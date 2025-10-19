# fitness-gym-ui-prototype

This is a framework-free, single-file **JavaScript UI prototype** for a fitness gym website. It is a small, hash-routed Single Page Application (SPA) with responsive styles, accessible navigation, and mock data supported by localStorage. This fitness-focused gym prototype UI links to my other repository, called fitness-gym-systems-design-assets. It meets all requirements and documentation, except for the UI prototype image, which has been improved for better quality.

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

├── index.html # Launcher page.

├── fitness_ui_prototype.js # All user interface, CSS, and logic should be contained in a single file with no dependencies.

└── README.md
