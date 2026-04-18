# Senerova — Project Structure

This document describes the actual file and folder layout of the repository.

---

## Root

```
senerova/
│
├── index.html              ← Main HTML entry point (SPA shell + page templates)
├── README.md               ← Project overview, quick start, deployment guide
├── CHANGELOG.md            ← Version history and release notes
├── LICENSE                 ← MIT License
├── SECURITY.md             ← Security model, known limitations, production checklist
├── PROJECT_STRUCTURE.md    ← This file
└── .gitignore              ← Git ignore rules
```

---

## `css/`

Extracted and custom CSS. All Tailwind utilities are pulled from CDN at runtime — this folder holds custom styles only.

```
css/
└── styles.css              ← Custom animations, scrollbar, .anim, .toast,
                               .nav-link underline, .pcard hover, hero gradients,
                               modal backdrop, star ratings, sidebar active states
```

---

## `js/`

JavaScript is split across focused modules. They are loaded in order via `<script>` tags in `index.html`.

```
js/
├── tailwind-config.js      ← Tailwind theme extension: custom colors (blush,
│                              rose-gold, cream, brand-text, etc.) and fonts
│
├── app-core.js             ← Main application logic:
│                              - Data: products, hero, orders, users, reviews,
│                                coupons, offers, story (defaults + localStorage)
│                              - Navigation (navigate, hash routing)
│                              - Page renderers: home, shop, product detail,
│                                collections, cart, checkout, account, story
│                              - Auth: login, signup, Google OAuth (sim),
│                                mobile OTP (sim), rate limiting
│                              - Admin: overview, orders, products, users,
│                                hero, offers, coupons, story, settings tabs
│                              - Cart operations, coupon validation, order placement
│                              - Currency formatting (USD/EUR/GBP/BDT/JPY)
│                              - IntersectionObserver animations
│                              - Toast notifications, modal system
│
├── admin-categories.js     ← IIFE that extends app-core:
│                              - Dynamic product categories CRUD
│                              - Extended shop filters (gender, price range,
│                                category select)
│                              - Overrides renderShopPage with advanced filters
│                              - Contact data store (saveContactAdmin)
│                              - Overrides buildAdminNav and adminTab with
│                                full 11-tab navigation
│                              - Overrides renderAdmin to add Categories +
│                                Contact tabs
│
├── image-story-contact.js  ← IIFE that extends app-core:
│                              - Image upload: file-to-dataURL, single/multi
│                                upload handlers, product gallery preview
│                              - renderContactPage (dynamic, reads contactData)
│                              - Extended applyHero (uses imgSrc resolver)
│                              - Extended renderStoryPage (uses esc() + imgSrc)
│                              - Extended renderAdmin hero tab with colour
│                                controls (image upload + URL/seed input)
│
├── announcement-bar.js     ← Announcement bar:
│                              - Renders a dismissible top banner
│                              - Admin tab for editing bar text, colour, link
│                              - Persists to localStorage (sen-announcement)
│
└── hero-colors.js          ← Hero colour system:
                               - heroColors object with badge, title, subtitle,
                                 button bg/text/border, overlay colour
                               - applyHeroColorStyles() applies to DOM
                               - Extends renderAdmin hero tab with full colour
                                 picker controls
                               - saveHeroColors() persists to localStorage
                               - saveHeroAppearance() saves all colour fields
```

---

## `screenshots/` *(add manually)*

Not committed. Create this folder and add your own screenshots for the README:

```
screenshots/
├── home.png                ← Homepage / hero section
├── shop.png                ← Shop grid with filters
├── product.png             ← Product detail page
├── cart.png                ← Cart and checkout
├── admin-overview.png      ← Admin dashboard overview
└── admin-products.png      ← Admin products tab
```

---

## Data Flow

```
localStorage keys:
  sen-products      ← product catalogue
  sen-hero          ← hero section content
  sen-hero-colors   ← hero colour overrides
  sen-offers        ← offer banners
  sen-coupons       ← discount codes
  sen-story         ← story page content
  sen-orders        ← order history
  sen-users         ← customer list
  sen-reviews       ← product reviews (object keyed by product id)
  sen-cart          ← active shopping cart
  sen-user          ← current logged-in user
  sen-currency      ← selected currency code
  sen-categories    ← product categories
  sen-contact       ← contact page info
  sen-admin-hash    ← SHA-256 hashed admin password
  sen-registered-users ← registered user accounts (name + email only)
  sen-announcement  ← announcement bar data

sessionStorage keys:
  sen-admin-session ← admin auth token + expiry (2-hour TTL)
```

---

## Load Order in `index.html`

Scripts are loaded in this order to ensure correct dependency resolution:

1. `css/styles.css` (via `<link>`)
2. Tailwind CDN (via `<script src>`)
3. `js/tailwind-config.js` (inline `<script>`)
4. Google Fonts (via `<link>`)
5. Lucide Icons CDN (via `<script src>`)
6. `js/app-core.js` (defines all global functions and data)
7. `js/admin-categories.js` (IIFE — extends app-core via `window.*` overrides)
8. `js/image-story-contact.js` (IIFE — extends app-core via `window.*` overrides)
9. `js/announcement-bar.js` (IIFE — standalone feature)
10. `js/hero-colors.js` (IIFE — extends hero admin tab)
