# Glowvai Home design extraction

## Source hierarchy

1. The supplied Zepto screenshots and HTML define the commerce skeleton.
2. `01-top-commerce.png` defines the top viewport and campaign proportions.
3. `02-product-discovery.png` defines category tabs, product cards, Explore and Featured.
4. `03-offers-cart.png` defines offers, value shelves, minis, cart dock and bottom navigation clearance.
5. `04-him-mode.png` defines the full Him-mode replacement while preserving geometry.

The generated images occasionally render subtle tonal variation. The implementation follows the user's stricter rule: solid fills only, with no CSS gradients.

## Page order

1. Compact delivery header with wallet/profile.
2. Search field with integrated Her/Him control.
3. Full-width seasonal campaign merchandising.
4. Trust/value strip.
5. Raised browser-tab category rail.
6. Horizontal addable product shelf and full-width See All.
7. Explore asymmetric grid.
8. Featured shortcuts.
9. Coupons and bank offer.
10. Value Picks shelf.
11. Glow Minis three-column shelf.
12. Floating cart/free-delivery dock and five-item bottom navigation.

## Geometry and spacing

- App width: 390-440 px; implementation reference width 440 px.
- Horizontal gutter: 14-16 px.
- Header total height: 124-136 px, never sticky and never 20%+ dead space.
- Campaign: edge-to-edge solid brand field; 14 px internal gutter.
- Campaign mosaic: one tall 5/12 tile plus a 7/12 two-by-two grid; 7-8 px gaps.
- Section spacing: 18-22 px before headings; 10-12 px heading-to-content.
- Product card width: 128-136 px; show about 3.2 cards at 440 px.
- Product image frame: 108-124 px tall; product copy below, not overlaid.
- Radius: 10-14 px for controls/cards; 16 px only for major campaign tiles.
- Borders: crisp 1 px cool gray; shadows only where separation is otherwise insufficient.

## Typography

- Body and commerce UI: Manrope.
- Glowvai wordmark only: Syne, lowercase.
- Delivery promise: 21-23 px, 800 weight.
- Campaign title: 25-30 px, 800 weight.
- Section heading: 18-20 px, 800 weight.
- Product name: 10-11 px, 750-800 weight, maximum two lines.
- Metadata: 8-9 px, 650-750 weight.
- Price: 12-13 px, 800 weight.

## Color system

### Her

- Brand/header/campaign: `#075DF7`.
- Pressed/dark: `#0649C6`.
- Soft surface: `#EAF2FF`.

### Him

- Brand/header/campaign: `#0A3F73`.
- Pressed/dark: `#082E54`.
- Soft surface: `#EAF1F7`.

### Shared

- Page: `#FFFFFF` and `#F7F8FA`.
- Text: `#111827`, secondary `#667085`.
- Border: `#E2E6EC`.
- Savings/delivery: `#07883D` with `#E8F7ED` badge.
- Cart dock: `#20242C`.
- Yellow appears only on the ₹5 deal badge.

No purple, glass effects, decorative blobs, or gradients.

## Signature components

1. Compact delivery/search header.
2. Zepto-style 1+4 campaign mosaic.
3. Raised browser-tab category rail with open-bottom active state.
4. Image-first product card with heart, discount, corner add button, price and savings.

## Mode behavior

Mode geometry remains stable to avoid disorientation, while the complete merchandising payload changes:

- header/campaign accent
- search placeholder
- campaign title, copy, images and five tile labels
- category labels and thumbnails
- product order and eligible products
- Explore and Featured labels/images
- offer values and shelf titles

The switch uses a short fade-through/slide transition over the whole feed. It must not merely recolor or replace one card.

## Interaction requirements

- Location opens the address modal.
- Search opens Search.
- Her/Him is an accessible two-state control.
- Category tabs horizontally scroll and update the shelf after a 200-300 ms skeleton.
- Product image/name opens details.
- Heart toggles wishlist.
- Add becomes a quantity stepper.
- See All and campaign tiles navigate to categories/search.
- Cart dock navigates to Cart and never covers add controls.
- The Home feed scrolls vertically while horizontal rails retain momentum.

## Motion

- Mode change: 360-460 ms fade-through plus 8-12 px horizontal settle across the page feed.
- Shelf change: 220-280 ms skeleton pulse, then content fade-in.
- Reduced Motion disables both.
