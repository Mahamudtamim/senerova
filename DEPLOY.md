# Deployment Guide

Senerova is a pure static site. No server, no build step, no database required.

---

## ✅ GitHub Pages (Recommended — Free & Fast)

### Step 1 — Push your code

Make sure `index.html` is in the root of your `main` branch.

```bash
git add .
git commit -m "chore: ready for deployment"
git push origin main
```

### Step 2 — Enable GitHub Pages

1. Go to your repo on GitHub
2. Click **Settings** (top tab)
3. In the left sidebar, click **Pages**
4. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**

### Step 3 — Wait ~60 seconds

GitHub will build and deploy your site. You'll see the URL:
```
https://mahamudtamim.github.io/senerova
```

### Step 4 — Update your README

Replace the placeholder demo URL in `README.md`:
```markdown
[![Demo](https://img.shields.io/badge/Demo-Live-4CAF50?style=flat)](https://mahamudtamim.github.io/senerova)
```

---

## Netlify (Drag & Drop — 30 seconds)

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag your entire project folder into the browser
3. Done — you get an instant HTTPS URL like `https://random-name.netlify.app`

To connect your GitHub repo for auto-deploy on every push:
1. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**
2. Choose GitHub → select `senerova`
3. Build command: *(leave empty)*
4. Publish directory: `.` (dot — the root)
5. Click **Deploy**

---

## Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from repo root
cd senerova
vercel

# Follow prompts — framework: Other, root: ./
```

Or import directly at [vercel.com/new](https://vercel.com/new).

---

## Cloudflare Pages

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Pages** → **Create a project**
2. Connect GitHub → select `senerova`
3. Build settings:
   - Framework preset: **None**
   - Build command: *(leave empty)*
   - Build output directory: `.`
4. Click **Save and Deploy**

---

## Custom Domain

Once deployed on any platform, you can add a custom domain (e.g. `senerova.com`):

- **GitHub Pages:** Settings → Pages → Custom domain → enter your domain → add DNS records at your registrar
- **Netlify/Vercel/Cloudflare:** Each has a "Custom Domains" section in their dashboard

---

## Troubleshooting

**Site shows 404 on refresh**
→ Normal for hash-based SPAs. This app uses `#` routing so refreshing works natively.

**Fonts not loading**
→ Make sure your deployment has internet access (all fonts come from Google Fonts CDN).

**Admin session keeps expiring**
→ Sessions use `sessionStorage` which clears when the tab closes. This is by design.

