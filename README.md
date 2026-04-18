<div align="center">

<h1>Senerova Fashion House</h1>

<p>A fully client-side fashion e-commerce storefront with integrated admin dashboard</p>

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-B76E79?style=flat)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/Demo-Live-4CAF50?style=flat&logo=github)](https://mahamudtamim.github.io/senerova)

<br/>

**[🌐 Live Demo](https://mahamudtamim.github.io/senerova)** · **[📁 Browse Code](https://github.com/Mahamudtamim/senerova)** · **[🐛 Report Bug](https://github.com/Mahamudtamim/senerova/issues)** · **[✨ Request Feature](https://github.com/Mahamudtamim/senerova/issues)**

</div>

---

## 📸 Screenshots

| Storefront | Admin Dashboard |
|:---:|:---:|
| ![Home Page](https://picsum.photos/seed/senerova-home-screen/600/400.jpg) | ![Admin Dashboard](https://picsum.photos/seed/senerova-admin-screen/600/400.jpg) |
| *Replace with real screenshots* | *Replace with real screenshots* |

> 💡 **To add real screenshots:** take a screenshot of your live site, save them as `screenshots/home.png` and `screenshots/admin.png`, then update the image paths above.

---

## ✨ Features

### 🛍️ Storefront
- **Home** — Hero banner (fully editable via Admin), collections preview, new arrivals, promotional offers
- **Shop** — Product grid with live search, category/collection/gender filter, price range filter, and sort
- **Collections** — Collection landing pages with product counts
- **Product Detail** — Image gallery, size & colour selector, add-to-bag, star reviews
- **Cart** — Quantity controls, free-shipping threshold indicator, per-item removal
- **Checkout** — Shipping form, auto-formatted card input, coupon code system
- **Story** — CMS-editable brand story page with stats, quote banner, value cards
- **Contact** — CMS-editable address, email, phone, social links with contact form

### 🔑 Auth
- Email/password sign-up with full validation (format + strength requirements)
- Google OAuth flow (UI simulation)
- Mobile OTP flow with countdown and resend
- Account dashboard: order history, reviews, currency selector, profile editing

### ⚙️ Admin Dashboard *(password-protected)*

| Tab | Capabilities |
|---|---|
| Overview | Revenue, orders, customers, products at a glance |
| Orders | Full CRUD — edit status, customer, address; delete |
| Products | Full CRUD — name, price, category, collection, sizes, colours, images, badge, sold-out |
| Categories | Add / delete product categories dynamically |
| Users | Full CRUD — name, email, phone, address, order count, spend |
| Hero | Edit banner content, image, text colours, overlay, button colours |
| Offers | Promotional banner cards with image, link, active toggle |
| Coupons | Percentage / fixed coupons with category scoping, usage limits, date ranges |
| Story | All story page content and images |
| Contact | Showroom address, hours, emails, phone, social links |
| Settings | Currency, admin password change, data reset |

### 💱 Multi-Currency
Supports **USD, EUR, GBP, BDT, JPY** — stored in `localStorage`, applied everywhere prices appear.

---

## 🚀 Quick Start

No build step required. Just open `index.html` in any modern browser.

```bash
# Clone the repository
git clone https://github.com/Mahamudtamim/senerova.git
cd senerova

# Open in browser
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux
```

### Development with live reload
```bash
# Using Node.js
npx serve .

# Using Python
python3 -m http.server 3000
```

Then open [http://localhost:3000](http://localhost:3000)

---

## 🔐 Admin Access

> See [SECURITY.md](SECURITY.md) for full security documentation.

To access the admin dashboard, navigate to the Login page and use the admin credentials. The admin panel is password-protected with SHA-256 hashing and session management.

---

## 🏗️ Project Structure

```
senerova/
│
├── index.html                  ← Main HTML entry point
│
├── css/
│   └── styles.css              ← Extracted custom CSS & animations
│
├── js/
│   ├── tailwind-config.js      ← Tailwind theme configuration
│   ├── app-core.js             ← Core storefront & admin logic
│   ├── admin-categories.js     ← Category, coupon & shop enhancements
│   ├── image-story-contact.js  ← Image upload, story & contact handlers
│   ├── announcement-bar.js     ← Announcement bar controls
│   └── hero-colors.js          ← Hero section colour controls
│
├── screenshots/                ← (Add your own screenshots here)
│
├── README.md
├── CHANGELOG.md
├── LICENSE
├── SECURITY.md
└── PROJECT_STRUCTURE.md
```

---

## 🛠️ Customisation

### Changing Products
Edit `defaultProducts` in `js/app-core.js`. Each product follows this shape:

```js
{
  id: 1,
  name: 'Product Name',
  price: 99,               // USD
  category: 'tops',        // tops | bottoms | layers
  collection: 'essentials',
  material: 'Cotton',
  desc: 'Description...',
  sizes: ['XS', 'S', 'M', 'L', 'XL'],
  colors: ['#111111', '#ffffff'],
  colorNames: ['Black', 'White'],
  badge: 'New',            // 'New' | '' | any label
  soldOut: false,
  img: 'picsum-seed-string' // or full image URL / base64
}
```

### Changing Brand Colours & Fonts
Open `js/tailwind-config.js` and update the colour tokens:

```js
colors: {
  blush: '#E8B4B8',        // accent tint
  'rose-gold': '#B76E79',  // primary brand colour
  'rose-dark': '#9A5A63',  // hover state
  // ...
}
```

### Replacing Placeholder Images
Images come from [Picsum Photos](https://picsum.photos) by default. To use your own:
- Upload images to an image host (Cloudinary, ImgBB, etc.)
- Paste the URL in the Admin → Products / Hero / Story tabs
- Or use the file upload feature in the Admin panel

### Connecting a Real Backend
Replace these functions in `js/app-core.js` with real API calls:
- `handleLogin()` — POST to your auth endpoint
- `handleSignup()` — POST to your registration endpoint
- `placeOrder()` — POST to your orders endpoint

---

## 🌐 Deployment

This is a pure static site — deploy anywhere for free:

| Platform | Steps |
|---|---|
| **GitHub Pages** | Settings → Pages → Deploy from `main` branch → `/ (root)` |
| **Netlify** | Drag & drop the folder at [netlify.com/drop](https://app.netlify.com/drop) |
| **Vercel** | Import repo at vercel.com or run `npx vercel` |
| **Cloudflare Pages** | Connect repo → framework: None → build command: *(leave empty)* |

---

## 🧰 Tech Stack

| Tool | Purpose |
|---|---|
| [Tailwind CSS v3](https://tailwindcss.com/) | Utility-first styling (CDN) |
| [Lucide Icons](https://lucide.dev/) | Icon library (CDN) |
| [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) | Heading font |
| [Inter](https://fonts.google.com/specimen/Inter) | Body font |
| [Picsum Photos](https://picsum.photos/) | Placeholder images |
| Vanilla JS ES2020+ | No framework — zero dependencies |
| Web Crypto API | SHA-256 password hashing |

---

## 📋 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for full text.

---

## 📬 Contact

**Mahamud Tamim** — [@Mahamudtamim](https://github.com/Mahamudtamim)

Project Link: [https://github.com/Mahamudtamim/senerova](https://github.com/Mahamudtamim/senerova)

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/Mahamudtamim">Mahamud Tamim</a></sub>
</div>
