import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const includesAll = (source, values, label) => values.forEach((value) => assert(source.includes(value), `${label} missing ${value}`));
const mode = process.argv[2] || 'all';

function customer() {
  const screen = read('src/screens/CustomerDetailsScreen.tsx');
  const profile = read('src/screens/ProfileScreen.tsx');
  const context = read('src/context/AppContext.tsx');
  includesAll(screen, ['fullName', 'phoneNumber', 'email', 'deliveryNote', '10-digit Indian mobile', 'Save and continue'], 'customer details');
  includesAll(context, ['glowvai:customer-details', 'glowvai:cart', 'glowvai:orders', 'glowvai:active-order', 'saveCustomerDetails', 'localStorage.setItem'], 'customer and commerce persistence');
  includesAll(profile, ['customerDetails', "navigate('customer-details'", 'Complete your delivery profile'], 'profile');
  console.log('COMMERCE V3 CUSTOMER VERIFIED');
}

function payments() {
  const checkout = read('src/screens/CheckoutScreen.tsx');
  const razorpay = read('src/services/razorpay.ts');
  includesAll(razorpay, ["method: 'upi'", "method: 'card'", "method: 'netbanking'", "method: 'wallet'", 'show_default_blocks: false', 'prefill:', 'confirm_close: true', "checkout.on('payment.failed'"], 'Razorpay');
  includesAll(checkout, ['UPI', 'Cards', 'Banks', 'Wallets', 'success@razorpay', 'Do not use a real UPI app or QR in test mode', 'Cash on delivery'], 'payment UI');
  console.log('COMMERCE V3 PAYMENTS VERIFIED');
}

function states() {
  const app = read('src/App.tsx');
  const checkout = read('src/screens/CheckoutScreen.tsx');
  const tracking = read('src/screens/OrderTrackingScreen.tsx');
  const payment = read('src/screens/PaymentStatusScreen.tsx');
  const cancelled = read('src/screens/OrderCancelledScreen.tsx');
  includesAll(app, ["case 'customer-details'", "case 'payment-status'", "case 'order-cancelled'"], 'routes');
  includesAll(checkout, ['checkout-processing', 'Verifying order', "status: 'cancelled'", "status: 'failed'", 'Retry'], 'checkout states');
  includesAll(payment, ['Try another method', 'Continue shopping', 'PAYMENT NOT COMPLETED', 'PAYMENT CANCELLED'], 'payment status');
  includesAll(tracking, ['No active delivery', 'Cancel this order?', 'Keep my order'], 'tracking states');
  includesAll(cancelled, ['Refund estimate', 'Shop again', 'View all orders'], 'cancelled state');
  console.log('COMMERCE V3 STATES VERIFIED');
}

function journey() {
  const checkout = read('src/screens/CheckoutScreen.tsx');
  const confirmation = read('src/screens/OrderConfirmationScreen.tsx');
  const history = read('src/screens/OrderHistoryScreen.tsx');
  const tracking = read('src/screens/OrderTrackingScreen.tsx');
  includesAll(checkout, ["navigate('customer-details'", "navigate('order-confirmation'", 'placeOrder'], 'checkout journey');
  includesAll(confirmation, ["navigate('order-tracking'", 'Track order'], 'confirmation journey');
  includesAll(history, ['setActiveOrder', "'order-tracking'", "'order-cancelled'"], 'history journey');
  includesAll(tracking, ['openstreetmap.org/export/embed.html', 'tracking-map-fallback', 'cancelOrder', "navigate('order-cancelled'"], 'tracking journey');
  console.log('COMMERCE V3 JOURNEY VERIFIED');
}

if (mode === 'customer' || mode === 'all') customer();
if (mode === 'payments' || mode === 'all') payments();
if (mode === 'states' || mode === 'all') states();
if (mode === 'journey' || mode === 'all') journey();
