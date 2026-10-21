import fs from 'node:fs';
import path from 'node:path';

const endpoint = process.argv[2] || 'http://127.0.0.1:9223';
const appUrl = process.argv[3] || 'http://localhost:5174';
const outputDir = path.resolve('design-references/commerce-v2');
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const assert = (condition, message) => { if (!condition) throw new Error(message); };
fs.mkdirSync(outputDir, { recursive: true });

const page = await fetch(`${endpoint}/json/new?${encodeURIComponent(`${appUrl}?screen=checkout`)}`, { method: 'PUT' }).then((response) => response.json());
const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
let nextId = 1;
const pending = new Map();
const runtimeErrors = [];
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  if (message.method === 'Runtime.exceptionThrown') runtimeErrors.push(message.params.exceptionDetails.text || 'runtime exception');
  if (message.method === 'Log.entryAdded' && message.params.entry.level === 'error') runtimeErrors.push(message.params.entry.text);
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
const screenshot = async (name) => { const result = await send('Page.captureScreenshot', { format: 'png', fromSurface: true }); fs.writeFileSync(path.join(outputDir, name), Buffer.from(result.data, 'base64')); };
const navigate = async (url) => { await send('Page.navigate', { url }); await wait(900); };

await send('Page.enable'); await send('Runtime.enable'); await send('Log.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 430, height: 900, deviceScaleFactor: 1, mobile: true });
await wait(800);
await evaluate(`['glowvai:customer-details','glowvai:orders','glowvai:active-order','glowvai:cart'].forEach(key=>localStorage.removeItem(key)); location.reload(); true`); await wait(1500);

const firstCheckout = await evaluate(`(() => ({ checkout:Boolean(document.querySelector('.checkout-v3')), addDetails:document.querySelector('.checkout-add-details')?.textContent, methods:[...document.querySelectorAll('.checkout-method-icons span')].map(n=>n.textContent.trim()), scrollable:document.querySelector('.screen-content').scrollHeight > document.querySelector('.screen-content').clientHeight, overflow:document.querySelector('.screen-content').scrollWidth <= document.querySelector('.screen-content').clientWidth + 1 }))()`);
assert(firstCheckout.checkout && firstCheckout.addDetails.includes('Add contact details'), 'First-order contact prompt is missing');
assert(['UPI','Cards','Banks','Wallets'].every((method) => firstCheckout.methods.includes(method)), 'All online payment methods are not visible');
assert(firstCheckout.scrollable && firstCheckout.overflow, 'Checkout scrolling or width is broken');
await screenshot('qa-v3-checkout.png');

const saved = await evaluate(`(async()=>{const wait=(ms)=>new Promise(r=>setTimeout(r,ms));document.querySelector('.checkout-add-details').click();await wait(250);const inputs=document.querySelectorAll('.customer-details-form input');const set=(el,value)=>{const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;setter.call(el,value);el.dispatchEvent(new Event('input',{bubbles:true}));};set(inputs[0],'Mukesh Kumar');set(inputs[1],'9876543210');set(inputs[2],'mukesh@example.com');document.querySelector('.customer-details-form button[type=submit]').click();await wait(450);return {checkout:Boolean(document.querySelector('.checkout-v3')),name:document.querySelector('.checkout-person-saved b')?.textContent,stored:JSON.parse(localStorage.getItem('glowvai:customer-details')||'null')?.phoneNumber};})()`);
assert(saved.checkout && saved.name === 'Mukesh Kumar' && saved.stored === '+91 9876543210', 'Customer details did not validate, persist and return to checkout');
await screenshot('qa-v3-checkout-saved.png');

const placed = await evaluate(`(async()=>{const wait=(ms)=>new Promise(r=>setTimeout(r,ms));const buttons=document.querySelectorAll('.checkout-payment-v3 > button');buttons[buttons.length-1].click();await wait(80);document.querySelector('.checkout-v3-footer button').click();await wait(1300);return {confirmation:Boolean(document.querySelector('.receipt-confirmation')),track:document.querySelector('.order-track-button')?.textContent};})()`);
assert(placed.confirmation && placed.track.includes('Track order'), 'COD order did not reach confirmation');
await screenshot('qa-v3-confirmation.png');

const tracked = await evaluate(`(async()=>{const wait=(ms)=>new Promise(r=>setTimeout(r,ms));document.querySelector('.order-track-button').click();await wait(600);return {tracking:Boolean(document.querySelector('.tracking-v2')),map:Boolean(document.querySelector('.tracking-map iframe')),cancel:Boolean(document.querySelector('.tracking-cancel-button'))};})()`);
assert(tracked.tracking && tracked.map && tracked.cancel, 'Tracking map or cancellation entry point is missing');
await screenshot('qa-v3-tracking-map.png');

const cancelled = await evaluate(`(async()=>{const wait=(ms)=>new Promise(r=>setTimeout(r,ms));document.querySelector('.tracking-cancel-button').click();await wait(150);document.querySelector('.tracking-cancel-dialog > button:not(.keep-order)').click();await wait(450);return {screen:Boolean(document.querySelector('.order-cancelled-screen')),refund:document.querySelector('.order-cancelled-screen')?.textContent};})()`);
assert(cancelled.screen && cancelled.refund.includes('No payment was collected'), 'Cancellation summary did not open');
await screenshot('qa-v3-cancelled.png');

await navigate(`${appUrl}?screen=profile`);
const profile = await evaluate(`(() => ({visible:Boolean(document.querySelector('.profile-v3')),name:document.querySelector('.profile-v3 header h1')?.textContent,orders:document.querySelector('.profile-quick-stats button b')?.textContent,overflow:document.querySelector('.screen-content').scrollWidth <= document.querySelector('.screen-content').clientWidth + 1}))()`);
assert(profile.visible && profile.name === 'Mukesh Kumar' && profile.orders === '1' && profile.overflow, 'Saved customer profile or order history did not render correctly');
await screenshot('qa-v3-profile.png');
assert(runtimeErrors.length === 0, `Browser emitted runtime errors: ${runtimeErrors.join(' | ')}`);
console.log(JSON.stringify({ firstCheckout, saved, placed, tracked, cancelled: cancelled.screen, profile, screenshots: ['qa-v3-checkout.png','qa-v3-checkout-saved.png','qa-v3-confirmation.png','qa-v3-tracking-map.png','qa-v3-cancelled.png','qa-v3-profile.png'] }, null, 2));
console.log('COMMERCE V3 BROWSER QA PASSED');
socket.close();
