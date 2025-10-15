<!--
Guidance file for AI coding agents working on the Nikigram Admin project.
Keep this short, concrete and tied to discoverable patterns in the codebase.
-->
# Nikigram Admin — Copilot Instructions

Quick, actionable guidance for an AI coding assistant to be productive in this repository.

- Project type: Next.js (App Router) + TypeScript + React 19.
- Entry: `app/` (App Router). Layouts and pages live under `app/` and use Server Components by default.

Key architecture and runtime
- UI components live in `src/components/` (grouped by feature). Layout wrappers are in `src/components/layouts/`.
- Global providers: `src/components/providers/QueryProvider.tsx` wraps the app (React Query). See `app/layout.tsx` where `QueryProvider` is placed.
- React Query config: hooks use central client (see `@/lib/queryClient.ts` reference in `QueryProvider`). Hooks live in `src/hooks/` (notably `useTaskServices.ts`).
- API surface: `src/services/*` (taskServices.ts) call backend using `fetch` and environment variable `NEXT_PUBLIC_API_URL`.

Conventions and patterns (do not change without confirming)
- Prefer Server Components in `app/` unless component requires client interactivity — add `"use client"` at top for client components.
- Hooks and services:
  - Use `src/hooks/useTaskServices.ts` patterns: read-only fetches are `useQuery`; mutations use `useMutation` and invalidate `['tasks']` queries on success.
  - Services return a small PaginatedResponse shape: `{ tasks, total, limit, offset }`. Respect this when creating or adapting hooks.
- Query cache keys: follow existing keys like `['tasks','my-profile', paginationParams]`, `['tasks','unassigned', paginationParams]`.
- File locations: put reusable UI under `src/components/ui/`, feature components under `src/components/tasks/` or similar feature folders.

Developer workflows (commands found in `package.json`)
- Start dev server: `npm run dev` (Next.js 15 App Router). Build: `npm run build`. Start production server: `npm run start`.
- Lint: `npm run lint` (uses eslint). Tests: not configured in scripts; run test libs directly if added.

Integration notes and gotchas
- Backend base URL must be set via `NEXT_PUBLIC_API_URL` in env for services to work. Many fetch calls expect REST endpoints under `/api/admin/task/...`.
- Some services rely on response fields like `total_count` or `total`. Handle both when mapping API responses.
- Task detail endpoints sometimes include `redirect_url` in the response — do not automatically follow redirects; surface them to the UI layer.
- Auth: service files include commented Authorization header references (localStorage token). Confirm auth strategy (SSO / cookies / token) before adding auth headers.

Where to look for examples
- React Query usage & provider: `src/components/providers/QueryProvider.tsx` and `src/hooks/useTaskServices.ts`.
- API implementations / response shapes: `src/services/taskServices.ts`.
- App layout and provider composition: `app/layout.tsx`.

Good-first edits AI can do safely
- Add missing type annotations to hooks and service functions using local `interface`/`types` (see `src/components/tasks/types` and `src/interface`).
- Improve error handling in services but keep existing return shapes (`PaginatedResponse`).
- Add small UI tests or Storybook stories (if requested) and reference existing component patterns.

When in doubt
- Prefer small, local changes. Follow existing query keys and response shapes precisely. Run `npm run dev` locally and test API interactions with `NEXT_PUBLIC_API_URL` mocked or pointed to staging.
- If changing fetch endpoints or response mapping, update all hooks that rely on those shapes (`useApiList`, `useMyTasks`, etc.).

If you add or modify lint, build, or start scripts, update `README.md` accordingly.

---
Please review these notes and tell me any missing specifics (auth approach, local env values, or preferred test runner) so I can iterate.
