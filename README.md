# Glowvai User Application — Production Workspace
**Version:** 1.0 (October Final Release)
**Repository:** `https://github.com/glowvaiteam/glowvai-oct-final`
**Market:** Vijayawada, Andhra Pradesh, India
**Branding:** White & Soft-Blue Theme, Minimal, Premium, Commerce-first

---

## 🚀 Overview

Glowvai is an Indian beauty-commerce platform combining:
1. **15-Minute Hyperlocal Quick Commerce** in Vijayawada (Benz Circle, MG Road, Governorpet, Patamata, Auto Nagar).
2. **AI-Powered Biometric Facial Diagnostics** assessing T-Zone sebum, barrier hydration, redness, and dark spots with dermatologist-approved active ingredient matching.
3. **Optional Beauty Insurance Programme** with 14-day daily routine verification streaks, adverse reaction reporting, and suitability refund guarantee.
4. **Multi-Source Hybrid Fulfilment** coordinating central dark-store inventory and regional hub sourcing under a single customer cart.
5. **Student Referral Programme Integration** linking directly to the official campus verification portal at [`https://earn.glowvai.in`](https://earn.glowvai.in).

---

## 📁 Repository & Architecture Structure

```
glowvai october final/
├── index.html                   # HTML entry point with Android viewport & Google Fonts (Inter + Plus Jakarta Sans)
├── package.json                 # Production scripts & dependencies (React 18, Vite, TypeScript, Lucide)
├── tsconfig.json                # TypeScript 5.6 configuration
├── vite.config.ts               # Vite configuration with alias resolution
├── src/
│   ├── main.tsx                 # React DOM root with AppProvider
│   ├── App.tsx                  # Android viewport container, status bar, screen router, toast
│   ├── index.css                # Android mobile shell, CSS variables, typography & layout resets
│   ├── vite-env.d.ts            # Client environment types
│   ├── theme/
│   │   └── tokens.ts            # Approved Glowvai tokens: soft blue (#1A73E8), charcoal text, 8pt spacing
│   ├── types/
│   │   └── index.ts             # Authoritative TypeScript data models (PRD Section 28)
│   ├── data/
│   │   ├── products.ts          # Authentic Indian beauty catalogue (Minimalist, Cetaphil, Plum, etc.)
│   │   ├── categories.ts        # Approved launch categories: Skin Care, Cosmetics, Accessories
│   │   └── serviceability.ts    # Vijayawada delivery zones & ETA calculation
│   ├── services/
│   │   └── api.ts               # Authoritative backend API contracts (PRD Section 27)
│   ├── context/
│   │   └── AppContext.tsx       # Centralized global state (Cart, User, Address, Streaks, Diagnostics, Orders)
│   ├── components/
│   │   ├── common/
│   │   │   ├── AndroidStatusBar.tsx     # Native Android system status bar
│   │   │   ├── AppHeader.tsx            # Vijayawada ETA pill, back button & cart shortcut
│   │   │   ├── BottomNavBar.tsx         # 5 primary destinations (Home, Categories, Search, Orders, Profile)
│   │   │   ├── AddressModal.tsx         # Vijayawada locality address switcher & form
│   │   │   └── StudentReferralModal.tsx # External earn.glowvai.in portal modal
│   │   └── cards/
│   │       └── ProductCard.tsx          # Production card (pricing, MRP, discounts, stock, insurance)
│   └── screens/
│       ├── WelcomeScreen.tsx            # Approved Glowvai welcome screen & carousel
│       ├── OnboardingScreen.tsx         # 3 approved onboarding screens
│       ├── LoginScreen.tsx              # Indian 10-digit mobile login (+91) with DPDP compliance
│       ├── OtpScreen.tsx                # 4-digit OTP input with resend cooldown
│       ├── FaceAnalysisPrepScreen.tsx   # Preparation rules & DPDP data retention choices
│       ├── FaceAnalysisCameraScreen.tsx # WebRTC front-camera capture with oval guide & quality checks
│       ├── FaceAnalysisLoadingScreen.tsx# Diagnostic progress animation (5-10s)
│       ├── SkinReportScreen.tsx         # Skin score, observations, actives & product matches
│       ├── HomeScreen.tsx               # Express delivery, shopping mode tabs (All, Men, Women), banners
│       ├── CategoryScreen.tsx           # Category tabs & subcategory filters
│       ├── SearchScreen.tsx             # Real-time search by product, brand, ingredient
│       ├── ProductDetailScreen.tsx      # Full formulation, variants, Beauty Insurance opt-in
│       ├── CartScreen.tsx               # Per-item insurance toggle, coupons, multi-source ETA notice
│       ├── CheckoutScreen.tsx           # UPI (GPay, PhonePe, Paytm), Card, COD, idempotency
│       ├── OrderConfirmationScreen.tsx  # Order ID, ETA & streak activation summary
│       ├── OrderTrackingScreen.tsx      # Live delivery timeline & rider details
│       ├── StreakTrackingScreen.tsx     # 14-day calendar, daily check-in uploads, adverse reaction ticket
│       ├── OrderHistoryScreen.tsx       # Order reordering & verified-purchase review modal
│       ├── ProfileScreen.tsx            # Personal details, addresses, DPDP deletion, student portal
│       └── SupportScreen.tsx            # Order-linked customer support ticket system
```

---

## 🛠️ Getting Started & Local Development

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v26)
- **Package Manager**: npm

