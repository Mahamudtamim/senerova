# Changelog

All notable changes to Senerova are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] — 2025-04-18

### Added
- Admin password gate with SHA-256 hashing via Web Crypto API (`SubtleCrypto`)
- Admin session management using `sessionStorage` with 2-hour TTL
- Brute-force lockout: 5 failed admin attempts triggers 30-second cooldown
- `changeAdminPassword()` function in Admin → Settings tab
- `Content-Security-Policy` meta tag restricting script sources to known CDNs
- Admin logout properly clears session (`AdminAuth.clearSession()`)
- Contact tab added to Admin navigation
- `SECURITY.md` — full security model documentation
- `CHANGELOG.md` — this file
- `LICENSE` — MIT license file

### Fixed
- `navigate('contact')` now correctly calls `renderContactPage()` so admin edits appear on the contact page
- OTP timer interval was not cleared on modal cancel — fixed `closeOtpModal()` to null the ref
- XSS vulnerability in `renderStoryPage()` — raw `${s.introText}` etc. replaced with `_esc()` escaping
- Duplicate `applyHero` implementations consolidated into single null-safe version
- Admin Settings "Danger Zone" now calls `AdminAuth.clearSession()` before data reset
- Duplicate `closeOtpModal` declaration removed
- Stale `renderContactPage()` call in IIFE startup removed (now driven by `navigate()`)
- `handleLogin()` now validates email format before accepting input
- `handleSignup()` now enforces password strength (8+ chars, uppercase, number)
- Login rate limiting: 5 failed attempts → 30-second lockout

### Security
- `ADMIN_LOGIN.txt` added to `.gitignore` to prevent credential commits
- Admin dashboard no longer accessible via direct URL hash (`#admin`) without a valid session

---

## [1.1.0] — 2025-03-20

### Added
- Hero colour controls in Admin — badge, title, subtitle, button, overlay colour pickers
- `sen-hero-colors` localStorage key for persisting hero colour overrides
- `js/hero-colors.js` IIFE module for hero colour management
- Announcement bar with admin editing tab (`js/announcement-bar.js`)
- Dynamic product categories — add/delete categories from Admin → Categories tab
- Extended shop filters: gender toggle, price range min/max, category select dropdown
- Contact page made fully dynamic — editable from Admin → Contact tab
- `saveContactAdmin()` and contact data persistence (`sen-contact`)
- Multi-image product gallery — up to 6 images per product with preview and remove
- `handleSingleImageUploadWithNote()` for hero/story image uploads with dimension hints
- `js/image-story-contact.js` IIFE module
- `js/admin-categories.js` IIFE module
- `PROJECT_STRUCTURE.md` documenting file layout

### Changed
- Admin navigation expanded to 11 tabs (added Categories and Contact)
- `buildAdminNav()` replaced with `customAdminTabs`-driven version
- `renderShopPage()` upgraded with gender filter, price range, and category select
- Story page admin tab now shows live image previews and upload size hints
- Hero admin tab now includes image upload + URL/seed input + dimension guidance

### Fixed
- Coupon date validation — coupons outside their date range now rejected
- Coupon category/collection scoping correctly filters cart items

---

## [1.0.0] — 2025-01-20

### Added
- Initial release of Senerova Fashion House SPA
- Home page with hero, collections preview, new arrivals, offers, marquee bar
- Shop page with search, category/collection filter, sort
- Product detail page with image gallery, size/colour selector, reviews
- Collections page with alternating image/text layout
- Story page (static content)
- Contact page with form and info cards
- Cart with quantity controls and free-shipping indicator
- Checkout with shipping form, card input formatting, coupon field
- Order confirmation page
- Login page: email/password, Google OAuth (UI), Mobile OTP (UI)
- Signup page with basic validation
- My Account dashboard: orders, reviews, currency, profile edit
- Admin dashboard: Overview, Orders, Products, Users, Hero, Offers, Coupons, Story, Settings
- Full CRUD for products, orders, users, coupons, offers
- Multi-currency support: USD, EUR, GBP, BDT, JPY
- Product reviews with star rating distribution
- Dark/light animation with `IntersectionObserver`
- Toast notification system
- Modal system for edit forms
- Responsive design across mobile, tablet, desktop
- `localStorage` persistence for all data
- Hash-based client-side routing

---

## Roadmap

Planned improvements for future versions:

- [ ] Real backend integration (Node.js / Supabase / Firebase)
- [ ] Real payment processing (Stripe)
- [ ] Real Google OAuth and SMS OTP
- [ ] Wishlist / favourites
- [ ] Product image zoom on hover
- [ ] Size guide modal
- [ ] Email newsletter signup
- [ ] Dark mode toggle
- [ ] Order tracking page
- [ ] Admin analytics charts (revenue over time, top products)
- [ ] Export orders to CSV from admin

