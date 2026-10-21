# Glowvai commerce v2 reference extraction

These three standalone images are implementation references, not runtime screenshots or image-only screens. Every control and content block is to be coded with the existing React state and navigation.

## Shared system

- Mobile canvas: 430px design width with 16px horizontal gutters and an 8px spacing grid.
- Typography: Syne is reserved for the `glowvai` wordmark and major display headings. Commerce copy uses the current grotesk at 600-750 weight, with 22-24px section headings, 13-14px product names, and 16-20px prices/totals.
- Palette: white and cool-white surfaces, near-black text, `#075cff` actions, green only for savings/success, amber only for attention. No gradients, glass, decorative blobs, or ornamental pills.
- Shape: 12-16px media/card radii, 1px neutral borders, nearly shadowless sections, 44px minimum actions.
- Motion: 180-240ms state changes; content fades through without layout jumping. Respect reduced-motion.

## Home remainder

Visual priority is shopping: category tabs, products, add buttons, then discovery and offers. The page uses open white space instead of enclosing every section in a tinted panel.

- Category tabs are a horizontal strip with fixed 64px image frames. Active state uses one blue border and a 3px bottom accent; inactive tabs stay neutral.
- Product rails use one reusable 148px card. Image area is 148x146 with `object-fit: contain`, fixed text slots, wishlist top-right, discount top-left, and a 44px blue add/stepper control at bottom-right.
- Section rhythm is 28px between modules and 12px between heading and content. The next product remains partially visible to signal horizontal scrolling.
- Explore changes tempo: one wide image-led banner followed by two equal compact shortcut tiles. The cards use restrained category-specific pale backgrounds, never gradients.
- Coupons are four 132px perforated-edge cards plus one horizontal UPI cashback row. Offer copy is short and the code remains selectable/copyable.
- Value Picks reuses the exact product card. Buy Again switches to a compact horizontal product row after interactive tabs.
- The fixed navigation and compact floating cart/offer affordance reserve at least 156px of final content padding so they never hide product text or controls.

## Skin report

The report should answer three questions in order: how am I doing, where should I focus, and what should I buy. It is explicitly a beauty-shopping guide, not a medical diagnosis.

- The 82/100 result is the first focal point inside a simple semicircular gauge. Zones are labelled in plain language: Needs care, Fair, Healthy glow.
- A single summary row shows skin type, tone, and scan timing. This removes repeated prose.
- Face zones and four signal meters sit side-by-side on wide render, then stack on narrow devices. Each signal is icon + short label + meter + one status; detail copy belongs behind `See full details`.
- Routine is visual: Morning (Cleanse, Treat, Protect) and Evening (Cleanse, Treat, Moisturize), with three compact steps each.
- `Shop your recommendations` is the single dominant CTA. `See full details` is secondary. A short scroll hint introduces the existing report-to-Home reveal.
- Entry animation order: gauge draws 0-700ms, score counts in 140-700ms, metrics fade 420-620ms, meters stagger 520-900ms, CTA rises at 780ms.

## Checkout and order status

The checkout reference uses the left side as the pre-order state and the receipt on the right as the post-tap state; these are separate coded screens, not a split layout at runtime.

- Checkout order: delivery address, delivery promise, editable order summary, coupon, bill details, payment method. The sticky action always reads `Place order • <payable total>`.
- Payment choices are explicit radio rows. UPI is selected by default; Cash on Delivery is an available alternative. No success is shown until the user presses Place order.
- Confirmation uses a receipt emerging from a dark slot. It shows order ID, payment status, concise items, payable amount, and four progress stages.
- Success motion: button compresses 0-120ms; check ring draws 120-520ms; receipt translates upward 180-700ms with a soft ease-out; progress nodes settle at 520/640/760/880ms. Reduced-motion renders the final state immediately.
- `Track order` is primary and `Continue shopping` secondary. Tracking preserves Confirmed, Packed, Out for delivery, Delivered semantics without pretending live courier data exists.
