# Gates: Glowvai full commerce experience

OWNS: GATES.md, .env, .env.example, .gitignore, vite.config.ts, server/**, design-references/commerce-v2/**, src/assets/**, src/components/**, src/data/**, src/screens/**, src/context/**, src/services/**, src/types/**, src/App.tsx, src/index.css, scripts/verify-commerce-v2.mjs, scripts/verify-commerce-v3.mjs, scripts/qa-commerce-v2.mjs, scripts/qa-commerce-v3.mjs

Scope: Preserve the approved first Home fold while rebuilding every lower Home section, simplifying the skin report, and delivering a functional cart-to-order flow with production-quality mobile scrolling and feedback.

- [x] G0: this ledger states concrete outcomes that can fail
  CHECK: node C:\Users\Mukesh\Documents\glowvai-v2\.agents\skills\unlazy\scripts\gate-lint.mjs GATES.md
  EXPECT: LINT OK
  EVIDENCE: automatic-evidence=v1; definition-sha256=b505fdf707f46703779692f9f6c1cbfb9ac63a5b8339a7515761c5818fb55149; exit=0; EXPECT=matched; output-sha256=48630b7361dd44ee870917b12c3d19b9d7bdea738aaca16bb04d4cab83b772d2; output-bytes=8; shell=C:\Windows\system32\cmd.exe; cwd=C:\Users\Mukesh\.gemini\antigravity-ide\scratch\glowvai october final; path=9a2c7b475205/29 entries

- [x] G1: focused visual references and extraction notes exist for Home remainder, skin report, and checkout status
  CHECK: node scripts/verify-commerce-v2.mjs references
  EXPECT: COMMERCE V2 REFERENCES VERIFIED
  EVIDENCE: automatic-evidence=v1; definition-sha256=824f4a4b7ee98a6d529ac887b197be2135c14da48078c0cd546ba2c503e878ea; exit=0; EXPECT=matched; output-sha256=ffc521ac7a4e7a547dd4c95cb000426163f1db2be46e503b4695cdd29379bd73; output-bytes=32; shell=C:\Windows\system32\cmd.exe; cwd=C:\Users\Mukesh\.gemini\antigravity-ide\scratch\glowvai october final; path=9a2c7b475205/29 entries

- [x] G2: every lower Home section uses cohesive Zepto-style hierarchy, reusable product cards, interactive tabs, stable horizontal rails, and safe bottom spacing
  CHECK: node scripts/verify-commerce-v2.mjs home
  EXPECT: COMMERCE V2 HOME VERIFIED
  EVIDENCE: automatic-evidence=v1; definition-sha256=93cb1e5f5d32e86e8522e7d6b546b6134414ce21b8769a6d9abff228c832064c; exit=0; EXPECT=matched; output-sha256=090b8809a8858ba38342160344391da8d0871b190b4b130acd209f4bb4c79a54; output-bytes=26; shell=C:\Windows\system32\cmd.exe; cwd=C:\Users\Mukesh\.gemini\antigravity-ide\scratch\glowvai october final; path=9a2c7b475205/29 entries

- [x] G3: skin report is visual and concise, explains results in plain language, and preserves the animated report-to-Home reveal
  CHECK: node scripts/verify-commerce-v2.mjs report
  EXPECT: COMMERCE V2 REPORT VERIFIED
  EVIDENCE: automatic-evidence=v1; definition-sha256=13d2d404a0566ee11cd8e8fda23bbd3e83c8288bb5ed1d5ab2fca999caf399f4; exit=0; EXPECT=matched; output-sha256=6b2a9d491d1a495d371c8584235d8de8c59924e0379db68bf1653e4c160357d1; output-bytes=28; shell=C:\Windows\system32\cmd.exe; cwd=C:\Users\Mukesh\.gemini\antigravity-ide\scratch\glowvai october final; path=9a2c7b475205/29 entries

- [x] G4: cart, checkout, verified Razorpay-or-COD place-order, confirmation, and tracking transitions are connected with an explicit payable CTA, truthful payment state, and a visible estimated map route
  CHECK: node scripts/verify-commerce-v2.mjs checkout
  EXPECT: COMMERCE V2 CHECKOUT VERIFIED
  EVIDENCE: automatic-evidence=v1; definition-sha256=9b1c3a9b5afbd05f0ac313c07c693a2c35094843fbbea547ea4387851eaa00a4; exit=0; EXPECT=matched; output-sha256=a613216a6a75e1586b5109dda0518b94c9c166c34a9b9f1b4abfc6995f773fbb; output-bytes=30; shell=C:\Windows\system32\cmd.exe; cwd=C:\Users\Mukesh\.gemini\antigravity-ide\scratch\glowvai october final; path=9a2c7b475205/29 entries

- [x] G5: application passes TypeScript validation and a production build
  CHECK: npm run typecheck && npm run build
  EXPECT: built in
  EVIDENCE: automatic-evidence=v1; definition-sha256=8bb83d89912ee6c6583ac8436260f3dc891b39c551dc4d66b495ebebe5bdff90; exit=0; EXPECT=matched; output-sha256=01cd89dca40877e118cbffb40779d08f92196edaae3342f1caba81e3abdd4ab1; output-bytes=1726; shell=C:\Windows\system32\cmd.exe; cwd=C:\Users\Mukesh\.gemini\antigravity-ide\scratch\glowvai october final; path=9a2c7b475205/29 entries

- [x] G6: rendered mobile QA passes at Home top, middle, bottom, both audience modes, report, cart, checkout, confirmation, and tracking with no runtime errors
  CHECK: node scripts/qa-commerce-v2.mjs
  EXPECT: COMMERCE V2 BROWSER QA PASSED
  EVIDENCE: automatic-evidence=v1; definition-sha256=987f2b47410b4015ed7d80634117a37f3cedde9d0c1b2ce0fb6e2370dac97245; exit=0; EXPECT=matched; output-sha256=3cc11dc78247c225d7fb8fc93dc79100ac30716988b8a42d4ff9f8c7ee26c81a; output-bytes=2008; shell=C:\Windows\system32\cmd.exe; cwd=C:\Users\Mukesh\.gemini\antigravity-ide\scratch\glowvai october final; path=9a2c7b475205/29 entries

- [x] G7: payment secrets cannot ship in the browser bundle, online success requires server signature verification, and the supplied Razorpay test key ID is ignored from version control
  CHECK: node scripts/verify-commerce-v2.mjs payments
  EXPECT: COMMERCE V2 PAYMENTS VERIFIED
  EVIDENCE: automatic-evidence=v1; definition-sha256=dd3c23611eca2e2496a94faadc4308c2dcfed50616fa76ba04552ea6fbd24132; exit=0; EXPECT=matched; output-sha256=c74fe914911fe7083ca6abf79659739e2fda623f2ff1e66c39f5ad1059e60d19; output-bytes=30; shell=C:\Windows\system32\cmd.exe; cwd=C:\Users\Mukesh\.gemini\antigravity-ide\scratch\glowvai october final; path=9a2c7b475205/29 entries

- [x] G8: first-order contact details are validated, persisted locally, shown at checkout, and editable from the profile
  CHECK: node scripts/verify-commerce-v3.mjs customer
  EXPECT: COMMERCE V3 CUSTOMER VERIFIED
  EVIDENCE: automatic-evidence=v1; definition-sha256=7d6a124cd3cb32f8685169334612b38d2966b019f2e964b4dff503679b0b4a5f; exit=0; EXPECT=matched; output-sha256=a3ab01218a62101b4cd900a7b0e0a347bce02d1279f2089c889bb37004055335; output-bytes=30; shell=C:\Windows\system32\cmd.exe; cwd=C:\Users\Mukesh\.gemini\antigravity-ide\scratch\glowvai october final; path=9a2c7b475205/29 entries

- [x] G9: Razorpay mobile checkout exposes UPI, cards, netbanking, and wallets with accurate test-mode guidance and customer prefill
  CHECK: node scripts/verify-commerce-v3.mjs payments
  EXPECT: COMMERCE V3 PAYMENTS VERIFIED
  EVIDENCE: automatic-evidence=v1; definition-sha256=95fa973c9b337ca0e86241675cd1e923b1d8a28f18f0a763ec8f246a98132257; exit=0; EXPECT=matched; output-sha256=e4e2d2ea0f16384ebecb063f790ace18ff06ef4c17e0fd58df36ecd1c888da60; output-bytes=30; shell=C:\Windows\system32\cmd.exe; cwd=C:\Users\Mukesh\.gemini\antigravity-ide\scratch\glowvai october final; path=9a2c7b475205/29 entries

- [x] G10: payment failure, payment cancellation, order cancellation, empty, loading, and retry states are coded and route back to a useful action
  CHECK: node scripts/verify-commerce-v3.mjs states
  EXPECT: COMMERCE V3 STATES VERIFIED
  EVIDENCE: automatic-evidence=v1; definition-sha256=76c823b00b7b048bb88ce9f70b7395ab597becd101ae97c85ce62f23ba8242c0; exit=0; EXPECT=matched; output-sha256=3618035547527113232af9a2cea853bf3724602f74b3b8408294a8e51cdc2dbd; output-bytes=28; shell=C:\Windows\system32\cmd.exe; cwd=C:\Users\Mukesh\.gemini\antigravity-ide\scratch\glowvai october final; path=9a2c7b475205/29 entries

- [x] G11: checkout, confirmation, order history, tracking map, cancellation, and profile entry points form one connected customer journey
  CHECK: node scripts/verify-commerce-v3.mjs journey
  EXPECT: COMMERCE V3 JOURNEY VERIFIED
  EVIDENCE: automatic-evidence=v1; definition-sha256=75f51bfaa639028cbae3bf7067b33ddc32075a3199966afc6cfe4dbf75b8b825; exit=0; EXPECT=matched; output-sha256=769c40131d3d65a72a7a1d0f5c07f7ba5dbfc00c8b0f44d25352f644e9b772a2; output-bytes=29; shell=C:\Windows\system32\cmd.exe; cwd=C:\Users\Mukesh\.gemini\antigravity-ide\scratch\glowvai october final; path=9a2c7b475205/29 entries

- [x] G12: expanded application passes TypeScript, production build, and mobile browser journey QA without runtime or horizontal-overflow errors
  CHECK: npm run typecheck && npm run build && node scripts/qa-commerce-v3.mjs
  EXPECT: COMMERCE V3 BROWSER QA PASSED
  EVIDENCE: automatic-evidence=v1; definition-sha256=b50fd71797dba91c7f170e3173754ee32eb57051f2f1bcfe119c7dd343600357; exit=0; EXPECT=matched; output-sha256=6a4aaf76280cce57bcea492267ec4f038916cecf86b742f77766eae35f8882e8; output-bytes=2589; shell=C:\Windows\system32\cmd.exe; cwd=C:\Users\Mukesh\.gemini\antigravity-ide\scratch\glowvai october final; path=9a2c7b475205/29 entries
