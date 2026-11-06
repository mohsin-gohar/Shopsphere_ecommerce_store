# API Reference & Endpoints

## Authentication & Identity
- `POST /api/auth/register` - Create client profile.
- `POST /api/auth/login` - Authenticate customer or admin.
- `POST /api/auth/logout` - Invalidate active session.
- `GET  /api/auth/me` - Fetch profile, wallet, and loyalty details.

## Catalog & Inventory
- `GET  /api/products` - List products with query, category, sort, and pagination.
- `GET  /api/products/:id` - Fetch single product with variants and customer reviews.
- `POST /api/products` - [Admin] Create a new piece for the floor.
- `PATCH /api/products/:id` - [Admin] Update product copy, price, badge, or stock.
- `POST /api/products/:id/questions` - Submit a product question.

## Cart, Pricing & Checkout
- `POST /api/pricing/quote` - Calculate real-time subtotal, coupon discount, shipping, and tax.
- `POST /api/pricing/settle` - Compute net due after applying points and wallet credit.
- `POST /api/orders` - Place and confirm order, reserve stock, and charge tenders.

## Orders & Fulfillment
- `GET  /api/orders` - List customer orders or atelier orders [Admin].
- `GET  /api/orders/:id` - Get detailed order status and tracking details.
- `PATCH /api/orders/:id/status` - [Admin] Advance fulfillment stage.
- `PATCH /api/orders/:id/dispatch` - [Admin] Update carrier, tracking number, and ETA.
- `POST /api/orders/:id/cancel` - Cancel order and restore stock and funds.

## Returns & Support
- `POST /api/returns` - Submit return request for delivered order.
- `PATCH /api/returns/:id` - [Admin] Approve refund or decline return.
- `POST /api/contact` - Submit inquiries to atelier concierge.
