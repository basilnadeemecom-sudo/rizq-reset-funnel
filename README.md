# The Rizq Reset — Funnel Mockup

A premium, mobile-first HTML mockup for an Islamic personal finance quiz funnel.

> "Discover your Muslim Money Archetype and get your personalised 30-day roadmap to take control of your money with Islamic principles."

This is a **visual / conversion mockup only**. No backend, no real payments. All state is held in JavaScript.

---

## Quick start

Open `index.html` in any modern browser. That's it — no build step, no dependencies.

```
open index.html
```

---

## Project structure

```
rizq-reset-funnel/
├── index.html        # The full funnel (HTML + CSS + JS, self-contained)
├── README.md         # This file
├── assets/           # Reserved for future images, fonts, icons
├── css/              # Reserved for extracted stylesheets
└── js/               # Reserved for extracted scripts
```

> All CSS and JS are currently embedded inside `index.html` for portability.
> The `css/` and `js/` folders are placeholders if you want to split them out later.

---

## Funnel flow

1. **Landing page** — hero, value props, roadmap preview card, trust pills
2. **Archetype selection** — 5 Muslim Money Archetypes
3. **Quiz** — 6 archetype-specific questions, keyed answers, progress bar, back button
4. **Loading** — animated "building your roadmap" screen
5. **Results** — personalised diagnosis, bottleneck, 4-week roadmap
6. **Offer** — **fully personalised** sales page tailored to the user's archetype + quiz answers (The Rizq Reset Blueprint, $47)
7. **Checkout** — order summary, Halal Budget Toolkit order bump (+$27), mock payment form
8. **Upsell 1** — Rizq Tracker Web App ($147 lifetime), dashboard mockup
9. **Upsell 2** — AI Muslim Money Coach ($97/year), example prompts
10. **Success** — dynamic receipt reflecting selected purchases

---

## Personalised sales page (v4 — Stripped & Premium)

Six clean sections, three CTAs, zero clutter. Built for cold Meta-ad traffic after a quiz. Universal button copy throughout: **Start My Rizq Reset — $47**.

Six sections, three CTAs:

1. **HERO (2-col on desktop)** — "★ Your roadmap is ready" badge + archetype badge, sharp archetype headline (e.g. *"Stop Letting Your Money Disappear Every Month"*), 1-line subheadline, $297 → $47 price box, hero CTA, 4 trust bullets · CSS-rendered product mockup (book + 2 worksheets peeking behind + dashboard preview + "A complete 30-day system" pill)
2. **YOUR QUIZ REVEALED** — exactly 3 personalised insight cards (most relevant quiz answers per archetype) + one universal bridge sentence: *"That's why your next step is not more random advice — it's a simple system you can follow weekly."*
3. **THE 30-DAY SYSTEM** (cream block) — 4 universal cards: **Audit · Control · Direct · Review**
4. **WHAT YOU GET** — 6-item value stack (Blueprint Guide / Action Plan / Audit Worksheet / Halal Budget Method / Sadaqah & Zakat Planner / Weekly Review System) totalling $297 → $47 today · inline CTA
5. **WHY $47 IS EASY** — light cream/gold callout, 2–3 sentence archetype-specific note that uses the user's actual quiz numbers (e.g. *"If **$300–$500** is leaking every month, this pays for itself before week 2"*)
6. **FAQ + FINAL CTA** — 5-item FAQ accordion (Is this financial advice? · Outside the US? · Includes zakat? · Will it tell me what to invest in? · What happens after I buy?) → dark emerald final CTA hero with archetype final headline, dark $47 price box, gold universal CTA, microcopy *"Instant access · One-time payment · Start today"*

### Three CTAs, universal copy

All 3 CTA buttons use **`Start My Rizq Reset — $47 →`** — written by `renderOffer()` to every `.sales-cta` button. Every button routes to `goto('checkout')`. The checkout, order bump, upsells, and success flow are unchanged.

### What was stripped from v3

