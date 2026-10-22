# ShopSphere — Premium Studio E-Commerce Storefront

Elevate ShopSphere into a luxury, minimalist studio e-commerce web application featuring high-end editorial aesthetics, zero-pill typography, and a complete suite of standard retail store pages (About Us, Contact Us, Live Order Tracking, Categorized FAQ, and Customer Policy Hub).

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following directions have been aligned based on user preferences and retail design standards:

- **Confirmed Aesthetic Direction**: *Clean Minimalist Studio* featuring crisp gallery white surfaces (`#FFFFFF`), warm off-white canvas (`#F8F9FA`), quiet charcoal typography (`#111827`), hairline architectural dividers (`#E5E7EB`), and disciplined slate/indigo accents.
- **Confirmed Page Suite**: Complete multi-view storefront including:
  1. **Shop / Catalog** (Hero showcase, Department filters, Product grid, Detailed PDP view, Offcanvas Cart, Checkout modal).
  2. **About Us** (Our Story, Sustainable Craftsmanship, Editorial Lookbook gallery, Studio values).
  3. **Contact Us** (Interactive inquiry form, live response feedback, Studio locations & operating hours, WhatsApp/Direct channels).
  4. **Order Tracking** (Live Order Lookup by ID/Email, 5-stage shipment progress bar, carrier updates, invoice download).
  5. **FAQ** (Searchable categorized accordions for Shipping, Returns, Sizing, and Payments).
  6. **Customer Policies** (Tabbed policy hub for Shipping, 30-Day Returns, Privacy Policy, and Terms of Service).
- **Navigation Architecture**: Seamless client-side Single Page Application (SPA) routing with active nav indicators, dynamic page breadcrumbs, and zero full-page reloads.

---

## 1. Overview & Core Concept

- **What It Does**: Transforms the student assignment into a high-end luxury e-commerce experience. Users can shop the curated catalog fetched from the live REST API, inspect deep product details, manage cart with promo codes, track orders with real-time visual progress, submit inquiries, and explore transparent store policies.
- **Target Audience**: Discerning shoppers who appreciate minimalist design, architectural fashion, and transparent customer service, as well as academic reviewers looking for a complete, production-grade assignment.
- **Key Value**: Delivers the visual and operational polish of modern luxury DTC brands (such as Totême, COS, Aesop, and Studio Nicholson) while strictly fulfilling every technical requirement of the ReactJS assignment.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Catalog & Discovery Flow**: Top Bar $\to$ Editorial Campaign Hero $\to$ Clean Department Navigation (Men, Women, Shoes, Accessories) $\to$ Product Card with image focus and subtle micro-lift $\to$ Product Details View (PDP) with contiguous purchase module.
2. **Shopping Bag & Checkout Flow**: Add to Cart $\to$ Slide-over Drawer with free-shipping threshold indicator $\to$ Promo discount code applied $\to$ Multi-channel checkout (COD, Cards, Mobile Wallets) $\to$ Instant Order Confirmation Receipt with generated Order ID.
3. **Order Tracking Flow**: Header/Footer "Track Order" $\to$ Input Order ID (e.g. `ORD-2026-8491`) $\to$ Animated 5-step fulfillment timeline (*Confirmed $\to$ Packed in Studio $\to$ Dispatched $\to$ In Transit $\to$ Delivered*) with itemized package summary.
4. **Customer Support & Story Flow**: Seamless switch to About Us for brand craftsmanship, Contact Us with working inquiry submissions, or interactive searchable FAQ.

### Visual Identity & Theme
- **Anti-Slop Discipline**:
  - **Zero-Pill Metadata**: No pill badges on static metadata; clean unboxed text separated by subtle typographic dots (`·`).
  - **No Badge Sandwiches**: Product cards feature clean image boundaries with single quiet typographic tags.
  - **Top Bar Contract**: Strict 1-row, 3-zone layout: Brand wordmark $\to$ Clean single-line nav links (`Shop`, `About`, `Tracking`, `FAQ`, `Contact`) $\to$ Cart & Wishlist actions.
