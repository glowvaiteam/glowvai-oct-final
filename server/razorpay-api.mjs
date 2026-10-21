import { createHmac, timingSafeEqual } from 'node:crypto';

const VARIANTS = new Map([
  ['v-1', { productId: 'prod-min-spf50', price: 379, insurance: 29 }], ['v-2', { productId: 'prod-min-spf50', price: 649, insurance: 29 }],
  ['v-3', { productId: 'prod-min-salicylic-2', price: 499, insurance: 39 }], ['v-4', { productId: 'prod-cet-gentle-cleanser', price: 359, insurance: 29 }],
  ['v-5', { productId: 'prod-cet-gentle-cleanser', price: 579, insurance: 29 }], ['v-6', { productId: 'prod-derma-niacinamide-10', price: 529, insurance: 39 }],
  ['v-7', { productId: 'prod-dot-ceramide-moisturizer', price: 445, insurance: 29 }], ['v-8', { productId: 'prod-plum-green-tea-toner', price: 349, insurance: 0 }],
  ['v-9', { productId: 'prod-aqua-radiance-gel', price: 369, insurance: 29 }], ['v-10', { productId: 'prod-neut-hydro-boost', price: 899, insurance: 49 }],
  ['v-11', { productId: 'prod-maybelline-fit-me', price: 479, insurance: 0 }], ['v-12', { productId: 'prod-maybelline-fit-me', price: 479, insurance: 0 }],
  ['v-13', { productId: 'prod-acc-rose-quartz-roller', price: 499, insurance: 0 }],
]);

const json = (response, status, payload) => {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(payload));
};

const readJson = (request) => new Promise((resolve, reject) => {
  let raw = '';
  request.on('data', (chunk) => {
    raw += chunk;
    if (raw.length > 100_000) reject(new Error('Request body is too large.'));
  });
  request.on('end', () => {
    try { resolve(JSON.parse(raw || '{}')); } catch { reject(new Error('Invalid JSON body.')); }
  });
  request.on('error', reject);
});

const priceOrder = ({ items, couponCode }) => {
  if (!Array.isArray(items) || !items.length) throw new Error('Your bag is empty.');
  let total = 0;
  for (const item of items) {
    const variant = VARIANTS.get(item.variantId);
    const quantity = Number(item.quantity);
    if (!variant || variant.productId !== item.productId || !Number.isInteger(quantity) || quantity < 1 || quantity > 10) throw new Error('An item in the bag is invalid or unavailable.');
    total += (variant.price + (item.withInsurance ? variant.insurance : 0)) * quantity;
  }
  if (['GLOW50', 'FIRST'].includes(String(couponCode || '').toUpperCase())) total -= 50;
  return Math.max(100, total);
};

export const createRazorpayMiddleware = ({ keyId, keySecret }) => {
  const issuedOrders = new Set();
  return async (request, response, next) => {
    const url = new URL(request.url || '/', 'http://localhost');
    if (request.method !== 'POST' || !url.pathname.startsWith('/api/payments/razorpay/')) return next();
    if (!keyId || !keySecret) return json(response, 503, { message: 'Razorpay server credentials are not configured. Add RAZORPAY_KEY_SECRET locally or choose cash on delivery.' });

    try {
      const body = await readJson(request);
      if (url.pathname.endsWith('/order')) {
        const amountRupees = priceOrder(body);
        if (Number(body.expectedAmount) !== amountRupees) return json(response, 409, { message: 'Your bag total changed. Return to the bag and review the latest price.' });
        const receipt = `glowvai_${Date.now()}`;
        const providerResponse = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: { Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: amountRupees * 100, currency: 'INR', receipt }),
        });
        const providerOrder = await providerResponse.json();
        if (!providerResponse.ok) return json(response, 502, { message: providerOrder.error?.description || 'Razorpay could not create the payment order.' });
        issuedOrders.add(providerOrder.id);
        return json(response, 200, { orderId: providerOrder.id, amount: providerOrder.amount, currency: providerOrder.currency, receipt });
      }

      if (url.pathname.endsWith('/verify')) {
        const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = body;
        if (!issuedOrders.has(orderId) || !paymentId || !signature) return json(response, 400, { verified: false, message: 'Unknown or incomplete payment response.' });
        const expected = createHmac('sha256', keySecret).update(`${orderId}|${paymentId}`).digest('hex');
        const expectedBytes = Buffer.from(expected, 'utf8');
        const signatureBytes = Buffer.from(String(signature), 'utf8');
        const verified = expectedBytes.length === signatureBytes.length && timingSafeEqual(expectedBytes, signatureBytes);
        if (verified) issuedOrders.delete(orderId);
        return json(response, verified ? 200 : 400, { verified, message: verified ? undefined : 'Payment signature verification failed.' });
      }
      return json(response, 404, { message: 'Payment endpoint not found.' });
    } catch (error) {
      return json(response, 400, { message: error instanceof Error ? error.message : 'Payment request failed.' });
    }
  };
};
