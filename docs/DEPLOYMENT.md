# Deployment and Operations Plan

## Production Architecture
- **Web & Application Tier**: Deployed on edge/serverless infrastructure (Vercel / Nitro runtime) with global CDN caching for static assets.
- **Relational Database**: Managed PostgreSQL cluster (Neon or AWS RDS Aurora) with connection pooling enabled.
- **Cache & Session Store**: Redis / In-memory edge cache for high-frequency pricing and catalog data.

## Environment Variables
- `DATABASE_URL`: Connection string for PostgreSQL database.
- `NODE_ENV`: Set to `production`.
- `VITE_APP_URL`: Base domain of the application.

## CI/CD Pipeline Stages
1. **Lint & Formatting**: `npm run lint` and `npm run format`.
2. **Type Checking**: `npm run typecheck` validates strict TypeScript compilation.
3. **Automated Testing**: Unit, calculation, and workflow test execution.
4. **Database Migrations**: `npm run db:migrate` automatically applies pending `.sql` migration files.
5. **Build & Bundle**: `npm run build` compiles Vite client and Nitro server output.
6. **Zero-Downtime Rollout**: Blue-green deployment with automated health check verification.
