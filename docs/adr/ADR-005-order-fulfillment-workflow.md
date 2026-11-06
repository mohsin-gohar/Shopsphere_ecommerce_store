# ADR-005: Order Fulfillment & Lifecycle Workflow

## Status
Accepted

## Context
Order fulfillment requires a deterministic state machine moving from placement to delivery, including exception states (Cancellation, Returns, Restocking).

## Decision
1. **Lifecycle States**:
   - `Confirmed`: Order placed, inventory decremented, tracking ID generated. Can be cancelled by customer before dispatch.
   - `Processing in Studio`: Pieces picked, inspected, and packed in the atelier.
   - `Dispatched`: Handed over to logistics carrier (e.g. TCS Express) with active tracking.
   - `In Transit`: Out for last-mile delivery to the client.
   - `Delivered`: Final delivery confirmed. Enables product return request window.
   - `Cancelled`: Terminated state. Automatically restores inventory stock to the floor and refunds wallet/points.
2. **Returns Flow**:
   - `Requested` -> Atelier Review -> `Refunded` (credit posted to client wallet balance) or `Declined`.

## Consequences
- Predictable and auditable order progression with automated inventory and financial balance reconciliations.
