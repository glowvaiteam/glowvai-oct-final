import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const existsLarge = (file, min) => fs.existsSync(path.join(root, file)) && fs.statSync(path.join(root, file)).size >= min;
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const includesAll = (source, values, label) => values.forEach((value) => assert(source.includes(value), `${label} missing ${value}`));
const hasDecorativeGradient = (source) => /(?:linear|radial|conic)-gradient\s*\(/i.test(source);
const mode = process.argv[2] || 'all';

function verifyReferences() {
  for (const file of ['home-remainder.png', 'skin-report.png', 'checkout-status.png']) assert(existsLarge(`design-references/commerce-v2/${file}`, 100_000), `${file} is missing or too small`);
  const analysis = read('design-references/commerce-v2/ANALYSIS.md');
  includesAll(analysis, ['## Home remainder', '## Skin report', '## Checkout and order status', 'Place order', 'Reduced-motion'], 'analysis');
  console.log('COMMERCE V2 REFERENCES VERIFIED');
}

function verifyHome() {
  const home = read('src/screens/HomeScreen.tsx');
  const card = read('src/components/cards/ProductCard.tsx');
  const css = read('src/index.css');
  const v6 = css.slice(css.indexOf('/* Commerce experience v6'));
  const productData = read('src/data/products.ts');
  includesAll(home, ['Top Picks', 'Explore', 'Coupons & Offers', 'Value Picks', 'Buy Again', 'zq-buy-tabs', 'zq-bottom-clearance', '<ProductCard'], 'Home');
  includesAll(home, ['For Her', 'For Him', 'MODE_CONTENT', 'shoppingPreference', 'setShoppingPreference'], 'mode switch');
  assert(!home.includes('CommerceProductCard'), 'Home still contains a duplicate one-off product card');
  includesAll(card, ['commerce-product-card', 'commerce-product-media', 'commerce-product-add', 'commerce-product-stepper', 'line-clamp-2'], 'ProductCard');
  includesAll(v6, ['width: 148px', 'object-fit: contain', 'scroll-snap-type: x proximity', '.zq-buy-tabs', '.zq-bottom-clearance'], 'v6 styles');
  assert(hasDecorativeGradient('background: linear-gradient(red, blue)'), 'gradient negative control failed');
  assert(!hasDecorativeGradient(v6), 'commerce v6 styles contain a forbidden decorative gradient');
  for (const file of ['spf50.jpg', 'salicylic-serum.avif', 'gentle-cleanser.avif', 'niacinamide.png', 'moisturizer.png', 'toner.webp', 'face-oil.avif', 'cleanser.png', 'foundation.jpg', 'beauty-tool.avif']) assert(existsLarge(`src/assets/products/${file}`, 8_000), `local product image missing: ${file}`);
  assert((productData.match(/\.\.\/assets\/products\//g) || []).length === 10, 'all catalogue products must use local images');
  console.log('COMMERCE V2 HOME VERIFIED');
}

function verifyReport() {
  const report = read('src/screens/SkinReportScreen.tsx');
  const css = read('src/index.css');
  includesAll(report, ['Your skin today', 'skin-gauge', 'Your face zones', 'Key signals', 'Your routine', 'Shop your recommendations', 'See full details', 'commerce-reveal'], 'report');
  includesAll(css, ['report-gauge-draw', 'skin-signal-in', 'report-cta-in', 'commerce-wash', '@media (prefers-reduced-motion: reduce)'], 'report motion');
  assert((report.match(/<p>/g) || []).length < 12, 'report became paragraph-heavy again');
  console.log('COMMERCE V2 REPORT VERIFIED');
}

function verifyCheckout() {
  const cart = read('src/screens/CartScreen.tsx');
  const checkout = read('src/screens/CheckoutScreen.tsx');
  const confirmation = read('src/screens/OrderConfirmationScreen.tsx');
  const tracking = read('src/screens/OrderTrackingScreen.tsx');
  const context = read('src/context/AppContext.tsx');
  const api = read('src/services/api.ts');
  includesAll(cart, ['couponDiscount', "navigate('checkout'", 'finalPayable: payable', 'Checkout'], 'cart');
  includesAll(checkout, ['Your bag', 'Bill details', 'Payment method', 'Pay securely', 'startRazorpayPayment', 'placeOrder(selectedMethod as PaymentMethodType, couponDiscount, verification)', 'is-processing'], 'checkout');
  includesAll(context, ['checkoutDiscount = 0', 'paymentMethod, checkoutDiscount, verification'], 'context pricing handoff');
  includesAll(api, ['checkoutDiscount = 0', 'pricing.discountTotal + checkoutDiscount', 'pricing.finalPayable - checkoutDiscount'], 'order pricing');
  includesAll(confirmation, ['receipt-slot', 'Order placed!', 'order-status-track', 'Track order', "navigate('order-tracking'"], 'confirmation');
  includesAll(tracking, ['Estimated route', 'openstreetmap.org/export/embed.html', 'tracking-map', 'tracking-map-fallback', 'Benz Circle', 'Route shown is an estimate', 'Delivery progress', 'tracking-progress', 'Your items', 'finalPayable'], 'tracking');
  console.log('COMMERCE V2 CHECKOUT VERIFIED');
}

function verifyPayments() {
  const checkout = read('src/screens/CheckoutScreen.tsx');
  const razorpay = read('src/services/razorpay.ts');
  const api = read('src/services/api.ts');
  const server = read('server/razorpay-api.mjs');
  const viteConfig = read('vite.config.ts');
  const gitignore = read('.gitignore');
  const envExample = read('.env.example');
  includesAll(razorpay, ['checkout.razorpay.com/v1/checkout.js', '/payments/razorpay/order', '/payments/razorpay/verify', 'razorpay_signature', 'verified.verified'], 'Razorpay service');
  includesAll(checkout, ['TEST MODE', 'Secure checkout powered by Razorpay', "selectedMethod === 'upi'", 'startRazorpayPayment'], 'checkout payment UI');
  includesAll(api, ["paymentMethod !== 'cod' && !verification", 'Online payment must be verified', 'paymentReference: verification?.paymentId'], 'order payment guard');
  includesAll(server, ['api.razorpay.com/v1/orders', 'createHmac', 'timingSafeEqual', 'priceOrder', 'keySecret', 'issuedOrders'], 'Razorpay backend');
  includesAll(viteConfig, ['createRazorpayMiddleware', 'RAZORPAY_KEY_SECRET', 'RAZORPAY_SECRET_ENV_FILE', 'linkedPrivateEnv', 'configureServer'], 'local payment server');
  assert(gitignore.split(/\r?\n/).includes('.env'), '.env must be ignored');
  assert(!envExample.includes('TVyUQbDqUqOFHe'), '.env.example must not contain the configured key ID');
  const sourceFiles = ['src/screens/CheckoutScreen.tsx', 'src/services/razorpay.ts', 'src/services/api.ts'].map(read).join('\n');
  assert(!/RAZORPAY_KEY_SECRET|rzp_(?:test|live)_[A-Za-z0-9]{8,}/.test(sourceFiles), 'payment secret or configured key ID leaked into source');
  console.log('COMMERCE V2 PAYMENTS VERIFIED');
}

if (mode === 'references' || mode === 'all') verifyReferences();
if (mode === 'home' || mode === 'all') verifyHome();
if (mode === 'report' || mode === 'all') verifyReport();
if (mode === 'checkout' || mode === 'all') verifyCheckout();
if (mode === 'payments' || mode === 'all') verifyPayments();
