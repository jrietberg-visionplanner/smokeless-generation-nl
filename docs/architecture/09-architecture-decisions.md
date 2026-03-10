# arc42 – Chapter 9: Architecture Decisions

**Smokeless Generation NL – Newsletter AI Assistant**
*Document version: 1.0 — March 10, 2026*

---

## ADR-001: Use Next.js for both client and server

**Status**: Accepted

**Context**: The application requires a rich client-side UI (tab navigation, inline editing, real-time status updates) and server-side processing (secrets protection, external API proxying). Separating these into a frontend SPA and a dedicated backend API would add deployment and maintenance overhead for a small team.

**Decision**: Use **Next.js 14 (App Router)** as the single application framework. Client components handle the UI; Next.js API routes handle all external integrations server-side.

**Consequences**:
- (+) One deployment unit; no cross-origin API calls.
- (+) Credentials never exposed to the browser (SE-02).
- (+) Built-in TypeScript support, image optimisation, and Vercel deployment.
- (–) The server and client are tightly coupled; large scale-out of the backend layer is constrained by the Next.js model.

---

## ADR-002: Client-side React state (no state management library)

**Status**: Accepted

**Context**: The application is used by a small editorial team in single-session workflows. All active state (feeds, selected items, drafts, publish queue) lives for the duration of one browser session.

**Decision**: Use React `useState` at the `HomePage` level, passing state down as props to tab components. No Redux, Zustand, or Context is introduced in v1.

**Consequences**:
- (+) Zero additional dependencies; simpler cognitive model.
- (+) No boilerplate for stores/reducers/selectors.
- (–) State is lost on page refresh (acceptable for v1 session-only workflow).
- (–) Prop drilling from `HomePage` to deep components; address with Context only if the component tree deepens significantly.

---

## ADR-003: AI provider behind a service module boundary

**Status**: Accepted

**Context**: The AI provider (e.g., OpenAI) may change as better or cheaper models become available. Prompt engineering iterations should not require UI changes.

**Decision**: All AI calls are encapsulated in `src/services/aiService.ts`. The module exposes `categoriseItems(items)` and `generateDraft(item)` functions. No UI component or API route imports the AI SDK directly.

**Consequences**:
- (+) Swapping the AI provider requires changes only in `aiService.ts` (SC-03).
- (+) Prompt templates remain server-side and can be externalised to env vars (FR-CFG-03).
- (–) Adds one layer of indirection; acceptable given the benefit.

---

## ADR-004: SQLite with Drizzle ORM as the persistence layer

**Status**: Accepted

**Context**: The editorial workflow spans multiple sessions (editors configure feeds once, accumulate items over time, and may return to review drafts on a later day). Session-only React state would be lost on every page refresh, forcing editors to re-enter feed configurations and re-run AI generation repeatedly. A persistence layer is required.

The application is an internal tool used by a small team (typically 1–2 editors at a time). A lightweight, file-based database with zero operational overhead is preferred over a full database server.

**Decision**: Use **SQLite** (via `better-sqlite3`) as the embedded database and **Drizzle ORM** for all database interactions. The schema is defined in TypeScript (`src/db/schema.ts`), providing compile-time type safety. All SQL operations go through typed Drizzle repository modules; raw SQL is prohibited in application code.

**Consequences**:
- (+) Zero-configuration; no separate server process; database is a single file on disk.
- (+) Type-safe schema and queries; Drizzle infers TypeScript types from the schema automatically.
- (+) Feed configurations, news items, selections, and drafts survive page refresh and browser close.
- (+) Audit trail: draft history and publish timestamps are persisted.
- (+) Swapping to a remote SQLite-compatible DB (e.g., Turso/libSQL) only requires changing the Drizzle driver, not the repository layer.
- (–) SQLite has a single-writer constraint; acceptable for a single-team editorial tool but unsuitable if multiple concurrent writers are needed.
- (–) File-based storage requires a persistent volume in Docker deployments (see Chapter 7).
- (–) Not directly compatible with Vercel serverless; Docker deployment is the recommended production target.

