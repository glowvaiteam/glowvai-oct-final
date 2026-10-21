# Glowvai Navratri Home — extraction notes

## Source hierarchy

- `image-2.png` is the authoritative layout reference.
- `for-her-reference.png` and `for-him-reference.png` are fresh standalone extraction renders used to clarify typography, imagery and spacing without turning the final screen into a screenshot.
- The final UI remains HTML/CSS/React. Only the campaign and product photography are raster assets.

## Shared structure

1. Compact status area supplied by the existing app shell.
2. White header with a large blue `Glowvai` wordmark, delivery block, wallet and profile.
3. Full-width outlined search input.
4. Full-width two-option segmented control below the search field.
5. Wide Navratri campaign banner.
6. Six equal category cards in a three-column, two-row grid.
7. Wide seasonal offer strip.
8. Compact centered green cart pill.
9. `Featured Picks` heading and the existing scrollable commerce feed.
10. Five-item bottom navigation.

## Geometry

- Mobile content width: 390–440 logical pixels.
- Horizontal gutter: 16px.
- Header top row: approximately 58px.
- Search field: 48–50px high, 14–16px radius.
- Segmented control: 48px high, 15–18px radius, equal 50% options.
- Campaign banner: roughly 2.2:1, 14px radius.
- Category grid: three equal columns, 8px gaps, cards near 1:1 aspect ratio.
- Offer strip: 52px high, 11–12px radius.
- Cart: 190–220px wide, 48–52px high, centered and visually floating.
- Bottom navigation: 72–78px high.

## Typography

- Glowvai wordmark and major campaign heading: Syne, bold.
- UI labels: Manrope, 700–800 for headings and actions, 500–650 for support text.
- Wordmark: about 27–30px on a 390px viewport.
- Campaign heading: 28–34px depending on available width.
- Category labels: 11–12px with at most two lines.
- Microcopy: never below 8px in the coded screen.

## Color system

- Brand electric blue: `#0505ff`.
- Her accent: `#ef2f72`; soft surface `#fff1f5`; deep text `#a90c42`.
- Him accent: `#075df7`; soft surface `#edf5ff`; deep text `#073784`.
- Cart green: `#24a33a`.
- Canvas: white; borders: restrained blue-grey around `#dfe5ee`.
- No decorative multi-colour gradients or glass effects.

## Mode behavior

- The segmented thumb moves as a single physical object.
- Her changes search copy, hero photography/copy, six categories, promo copy, category imagery, featured shelf ordering, offers and supporting content.
- Him changes the same full set while preserving geometry so no layout jumps occur.
- Transition: 360–420ms fade/translate for content; 320ms cubic-bezier slide for the thumb.

## Interaction mapping

- Address opens the existing address modal.
- Search opens the existing search screen.
- Wallet/profile use existing destinations where available.
- Each category opens existing search with its category query.
- Seasonal banner and `See all` open existing category/search destinations.
- Cart opens the existing cart.
- Product cards below the fold retain wishlist, add, quantity and product-detail behavior.
