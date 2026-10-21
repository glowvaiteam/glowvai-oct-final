import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const mode = process.argv[2];
const fail = (message) => { throw new Error(message); };
const read = (path) => readFileSync(resolve(root, path), 'utf8');

if (mode === 'references') {
  const images = [
    'design-references/navratri-target/for-her-reference.png',
    'design-references/navratri-target/for-him-reference.png',
    'src/assets/home/navratri-her-hero.png',
    'src/assets/home/navratri-him-hero.png',
    'src/assets/home/navratri-her-categories.png',
    'src/assets/home/navratri-him-categories.png',
  ];
  for (const image of images) {
    const absolute = resolve(root, image);
    if (!existsSync(absolute)) fail(`Missing target reference or asset: ${image}`);
    if (statSync(absolute).size < 100_000) fail(`Image is unexpectedly small: ${image}`);
  }
  const spec = read('design-references/navratri-target/ANALYSIS.md');
  for (const token of ['Shared structure', 'Geometry', 'Typography', 'Color system', 'Mode behavior', 'Interaction mapping']) {
    if (!spec.includes(token)) fail(`Target analysis missing ${token}`);
  }
  console.log('NAVRATRI HOME REFERENCES VERIFIED');
  process.exit(0);
}

if (mode === 'implementation') {
  const home = read('src/screens/HomeScreen.tsx');
  const css = read('src/index.css');
  const nav = read('src/components/common/BottomNavBar.tsx');
  const marker = '/* Navratri reference-match Home v5 */';
  const start = css.indexOf(marker);
  if (start < 0) fail('Missing Navratri Home CSS marker');
  const homeCss = css.slice(start);

  const requiredSource = [
    'navratri-her-hero.png',
    'navratri-him-hero.png',
    'navratri-her-categories.png',
    'navratri-him-categories.png',
    'zq-wordmark',
    'zq-mode-thumb',
    'zq-festival-hero',
    'zq-festival-grid',
    'zq-festival-promo',
    'zq-scoop-tabs',
    'zq-product-rail',
    'Pooja Essentials',
    'Shaving & Beard',
    'Beauty · Gifting · Festive Picks',
    'Style · Grooming · Festive Picks',
    'toggleWishlist(product.id)',
    'addToCart(product, variant.id, false)',
    'setShoppingPreference(next)',
  ];
  for (const token of requiredSource) {
    if (!home.includes(token) && !homeCss.includes(token)) fail(`Missing target behavior or section: ${token}`);
  }
  if (!home.includes('women: {') || !home.includes('men: {')) fail('Both merchandising modes are required');
  if (/(?:linear|radial|conic)-gradient\s*\(/i.test(homeCss)) fail('Decorative gradient found in target Home styles');
  if (/\.zq-header\s*\{[^}]*position\s*:\s*(?:fixed|sticky)/i.test(homeCss)) fail('Header must scroll naturally');
  if (!/\.zq-home\s*\{[^}]*overflow\s*:\s*visible/i.test(homeCss)) fail('Vertical scrolling contract missing');
  for (const label of ["label: 'Home'", "label: 'Order Again'", "label: 'Categories'", "label: 'Print'"]) {
    if (!nav.includes(label)) fail(`Missing target navigation item: ${label}`);
  }

  console.log('NAVRATRI HOME IMPLEMENTATION VERIFIED');
  process.exit(0);
}

fail('Usage: node scripts/verify-home-redesign.mjs references|implementation');
