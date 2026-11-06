# ADR-001: Enterprise Full-Stack E-Commerce Architecture Overview

## Status
Accepted

## Context
ShopSphere is an enterprise-grade digital fashion commerce platform engineered to support luxury retail storefronts, client styling salons, multi-channel checkout settlement, and a comprehensive Atelier Admin Console. The system needs to support high-concurrency traffic, real-time client state hydration, resilient offline/edge fallbacks, and multi-step fulfillment workflows.

## Decision
We adopted a modern, type-safe full-stack stack:
1. **Frontend**: React 19 with Vite, TanStack Router and TanStack Start, Tailwind CSS v4, Lucide icons, and Recharts for administrative telemetry.
2. **State & Offline Hydration**: Zustand with partitioned local persistence, ensuring uninterrupted operations across guest browsing and authenticated client sessions.
3. **Backend & Relational Persistence**: PostgreSQL with Neon pooling and local PGLite embedded fallback, supporting transactional schema migrations.
4. **Security & RBAC**: Role-Based Access Control dividing roles between `customer` and `admin`, with secure session and credential verification.
5. **Catalog & Search**: Multi-source catalog orchestration incorporating fallback house archives with live external API streams, client-side faceted filtering, and live multi-attribute search.

## Consequences
- **Positive**: Blazing fast rendering, deterministic client state transitions, zero-cold-start development with PGLite, and robust enterprise admin workflows.
- **Negative**: Requires careful synchronization between in-memory/zustand client state and backend database entities during transitions.