- **Color Palette (60-30-10 Rule)**:
  - `60% Neutral Canvas`: Crisp Studio White (`#FFFFFF`) and Soft Gallery Bone (`#F9FAFB`).
  - `30% Structural Surfaces`: Clean border hairlines (`#E5E7EB`), slate cards, and muted slate metadata (`#6B7280`).
  - `10% Accent Accent`: Deep Obsidian Charcoal (`#111827`) for primary actions and subtle Indigo/Cobalt focus states.
- **Typography**:
  - Primary Display: *Plus Jakarta Sans* / *Outfit* with balanced weights (Medium 500, SemiBold 600).
  - Body: *Plus Jakarta Sans* (15px–16px, 1.55 line-height) for effortless reading.
  - Metrics / Numbers: Tabular figures (`tabular-nums`) for prices, order IDs, and dates.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Client-Side View State vs React Router**
  - *Chosen Approach*: Lightweight client-side page routing (`activePage: 'shop' | 'about' | 'contact' | 'tracking' | 'faq' | 'policies'`) managed through unified state with scroll-to-top on page change.
  - *Why*: Seamless execution in the AI Studio preview sandbox with zero routing edge cases or 404s on browser reloads.
- **Decision 2: Comprehensive Store Page Interactivity**
  - *Chosen Approach*: Every page is fully interactive—Contact Us has working validation and feedback toasts; Order Tracking supports searching real newly-placed orders as well as pre-loaded demo orders; FAQ features real-time search filtering.
  - *Why*: Eliminates dead clicks and hollow placeholders, satisfying production-grade evaluation.
- **Decision 3: Integrated Order History & Live Tracking Sync**
  - *Chosen Approach*: Orders placed through checkout automatically populate the tracking system, allowing immediate lookup with the generated Order ID.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        App Root State Container                       │
│  (products, cart, wishlist, activePage, orders, filters, toasts)       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┼───────────────────────────────┐
    ▼                               ▼                               ▼
┌──────────────┐            ┌──────────────┐                ┌──────────────┐
│  Top Navbar  │            │ Current View │                │ Store Footer │
│  (3-Zone     │            │  Controller  │                │  (Quick Links│
│  Navigation) │            └───────┬──────┘                │  & Policies) │
└──────────────┘                    │                       └──────────────┘
                                    │
   ┌────────────────┬───────────────┼───────────────┬────────────────┐
   ▼                ▼               ▼               ▼                ▼
┌──────────────┐ ┌──────────────┐┌──────────────┐┌──────────────┐┌──────────────┐
│  Shop Page   │ │  About Us    ││  Contact Us  ││Order Tracking││  FAQ & Hub   │
│ (Hero, Grid, │ │(Craft & Story││(Form, Hours, ││(Lookup & 5-  ││(Searchable   │
│ Filters, PDP)│ │ & Values)    ││ Direct Comms)││ Step Tracker)││ Accordions)  │
└──────────────┘ └──────────────┘└──────────────┘└──────────────┘└──────────────┘
```

### Component & Page Mapping:
- **`src/pages/ShopPage.tsx`**: Hero campaign, Department selectors, Multi-parameter Filter bar, Product Grid, PDP modal.
- **`src/pages/AboutPage.tsx`**: Brand philosophy, Sustainable studio craftsmanship, Material transparency, Milestones.
- **`src/pages/ContactPage.tsx`**: Customer inquiry form, studio headquarters, direct contact cards, business hours.
- **`src/pages/TrackingPage.tsx`**: Order lookup bar, order details card, 5-stage visual progress timeline, courier dispatch details.
- **`src/pages/FaqPage.tsx`**: Searchable accordion categories (Orders & Shipping, Returns & Refunds, Sizing & Care, Payments).
- **`src/pages/PoliciesPage.tsx`**: Tabbed policy viewer (Shipping Policy, 30-Day Return Guarantee, Privacy Policy, Terms of Service).
- **`src/components/Navbar.tsx`**: Updated 3-zone clean navigation supporting all store pages, live cart badge, and wishlist toggle.
- **`src/components/Footer.tsx`**: Clean luxury footer linking to all pages, policies, newsletter signup, and copyright.
