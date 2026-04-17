# Security Policy

## Overview

Senerova is a **client-side demo / prototype**. It is designed to showcase a fashion storefront UI and admin panel without a backend. The security model is appropriate for demo use, but **must be replaced** before handling real user data or payments.

---

## What Is Protected

| Mechanism | Implementation |
|---|---|
| Admin password | SHA-256 hash via Web Crypto `SubtleCrypto.digest` + app-specific salt |
| Admin session | `sessionStorage` with 2-hour expiry (cleared on tab close) |
| Brute-force protection | 5 failed attempts → 30-second lockout (in-memory per session) |
| Content injection | All admin-editable content rendered through `esc()` HTML-entity encoder |
| Content Security Policy | `<meta http-equiv="Content-Security-Policy">` restricts script sources |
| Input validation | Email regex, password strength (8+ chars, uppercase, number) on sign-up |

---

## Known Limitations (Demo Only)

### 1. No Real Authentication
- User login accepts any email (demo fallback). Registered users are stored by name only — **no password is stored**.
- Google and Mobile OTP sign-in are simulated UI flows; no real OAuth or SMS gateway is used.
- **For production:** Use a real auth provider (Firebase Auth, Auth0, Supabase, custom JWT).

### 2. Admin Password in localStorage
- The admin password hash lives in `localStorage`. A user with physical access to the browser can clear it (resetting to the default).
- **For production:** Move admin authentication entirely server-side.

### 3. All Data in localStorage
- Products, orders, users, and settings are stored in `localStorage`. This data is accessible to any JavaScript on the page.
- **For production:** Use a real database with server-side access control.

### 4. No HTTPS Enforcement
- Static files served without HTTPS will expose session data. Always deploy behind HTTPS.
- All major static hosts (Netlify, Vercel, GitHub Pages, Cloudflare) provide HTTPS automatically.

### 5. No Payment Processing
- The checkout form accepts card numbers but does **not** connect to any payment gateway.
- **For production:** Integrate Stripe, Paddle, or another PCI-compliant provider. Never handle raw card numbers yourself.

### 6. XSS Surface
- Dynamic content from admin-editable fields is escaped via `esc()` before insertion into the DOM.
- `innerHTML` is used for performance (SPA rendering). Any future feature adding user-generated content (e.g. reviews from untrusted users) should use `textContent` or a proper sanitiser like DOMPurify.

---

## Reporting Issues

If you find a security issue in this codebase, please open a GitHub Issue with the label `security`. This is a demo project; critical vulnerabilities will be addressed on a best-effort basis.

---

## Production Checklist

Before going live with real users and money:

- [ ] Replace client-side auth with a real backend (Node.js / Python / etc.)
- [ ] Move all data storage to a real database
- [ ] Integrate a PCI-compliant payment provider (Stripe recommended)
- [ ] Enable HTTPS on your domain
- [ ] Add real email OTP or magic-link auth
- [ ] Add server-side rate limiting and CSRF protection
- [ ] Audit all `innerHTML` assignments and wrap with DOMPurify
- [ ] Set a proper server-side CSP header instead of the meta tag
- [ ] Remove the Picsum Photos placeholder images and use your own CDN
