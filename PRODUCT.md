# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Indian customers, initially in Vijayawada, shopping for skincare, cosmetics, and beauty essentials on ordinary Android phones.

## Product Purpose

Glowvai is a beauty quick-commerce application that helps customers discover suitable products, see local availability and delivery estimates, manage a cart and checkout, and optionally use AI skin analysis and product-specific Beauty Insurance.

## Positioning

Glowvai combines local beauty-commerce fulfilment with optional skin analysis and policy-driven product suitability coverage in one shopping flow.

## Operating Context

Customers browse and order on mobile, often under time pressure, using delivery location, search, categories, product details, cart, checkout, order tracking, support, and account flows.

## Capabilities and Constraints

- React, TypeScript, and Vite web application optimized for Android-sized viewports.
- Existing authentication, OTP, skin analysis, catalogue, cart, checkout, order, insurance-streak, profile, and support flows must remain functional.
- Product availability, prices, discounts, insurance eligibility, delivery estimates, and payment results remain backend-authoritative.
- Development fixtures must not be presented as verified production data.
- The initial market is Vijayawada, Andhra Pradesh, India.

## Brand Commitments

- Brand name is always written as lowercase `glowvai`.
- The Glowvai wordmark uses Syne.
- Bright Glowvai blue is the primary brand color.
- Welcome and onboarding follow the user-supplied Canva reference.
- Home and login use practical Instamart-style quick-commerce hierarchy without copying Instamart branding.
- Brand voice is direct, useful, credible, and commerce-first.

## Evidence on Hand

- User-provided Canva references stored under `.impeccable/references/`.
- User-provided login screenshot in the conversation.
- Existing product, category, serviceability, and application-flow fixtures in `src/data/` and `src/context/`.
- No verified production inventory or fulfilment feed is present in this frontend repository.

## Product Principles

- Commerce and delivery clarity lead the experience.
- Personalization supports shopping; it does not replace shopping.
- Show only truthful availability, ETA, policy, and payment states.
- Keep primary actions reachable and readable on ordinary Android devices.
- Preserve customer control over biometric data and optional insurance.

## Accessibility & Inclusion

Maintain readable contrast, keyboard focus, comfortable touch targets, reduced-motion support, and layouts that tolerate font scaling and narrow Android screens.
