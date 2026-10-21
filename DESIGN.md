# glowvai interface system

This document describes the shipped mobile-web interface. Preserve these rules when extending it; do not introduce a competing visual system.

## Brand and typography

- The brand is always written as lowercase `glowvai`.
- Use Syne for the wordmark only: `var(--font-brand)`, weight 600, tight `-.055em` tracking. Do not use Syne as a general display face.
- Use Manrope for headings, controls, labels, and body copy through `var(--font-heading)` and `var(--font-body)`.
- Both typefaces are bundled in `src/assets/fonts/` as variable WOFF2 files. Do not replace them with remote font requests.
- Working type scale: 25px campaign display, 21-22px primary headings, 18px section headings, 12-13px body/control text, and 10-11.5px metadata.

## Color and hierarchy

- Quick-commerce blue: `#0f5cf6`. It owns the home header, login brand field, onboarding backdrop, and high-priority glowvai actions.
- Editorial campaign red: `#9d1725`, paired with white headings, `#ffd9dd` supporting copy, and a white CTA. Use it for the featured beauty edit, not routine controls.
- Main commerce canvas: `#f5f6f8`; elevated surfaces are white.
- Core text is `#161a22`; supporting text uses the existing secondary and muted tokens.
- Dark navigation/cart surface: `#17191e` / `#1c2330` with white active content and `#9299a7` inactive navigation.
- Keep one dominant action or campaign per view. Blue communicates Glowvai navigation/action; red is reserved for editorial promotion.

## Home structure

The home screen follows a fixed quick-commerce hierarchy:

1. Compact white delivery header with blue delivery time/location, wallet status, account, black search, and a for-her / for-him switch.
2. Horizontally scrollable `The glow drop` cards; use distinct editorial color fields and product imagery rather than a large 2x2 promotion.
3. Contextual skin-analysis action.
4. Chrome-tab-like category rail with a 240ms skeleton loading state and a dense three-column nearby inventory grid.
5. Small floating green cart summary and a five-item white bottom navigation: Home, Reorder, Categories, Skin scan, vaithra.

Home content keeps at least `126px` bottom clearance so products remain reachable above the cart summary and navigation.

## Scan to commerce handoff

- A skin report is a real scrollable assessment, not a dead-end product list. It ends with a clear “Scroll to shop your routine” cue.
- Report signals use plain-language `What it means` and `What helps` explanations. Never use an unlabeled score bar where higher could mean either healthier or worse.
- When the commerce surface enters view, it translates upward with a blue-to-green-to-yellow color wash, then completes the handoff to the standalone Home screen. Only then may the global floating cart and navigation appear.
- Returning to a completed report from Home requires a deliberate downward pull on the report handle; avoid a prominent one-tap shortcut after handoff.
- Category changes use a short 240ms skeleton state. The gender/audience mode uses a single contained spring-like transition; respect reduced-motion preferences.

## Home merchandising

- The Her/Him mode is a full-width interactive merchandising widget, not a tiny utility toggle. Switching mode changes the widget color world, copy, and filtered products together.
- Follow a dense quick-commerce rhythm: compact delivery/search header, interactive mode widget, swipeable editorial rail, asymmetric Explore shortcuts, category tabs, then horizontal product rails.
- Cart feedback is a compact floating bag with count and payable amount; never restore the full-width floating cart bar.

## Spacing, radii, and controls

- Build spacing from 4px increments. Common page insets are 10-16px; section separation is 20-24px.
- Surface radii are compact and friendly: 9-13px for controls/cards, 14-16px for feature surfaces, and 26px for the login sheet.
- Interactive targets must be at least 44x44px. Primary submit actions are 54px high; the cart summary is at least 52px high.
- Product imagery uses `object-fit: cover` inside commerce cards. Decorative login tiles use `contain`.
- Use restrained elevation. The floating cart may use `var(--shadow-float)`; routine content should rely on spacing, borders, and surface contrast.
- Preserve visible `:focus-visible` outlines and reduced-motion behavior from `src/index.css`.

## Bottom navigation

- The bottom bar is a 62px, five-column white navigation: Home, Reorder, Categories, Skin scan, vaithra.
- The active destination uses dark iconography and a small yellow top marker. The vaithra destination is a yellow wordmark chip.
- Set `aria-current="page"` on the active destination.
- When the cart contains items, show the authoritative item count and payable total in the floating cart summary. Do not cover the final scrollable content.

## Welcome and onboarding implementation

- Welcome is fully coded: a blue-to-white vertical gradient, centered lowercase Syne wordmark, and the supplied `always for you!!` line. Never replace the screen with a flattened screenshot.
- Onboarding is a real React flow. The logo, white sheet, headline, body copy, progress dots, CTA, state changes, and accessibility labels are live UI.
- `hero-skin-v2.png`, `hero-delivery-v2.png`, and `hero-progress-v2.png` are high-resolution artwork derived from the user-provided visual references. They are decorative hero media only—not screenshots of the interface.
- Hero media occupies the upper scene with `object-fit: cover`; the coded white sheet overlaps it with a 30px top radius.
- Keep controls at least 44px, preserve the 62px primary CTA, and expose the current step through an accessible label.
- The older `welcome.png` and `step-1.png` through `step-3.png` remain reference artifacts and must not be rendered as full screens.

## Accessibility and honest states

- Use native buttons for navigation/actions; do not attach click behavior to non-interactive sections.
- Decorative product/artwork images use empty alt text or `aria-hidden`; meaningful state is expressed in text.
- Validation failures use `role="alert"`; transient app messages use the existing polite live region.
- Do not force-focus the mobile-number input or automatically open the keyboard.
- Never invent integrations, balances, availability, eligibility, or success states. Address, delivery ETA, products, skin-report state, cart count, and payable total must come from app state.
- If a destination does not exist, do not present a fake link or button. The current rewards balance and legal terms are intentionally informational, not interactive.
- Keep insurance language conditional and product-specific. Do not imply universal coverage.
- Disabled actions must look disabled and remain unavailable until their real validation conditions pass.

## Responsive frame

- The app viewport fills small screens and is centered at a maximum of 440x920px on wider canvases.
- Prevent horizontal overflow and verify both edges at the real app viewport width.
- Respect `env(safe-area-inset-bottom)` for bottom navigation, cart, and transient messages.
