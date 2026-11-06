# ADR-004: RBAC & Multi-Role Security Model

## Status
Accepted

## Context
The platform serves both retail shoppers and internal atelier studio staff. Unauthorized access to admin controls, inventory manipulations, client private data, and financial reports must be strictly prohibited.

## Decision
1. **Role Division**:
   - `customer`: Can view catalog, manage personal profile, save shipping addresses, place orders, redeem loyalty points/wallet, submit returns, ask questions, and leave reviews.
   - `admin`: Full atelier console privileges: order status workflows, dispatch management, pricing and stock overrides, custom coupon creation, client book exports, returns review, and inquiry responses.
2. **Access Control**: Administrative routes (`/admin`) and API surfaces enforce role verification. Unauthenticated requests are redirected to dedicated login portals (`/admin/login` and `/account/login`).

## Consequences
- Strong role isolation ensuring client privacy and preventing unauthorized catalog or administrative tampering.
