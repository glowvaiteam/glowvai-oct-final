import fs from 'node:fs';
import path from 'node:path';

const endpoint = process.argv[2] || 'http://127.0.0.1:9223';
const appUrl = process.argv[3] || 'http://localhost:5174';
const outputDir = path.resolve('design-references/commerce-v2');
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const page = await fetch(`${endpoint}/json/new?${encodeURIComponent(`${appUrl}?screen=home`)}`, { method: 'PUT' }).then((response) => response.json());
const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });

let nextId = 1;
const pending = new Map();
const runtimeErrors = [];
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  if (message.method === 'Runtime.exceptionThrown') runtimeErrors.push(message.params.exceptionDetails.text || 'runtime exception');
  if (message.method === 'Log.entryAdded' && ['error', 'warning'].includes(message.params.entry.level)) runtimeErrors.push(message.params.entry.text);
  if (!message.id || !pending.has(message.id)) return;
  const callbacks = pending.get(message.id); pending.delete(message.id);
  if (message.error) callbacks.reject(new Error(message.error.message)); else callbacks.resolve(message.result);
});
const send = (method, params = {}) => new Promise((resolve, reject) => { const id = nextId++; pending.set(id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params })); });
const evaluate = async (expression) => {
  const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text || 'Runtime evaluation failed');
  return result.result.value;
};
const screenshot = async (name) => {
  const result = await send('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false });
  fs.writeFileSync(path.join(outputDir, name), Buffer.from(result.data, 'base64'));
};
const navigate = async (url) => { await send('Page.navigate', { url }); await wait(1100); };

await send('Page.enable');
await send('Runtime.enable');
await send('Log.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 430, height: 900, deviceScaleFactor: 1, mobile: true });
await wait(1200);
await evaluate(`localStorage.removeItem('glowvai:cart'); localStorage.setItem('glowvai:customer-details', JSON.stringify({fullName:'QA Customer',phoneNumber:'+91 9876543210',email:'qa@example.com',deliveryNote:''})); location.reload(); true`);
await wait(1500);

const homeTop = await evaluate(`(() => {
  const root = document.querySelector('.screen-content');
  const home = document.querySelector('.zq-home');
  const images = [...document.querySelectorAll('.commerce-product-open img')];
  return {
    home: Boolean(home), mode: document.querySelector('.zq-mode-toggle')?.dataset.mode,
    sections: [...document.querySelectorAll('.zq-section-title h2')].map((node) => node.textContent),
    categories: document.querySelectorAll('.zq-festival-grid button').length,
    cards: document.querySelectorAll('.commerce-product-card').length,
    imagesReady: images.length > 0 && images.every((image) => image.getAttribute('src')?.includes('/src/assets/products/')) && images.slice(0, 6).every((image) => image.complete && image.naturalWidth > 0),
    scrollable: root.scrollHeight > root.clientHeight,
    noHorizontalOverflow: root.scrollWidth <= root.clientWidth + 1,
    accent: getComputedStyle(home).getPropertyValue('--commerce-blue').trim(),
    cart: Boolean(document.querySelector('.mini-cart-bar')),
  };
})()`);
assert(homeTop.home && homeTop.mode === 'women', 'Home did not open in Her mode');
if (!homeTop.imagesReady) console.error('HOME IMAGE DEBUG', JSON.stringify(await evaluate(`[...document.querySelectorAll('.commerce-product-open img')].slice(0,8).map((image)=>({src:image.getAttribute('src'),currentSrc:image.currentSrc,complete:image.complete,naturalWidth:image.naturalWidth}))`), null, 2));
assert(homeTop.categories === 6 && homeTop.cards >= 10, 'Home catalogue did not render');
assert(['Top Picks', 'Explore', 'Coupons & Offers', 'Value Picks', 'Buy Again'].every((title) => homeTop.sections.includes(title)), 'Home is missing a required lower section');
assert(homeTop.imagesReady, 'Local product images did not render');
assert(homeTop.scrollable && homeTop.noHorizontalOverflow && homeTop.cart, 'Home scrolling or fixed cart shell is broken');
assert(homeTop.accent === '#e51e68', 'Her mode accent did not apply to the full commerce page');
await screenshot('qa-home-top.png');

const modeResult = await evaluate(`(async () => {
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  document.querySelectorAll('.zq-mode-toggle button')[1].click(); await wait(500);
  const him = { mode: document.querySelector('.zq-mode-toggle')?.dataset.mode, shelf: document.querySelector('#top-picks-title')?.textContent, copy: document.querySelector('.zq-festival-copy em')?.textContent, accent: getComputedStyle(document.querySelector('.zq-home')).getPropertyValue('--commerce-blue').trim() };
  document.querySelectorAll('.zq-mode-toggle button')[0].click(); await wait(500);
  const her = { mode: document.querySelector('.zq-mode-toggle')?.dataset.mode, shelf: document.querySelector('#top-picks-title')?.textContent, accent: getComputedStyle(document.querySelector('.zq-home')).getPropertyValue('--commerce-blue').trim() };
  const tab = document.querySelectorAll('.zq-scoop-tabs button')[1]; tab.click();
  await wait(40); const skeletonVisible = document.querySelectorAll('.zq-skeleton').length > 0; await wait(320);
  return { him, her, skeletonVisible, activeTab: document.querySelectorAll('.zq-scoop-tabs button')[1]?.getAttribute('aria-selected'), cards: document.querySelectorAll('.commerce-product-card').length };
})()`);
assert(modeResult.him.mode === 'men' && modeResult.him.shelf === 'Grooming Picks' && modeResult.him.copy.includes('Grooming') && modeResult.him.accent === '#075cff', 'Him mode did not replace content and page accent');
assert(modeResult.her.mode === 'women' && modeResult.her.shelf === 'Top Picks' && modeResult.her.accent === '#e51e68', 'Her mode did not restore fully');
assert(modeResult.skeletonVisible && modeResult.activeTab === 'true' && modeResult.cards > 0, 'Interactive category reload failed');

await evaluate(`document.querySelector('.zq-offers').scrollIntoView({block:'start'}); true`); await wait(300); await screenshot('qa-home-middle.png');
const middle = await evaluate(`(() => { const root=document.querySelector('.screen-content'); return { top:root.scrollTop, offerCards:document.querySelectorAll('.zq-offer-rail button').length, offerVisible:document.querySelector('.zq-offers').getBoundingClientRect().top < innerHeight }; })()`);
assert(middle.top > 600 && middle.offerCards === 4 && middle.offerVisible, 'Home middle sections are not reachable');

await evaluate(`document.querySelector('.zq-buy-again').scrollIntoView({block:'start'}); true`); await wait(300); await screenshot('qa-home-bottom.png');
const bottom = await evaluate(`(() => { const root=document.querySelector('.screen-content'); const last=document.querySelector('.zq-bottom-clearance'); return { top:root.scrollTop, tabs:document.querySelectorAll('.zq-buy-tabs button').length, clearance:last.getBoundingClientRect().height }; })()`);
assert(bottom.top > middle.top && bottom.tabs === 4 && bottom.clearance > 120, `Home bottom or safe clearance is broken: ${JSON.stringify({ middle, bottom })}`);

await navigate(`${appUrl}?screen=checkout`); await screenshot('qa-checkout.png');
const checkoutPreview = await evaluate(`(() => ({ visible:Boolean(document.querySelector('.checkout-screen')), steps:document.querySelectorAll('.checkout-steps li').length, paymentOptions:document.querySelectorAll('.checkout-payment button').length, secure:document.querySelector('.checkout-security')?.textContent }))()`);
assert(checkoutPreview.visible && checkoutPreview.steps === 3 && checkoutPreview.paymentOptions === 2 && checkoutPreview.secure.includes('verifies'), 'Checkout preview is incomplete');
await navigate(`${appUrl}?screen=home`);

const checkoutPath = await evaluate(`(async () => {
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  document.querySelector('.mini-cart-bar').click(); await wait(350);
  const cart = { visible:Boolean(document.querySelector('.cart-screen')), checkoutText:document.querySelector('.commerce-sticky-action button')?.textContent };
  document.querySelector('.commerce-sticky-action button').click(); await wait(350);
  const checkout = { visible:Boolean(document.querySelector('.checkout-screen')), orderSummary:Boolean(document.querySelector('.checkout-summary')), placeOrder:document.querySelector('.checkout-place-order button')?.textContent, bill:document.querySelector('.checkout-bill .bill-total')?.textContent };
  document.querySelectorAll('.checkout-payment button')[1].click(); await wait(120);
  document.querySelector('.checkout-place-order button').click(); await wait(1600);
  const confirmation = { visible:Boolean(document.querySelector('.receipt-confirmation')), receipt:Boolean(document.querySelector('.order-receipt')), track:document.querySelector('.order-track-button')?.textContent, stages:document.querySelectorAll('.order-status-track > div').length };
  return { cart, checkout, confirmation };
})()`);
assert(checkoutPath.cart.visible && checkoutPath.cart.checkoutText.includes('Checkout'), 'Cart checkout CTA is not reachable');
assert(checkoutPath.checkout.visible && checkoutPath.checkout.orderSummary && checkoutPath.checkout.placeOrder.includes('Pay securely') && /\d/.test(checkoutPath.checkout.bill), 'Checkout is missing order details or secure payment CTA');
assert(checkoutPath.confirmation.visible && checkoutPath.confirmation.receipt && checkoutPath.confirmation.track.includes('Track order') && checkoutPath.confirmation.stages === 4, 'Order confirmation did not render after place order');
await screenshot('qa-order-confirmation.png');
const tracking = await evaluate(`(async () => { const wait=(ms)=>new Promise((resolve)=>setTimeout(resolve,ms)); document.querySelector('.order-track-button').click(); await wait(700); return { visible:Boolean(document.querySelector('.tracking-v2')), stages:document.querySelectorAll('.tracking-progress article').length, items:document.querySelectorAll('.tracking-items article').length, map:Boolean(document.querySelector('.tracking-map iframe')), mapTitle:document.querySelector('.tracking-map-card h2')?.textContent }; })()`);
assert(tracking.visible && tracking.stages === 4 && tracking.items > 0 && tracking.map && tracking.mapTitle === 'Estimated route', 'Order tracking transition or map failed');
await screenshot('qa-order-tracking.png');

await navigate(`${appUrl}?screen=skin-report`);
const report = await evaluate(`(() => ({ visible:Boolean(document.querySelector('.skin-dashboard')), score:document.querySelector('.skin-gauge-score b')?.textContent, signals:document.querySelectorAll('.skin-signal').length, routine:document.querySelectorAll('.skin-routine-grid li').length, cta:document.querySelector('.skin-shop-cta')?.textContent, paragraphs:document.querySelectorAll('.skin-dashboard-sheet > p').length }))()`);
assert(report.visible && report.score === '82' && report.signals === 4 && report.routine === 6 && report.cta.includes('Shop your recommendations'), 'Visual report is incomplete');
await screenshot('qa-skin-report.png');
const reveal = await evaluate(`(async () => { const wait=(ms)=>new Promise((resolve)=>setTimeout(resolve,ms)); document.querySelector('.skin-shop-cta').click(); await wait(1900); return { home:Boolean(document.querySelector('.zq-home')), report:Boolean(document.querySelector('.skin-dashboard')), nav:Boolean(document.querySelector('.quick-bottom-nav')) }; })()`);
assert(reveal.home && !reveal.report && reveal.nav, 'Report-to-Home reveal did not complete');
assert(runtimeErrors.length === 0, `Browser emitted runtime errors: ${runtimeErrors.join(' | ')}`);

console.log(JSON.stringify({ homeTop, modeResult, middle, bottom, checkoutPath, tracking, report, reveal, screenshots: fs.readdirSync(outputDir).filter((file) => file.startsWith('qa-')) }, null, 2));
console.log('COMMERCE V2 BROWSER QA PASSED');
socket.close();
