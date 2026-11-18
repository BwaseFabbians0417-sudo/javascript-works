import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const fawryChargeUrl = 'https://atfawry.fawrystaging.com/ECommerceWeb/Fawry/payments/charge'

function respond(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

async function createSignature(values: string[]) {
  const data = new TextEncoder().encode(values.join(''))
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function normalizeItems(value: unknown) {
  if (!Array.isArray(value) || value.length === 0 || value.length > 100) return null
  const items: Array<{ itemId: string; description: string; price: number; quantity: number }> = []
  for (const [index, item] of value.entries()) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return null
    const record = item as Record<string, unknown>
    const productId = Number(record.product_id)
    const name = typeof record.name === 'string' ? record.name.trim() : ''
    const variant = typeof record.variant === 'string' ? record.variant.trim() : ''
    const quantity = Number(record.quantity)
    const price = Number(record.unit_price_rub)
    if (
      !Number.isSafeInteger(productId)
      || productId < 1
      || !name
      || name.length > 120
      || variant.length > 80
      || !Number.isSafeInteger(quantity)
      || quantity < 1
      || quantity > 100
      || !Number.isFinite(price)
      || price <= 0
      || price > 100000000
    ) return null
    items.push({
      itemId: `${productId}-${index + 1}`,
      description: `${name}${variant ? ` (${variant})` : ''}`,
      price: Math.round(price * 100) / 100,
      quantity,
    })
  }
  return items
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return respond({ error: 'Method not allowed.' }, 405)

  const authorization = request.headers.get('Authorization')
  if (!authorization?.startsWith('Bearer ')) return respond({ error: 'Sign in to request a payment.' }, 401)

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const merchantCode = Deno.env.get('FAWRY_MERCHANT_CODE')
  const secureKey = Deno.env.get('FAWRY_SECURE_KEY')
  if (!supabaseUrl || !anonKey || !serviceRoleKey || !merchantCode || !secureKey) {
    console.error('Fawry sandbox payment is missing one or more server-side secrets.')
    return respond({ error: 'Fawry sandbox is not configured.' }, 503)
  }

  let orderId: unknown
  try {
    ({ orderId } = await request.json())
  } catch {
    return respond({ error: 'Invalid request body.' }, 400)
  }
  if (typeof orderId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(orderId)) {
    return respond({ error: 'Invalid order reference.' }, 400)
  }

  try {
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authorization } },
      auth: { autoRefreshToken: false, persistSession: false },
    })
    const { data: { user }, error: authError } = await userClient.auth.getUser(authorization.slice(7))
    if (authError || !user) return respond({ error: 'Your session is invalid. Sign in again.' }, 401)

    const { data: order, error: orderError } = await userClient
      .from('storefront_orders')
      .select('id, user_id, status, items, subtotal, customer_phone')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .maybeSingle()
    if (orderError) {
      console.error('Could not read the order for its Fawry payment.', orderError)
      return respond({ error: 'The order could not be verified.' }, 500)
    }
    if (!order) return respond({ error: 'Order not found.' }, 404)
    if (!['Requested', 'Confirmed'].includes(order.status)) {
      return respond({ error: 'This order is not eligible for a sandbox payment.' }, 409)
    }

    const items = normalizeItems(order.items)
    const subtotal = Number(order.subtotal)
    const itemSubtotal = items?.reduce((sum, item) => sum + item.price * item.quantity, 0)
    if (
      !items
      || !Number.isFinite(subtotal)
      || subtotal <= 0
      || !itemSubtotal
      || Math.abs(itemSubtotal - subtotal) > 0.01
      || typeof order.customer_phone !== 'string'
      || order.customer_phone.trim().length < 5
    ) return respond({ error: 'Order details are incomplete or invalid.' }, 422)

    const amountEgp = subtotal.toFixed(2)
    const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
    const { data: existingPayment, error: existingError } = await serviceClient
      .from('storefront_fawry_payments')
      .select('merchant_ref_num, fawry_ref_number, amount_egp, status, gateway_status')
      .eq('order_id', order.id)
      .maybeSingle()
    if (existingError) {
      console.error('Could not read the Fawry payment record.', existingError)
      return respond({ error: 'The payment record could not be loaded.' }, 500)
    }
    if (existingPayment?.status === 'created' && existingPayment.fawry_ref_number) {
      return respond({
        referenceNumber: existingPayment.fawry_ref_number,
        merchantReference: existingPayment.merchant_ref_num,
        amountEgp: Number(existingPayment.amount_egp).toFixed(2),
        paymentStatus: existingPayment.gateway_status || 'CREATED',
      })
    }
    if (existingPayment?.status === 'processing') {
      return respond({ error: 'A sandbox payment request is already being processed.' }, 409)
    }

    const merchantRefNum = crypto.randomUUID().replaceAll('-', '')
    const paymentMethod = 'PAYATFAWRY'
    const customerProfileId = user.id.replaceAll('-', '')
    const signature = await createSignature([
      merchantCode,
      merchantRefNum,
      customerProfileId,
      paymentMethod,
      amountEgp,
      '',
      secureKey,
    ])
    const paymentRecord = {
      merchant_ref_num: merchantRefNum,
      fawry_ref_number: null,
      amount_egp: amountEgp,
      status: 'processing',
      gateway_status: '',
      updated_at: new Date().toISOString(),
    }
    if (existingPayment) {
      const { data: claimedPayment, error: claimError } = await serviceClient
        .from('storefront_fawry_payments')
        .update(paymentRecord)
        .eq('order_id', order.id)
        .eq('status', 'failed')
        .select('order_id')
        .maybeSingle()
      if (claimError) throw claimError
      if (!claimedPayment) return respond({ error: 'A sandbox payment request is already being processed.' }, 409)
    } else {
      const { error: insertError } = await serviceClient
        .from('storefront_fawry_payments')
        .insert({ order_id: order.id, ...paymentRecord })
      if (insertError?.code === '23505') return respond({ error: 'A sandbox payment request is already being processed.' }, 409)
      if (insertError) throw insertError
    }

    async function markPaymentFailed() {
      const { data, error } = await serviceClient
        .from('storefront_fawry_payments')
        .update({ status: 'failed', updated_at: new Date().toISOString() })
        .eq('order_id', order.id)
        .eq('merchant_ref_num', merchantRefNum)
        .select('order_id')
        .maybeSingle()
      if (error || !data) console.error('Could not mark the Fawry payment request as failed.', error || 'Payment record not found.')
    }

    let fawryResponse: Response
    try {
      fawryResponse = await fetch(fawryChargeUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(15000),
        body: JSON.stringify({
          merchantCode,
          merchantRefNum,
          customerProfileId,
          customerMobile: order.customer_phone.trim(),
          paymentMethod,
          currencyCode: 'EGP',
          amount: amountEgp,
          description: `FENGS order ${order.id.slice(0, 8).toUpperCase()}`,
          chargeItems: items.map((item) => ({
            itemId: item.itemId,
            description: item.description,
            price: item.price.toFixed(2),
            quantity: item.quantity,
          })),
          signature,
        }),
      })
    } catch (error) {
      console.error('Could not reach the Fawry sandbox.', error)
      await markPaymentFailed()
      return respond({ error: 'The Fawry sandbox could not be reached. Please try again.' }, 502)
    }

    let gatewayResult: Record<string, unknown>
    try {
      const result: unknown = await fawryResponse.json()
      if (!result || typeof result !== 'object' || Array.isArray(result)) throw new Error('Invalid Fawry response.')
      gatewayResult = result as Record<string, unknown>
    } catch (error) {
      console.error('Fawry sandbox returned an unreadable response.', fawryResponse.status, error)
      await markPaymentFailed()
      return respond({ error: 'Fawry returned an invalid response. Please try again.' }, 502)
    }

    const referenceNumber = typeof gatewayResult.referenceNumber === 'string'
      ? gatewayResult.referenceNumber
      : typeof gatewayResult.fawryRefNumber === 'string' ? gatewayResult.fawryRefNumber : ''
    if (!fawryResponse.ok || !referenceNumber) {
      console.error('Fawry sandbox rejected the payment request.', fawryResponse.status)
      await markPaymentFailed()
      return respond({ error: 'Fawry could not create a sandbox payment reference.' }, 502)
    }

    const gatewayStatus = String(gatewayResult.paymentStatus || gatewayResult.orderStatus || gatewayResult.statusDescription || 'CREATED').slice(0, 100)
    const { error: saveError } = await serviceClient
      .from('storefront_fawry_payments')
      .update({
        fawry_ref_number: referenceNumber,
        status: 'created',
        gateway_status: gatewayStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('order_id', order.id)
      .eq('merchant_ref_num', merchantRefNum)
    if (saveError) {
      console.error('Fawry created a reference but its local status could not be saved.', saveError)
      return respond({ error: 'Fawry created a payment reference, but it could not be saved. Contact the store before retrying.' }, 500)
    }

    return respond({ referenceNumber, merchantReference: merchantRefNum, amountEgp, paymentStatus: gatewayStatus })
  } catch (error) {
    console.error('Fawry sandbox payment failed.', error)
    return respond({ error: 'The Fawry sandbox payment could not be created.' }, 500)
  }
})
