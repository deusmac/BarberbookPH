# Neo-Brutalism Design System & UI Specification

A complete, highly structured design guide based on the visual identity and user interface from the provided demo. This document provides exact design rules, CSS parameters, component definitions, and UX guidelines to replicate or adapt this style in any Web / App application.

---

## 1. Aesthetic Overview & Design Philosophy

The application utilizes a **Neo-Brutalist** aesthetic combined with high-contrast functional UI elements. Key characteristics include:

* **Thick Black Borders:** Heavy, uniform outline strokes (`2px` to `3px` solid black) on almost every container, button, input, and badge.
* **Hard Hard-Edged Drop Shadows:** Non-blurred offset drop shadows (`4px` to `6px`) in pure black (`#000000`) or contrasting colors creating a distinct 3D card/popout effect.
* **Vibrant & Saturated Primary Palette:** Deep Cobalt/Royal Blue background, bright Golden Yellow primary accents, with off-white/cream container backgrounds for legibility.
* **Playful Typography & Badge Tags:** Heavy sans-serif bold titles (often upper-case) paired with angled or floating label tags (`rotate(-3deg)` / `rotate(3deg)`).
* **High Contrast & Tactile Controls:** Distinct interactive states with strong visual feedback (hover offset shift, active tactile click compression).

---

## 2. Color Palette & Variables

### Primary & Core Brand Colors
| Token Name | Hex Code | Usage / Context |
| :--- | :--- | :--- |
| `color-bg-main` | `#1D4ED8` / `#1E50FF` | Primary page background (Vibrant Cobalt / Electric Royal Blue) |
| `color-primary` | `#FACC15` / `#FFE600` | Accent & Hero Highlights, Primary Buttons, Active Tabs |
| `color-card-bg` | `#FFFFFF` / `#FAFAFA` | Main Card Containers, Form Containers, Content Boxes |
| `color-body-bg` | `#E0F2FE` / `#E2F1F8` | Light Ice Blue for Portal Inner Dashboards & Backgrounds |
| `color-stroke` | `#000000` | Global Borders, Outlines, Divider Lines, Hard Shadows |

### Functional & Status Colors
| Token Name | Hex Code | Usage / Context |
| :--- | :--- | :--- |
| `color-success` | `#22C55E` / `#10B981` | Approve / Action Confirmed Buttons, Active Badges |
| `color-danger` | `#EF4444` / `#DC2626` | Reject / Cancel Buttons, Destructive Actions |
| `color-warning` | `#F59E0B` | Pending Status Tags, Alert Callouts |
| `color-accent-soft` | `#FEF08A` | Secondary tag background (e.g., "Professional", "NEW!") |

---

## 3. Typography & Styling Rules

* **Primary Font Family:** Clean, geometric heavy sans-serif (e.g., *Inter*, *Plus Size Sans*, *Outfit*, or *Montserrat*).
* **Heading Styling (`H1`, `H2`, `H3`):**
  * Weight: `800` (ExtraBold) or `900` (Black).
  * Transform: Mostly `uppercase` for hero headers, section titles, and action badges.
  * Letter Spacing: Tight tracking (`-0.02em` to `-0.04em`).
* **Body Text:**
  * Weight: `500` (Medium) / `600` (SemiBold).
  * High contrast black (`#000000`) or dark charcoal (`#111827`) for readability on cream/white backgrounds.

---

## 4. Design System Tokens & CSS Baseline

```css
:root {
  /* Colors */
  --bg-primary: #1e50ff;
  --bg-portal: #e2f1f8;
  --surface-card: #ffffff;
  --brand-yellow: #ffe600;
  --brand-yellow-hover: #edd400;
  --border-black: #000000;
  
  /* Status Colors */
  --status-green: #10b981;
  --status-red: #ef4444;
  --status-yellow: #f59e0b;

  /* Geometry & Borders */
  --border-width: 2.5px;
  --border-radius-sm: 8px;
  --border-radius-md: 12px;
  --border-radius-lg: 16px;
  --border-radius-pill: 9999px;

  /* Shadows (Neo-Brutalist Hard Offset) */
  --shadow-sm: 2px 2px 0px #000000;
  --shadow-md: 4px 4px 0px #000000;
  --shadow-lg: 6px 6px 0px #000000;
  --shadow-hover: 6px 6px 0px #000000;
  --shadow-active: 1px 1px 0px #000000;
}
```

