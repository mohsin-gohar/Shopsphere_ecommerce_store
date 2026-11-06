# 🏛️ Enterprise E-Commerce Software Prompt — ShopSphere

## Mission
Upgrade the current **ShopSphere** React + TypeScript storefront into a real, scalable, enterprise-grade eCommerce software platform.

The final product should feel like a **$100M software company** product: not just a shopping cart, but a complete commerce operating system with storefront, customer, orders, inventory, payments, marketing, analytics, operations, security, and enterprise scalability.

## Product Vision
Build a premium, secure, high-performance, multi-tenant-ready eCommerce platform supporting:

- B2C luxury retail
- B2B wholesale
- Marketplace-style multi-vendor selling
- Subscription/recurring commerce

## Current Baseline
React 19 + Vite 8 + TypeScript + Tailwind CSS v4 + Framer Motion + Lucide + Express.
Strengths: premium UI, cart, wishlist, checkout, customer portal, admin dashboard, REST API, fallback catalog.
Gaps: no real database, no auth backend, no payment integration, no inventory system, limited operations.

## Target Architecture
- Frontend: React 19, Vite, TypeScript, Tailwind, Framer Motion, Headless UI, React Query, Zustand/Redux, React Router, PWA, i18n.
- Backend: Node.js, Express, PostgreSQL/MySQL, Prisma/Drizzle, Redis, BullMQ.
- Auth: JWT + RBAC + OAuth.
- Data: users, roles, addresses, carts, products, variants, inventory, coupons, orders, payments, shipments, refunds, reviews, wishlists, notifications, audit logs.

## Enterprise Feature Scope
### Storefront
- Advanced catalog, search, filters, facets, sorting, pagination/infinite scroll.
- Product variants/SKU, inventory, reviews, recommendations, recently viewed, compare.
- Cart, wishlist, checkout, tax, shipping, coupons, payments, order tracking, customer account.

### Admin
- Dashboard analytics, orders, products, inventory, customers, discounts, marketing, reports, exports.

### Customer
- Orders, tracking, returns, profile, addresses, loyalty, support.

### Security & Operations
- JWT, RBAC, rate limiting, audit logs, GDPR/CCPA, PCI awareness.
- Monitoring, analytics, SEO, performance, accessibility.

## Master AI Prompt
You are a senior enterprise eCommerce architect and full-stack engineer.

Build a real, production-ready, enterprise-level eCommerce software platform inspired by a $100M software product.

Include:
1. Premium storefront with advanced catalog, search, filters, sorting, product variants, reviews, recommendations, cart, wishlist, multi-step checkout, tax, shipping, coupons, payments, order tracking, customer account.
2. Powerful admin dashboard with orders, products, inventory, customers, discounts, marketing, analytics, reports, exports.
3. Customer portal with orders, tracking, returns, profile, addresses, loyalty, support.
4. Backend API with authentication, RBAC, database, persistence, integrations.
5. Payment integration, email/SMS notifications, analytics, SEO, PWA, performance optimization.

Tech direction:
- Frontend: React 19, Vite, TypeScript, Tailwind, Framer Motion.
- Backend: Node.js, Express, PostgreSQL, Prisma/Drizzle, Redis.
- Auth: JWT + RBAC.
- Search: PostgreSQL full-text + Elasticsearch/Algolia.
- Payments: Stripe/Razorpay/PayPal/COD.

Do not stop at a basic storefront. Build an enterprise commerce operating system.

Prioritize:
- Real business workflows over mock screens.
- Secure data models.
- Scalable architecture.
- Premium UX.
- Performance and accessibility.
- Admin operational value.
- Customer delight.

Deliver:
- Architecture decision records.
- Database schema.
- API endpoints.
- Frontend pages/components.
- Admin workflows.
- Payment/order flows.
- Tests.
- Deployment plan.

## Final Note
The target is not a UI clone. The target is an enterprise eCommerce software product that can handle real transactions, real inventory, real customers, real analytics, real operations, and premium experiences at scale.
