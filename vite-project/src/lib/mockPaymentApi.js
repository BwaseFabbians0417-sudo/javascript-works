const allowedMethods = new Set(['paystack', 'flutterwave', 'visa', 'mastercard', 'opay', 'gtbank', 'access', 'zenith', 'uba'])

export async function createMockPayment({ orderId, method }) {
  if (typeof orderId !== 'string' || !orderId.trim() || !allowedMethods.has(method)) {
    throw new Error('Invalid demo payment request.')
  }

  await new Promise((resolve) => window.setTimeout(resolve, 650))

  return {
    reference: `DEMO-${window.crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    orderId,
    method,
    provider: method === 'paystack' ? 'Paystack' : method === 'flutterwave' ? 'Flutterwave' : 'FENGS demo',
    status: 'simulated',
    createdAt: new Date().toISOString(),
  }
}