---

## 5. UI Component Specifications

### A. Cards & Containers
* **Border:** `2.5px solid #000000`
* **Border Radius:** `12px` or `16px`
* **Box Shadow:** `4px 4px 0px #000000`
* **Background:** `#FFFFFF`
* **Header / Title Area:** Bold capitalized headings with optional black divider lines (`border-bottom: 2.5px solid #000`).

### B. Buttons & Actions
* **Primary Button (Yellow Accent):**
  * Background: `--brand-yellow` (`#FFE600`)
  * Text Color: `#000000` (Bold `700` or `800`)
  * Border: `2.5px solid #000000`
  * Radius: `8px` - `12px`
  * Box Shadow: `3px 3px 0px #000000`
  * Hover State: `transform: translate(-2px, -2px); box-shadow: 5px 5px 0px #000;`
  * Active/Click State: `transform: translate(2px, 2px); box-shadow: 1px 1px 0px #000;`
* **Secondary / Outline Button:**
  * Background: `#FFFFFF`
  * Same hover and shadow offset logic as primary.

### C. Floating Badges & Callout Pills
* **Angled Feature Badges:**
  * Positioned floating over card top corners or headings.
  * Transform: `rotate(-4deg)` or `rotate(4deg)`
  * Padding: `4px 10px`
  * Border: `2px solid #000000`
  * Background: Light Yellow (`#FEF08A`) or Cyan/Blue.
  * Typography: Uppercase, bold `800`, font-size `0.75rem`.

### D. Form Controls & Inputs
* **Input Fields:**
  * Background: `#FFFFFF`
  * Border: `2px solid #000000`
  * Radius: `8px`
  * Shadow: Inset or light flat shadow.
  * Focus State: Yellow accent border highlight (`border-color: #000; background-color: #FFFAEC; outline: 2px solid #000;`)

### E. Navigation & Sidebar (Portal/Admin Layout)
* **Sidebar Navigation:**
  * Background: `#FFFFFF` or Light Ice Blue.
  * Border-Right: `3px solid #000000`.
  * Nav Items: Boxed tabs with rounded corners, bold black text, turning Yellow (`#FFE600`) with a `3px 3px 0px #000` shadow when active.
* **Top Header / Announcement Bar:**
  * High-contrast blue/black bar with clean bold navigation buttons.

---

## 6. Layout & Page Structures Observed

1. **Landing Page / Hero Section:**
   * Bright cobalt blue background (`#1E50FF`).
   * Main centered White Neo-Brutalist card container.
   * Large headline with hero primary action button in vibrant yellow with arrow icon (`BOOK YOUR SESSION ->`).
2. **Pricing / Package Selection Grid:**
   * Grid of white rectangular cards with thick black borders.
   * Price badges displayed inside prominent yellow rounded boxes.
   * Floating tag badges ("CREATIVE", "WHOLE ROOM", "FAM") tilted above cards.
3. **Multi-Step Checkout Flow:**
   * Circular numbered step indicators (1, 2, 3, 4) connected by bold dark lines.
   * Interactive selection boxes (date/time slots, add-on counter buttons `+ / -`).
4. **Client & Admin Dashboards:**
   * Left-side vertical navbar with Neo-Brutalist tab buttons.
   * Content view area on soft light blue canvas (`#E2F1F8`).
   * Analytics widgets rendered inside distinct black-bordered white cards featuring clean charts (pie charts, line graphs, bar charts).

---

## 7. Universal Adaptability Guide

To apply this theme to **any software project** (SaaS, E-commerce, Portfolio, Internal Tools):

1. **Adopt High-Contrast Geometry:** Give every card, input, and button a `2px` to `3px` solid black border.
2. **Apply Offset Hard Shadows:** Replace soft radial drop-shadows (`box-shadow: 0 4px 10px rgba(0,0,0,0.1)`) with crisp offset vector shadows (`box-shadow: 4px 4px 0px #000`).
3. **Use Playful Micro-Interactions:** Make buttons shift down and right on click (`translate(2px, 2px)`), simulating pressing a physical mechanical switch.
4. **Incorporate Badge Tags:** Use rotated mini-badges above section titles to highlight categories, status flags, or key metrics.
