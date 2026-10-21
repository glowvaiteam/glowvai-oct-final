const endpoint = process.argv[2] || 'http://127.0.0.1:9223';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const page = await fetch(`${endpoint}/json/new?${encodeURIComponent('http://localhost:5174')}`, { method: 'PUT' }).then((response) => response.json());
if (!page) throw new Error('No Chrome page target found');

const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});

let nextId = 1;
const pending = new Map();
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  if (!message.id || !pending.has(message.id)) return;
  const { resolve, reject } = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) reject(new Error(message.error.message));
  else resolve(message.result);
});

const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = nextId++;
  pending.set(id, { resolve, reject });
  socket.send(JSON.stringify({ id, method, params }));
});

await send('Page.enable');
await send('Runtime.enable');
await wait(1700);

const evaluate = async (expression) => {
  const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || 'Runtime evaluation failed');
  return result.result.value;
};

const result = await evaluate(`(async () => {
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const snapshot = () => ({
    mode: document.querySelector('.zq-mode-toggle')?.dataset.mode,
    homeClass: document.querySelector('.zq-home')?.className,
    search: document.querySelector('.zq-search span')?.textContent,
    heroCopy: document.querySelector('.zq-festival-copy em')?.textContent,
    categories: [...document.querySelectorAll('.zq-festival-grid button b')].map((node) => node.textContent),
    categoryCount: document.querySelectorAll('.zq-festival-grid button').length,
    productCards: document.querySelectorAll('.zq-product-card').length,
    cartVisible: Boolean(document.querySelector('.mini-cart-bar')),
    canScroll: document.querySelector('.screen-content').scrollHeight > document.querySelector('.screen-content').clientHeight,
  });
  const states = [snapshot()];
  for (const index of [1, 0, 1, 0]) {
    document.querySelectorAll('.zq-mode-toggle button')[index].click();
    await wait(480);
    states.push(snapshot());
  }
  document.querySelector('.zq-festival-grid button').click();
  await wait(250);
  const categoryNavigation = Boolean(document.querySelector('.search-screen')) || !document.querySelector('.zq-home');
  document.querySelector('.quick-bottom-nav button')?.click();
  await wait(300);
  document.querySelector('.mini-cart-bar')?.click();
  await wait(300);
  const cartNavigation = Boolean(document.querySelector('.cart-screen'));
  return { states, categoryNavigation, cartNavigation };
})()`);

const [initial, him, herAgain, himAgain, finalHer] = result.states;
const assertions = {
  initialHer: initial.mode === 'women' && initial.heroCopy.includes('Beauty') && initial.categories.includes('Makeup Essentials'),
  fullHimSwap: him.mode === 'men' && him.homeClass.includes('zq-mode-men') && him.search.includes('shampoo') && him.heroCopy.includes('Grooming') && him.categories.includes('Shaving & Beard'),
  repeatedSwitching: herAgain.mode === 'women' && himAgain.mode === 'men' && finalHer.mode === 'women',
  stableGeometry: result.states.every((state) => state.categoryCount === 6 && state.productCards > 0),
  verticalScroll: initial.canScroll,
  cartRendered: initial.cartVisible,
  categoryNavigation: result.categoryNavigation,
  cartNavigation: result.cartNavigation,
};

if (Object.values(assertions).some((value) => !value)) {
  console.error(JSON.stringify({ assertions, result }, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({ assertions, finalMode: finalHer.mode }, null, 2));
}

socket.close();
