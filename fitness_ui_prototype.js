
/**
 * Fitness Website – UI Prototype (Vanilla JS, single file)
 * -------------------------------------------------------------------------
 * How to run:
 * 1) Open index.html in your browser (it loads this file).
 * 2) Or deploy the two files to GitHub (see README.md for steps).
 *
 * What this prototype shows:
 * - A small SPA router using the URL fragment (#/route).
 * - Pages: Home, Classes, Trainers, Memberships, Checkout (mock), Dashboard.
 * - Accessible navigation with aria-current and keyboard focus styles.
 * - Responsive layout (mobile-first), prefers-color-scheme awareness.
 * - LocalStorage-backed mock state (user, bookings, membership).
 *
 * Note: This is intentionally framework-free and simple to explain in class.
 * You can refactor each "component" into separate files later if you like.
 */

(function () {
  'use strict';

  /* ----------------------------------------------------------------------
   * Global Style – injected once so the prototype is a single-file JS asset.
   * ---------------------------------------------------------------------- */
  const styles = `
    :root {
      --bg: #0b0c10;
      --panel: #11131a;
      --text: #e6e6e6;
      --muted: #a0a3ad;
      --brand: #7dd3fc;         /* cyan-300 */
      --brand-2: #22d3ee;       /* cyan-400 */
      --ok: #34d399;            /* green-400 */
      --warn: #fbbf24;          /* amber-400 */
      --error: #f87171;         /* red-400 */
      --ring: #93c5fd;          /* blue-300 */
      --shadow: 0 10px 20px rgba(0,0,0,.25);
      --radius: 14px;
      --radius-sm: 10px;
    }

    @media (prefers-color-scheme: light) {
      :root {
        --bg: #f6f7fb;
        --panel: #ffffff;
        --text: #111827;
        --muted: #6b7280;
        --brand: #0ea5e9;
        --brand-2: #0284c7;
        --ring: #3b82f6;
      }
    }

    * { box-sizing: border-box; }
    html, body { height: 100%; }
    body {
      margin: 0;
      font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji";
      color: var(--text);
      background: radial-gradient(1200px 800px at 10% -10%, rgba(125,211,252,0.08), transparent 60%),
                  radial-gradient(800px 800px at 120% 120%, rgba(34,211,238,0.10), transparent 50%),
                  var(--bg);
      line-height: 1.5;
    }

    a { color: inherit; text-decoration: none; }
    img { max-width: 100%; display: block; }
    button {
      cursor: pointer;
      background: linear-gradient(180deg, var(--brand), var(--brand-2));
      color: #0b0c10;
      border: 0;
      padding: 0.7rem 1rem;
      border-radius: 12px;
      font-weight: 700;
      transition: transform .12s ease, box-shadow .12s ease, filter .12s ease;
      box-shadow: var(--shadow);
    }
    button:hover { transform: translateY(-1px); filter: brightness(1.02); }
    button:active { transform: translateY(0); filter: brightness(.98); }
    button[aria-disabled="true"] { filter: grayscale(1) brightness(.7); cursor: not-allowed; }

    .btn-ghost {
      background: transparent;
      border: 1px solid rgba(255,255,255,.12);
      color: var(--text);
    }

    .container {
      max-width: 1100px;
      margin-inline: auto;
      padding: 1rem;
    }

    /* Skip to content for keyboard users */
    .skip-link {
      position: absolute;
      left: -9999px;
      top: 0;
    }
    .skip-link:focus {
      left: 1rem;
      top: 1rem;
      z-index: 1000;
      background: var(--panel);
      padding: .5rem .75rem;
      border-radius: 8px;
      outline: 2px solid var(--ring);
    }

    header.site {
      position: sticky;
      top: 0;
      z-index: 10;
      backdrop-filter: blur(8px) saturate(120%);
      background: color-mix(in srgb, var(--bg), transparent 70%);
      border-bottom: 1px solid rgba(255,255,255,.08);
    }
    .nav {
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: center;
      gap: 1rem;
    }
    .brand {
      display: flex; align-items: center; gap: .75rem;
      font-weight: 900; letter-spacing: .5px;
    }
    .brand .dot {
      inline-size: 12px; block-size: 12px; border-radius: 50%;
      background: linear-gradient(180deg, var(--brand), var(--brand-2));
      box-shadow: 0 0 40px var(--brand-2);
    }
    nav[aria-label="Primary"] a {
      padding: .6rem .8rem;
      border-radius: 10px;
      color: var(--muted);
      font-weight: 600;
    }
    nav[aria-label="Primary"] a[aria-current="page"] {
      color: var(--text);
      background: color-mix(in srgb, var(--brand-2), transparent 88%);
      outline: 2px solid color-mix(in srgb, var(--brand-2), transparent 70%);
    }

    .toolbar { display: flex; align-items: center; gap: .5rem; }
    .navlinks { display: none; }
    .menu-btn { display: inline-flex; }

    @media (min-width: 760px) {
      .nav {
        grid-template-columns: auto 1fr auto;
      }
      .navlinks { display: flex; gap: .25rem; justify-content: center; }
      .menu-btn { display: none; }
    }

    main {
      min-height: calc(100dvh - 160px);
    }

    .card-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    @media (min-width: 600px) {
      .card-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (min-width: 980px) {
      .card-grid { grid-template-columns: repeat(3, 1fr); }
    }
    .card {
      background: color-mix(in srgb, var(--panel), transparent 0%);
      padding: 1rem;
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      border: 1px solid rgba(255,255,255,.06);
    }
    .card h3 { margin: .25rem 0 .5rem; }
    .muted { color: var(--muted); }
    .pill {
      display: inline-block; padding: .2rem .5rem; font-size: .8rem;
      border-radius: 999px; background: color-mix(in srgb, var(--brand), transparent 80%);
      color: var(--text);
    }

    .hero {
      display: grid; gap: 1rem; align-items: center;
    }
    @media (min-width: 900px) {
      .hero { grid-template-columns: 1.2fr 1fr; }
    }
    .hero .panel {
      background: color-mix(in srgb, var(--panel), transparent 0%);
      border-radius: var(--radius);
      padding: 1.4rem;
      box-shadow: var(--shadow);
      border: 1px solid rgba(255,255,255,.06);
    }

    .input, select {
      background: color-mix(in srgb, var(--panel), transparent 0%);
      color: var(--text);
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,.12);
      padding: .6rem .75rem;
      inline-size: 100%;
    }
    .row { display: grid; gap: .75rem; }
    @media (min-width: 640px) { .row { grid-template-columns: 1fr 1fr; } }

    .status { margin-top: .75rem; min-height: 1.5rem; }
    .status[aria-live="polite"] { color: var(--muted); }

    footer {
      color: var(--muted);
      padding: 2rem 1rem;
      border-top: 1px solid rgba(255,255,255,.08);
    }

    /* Focus and reduced motion */
    :focus-visible { outline: 3px solid var(--ring); outline-offset: 2px; }
    @media (prefers-reduced-motion: reduce) {
      * { transition: none !important; animation: none !important; }
    }
  `;

  function injectStyles() {
    if (document.getElementById('fitness-proto-styles')) return;
    const s = document.createElement('style');
    s.id = 'fitness-proto-styles';
    s.textContent = styles;
    document.head.appendChild(s);
  }

  /* ----------------------------------------------------------------------
   * Mock Data
   * ---------------------------------------------------------------------- */
  const data = {
    membershipPlans: [
      { id: 'basic',   name: 'Basic',   price: 19.99, perks: ['Gym Access', 'Locker'], color: 'basic' },
      { id: 'plus',    name: 'Plus',    price: 34.99, perks: ['Gym + Classes', 'Sauna'], color: 'plus' },
      { id: 'premium', name: 'Premium', price: 54.99, perks: ['All Access', 'PT Discounts', 'Priority Booking'], color: 'premium' },
    ],
    trainers: [
      { id: 't1', name: 'Ava Walker',   focus: 'Strength',   bio: '5+ yrs coaching powerlifting and functional training.' },
      { id: 't2', name: 'Diego Patel',  focus: 'Cardio',     bio: 'HIIT specialist with running programs for all levels.' },
      { id: 't3', name: 'Maya Chen',    focus: 'Mobility',   bio: 'Mobility & yoga sequencing for active recovery.' },
    ],
    classes: [
      { id: 'c1', title: 'HIIT Express',    level: 'All',     trainerId: 't2', day: 'Mon', time: '18:00', spots: 14, category: 'Cardio' },
      { id: 'c2', title: 'Strength 101',    level: 'Begin',   trainerId: 't1', day: 'Tue', time: '17:00', spots: 12, category: 'Strength' },
      { id: 'c3', title: 'Mobility Flow',   level: 'All',     trainerId: 't3', day: 'Wed', time: '19:00', spots: 10, category: 'Mobility' },
      { id: 'c4', title: 'Spin Power',      level: 'All',     trainerId: 't2', day: 'Thu', time: '18:30', spots: 16, category: 'Cardio' },
      { id: 'c5', title: 'Barbell Basics',  level: 'Begin',   trainerId: 't1', day: 'Fri', time: '17:30', spots: 10, category: 'Strength' },
    ]
  };

  /* ----------------------------------------------------------------------
   * App State (persisted to localStorage)
   * ---------------------------------------------------------------------- */
  const storeKey = 'fitness-ui-prototype';
  function loadStore() {
    try {
      const raw = localStorage.getItem(storeKey);
      if (!raw) return { user: null, bookings: [], membership: null, cart: null };
      const obj = JSON.parse(raw);
      return { user: null, bookings: [], membership: null, cart: null, ...obj };
    } catch { return { user: null, bookings: [], membership: null, cart: null }; }
  }
  function saveStore(next) {
    localStorage.setItem(storeKey, JSON.stringify(next));
  }
  let store = loadStore();

  /* ----------------------------------------------------------------------
   * Tiny Utilities
   * ---------------------------------------------------------------------- */
  const $ = (sel, el = document) => el.querySelector(sel);
  const $all = (sel, el = document) => [...el.querySelectorAll(sel)];
  const money = (n) => `£${n.toFixed(2)}`;
  const byId = (arr, id) => arr.find((x) => x.id === id);
  const trainerName = (id) => byId(data.trainers, id)?.name ?? 'Trainer';

  function flash(msg = '', type = 'ok') {
    const box = document.createElement('div');
    box.setAttribute('role', 'status');
    box.setAttribute('aria-live', 'polite');
    box.style.position = 'fixed';
    box.style.insetInline = '0';
    box.style.top = '1rem';
    box.style.margin = '0 auto';
    box.style.padding = '.6rem .8rem';
    box.style.width = 'fit-content';
    box.style.background = 'var(--panel)';
    box.style.border = '1px solid rgba(255,255,255,.15)';
    box.style.borderLeft = '4px solid ' + (type === 'ok' ? 'var(--ok)' : type === 'warn' ? 'var(--warn)' : 'var(--error)');
    box.style.borderRadius = '10px';
    box.style.boxShadow = 'var(--shadow)';
    box.textContent = msg;
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 2100);
  }

  /* ----------------------------------------------------------------------
   * Router (hash-based)
   * ---------------------------------------------------------------------- */
  const routes = {
    '/': homePage,
    '/classes': classesPage,
    '/trainers': trainersPage,
    '/memberships': membershipsPage,
    '/checkout': checkoutPage,
    '/dashboard': dashboardPage,
    '/signin': signInPage,
  };

  function navigate(path) {
    if (location.hash !== `#${path}`) location.hash = path;
    else render(); // force re-render if same
  }

  function currentPath() {
    const h = location.hash || '#/';
    const path = h.slice(1).split('?')[0];
    return path;
  }

  window.addEventListener('hashchange', render);
  window.addEventListener('DOMContentLoaded', render);

  /* ----------------------------------------------------------------------
   * Layout (Header + Main + Footer)
   * ---------------------------------------------------------------------- */
  function layout(innerHTML) {
    return `
      <a href="#main" class="skip-link">Skip to content</a>
      <header class="site">
        <div class="container nav">
          <div class="brand" aria-label="Fitness brand">
            <span class="dot" aria-hidden="true"></span>
            <a href="#/" class="brand-name">Fitness First Gym</a>
          </div>

          <nav class="navlinks" aria-label="Primary">
            ${navLink('/', 'Home')}
            ${navLink('/classes', 'Classes')}
            ${navLink('/trainers', 'Trainers')}
            ${navLink('/memberships', 'Memberships')}
            ${navLink('/dashboard', 'Dashboard')}
          </nav>

          <div class="toolbar">
            ${store.user ? `<span class="muted" aria-live="polite">Hello, ${store.user.name}</span>` : ''}
            ${store.user ? `<button class="btn-ghost" data-action="signout" title="Sign out">Sign out</button>`
                         : `<button class="btn-ghost" data-navigate="/signin" title="Sign in">Sign in</button>`}
            <button class="menu-btn btn-ghost" aria-label="Open menu" title="Menu" data-action="toggle-menu">☰</button>
          </div>
        </div>
      </header>

      <main id="main">
        <div class="container" id="view">${innerHTML}</div>
      </main>

      <footer class="container">
        <p>© ${new Date().getFullYear()} Fitness First Gym — UI Prototype.</p>
      </footer>
    `;
  }

  function navLink(path, text) {
    const active = currentPath() === path ? 'aria-current="page"' : '';
    return `<a href="#${path}" ${active}>${text}</a>`;
  }

  function wireGlobalHandlers() {
    // Delegate navigation buttons
    document.body.addEventListener('click', (e) => {
      const go = e.target.closest('[data-navigate]');
      if (go) { e.preventDefault(); navigate(go.getAttribute('data-navigate')); }

      if (e.target.matches('[data-action="signout"]')) {
        e.preventDefault();
        store.user = null; saveStore(store);
        flash('Signed out', 'ok'); navigate('/');
      }
      if (e.target.matches('[data-action="toggle-menu"]')) {
        const nav = document.querySelector('.navlinks');
        if (nav) nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
      }
    });
  }

  /* ----------------------------------------------------------------------
   * Pages
   * ---------------------------------------------------------------------- */
  function homePage() {
    return `
      <section class="hero">
        <div class="panel">
          <h1 style="margin:0 0 .5rem;">Train smarter, feel stronger</h1>
          <p class="muted">Book expert-led classes, track your membership, and manage your training — all in one place.</p>
          <div style="display:flex; gap:.5rem; flex-wrap: wrap; margin-top: .5rem;">
            <button data-navigate="/classes" aria-label="Browse classes">Browse classes</button>
            <button class="btn-ghost" data-navigate="/memberships" aria-label="See membership plans">Memberships</button>
          </div>
          <div class="status" aria-live="polite"></div>
        </div>
        <div class="panel">
          <form id="quick-book" aria-labelledby="qb-title">
            <h2 id="qb-title" style="margin-top:0;">Quick book</h2>
            <div class="row" style="margin:.5rem 0;">
              <label>
                <span class="muted">Category</span>
                <select name="cat">
                  <option value="Any">Any</option>
                  <option>Cardio</option>
                  <option>Strength</option>
                  <option>Mobility</option>
                </select>
              </label>
              <label>
                <span class="muted">Day</span>
                <select name="day">
                  <option value="Any">Any</option>
                  <option>Mon</option><option>Tue</option><option>Wed</option><option>Thu</option><option>Fri</option>
                </select>
              </label>
            </div>
            <button type="submit">Find a class</button>
            <div class="status" aria-live="polite"></div>
          </form>
        </div>
      </section>
      <section style="margin-top:1rem;" aria-label="Highlights">
        <div class="card-grid">
          <article class="card"><h3>Expert Coaches</h3><p class="muted">Certified trainers who tailor sessions for any level.</p></article>
          <article class="card"><h3>Flexible Plans</h3><p class="muted">Start from £19.99/month. Upgrade anytime.</p></article>
          <article class="card"><h3>Modern Equipment</h3><p class="muted">Curated strength, cardio, and mobility zones.</p></article>
        </div>
      </section>
    `;
  }

  function classesPage() {
    const cats = Array.from(new Set(data.classes.map(c => c.category)));
    const options = ['All', ...cats].map(c => `<option${c==='All'?' selected':''}>${c}</option>`).join('');
    const cards = data.classes.map(renderClassCard).join('');
    return `
      <section>
        <h2>Classes</h2>
        <div class="row" style="margin-bottom:.5rem;">
          <label>
            <span class="muted">Filter by category</span>
            <select id="class-filter">${options}</select>
          </label>
          <label>
            <span class="muted">Search</span>
            <input id="class-search" class="input" placeholder="e.g., HIIT, Strength" />
          </label>
        </div>
        <div class="card-grid" id="class-list">${cards}</div>
      </section>
    `;
  }

  function renderClassCard(c) {
    return `
      <article class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <h3 style="margin:0;">${c.title}</h3>
          <span class="pill">${c.category}</span>
        </div>
        <p class="muted">Level: ${c.level} • ${c.day} ${c.time} • Coach ${trainerName(c.trainerId)}</p>
        <div style="display:flex; gap:.5rem; align-items:center;">
          <button data-action="book" data-id="${c.id}">Book</button>
          <button class="btn-ghost" data-action="details" data-id="${c.id}">Details</button>
        </div>
      </article>
    `;
  }

  function trainersPage() {
    const cards = data.trainers.map(t => `
      <article class="card">
        <h3>${t.name}</h3>
        <p class="muted">Focus: ${t.focus}</p>
        <p>${t.bio}</p>
        <button class="btn-ghost" data-action="message" data-id="${t.id}">Message</button>
      </article>
    `).join('');
    return `<section><h2>Trainers</h2><div class="card-grid">${cards}</div></section>`;
  }

  function membershipsPage() {
    const cards = data.membershipPlans.map(p => `
      <article class="card">
        <h3 style="display:flex;justify-content:space-between;align-items:center;">
          <span>${p.name}</span><span>${money(p.price)}/mo</span>
        </h3>
        <ul class="muted" style="margin-top:.25rem;">
          ${p.perks.map(x => `<li>${x}</li>`).join('')}
        </ul>
        <div style="display:flex;gap:.5rem;">
          <button data-action="choose-plan" data-id="${p.id}">Choose</button>
          <button class="btn-ghost" data-action="plan-details" data-id="${p.id}">Details</button>
        </div>
      </article>
    `).join('');
    return `<section><h2>Memberships</h2><div class="card-grid">${cards}</div></section>`;
  }

  function checkoutPage() {
    if (!store.cart) {
      return `<section><p class="muted">Your cart is empty. Pick a membership first.</p><button data-navigate="/memberships">Browse plans</button></section>`;
    }
    const plan = byId(data.membershipPlans, store.cart.planId);
    return `
      <section>
        <h2>Checkout</h2>
        <div class="card">
          <h3>Plan: ${plan.name} — ${money(plan.price)}/mo</h3>
          <form id="checkout-form" class="row" aria-labelledby="checkout-title">
            <label><span class="muted">Name on card</span><input required name="name" class="input"/></label>
            <label><span class="muted">Card number</span><input required name="card" inputmode="numeric" class="input" placeholder="4242 4242 4242 4242"/></label>
            <label><span class="muted">Expiry</span><input required name="exp" class="input" placeholder="MM/YY" /></label>
            <label><span class="muted">CVC</span><input required name="cvc" class="input" placeholder="123" /></label>
            <button type="submit">Pay now</button>
            <div class="status" aria-live="polite"></div>
          </form>
        </div>
      </section>
    `;
  }

  function dashboardPage() {
    const bookings = store.bookings ?? [];
    const bookingList = bookings.length
      ? bookings.map(id => {
          const c = byId(data.classes, id);
          return `<li>${c.title} — ${c.day} ${c.time} with ${trainerName(c.trainerId)}</li>`;
        }).join('')
      : '<li class="muted">No bookings yet.</li>';
    const membership = store.membership
      ? `You have the <strong>${store.membership.name}</strong> plan at <strong>${money(store.membership.price)}/mo</strong>.`
      : 'No active membership.';

    return `
      <section>
        <h2>Your dashboard</h2>
        <div class="card">
          <h3>Membership</h3>
          <p>${membership}</p>
          <div style="display:flex; gap:.5rem; flex-wrap:wrap;">
            <button class="btn-ghost" data-navigate="/memberships">Change plan</button>
            <button class="btn-ghost" data-action="cancel-membership" ${store.membership ? '' : 'aria-disabled="true"'}>Cancel</button>
          </div>
        </div>
        <div class="card" style="margin-top:1rem;">
          <h3>Bookings</h3>
          <ul>${bookingList}</ul>
          <button class="btn-ghost" data-navigate="/classes">Book another class</button>
        </div>
      </section>
    `;
  }

  function signInPage() {
    return `
      <section>
        <h2>Sign in</h2>
        <form id="signin-form" class="row" aria-labelledby="signin-title">
          <label><span class="muted">Email</span><input required name="email" class="input" type="email" placeholder="you@example.com"/></label>
          <label><span class="muted">Password</span><input required name="password" class="input" type="password" placeholder="••••••••"/></label>
          <button type="submit">Sign in</button>
          <div class="status" aria-live="polite"></div>
        </form>
      </section>
    `;
  }

  /* ----------------------------------------------------------------------
   * Rendering and page-level event handling
   * ---------------------------------------------------------------------- */
  function render() {
    injectStyles();
    const path = currentPath();
    const view = (routes[path] ?? notFoundPage)();
    document.body.innerHTML = layout(view);
    wireGlobalHandlers();
    wirePageHandlers(path);
    // Update aria-current on nav links
    $all('nav[aria-label="Primary"] a').forEach(a => {
      if (a.getAttribute('href') === `#${path}`) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  function wirePageHandlers(path) {
    const container = $('#view');
    if (!container) return;

    if (path === '/') {
      $('#quick-book')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const cat = form.cat.value;
        const day = form.day.value;
        const first = data.classes.find(c =>
          (cat === 'Any' || c.category === cat) &&
          (day === 'Any' || c.day === day)
        );
        const status = form.nextElementSibling;
        if (first) {
          status.textContent = `We found ${first.title} on ${first.day} ${first.time} — coach ${trainerName(first.trainerId)}.`;
        } else {
          status.textContent = 'No match found. Try different filters.';
        }
      });
    }

    if (path === '/classes') {
      const list = $('#class-list');
      $('#class-filter')?.addEventListener('change', filterRender);
      $('#class-search')?.addEventListener('input', filterRender);

      function filterRender() {
        const cat = $('#class-filter').value;
        const q = ($('#class-search').value || '').toLowerCase();
        const items = data.classes.filter(c =>
          (cat === 'All' || c.category === cat) &&
          (!q || c.title.toLowerCase().includes(q))
        );
        list.innerHTML = items.map(renderClassCard).join('') || '<p class="muted">No classes.</p>';
      }

      list?.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        if (e.target.matches('[data-action="book"]')) {
          ensureSignedIn(() => {
            if (!store.bookings.includes(id)) {
              store.bookings.push(id);
              saveStore(store);
              flash('Class booked', 'ok');
            } else flash('Already booked', 'warn');
          });
        }
        if (e.target.matches('[data-action="details"]')) {
          const c = byId(data.classes, id);
          alert(`${c.title}\n${c.day} ${c.time}\nCoach: ${trainerName(c.trainerId)}\nLevel: ${c.level}`);
        }
      });
    }

    if (path === '/memberships') {
      container.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        if (e.target.matches('[data-action="choose-plan"]')) {
          store.cart = { planId: id }; saveStore(store); navigate('/checkout');
        }
        if (e.target.matches('[data-action="plan-details"]')) {
          const p = byId(data.membershipPlans, id);
          alert(`${p.name}\n${money(p.price)}/mo\n\nPerks:\n- ${p.perks.join('\n- ')}`);
        }
      });
    }

    if (path === '/checkout') {
      $('#checkout-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        ensureSignedIn(() => {
          const plan = byId(data.membershipPlans, store.cart.planId);
          store.membership = plan;
          store.cart = null;
          saveStore(store);
          flash('Payment successful (mock)', 'ok'); navigate('/dashboard');
        });
      });
    }

    if (path === '/dashboard') {
      container.addEventListener('click', (e) => {
        if (e.target.matches('[data-action="cancel-membership"]') && store.membership) {
          if (confirm('Cancel your membership?')) {
            store.membership = null; saveStore(store);
            flash('Membership cancelled', 'warn'); render();
          }
        }
      });
    }

    if (path === '/signin') {
      $('#signin-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        store.user = { email: fd.get('email'), name: fd.get('email').split('@')[0] };
        saveStore(store);
        flash('Signed in (mock)', 'ok'); navigate('/dashboard');
      });
    }
  }

  function notFoundPage() {
    return `<section><h2>Page not found</h2><p class="muted">The route <code>${currentPath()}</code> does not exist.</p></section>`;
  }

  function ensureSignedIn(fn) {
    if (!store.user) {
      flash('Please sign in first', 'warn'); navigate('/signin');
      return;
    }
    fn();
  }

  // Expose a tiny API for debugging in the console
  window.FitnessUI = {
    getStore: () => structuredClone(store),
    reset: () => { store = { user: null, bookings: [], membership: null, cart: null }; saveStore(store); render(); },
    navigate,
  };
})();
