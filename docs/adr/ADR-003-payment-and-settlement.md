# ADR-003: Payment Orchestration, Settlement & Multi-Tender Checkout

## Status
Accepted

## Context
Modern commerce platforms must accommodate diverse payment mechanisms including Cards, Cash on Delivery (COD), Mobile Wallets (JazzCash, EasyPaisa), Bank Direct Wire, and internal stored value (Customer Wallet Balance and Loyalty Points).

## Decision
1. **Multi-Tender Engine**: The settlement algorithm (`settle()`) calculates net amount due after sequentially applying:
   - Promotional coupon discounts (percentage or fixed amount).
   - Loyalty points redemption (e.g. 100 points = $1.00, capped at 30% of order value).
   - Stored wallet balance.
2. **Residual Tender Processing**: If residual amount due > 0, the customer selects the final payment method (Card, COD, JazzCash, EasyPaisa, or Wire Transfer). If residual is $0, the order is settled completely via stored balances.
3. **PCI & Privacy**: Credit card numbers are validated client-side and masked down to the last 4 digits (`cardLast4`), ensuring sensitive PAN data never enters unencrypted storage.

## Consequences
- Flexible checkout experience catering to international and local payment preference standards.
- Zero liability risk by eliminating unnecessary raw PAN retention.