### 2. Run Locally
```bash
# Navigate to workspace
cd "C:\Users\Mukesh\.gemini\antigravity-ide\scratch\glowvai october final"

# Start Vite Development Server
npm run dev
```
App runs locally at: `http://localhost:5173/`

### 3. Production Build & Typecheck
```bash
# Validate TypeScript and compile production bundle
npm run build
```

---

## 🧪 Verified PRD Requirements & Features

| Feature Group | Implementation Status | PRD Reference |
| :--- | :--- | :--- |
| **Authentication** | 10-digit Indian mobile validation (+91), OTP verification, session handling | Section 6, 27.1 |
| **Onboarding** | 3 approved educational screens, progress dots, skip to catalogue | Section 6.3 |
| **Facial Analysis** | Natural lighting guidelines, DPDP consent, WebRTC camera capture, quality checks | Section 7, 27.10 |
| **Skin Diagnostic** | 0-100 score, T-Zone sebum, barrier hydration, active ingredient suggestions | Section 8 |
| **Quick Commerce** | 12-15 min ETA in Vijayawada (Benz Circle, MG Road, Auto Nagar) | Section 9, 10 |
| **Shopping Modes** | User-controlled tabs for All, Women, Men (never inferred from facial scan) | Section 10.6 |
| **Catalogue & Search** | Verified authentic formulations (Minimalist, Cetaphil, Plum, etc.) with ingredient search | Section 11, 12, 13 |
| **Multi-Source Fulfilment** | Sourcing notice displayed when dispatching from Auto Nagar regional hub | Section 16 |
| **Cart & Pricing** | Authoritative backend price calculations, per-item Beauty Insurance toggle (+₹29) | Section 14, 15 |
| **Checkout & Payments** | UPI (GPay, PhonePe, Paytm), Cards, NetBanking, COD with anti-duplicate idempotency | Section 15.4 |
| **Order Tracking** | 5-stage timeline progression, masked rider details (K. Ramesh Babu) | Section 17 |
| **Beauty Insurance** | 14-day daily routine streak tracking, photo uploads, claim review, adverse reaction ticket | Section 20 |
| **Student Referrals** | Modal linking directly to official campus verification portal at `https://earn.glowvai.in` | Section 21.5 |
| **Profile & Privacy** | DPDP Act compliant privacy policy, data retention preferences, account deletion | Section 23, 29 |

---

## Android and Play Store bundle

The Android project is generated with Capacitor and uses application ID `com.glowvai.app`.

```powershell
npm install
npm run android:sync
cd android
.\gradlew.bat bundleRelease
```

The signed bundle is generated at `android/app/build/outputs/bundle/release/app-release.aab` when a private `android/keystore.properties` file and upload keystore are present. Start from `android/keystore.properties.example`; never commit the real keystore or passwords.

For an installed Android build, set `VITE_PAYMENTS_API_URL` to the public HTTPS payments backend before running `npm run android:sync`. The relative `/api` development middleware is available only during local Vite development. Razorpay Test Mode accepts mock test methods; live UPI applications require activated live credentials.
