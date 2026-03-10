# arc42 – Chapter 8: Cross-cutting Concepts

**Smokeless Generation NL – Newsletter AI Assistant**
*Document version: 1.0 — March 10, 2026*

---

## 8.1 Security

### 8.1.1 Secret Management
All credentials (AI API key, Joomla API key, endpoint URLs) are stored exclusively as server-side environment variables. They are loaded by `configService` at startup and accessed only within Next.js API routes / Server Actions. They are never passed to client components, never included in API responses, and never prefixed with `NEXT_PUBLIC_` (which would expose them to the browser bundle).

### 8.1.2 SSRF Prevention
Before any outbound HTTP request to an RSS feed URL, the server must:
1. Parse and validate the URL structure (must be `https://`).
2. Reject private IP ranges, `localhost`, and non-standard ports.
3. Reject URLs not matching the expected RSS/Atom content type in the response.

(SE-03)

### 8.1.3 XSS Prevention
All AI-generated content (title, intro, summary) is rendered using React's standard JSX rendering, which escapes HTML entities by default. Raw `innerHTML` assignments are strictly prohibited throughout the codebase. (SE-04)

### 8.1.4 TLS
All outbound HTTP calls from the server (to AI service, Joomla CMS, RSS feeds) must use `https://` URLs. The application must reject and log an error on startup if `JOOMLA_API_URL` or `AI_API_URL` uses `http://`. (SE-01)

### 8.1.5 GDPR / AVG Compliance
The application does not collect, store, or log user PII. Article content and feed data are treated as editorial material, not personal data. No analytics or tracking scripts are embedded. (SE-05)

---

## 8.2 Error Handling

A consistent error-handling strategy applies across all integration boundaries:

| Layer | Strategy |
|-------|----------|
| **RSS fetch** | Per-feed error state returned in API response; UI displays error indicator per feed; other feeds unaffected (RE-02) |
| **AI service** | Per-item or per-batch error state; UI shows degradation message and enables manual editing (RE-03) |
| **CMS publish** | Per-article error state with error reason string; draft content preserved; Retry action available (RE-04) |
| **Startup config** | `configService` validates all required env vars and throws a descriptive startup error if any are missing (US-CFG-04) |
| **Client-side** | React error boundaries should wrap each tab component to prevent a crash in one tab from destroying the entire application shell |

---

## 8.3 Data Persistence and State Management

### 8.3.1 Durable State (SQLite via Drizzle ORM)
All pipeline data is persisted to the SQLite database via Drizzle ORM repository modules. State survives page refresh and is available across sessions.

| Data | Table | Persisted via |
|------|-------|---------------|
| RSS feed configurations | `feeds` | `feedRepository` |
| Fetched news items | `news_items` | `itemRepository` |
| Editor selections | `selections` | `selectionRepository` |
| Article drafts (title, intro, summary, status) | `article_drafts` | `draftRepository` |

All database access is encapsulated in repository modules (`src/db/repositories/`). API routes call repositories; no Next.js component imports Drizzle or `better-sqlite3` directly.

### 8.3.2 Transient Client State (React)
The following state is managed purely in React (`useState`) and is intentionally **not** persisted to the database:

- Active tab (`activeTab`)
- Loading / spinner states per feed, per draft, per publish action
- Inline-edit focus and unsaved field buffer (while the user is typing)
- Form dirty state (React Hook Form)

**State preserved across tab switches** (FR-NAV-03): all durable pipeline data is loaded from SQLite on demand; switching tabs triggers a fetch/reload rather than relying on in-memory state.

---

## 8.4 Internationalisation (i18n)

| Aspect | Implementation |
|--------|---------------|
| UI language | All labels, tooltips, error messages, and placeholder text are written in **Dutch (nl-NL)** (IN-01) |
| HTML lang attribute | `<html lang="nl">` set in `layout.tsx` |
| Date/time formatting | All dates formatted using `Intl.DateTimeFormat` with `locale: 'nl-NL'` and `timeZone: 'Europe/Amsterdam'` (IN-02) |
| AI output language | All AI prompt templates instruct the model to produce Dutch-language output appropriate for a public-health newsletter (IN-03) |

