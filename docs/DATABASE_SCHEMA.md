# Database Schema Specification

ShopSphere uses an enterprise relational PostgreSQL schema covering the full lifecycle of digital commerce:

### Core Entities

1. **`roles` & `users`**
   - User authentication, password hashes, contact details, role-based authorization (`customer` or `admin`).
   - Extended loyalty properties: `membership_tier`, `loyalty_points`, `wallet_balance`.

2. **`categories` & `products`**
   - Hierarchical category taxonomy.
   - Products with short and full descriptions, rating, review counter, and merchandise badges (`New`, `Sale`, `Limited`, `Best Seller`).

3. **`product_variants`**
   - Specific SKUs with attributes (`size`, `color`), inventory quantity, and price delta adjustments.

4. **`inventory_ledger`**
   - Immutable audit trail recording each stock change: `RESTOCK`, `ORDER_RESERVED`, `ORDER_CANCELLED`, `RETURN_RECEIVED`.

5. **`orders` & `order_items`**
   - Detailed order records capturing customer snapshot, billing and shipping breakdown, applied discounts, taxes, and shipping fees.
   - Line items locking in price at checkout with variant specifics.

6. **`payments`**
   - Payment method (card, cod, jazzcash, easypaisa, bank, wallet), transaction IDs, amount paid, and status (`pending`, `completed`, `failed`, `refunded`).

7. **`coupons`**
   - Promo vouchers with `percent` or `flat` reductions, minimum spend requirements, expiry, and active toggles.

8. **`returns`**
   - Order return requests with status progression (`Requested`, `Refunded`, `Declined`) and wallet credit integration.

9. **`saved_addresses`, `reviews`, `product_questions`, `contact_inquiries`**
   - Customer address book, piece ratings and client reviews, Q&A interactions, and customer support tickets.
