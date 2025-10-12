# fitness-gym-ui-prototype

A framework-free, single-file **JavaScript UI prototype** for a fitness gym website.  
It’s a small hash-routed SPA with responsive styles, accessible navigation, and localStorage-backed mock data — perfect for coursework demos and GitHub Pages.

> Live easily with GitHub Pages: push `index.html` + `fitness_ui_prototype.js` to the repo **root** and enable Pages (Settings → Pages). ✨

---

## ✨ Features

- **Vanilla JS SPA** with hash routing (`#/classes`, `#/memberships`, etc.).
- **Pages**: Home, Classes (filter/search + “Book”), Trainers, Memberships (choose plan), Checkout (mock), Dashboard (bookings + membership), Sign-in (mock).
- **State**: `localStorage` persists user, bookings, membership, and cart.
- **Responsive UI**: mobile-first layout, media queries, and light/dark via `prefers-colour-scheme`.
- **Accessibility**: skip link, visible focus outlines, live status messages, and `aria-current = "page"` on the active nav item.

---

## 🗂 Project structure

├── index.html # Minimal launcher page.

├── fitness_ui_prototype.js # All UI/CSS/logic in one file (no deps).

└── README.md # This file.