---

## 8.5 Accessibility

The application targets **WCAG 2.1 Level AA** (AC-01). Implementation requirements:

| Requirement | Implementation |
|-------------|---------------|
| Keyboard navigation | All interactive controls (buttons, toggles, inputs, tabs) have proper focus management and are reachable via Tab key (US-04, AC-01) |
| Focus states | Tailwind `focus-visible:ring` classes provide visible focus indicators on all interactive elements (US-02) |
| ARIA attributes | Non-text icons have `aria-label`; status badges have appropriate `role` and `aria-live` regions for dynamic updates (AC-02) |
| Colour contrast | Minimum 4.5:1 for body text; 3:1 for large text and UI components (AC-03) |
| Screen reader compatibility | NVDA/JAWS on Windows and VoiceOver on macOS must be able to navigate and operate the full workflow (AC-04) |

---

## 8.6 Form Validation

All forms in the application use **React Hook Form** with a **Zod resolver** (`@hookform/resolvers/zod`). Zod schemas are the single source of truth for field types, constraints, and error messages.

| Concern | Implementation |
|---------|---------------|
| Feed URL validation | `feedSchema` (Zod) validates name (non-empty) and URL (HTTPS, valid format); reused in both the React Hook Form resolver (client) and the `/api/rss` route (server) |
| Required fields | Declared once in the Zod schema; React Hook Form surfaces the error automatically; no duplicate client-side validation logic |
| Server-side validation | Every API route parses its request body through the relevant Zod schema using `schema.parse()`; invalid payloads return `400 Bad Request` with field-level error details |
| Error messages | Zod message strings are written in Dutch to satisfy IN-01 |

---

## 8.7 Performance

| Concern | Approach |
|---------|----------|
| Initial page load (LCP ≤ 2 s) | Next.js automatic code splitting; only the active tab's JavaScript is in the initial bundle; Tailwind CSS purging removes unused styles (PF-01) |
| Tab switching (≤ 300 ms) | Tab content is conditionally rendered via React `state`; no network call on switch; pure React re-render (PF-02) |
| RSS refresh (≤ 5 s for 10 feeds) | Feed fetches parallelised server-side using `Promise.allSettled`; individual feed errors do not block others (PF-03) |
| AI categorisation (≤ 30 s / 200 items) | Items sent in a single batched prompt call where the AI provider supports it; fallback to chunked parallel calls (PF-04) |
| AI draft per article (≤ 10 s) | One API call per article; multiple drafts generated concurrently to improve perceived performance; per-draft loading spinner (PF-05) |
| Publish (≤ 5 s) | Single API call to Joomla per article; connection timeout set to 5 s; error surfaced immediately on timeout (PF-06) |

---

---

## 8.8 Testability

| Test Level | Scope | Tooling |
|-----------|-------|--------|
| Unit tests | Service modules (`rssService`, `aiService`, `cmsService`), Drizzle repository modules, Zod schema validation, utility functions | **Vitest** |
| Component tests | Tab components with mocked API responses; React Hook Form form state; approve/reject state transitions | **Vitest** + React Testing Library |
| Integration tests | API routes with mocked external HTTP calls and in-memory SQLite | **Vitest** + `msw` (Mock Service Worker) |
| Accessibility tests | WCAG 2.1 AA automated scan on rendered components | `vitest-axe` / `jest-axe` |
| End-to-end tests | Full editor workflow (select → draft → publish) against a local SQLite DB | Playwright |

All external API calls (`rssService`, `aiService`, `cmsService`) are injected as dependencies in API routes to allow `vi.mock()` substitution in Vitest tests. Database repositories are tested against an in-memory or temporary SQLite file to avoid polluting the production database.
