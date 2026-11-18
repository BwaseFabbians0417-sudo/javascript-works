import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function respond(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function escapeHtml(value: unknown) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => {
    if (character === '&') return '&amp;'
    if (character === '<') return '&lt;'
    if (character === '>') return '&gt;'
    if (character === '"') return '&quot;'
    return '&#39;'
  })
}

function normalizeItems(value: unknown) {
  if (!Array.isArray(value) || value.length === 0) return null
  const items: Array<{ name: string; variant: string; quantity: number; unitPrice: number }> = []
  for (const item of value) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return null
    const record = item as Record<string, unknown>
    const quantity = Number(record.quantity)
    const unitPrice = Number(record.unit_price_rub)
    if (
      typeof record.name !== 'string'
      || typeof record.variant !== 'string'
      || !Number.isSafeInteger(quantity)
      || quantity < 1
      || !Number.isFinite(unitPrice)
      || unitPrice <= 0
    ) return null
    items.push({ name: record.name, variant: record.variant, quantity, unitPrice })
  }
  return items
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return respond({ error: 'Method not allowed.' }, 405)

  const authorization = request.headers.get('Authorization')
  if (!authorization?.startsWith('Bearer ')) return respond({ error: 'Sign in to submit an order.' }, 401)

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const resendApiKey = Deno.env.get('RESEND_API_KEY')
  const notificationEmail = Deno.env.get('ORDER_NOTIFICATION_EMAIL')
  const fromEmail = Deno.env.get('ORDER_FROM_EMAIL')
  const storeAppUrl = Deno.env.get('STORE_APP_URL')

  if (!supabaseUrl || !anonKey || !serviceRoleKey || !resendApiKey || !notificationEmail || !fromEmail || !storeAppUrl) {
    console.error('Order notification is missing one or more server-side secrets.')
    return respond({ error: 'Order email is not configured.' }, 503)
  }

  let adminDashboardUrl: string
  try {
    const appUrl = new URL(storeAppUrl)
    const isLocalhost = appUrl.hostname === 'localhost' || appUrl.hostname === '127.0.0.1'
    if ((!isLocalhost && appUrl.protocol !== 'https:') || appUrl.username || appUrl.password) {
      return respond({ error: 'The store admin URL is not configured securely.' }, 503)
    }
    appUrl.searchParams.set('openAdmin', '1')
    adminDashboardUrl = appUrl.toString()
  } catch (error) {
    console.error('The store admin URL is invalid.', error)
    return respond({ error: 'The store admin URL is not configured.' }, 503)
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
      .select('id, created_at, status, items, country_code, city, region, postal_code, street_address, carrier_preference, customer_name, customer_email, customer_phone, subtotal')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .maybeSingle()
    if (orderError) {
      console.error('Could not read the order for its email notification.', orderError)
      return respond({ error: 'The order could not be verified.' }, 500)
    }
    if (!order) return respond({ error: 'Order not found.' }, 404)
    const items = normalizeItems(order.items)
    if (!items || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(order.customer_email || '')) {
      return respond({ error: 'Order details are incomplete.' }, 422)
    }

    const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
    const now = new Date().toISOString()
    const { error: claimError } = await serviceClient
      .from('storefront_order_email_notifications')
      .insert({ order_id: order.id, status: 'sending', updated_at: now })

    if (claimError?.code === '23505') {
      const { data: existing, error: statusError } = await serviceClient
        .from('storefront_order_email_notifications')
        .select('status, updated_at')
        .eq('order_id', order.id)
        .single()
      if (statusError) throw statusError
      if (existing.status === 'sent') return respond({ sent: true, alreadySent: true })

      const staleSending = existing.status === 'sending'
        && Date.now() - Date.parse(existing.updated_at) > 5 * 60 * 1000
      if (existing.status !== 'failed' && !staleSending) {
        return respond({ error: 'Order email is already being processed.' }, 409)
      }

      const { data: claimed, error: retryClaimError } = await serviceClient
        .from('storefront_order_email_notifications')
        .update({ status: 'sending', updated_at: now })
        .eq('order_id', order.id)
        .eq('status', existing.status)
        .eq('updated_at', existing.updated_at)
        .select('order_id')
        .maybeSingle()
      if (retryClaimError) throw retryClaimError
      if (!claimed) return respond({ error: 'Order email is already being processed.' }, 409)
    } else if (claimError) {
      console.error('Could not reserve the order email notification.', claimError)
      return respond({ error: 'Order email could not be prepared.' }, 500)
    }

    const orderLabel = order.id.slice(0, 8).toUpperCase()
    const deliveryAddress = [order.street_address, order.city, order.region, order.postal_code, order.country_code]
      .filter(Boolean)
      .join(', ')
    const text = [
      `New FENGS LUXE EMPIRE order request #${orderLabel}`,
      `Status: ${order.status}`,
      `Received: ${order.created_at}`,
      '',
      `Customer: ${order.customer_name}`,
      `Email: ${order.customer_email}`,
      `Phone: ${order.customer_phone}`,
      `Delivery address: ${deliveryAddress}`,
      `Preferred carrier: ${order.carrier_preference}`,
      '',
      'Items:',
      ...items.map((item) => `- ${item.name} (${item.variant}) × ${item.quantity} · ${item.unitPrice * item.quantity} RUB`),
      `Items subtotal: ${order.subtotal} RUB`,
      '',
      'Open the admin dashboard and sign in to review and accept this order:',
      adminDashboardUrl,
      'Confirm availability, delivery, and final pricing with the customer before dispatch.',
    ].join('\n')
    const html = `
      <h1>New FENGS LUXE EMPIRE order request</h1>
      <p><strong>Order:</strong> #${escapeHtml(orderLabel)}<br>
      <strong>Status:</strong> ${escapeHtml(order.status)}<br>
      <strong>Received:</strong> ${escapeHtml(order.created_at)}</p>
      <h2>Customer</h2>
      <p>${escapeHtml(order.customer_name)}<br>
      <a href="mailto:${escapeHtml(order.customer_email)}">${escapeHtml(order.customer_email)}</a><br>
      ${escapeHtml(order.customer_phone)}</p>
      <p><strong>Delivery:</strong> ${escapeHtml(deliveryAddress)}<br>
      <strong>Preferred carrier:</strong> ${escapeHtml(order.carrier_preference)}</p>
      <h2>Items</h2>
      <ul>${items.map((item) => `<li>${escapeHtml(item.name)} (${escapeHtml(item.variant)}) × ${item.quantity} — ${item.unitPrice * item.quantity} RUB</li>`).join('')}</ul>
      <p><strong>Items subtotal: ${escapeHtml(order.subtotal)} RUB</strong></p>
      <p><a href="${escapeHtml(adminDashboardUrl)}">Open the admin dashboard to review and accept this order</a></p>
      <p>Sign in with the store-owner account. Confirm availability, delivery, and final pricing with the customer before dispatch.</p>
    `
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [notificationEmail],
        reply_to: order.customer_email,
        subject: `New FENGS order request #${orderLabel}`,
        text,
        html,
      }),
    })

    if (!resendResponse.ok) {
      console.error('Resend rejected an order notification.', resendResponse.status)
      await serviceClient
        .from('storefront_order_email_notifications')
        .update({ status: 'failed', updated_at: new Date().toISOString() })
        .eq('order_id', order.id)
        .eq('status', 'sending')
      return respond({ error: 'The order email could not be sent.' }, 502)
    }

    const { error: sentError } = await serviceClient
      .from('storefront_order_email_notifications')
      .update({ status: 'sent', updated_at: new Date().toISOString() })
      .eq('order_id', order.id)
      .eq('status', 'sending')
    if (sentError) {
      console.error('Order email was accepted but its notification status could not be saved.', sentError)
      return respond({ error: 'The email service accepted the order email, but its status could not be saved.' }, 500)
    }

    return respond({ sent: true })
  } catch (error) {
    console.error('Order notification failed.', error)
    return respond({ error: 'The order email could not be sent.' }, 500)
  }
})
