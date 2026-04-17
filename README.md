# Senerova Fashion House

A fully client-side fashion e-commerce storefront with integrated admin dashboard, built as a single-file SPA using Tailwind CSS, Lucide Icons, and vanilla JavaScript.

---

## ✨ Features

### Storefront
- **Home** — Hero section (fully editable via Admin), collections preview, new arrivals, and promotional offers
- **Shop** — Product grid with live search, category/collection/gender filter, price range filter, and sort
- **Collections** — Full collection landing pages with product counts
- **Product Detail** — Image gallery, size & colour selector, add-to-bag, product reviews with star rating
- **Cart** — Quantity controls, free-shipping threshold indicator, per-item removal
- **Checkout** — Shipping form, card input with auto-formatting, coupon code application
- **Story** — Fully CMS-editable brand story page with stats, quote banner, and value cards
- **Contact** — CMS-editable address, phone, email, and social links with contact form

### Auth
- Email/password sign-up with validation (format, strength: 8+ chars, uppercase, number)
- Login with registered accounts + demo fallback
- Google OAuth simulation (UI flow)
- Mobile OTP simulation with countdown and resend
- Account dashboard: order history, reviews, currency selector, profile edit, sign-out

### Admin Dashboard *(password-protected)*
| Tab | Capabilities |
|---|---|
| Overview | Revenue, orders, customers, products — top-5 recent orders |
| Orders | Full CRUD — edit status, address, customer; delete |
| Products | Full CRUD — name, price, category, collection, sizes, colours, images, badge, sold-out |
| Users | Full CRUD — name, email, phone, address, order count, spend |
| Hero | Editable banner content + image + full colour controls |
| Offers | Promotional banner cards with image, link, active toggle |
| Coupons | Percentage / fixed coupons with category/collection scoping, usage limits, date ranges |
| Story | All story page content and images |
| Contact | Showroom address, hours, emails, phone, social links |
| Settings | Currency, admin password change, danger-zone data reset |

### Currency
Supports USD, EUR, GBP, BDT, JPY — stored in `localStorage`, applied everywhere prices appear.

---

## 🚀 Quick Start

No build step required. Open `index.html` directly in any modern browser.

```bash
git clone https://github.com/YOUR_USERNAME/senerova.git
cd senerova
open index.html       # macOS
# or
start index.html      # Windows
# or
xdg-open index.html   # Linux
```

For live-reload development:
```bash
npx serve .
# or
python3 -m http.server 3000
```

---

## 🔐 Admin Access

Default admin password: **`Admin@2025`**

To access the admin dashboard:
1. Navigate to the Login page
2. The **Admin Dashboard** link is hidden by default — it appears after you enter any valid email in the login form (prototype behaviour)
3. Click **Admin Dashboard** → enter the admin password
4. Sessions last **2 hours** and are stored in `sessionStorage` (cleared when the tab closes)

**Change your admin password immediately** after first use via **Admin → Settings → Change Admin Password**.

> ⚠️ This is a **client-side demo**. The admin password is hashed with SHA-256 via the Web Crypto API and stored in `localStorage`. For production, replace with a real server-side authentication system. See [SECURITY.md](SECURITY.md) for full details.

---

## 🏗️ Project Structure

```
senerova/
├── index.html        ← Entire app (HTML + CSS + JS)
├── README.md
├── SECURITY.md
└── .gitignore
```

All data (products, orders, hero content, etc.) is persisted to `localStorage`. No backend or database is required for the demo.

---

## 🛠️ Customisation

### Products
Edit `defaultProducts` in the main `<script>` block inside `index.html`. Each product has:
```js
{
  id, name, price, category, collection, material,
  desc, sizes, colors, colorNames, badge, soldOut, img
}
```

### Colours & Fonts
Tailwind config is inline in `<head>`. Update the `blush`, `rose-gold`, `brand-text` tokens to rebrand.

### Real Backend
Replace `handleLogin`, `handleSignup`, and the `AdminAuth` module with real API calls. The rest of the app is backend-agnostic.

---

## 🌐 Deployment

Works on any static host:

| Host | Command / Method |
|---|---|
| **GitHub Pages** | Push to `main` → Settings → Pages → Deploy from branch |
| **Netlify** | Drag `index.html` to netlify.com/drop |
| **Vercel** | `vercel` CLI or import repo |
| **Cloudflare Pages** | Connect repo → build command: *(none)* |

---

## 🧰 Tech Stack

- [Tailwind CSS](https://tailwindcss.com/) v3 (CDN)
- [Lucide Icons](https://lucide.dev/) (CDN)
- [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) + [Inter](https://fonts.google.com/specimen/Inter) (Google Fonts)
- [Picsum Photos](https://picsum.photos/) for placeholder images
- Vanilla JS ES2020+ (no framework)
- Web Crypto API (`SubtleCrypto.digest`) for password hashing

---

## 📝 License

MIT — free to use, modify, and redistribute.