- Mid CTAs (both) — removed
- Comparison section (chaos vs Blueprint) — removed
- 30-day journey timeline — removed
- Modules grid (6 cards with archetype highlight) — removed (the value stack covers it)
- Mechanism section (See/Control/Direct/Review) — replaced by the simpler "The 30-Day System" cards
- Benefits section ("By the end of your 30-day reset…") — removed
- "Is This For You" fit-check section — removed
- Pattern-bridge per-archetype paragraph — replaced by one universal sentence
- 30+ dead CSS classes removed: `.sp-section`, `.sp-bullets`, `.sp-reframe`, `.reframe-grid`, `.reframe-card`, `.method-weeks`, `.method-week`, `.sp-cta-block`, `.forfor-grid`, `.forfor`, `.obj-card`, `.objections`, `.sp-whynow`, `.sp-lead`, `.modules-grid`, `.module-card`, `.compare-grid`, `.compare-col`, `.tl`, `.tl-step`, `.benefits-grid`, `.archetype-bonus`, `.included-chips`, `.chip`, `.mech-card .m-add` — and their media-query variants

File size dropped from ~3486 → 2656 lines.

Every CTA (5 in total) calls `goto('checkout')` — the existing checkout, order bump, upsells, and success flow are unchanged.

### Visual treatment

- **Alternating section backgrounds** — white `sp-block` sections alternate with cream-tinted `sp-block.cream` rounded blocks to break up the page rhythm
- **CSS product mockup** — Blueprint "book cover" (emerald gradient, gold accents, rotated -3deg) overlapping a "dashboard preview" card (rotated +4deg) with a gold glow halo
- **Slightly wider frame** on desktop only when the sales page is active, using `body:has(#screen-offer.active)` (Chrome/Safari/Edge/FF121+)
- **3-column module grid** on desktop, 2 on tablet, 1 on mobile
- **4-column timeline** on desktop with dashed gold connector, 2x2 on tablet, vertical on mobile

### Where the copy lives

All dynamic sales copy is in the `archetypeSalesPages` object inside `index.html`. Per archetype:

- `archetypeBadge` — "Recommended for: [Archetype]"
- `headline` — outcome-driven, archetype-specific
- `subheadline(answers)` — short, 1-line, mostly universal framing
- `insights[]` — 3 cells `{label, key, icon, fallback}` (the 3 most relevant quiz answers)
- `why47Note(answers)` — 2–3 sentence archetype-specific easy-decision callout (HTML, includes a `.w47-anchor` gold pill on the key number)
- `finalHeadline` — closing CTA headline

Universal arrays:
- `thirtyDaySystem` — 4 cards: Audit · Control · Direct · Review
- `blueprintStack` — 6 items, totalling $297 (Blueprint Guide / Action Plan / Audit Worksheet / Halal Budget Method / Sadaqah & Zakat Planner / Weekly Review System)
- `blueprintFAQ` — 5 universal FAQ entries

### Quiz answers are keyed

Each archetype has an `answerKeys` array. Selections are stored on `state.answers` by key, so any screen can reference them by name:

```js
state.answers = {
  overspendCategory: "Food delivery",
  monthlyLeak: "$300–$500",
  budgetStatus: "No",
  spendingTrigger: "Stress",
  urgency: "This month"
}
```

| Archetype | Answer keys |
|---|---|
| Rizq Leaker | `trackingFrequency`, `overspendCategory`, `monthlyLeak`, `budgetStatus`, `spendingTrigger`, `urgency` |
| Paycheck Prisoner | `paydayShortageFrequency`, `emergencyFund`, `incomeDrain`, `survivalNumber`, `peaceNeed`, `breathingRoom` |
| Debt-Burdened Muslim | `debtType`, `debtAmount`, `ribaStatus`, `minimumPayments`, `debtCause`, `planUrgency` |
| Generous Giver | `supportRecipient`, `givingBudget`, `guiltSayingNo`, `givingPressure`, `safeGivingAmount`, `givingType` |
| Future Builder | `mainGoal`, `monthlySavings`, `emergencyFund`, `halalInvestingKnowledge`, `timeline`, `progressBlocker` |

### Where the copy lives