---

## ADR-005: All external API calls proxied through Next.js API routes

**Status**: Accepted

**Context**: The application must never expose credentials in the browser (SE-02). RSS feed URLs entered by users must be validated server-side to prevent SSRF (SE-03). Database access must also remain server-side to protect data integrity.

**Decision**: Every call to RSS providers, the AI service, the Joomla CMS, and the SQLite database is made from Next.js API routes (or Server Actions). The browser only calls `/api/*` endpoints on the same origin.

**Consequences**:
- (+) Credentials isolated on the server.
- (+) SSRF prevention can be implemented centrally in `rssService`.
- (+) A single TLS enforcement point.
- (–) Every browser interaction incurs a server round-trip; mitigated by the target response-time budgets (≤ 5 s, ≤ 10 s per NFR).

---

## ADR-006: Dutch-language UI as the default and only locale

**Status**: Accepted

**Context**: The application is used exclusively by the Dutch-speaking editorial team of Smokeless Generation NL. Internationalisation (i18n routing) adds complexity with no benefit for v1.

**Decision**: All UI strings are written directly in Dutch. No i18n library (e.g., `next-intl`) is introduced in v1.

**Consequences**:
- (+) No i18n overhead or translation file management.
- (–) Adding a second language in the future requires extracting all strings into a translation layer. This is acceptable for the current organisational scope.

---

## ADR-007: Tailwind CSS for styling

**Status**: Accepted

**Context**: The team needs consistent, accessible styles (focus states, colour contrast) without introducing a component library that might conflict with custom design requirements.

**Decision**: Use **Tailwind CSS** with `focus-visible:ring` utilities for focus states, semantic colour tokens for brand colours, and purging unused classes at build time.

**Consequences**:
- (+) Accessible focus rings and hover states are trivial to apply consistently (US-02, AC-03).
- (+) No runtime CSS-in-JS cost.
- (+) Well-supported in the Next.js ecosystem.
- (–) Long class strings in JSX can reduce readability; mitigated by 300-line component limit (MA-02) and component extraction.

---

## ADR-008: React Hook Form + Zod for all form management and validation

**Status**: Accepted

**Context**: The application contains multiple forms (add RSS feed, inline draft editing). Ad-hoc validation logic scattered across components is hard to test and maintain. A consistent, type-safe approach is needed that works for both client-side form UX and server-side input validation.

**Decision**: Use **React Hook Form** for all form state (registration, submission, error display) with Zod schemas via `@hookform/resolvers/zod`. The same Zod schema is used in the API route to validate the incoming request body. Dutch-language error messages are defined once in the schema.

**Consequences**:
- (+) Single source of truth for validation rules shared between client and server.
- (+) React Hook Form minimises re-renders during input compared to controlled `useState` forms.
- (+) Zod schemas integrate with Drizzle's `createInsertSchema` helper, eliminating duplication between DB schema and form validation.
- (+) Fully testable: Zod schemas can be unit-tested in isolation.
- (–) Adds `react-hook-form` and `@hookform/resolvers` as dependencies.

---

## ADR-009: Vitest as the test framework

**Status**: Accepted

**Context**: The project uses Next.js 14 with ESM modules and TypeScript. Jest requires additional configuration (Babel transform, ESM shims) to work well with this stack. A simpler, faster alternative is preferred.

**Decision**: Use **Vitest** as the sole unit/integration test runner. Vitest is ESM-native, shares Vite's transform pipeline, and supports `vi.mock()` for dependency injection. Tests targeting React components are run with `@testing-library/react` on top of Vitest.

**Consequences**:
- (+) Near-zero configuration with TypeScript and Next.js App Router.
- (+) `vi.mock()` is the idiomatic way to mock service modules and DB repositories.
- (+) In-memory or temporary-file SQLite databases can be used in Vitest integration tests without a separate test database server.
- (+) Significantly faster than Jest for large TypeScript codebases.
- (–) Some Jest-specific matchers or community plugins may not be available; Vitest equivalents exist for all common cases.
