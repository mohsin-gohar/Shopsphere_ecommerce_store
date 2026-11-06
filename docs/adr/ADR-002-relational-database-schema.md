# ADR-002: Relational Database Schema & Ledger Persistence

## Status
Accepted

## Context
High-volume retail operations require strict data integrity for products, multi-variant SKUs, real-time inventory allocation, multi-currency pricing, and immutable order records.

## Decision
We designed a normalized relational schema for PostgreSQL:
1. **Products & Variants**: Hierarchical product modeling with discrete `product_variants` capturing SKU, size, color, barcode, price adjustment, and inventory quantity.
2. **Inventory Ledger**: An append-only ledger tracking all inventory state mutations (restock, order reservation, cancellation release, return intake) to prevent race conditions.
3. **Order & Line Items**: Deep snapshotting of line item attributes (name, price at purchase, selected variant) to preserve billing integrity regardless of future product updates.
4. **Transactions & Audit**: Dedicated payment transaction and audit logging tables.

## Consequences
- Guarantees financial and inventory consistency across high-volume checkout spikes.
- Enables accurate historical reporting and point-in-time auditing.
