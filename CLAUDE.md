# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mythryl is a T3 Stack application with both web (Next.js) and desktop (Tauri) interfaces. It integrates Web3 wallet authentication (Thirdweb), Farcaster social features, and multi-window management.

**Tech Stack:** Next.js 15, React 19, TypeScript, tRPC 11, Drizzle ORM, Neon PostgreSQL, Tailwind CSS 4, Tauri 2

## Commands

**Note:** Do not run `pnpm check` or `pnpm build` after making changes. I will run these commands myself when ready.

```bash
# Development
pnpm dev                    # Start dev server (Webpack)
pnpm check                  # Lint + type check
pnpm lint:fix              # ESLint with auto-fix
pnpm format:write          # Prettier format

# Database
#. Never run DB migrations I will always run them for you, just tell me when you're ready.
pnpm db:generate           # Generate migrations
pnpm db:migrate            # Run migrations
pnpm db:studio             # Open Drizzle Studio

# Desktop (Tauri)
pnpm tauri:dev             # Dev mode with hot reload
pnpm tauri:build           # Build desktop app
pnpm tauri:build:next      # Build Next.js for Tauri (static export)

# Build
pnpm build                 # Production build
pnpm build:app             # Build without worker (WORKER_MODE=false)
pnpm build:worker          # Build with worker (WORKER_MODE=true)
```

## Architecture

### Directory Structure

- `src/app/` - Next.js App Router (route groups: `(app)` for main, `(auth)` for login)
- `src/server/api/` - tRPC routers and services
- `src/server/db/` - Drizzle schema and database connections
- `src/components/` - React components (Shadcn/ui in `ui/`)
- `src/services/` - Business logic (Thirdweb, S3, Neynar, Alchemy, etc.)
- `src/hooks/` - Custom React hooks
- `src-tauri/` - Tauri desktop app (Rust)

### tRPC Pattern

```
src/server/api/routers/{feature}/
├── {feature}.router.ts    # Router with procedures
├── {feature}.service.ts   # Business logic (takes DB as param)
└── {feature}.schema.ts    # Zod validation schemas
```

Procedures: `publicProcedure` (anyone), `protectedProcedure` (authenticated), `walletProcedure` (wallet verified)

### Authentication

- NextAuth 5 with Thirdweb credential provider
- Wallet-based authentication flow
- Session extended with user ID
- Hooks: `useIsAuthenticated()`, `useCanTransact()`, `useSignOut()`

### Database

- Drizzle ORM with dual connections:
  - Neon HTTP client for read queries
  - postgres-js for transactions
- Service functions use pattern: `getUserById(db)(userId)`
- DO NOT EVER run migrations yourself. I will always run them for you, just tell me when you're ready.

### State Management

- **Zustand** for client state (wallet, windows)
- **React Query** via tRPC for server state

### Import Alias

`~/` maps to `src/` (e.g., `~/components/ui/button`)

## Key Patterns

### Code Style

- **Always use const arrow functions** - never use `function` declarations

  ```typescript
  // Good
  const MyComponent = () => { ... }
  const handleClick = () => { ... }

  // Bad
  function MyComponent() { ... }
  function handleClick() { ... }
  ```

- **Never use `next/image`** - always use regular `<img>` tags
  - External URLs cause issues with Next.js image optimization
  - Use standard img with appropriate Tailwind classes for sizing/object-fit

### Component Structure

- Client components: Add `"use client"` directive
- UI primitives in `src/components/ui/` (Shadcn/ui + Radix)
- Use `cn()` utility for className merging

### File Naming

- Components: `kebab-case.tsx` or `scope.feature.tsx`
- Stores: `name.store.ts`
- Hooks: `use-kebab-case.ts` for one off. `scope.hooks.tsx` for scoped
- Services: `name.service.ts`

### Tauri Detection

```typescript
import { isTauri } from "~/lib/tauri";
if (isTauri()) {
  /* desktop-specific code */
}
```

### Environment Variables

- Validated via `src/env.app.ts` using t3-env
- Client vars prefixed with `NEXT_PUBLIC_`
- Never use `process.env` directly

## Windows System

Multi-window management via Zustand store in `src/components/windows/`:

- `WindowsProvider` wraps app for context
- `useWindows()`, `useWindowActions()` hooks
- Desktop: draggable windows with DnD Kit
- Mobile: full-screen modal with tabs
