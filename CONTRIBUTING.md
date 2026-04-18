# Contributing to Senerova

Thanks for your interest in contributing! Here's everything you need to know.

---

## 🐛 Reporting Bugs

1. Check the [existing issues](https://github.com/Mahamudtamim/senerova/issues) to make sure it hasn't been reported
2. Open a new issue with the **Bug** label
3. Include:
   - Browser and OS
   - Steps to reproduce
   - What you expected vs. what happened
   - Screenshot if relevant

---

## ✨ Suggesting Features

1. Open an issue with the **Enhancement** label
2. Describe the feature and why it would be useful
3. If you have a design idea, sketch or screenshot helps

---

## 🔧 Making Changes

### Setup

```bash
git clone https://github.com/Mahamudtamim/senerova.git
cd senerova
# No install needed — just open index.html
```

### Branch naming

| Type | Pattern | Example |
|---|---|---|
| New feature | `feat/description` | `feat/wishlist` |
| Bug fix | `fix/description` | `fix/otp-timer-leak` |
| Docs | `docs/description` | `docs/update-readme` |
| Refactor | `refactor/description` | `refactor/admin-tabs` |

### Commit messages

Follow this format:
```
type: short summary in present tense

Optional longer description.
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
```
feat: add wishlist toggle on product cards
fix: prevent OTP timer running after modal close
docs: add screenshots to README
```

### Pull Request checklist

- [ ] Branch is up to date with `main`
- [ ] Code is tested in Chrome, Firefox, and mobile
- [ ] No `console.log` left in production code
- [ ] README updated if a new feature was added
- [ ] CHANGELOG updated under `[Unreleased]`

---

## 📁 Code Style

This project uses vanilla JS with no linter configured. Please follow the existing style:

- Use `const`/`let`, never `var`
- Arrow functions for callbacks
- Template literals for HTML strings
- Always escape user-generated content with `esc()` before inserting into innerHTML
- Keep functions focused — one job per function

---

## ❓ Questions

Open a [Discussion](https://github.com/Mahamudtamim/senerova/discussions) for questions that aren't bugs or feature requests.

