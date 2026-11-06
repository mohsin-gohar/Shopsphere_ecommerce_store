# ShopSphere Enterprise Architecture

## Overview
ShopSphere is a full-featured enterprise eCommerce system designed for luxury retail, omni-channel fulfillment, client relationship management, and administrative operations.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION LAYER                            │
│  React 19 • TanStack Router • Tailwind CSS v4 • Lucide • Recharts      │
│  - Luxury Storefront (Catalog, Facets, Variants, Cart, Bag Quote)      │
│  - Client Salon (Profiles, Addresses, Loyalty, Wallet, Order History)  │
│  - Atelier Console (Orders, Stock, Clients, Dispatch, Returns, Insights│
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
┌────────────────────────────────────▼───────────────────────────────────┐
│                          APPLICATION LOGIC                             │
│  - Commerce Engine (Pricing, Quote, Multi-Tender Settlement)           │
│  - Inventory Manager & Stock Reservation Workflow                      │
│  - Order Fulfillment State Machine & Dispatch Tracking                 │
│  - Authentication & Role-Based Access Control (Admin vs Customer)      │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
┌────────────────────────────────────▼───────────────────────────────────┐
│                          PERSISTENCE LAYER                             │
│  - PostgreSQL Database (Neon pooled or embedded PGLite)                │
│  - Schema Migrations (Schema version tracking)                         │
│  - Zustand Client Store (Offline/Local storage hydration)              │
│  - External Live Catalog APIs & House Fallback Archive                 │
└────────────────────────────────────────────────────────────────────────┘
```

## Key Capabilities
- **Advanced Catalog & Search**: Instant filtering by department (Women, Men, Shoes, Objects), price bounds, sorting, live search suggestions, and comparative product matrix.
- **Product Variants**: Support for sizes, colors, dynamic pricing overrides, and SKU stock tracking.
- **Checkout Settlement**: Complex calculation with tax brackets, free shipping thresholds, promo vouchers, client loyalty point redemption, and digital wallet tender.
- **Atelier Console**: Real-time sales telemetry, dynamic CSV report exports, returns approval/rejection pipeline, and dispatch tracking management.
