import fs from 'node:fs';
import path from 'node:path';

const endpoint = process.argv[2] || 'http://127.0.0.1:9223';
const appUrl = process.argv[3] || 'http://localhost:5174';
const page = await fetch(`${endpoint}/json/new?${encodeURIComponent(`${appUrl}?screen=checkout`)}`, { method: 'PUT' }).then((response) => response.json());
const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
let nextId = 1;
const pending = new Map();
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  if (!message.id || !pending.has(message.id)) return;
  const callbacks = pending.get(message.id); pending.delete(message.id);
  if (message.error) callbacks.reject(new Error(message.error.message)); else callbacks.resolve(message.result);
});
const send = (method, params = {}) => new Promise((resolve, reject) => { const id = nextId++; pending.set(id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params })); });
const evaluate = async (expression) => {
  const response = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.exception?.description || response.exceptionDetails.text);
  return response.result.value;
};
await send('Page.enable');
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 430, height: 920, deviceScaleFactor: 1, mobile: true });
await new Promise((resolve) => setTimeout(resolve, 700));
const result = await evaluate(`(async () => { for (let index=0; index<30 && !document.querySelector('.checkout-place-order button'); index += 1) await new Promise((resolve) => setTimeout(resolve, 100)); const button=document.querySelector('.checkout-place-order button'); if (!button) return { ready:false }; button.click(); await new Promise((resolve) => setTimeout(resolve, 5000)); return { ready:true, modal:Boolean(document.querySelector('.razorpay-container, iframe[src*="razorpay"]')), error:document.querySelector('.checkout-error')?.textContent || '', button:document.querySelector('.checkout-place-order button')?.textContent || '' }; })()`);
if (!result.modal || result.error) throw new Error(`Razorpay modal did not open cleanly: ${JSON.stringify(result)}`);
const capture = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
fs.writeFileSync(path.resolve('design-references/commerce-v2/qa-razorpay-modal.png'), Buffer.from(capture.data, 'base64'));
console.log('RAZORPAY CHECKOUT MODAL VERIFIED');
await send('Page.close');
socket.close();