All dynamic sales copy is in the `archetypeSalesPages` object inside `index.html`. Each archetype defines:

- `preheadline`, `headline`, `subheadline(answers)`
- `insights[]` — array of `{label, key, icon, fallback}`
- `meaning(answers)`, `bridge(answers)` — calm narrative paragraphs
- `cta` — dynamic button copy

### Dynamic CTA labels

| Archetype | Button copy |
|---|---|
| Rizq Leaker | Start Plugging The Leaks → |
| Paycheck Prisoner | Build My Payday Control System → |
| Debt-Burdened Muslim | Create My Debt Relief Plan → |
| Generous Giver | Structure My Giving → |
| Future Builder | Build My Halal Money Roadmap → |

---

## The 5 Muslim Money Archetypes

| Archetype | Core problem |
|---|---|
| The Rizq Leaker | Income leaks out through untracked spending |
| The Paycheck Prisoner | Living month to month with no breathing room |
| The Debt-Burdened Muslim | Debt and riba-related stress |
| The Generous Giver | Generosity without structure causing strain |
| The Future Builder | Long-term goals without a clear plan |

Each archetype has its own diagnosis, bottleneck, 4-week roadmap, and 6 quiz questions — all defined in the `ARCHETYPES` object in `index.html`.

---

## Pricing model (mockup)

| Item | Price |
|---|---|
| The Rizq Reset Blueprint (front-end) | **$47** |
| Halal Budget Toolkit (order bump) | **$11** |
| Rizq Tracker Web App (upsell 1) | $147 lifetime |
| AI Muslim Money Coach (upsell 2) | $97 / year |
| **Checkout total (no bump)** | **$47** |
| **Checkout total (with bump)** | **$58** |
| **Maximum cart (all upsells)** | **$302** |

---

## Brand palette

| Token | Hex | Use |
|---|---|---|
| Deep Emerald | `#0B3D2E` | Hero backgrounds, premium dark sections |
| Rich Islamic Green | `#116B4F` | Primary buttons, active states, progress bars |
| Soft Gold | `#D4AF37` | Premium accents, badges, dividers |
| Warm Cream | `#F8F3E7` | Page backgrounds, calm sections |
| Off-White | `#FFFCF4` | Card backgrounds, forms |
| Charcoal | `#1E2522` | Primary text |
| Muted Grey | `#6B7280` | Secondary text |
| Border Beige | `#E7DDC8` | Card borders, dividers |
| Success | `#1F8A5B` | Positive states |
| Warning | `#C98A1A` | Caution states |
| Soft Red | `#B94A48` | Debt / risk indicators (sparingly) |

---

## Brand voice

The Rizq Reset is positioned as a **premium Islamic money system** — calm, trustworthy, spiritually grounded, modern, and non-judgmental.

**We don't say:**
- "Get rich" · "Manifest wealth" · "Hack Allah's blessings"
- "Guaranteed barakah" · "Become wealthy overnight"
- Any claim that suggests buying this guarantees rizq

**We do say:**
- "Your money is an amanah."
- "Stop guessing where your rizq is going."
- "Build discipline with your spending, intention with your giving, and structure with your goals."

---

## Ethical boundaries

- No fatwas issued
- No guaranteed wealth claims
- No riba-based product promotion
- No specific investment recommendations
- Islamic terms (rizq, amanah, barakah, sadaqah, zakat) used carefully and respectfully

For specific Islamic rulings, users should consult a qualified scholar. For regulated financial advice, a qualified adviser.

---

## Customising

All copy and data live in `index.html`:

- **Archetype data** (questions, diagnosis, bottleneck, weeks): `ARCHETYPES` object
- **Pricing**: `state.totals` object
- **Brand colours**: `:root` CSS variables at the top of the `<style>` block

To split CSS / JS out of `index.html`, move the contents of `<style>` into `css/styles.css` and the `<script>` block into `js/app.js`, then link them in the `<head>` and before `</body>`.

---

## Built with

- Plain HTML + embedded CSS + vanilla JavaScript
- No frameworks, no CDNs, no build step
- Mobile-first, responsive on desktop (max-width 980px frame)
