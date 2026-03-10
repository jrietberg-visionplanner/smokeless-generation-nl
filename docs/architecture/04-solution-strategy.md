# arc42 – Chapter 4: Solution Strategy

**Smokeless Generation NL – Newsletter AI Assistant**
*Document version: 1.0 — March 10, 2026*

---

## 4.1 Technology Decisions

| Decision | Choice | Rationale |
|---------|--------|-----------|
| **Web framework** | Next.js 14 (App Router) | Provides both server-side execution (protecting secrets, proxying external APIs) and a first-class React client model within a single deployment unit. Meets CO-02 (Node.js ≥ 18 LTS) and TC-06 (credentials server-side only). |
| **UI library** | React 18 | Component model fits the tab-based, stateful single-page workflow perfectly. `useState` is sufficient for v1 session state without introducing a state-management library. |
| **Language** | TypeScript (strict) | MA-01 — mandatory quality gate; reduces class of runtime errors in a team that may grow over time. |
| **Styling** | Tailwind CSS | Utility-first approach keeps component files readable; no separate CSS files to maintain; good accessibility support for focus-visible states (US-02, AC-01). |
| **Icons** | Lucide React | Lightweight, tree-shakeable, semantically labelled icons improve accessibility (AC-02). |
| **External API calls** | Next.js API Routes (or Server Actions) | Ensures credentials never leave the server (SE-02); allows input validation before passing to external services (SE-03, SE-04). |

---

## 4.2 Architectural Patterns

### Pattern 1 – Client/Server Split for Security
All calls to the AI service, Joomla CMS, and RSS feeds are proxied through Next.js server-side handlers. The browser has no direct knowledge of external endpoints or credentials. This directly addresses SE-01, SE-02, SE-03.

### Pattern 2 – 2-Tier Architecture: SQLite + Next.js
The application is a single deployment unit with two tiers: a SQLite embedded database (Tier 1) accessed via Drizzle ORM, and the Next.js application (Tier 2) acting as both frontend and backend. Durable application data — RSS feed configurations, fetched news items, user selections, and article drafts — is persisted to SQLite. Transient UI state (active tab, loading spinners, inline edit focus) stays in React component state. This design eliminates data loss on page refresh (RE-05) and retains the simplicity of a self-contained deployment.

### Pattern 3 – Single-Page Application with Hybrid State
The entire application is rendered as a single Next.js page. Tab content is conditionally rendered based on a React `useState` value (`activeTab`). UI-only state lives in React; all pipeline data is loaded from and saved to SQLite via API routes. This satisfies FR-NAV-03 (state preserved across tab switches) because data survives both tab navigation and page refresh.

### Pattern 4 – Service Module Abstraction for AI Provider
The AI provider (categorisation, draft generation) is accessed exclusively through a server-side service module (e.g., `src/services/aiService.ts`). UI components call API routes; API routes call the service module. Swapping the AI provider requires only changes to this module (SC-03).

### Pattern 5 – Fail-Gracefully, Not Fail-Silent
Each external integration (RSS, AI, CMS) must surface errors independently without crashing the rest of the UI. Client-side error state per feed / per draft / per publish item implements RE-02, RE-03, RE-04.

---

## 4.3 Quality Goal Achievement

| Quality Goal | Architectural Response |
|-------------|----------------------|
| **Security** | Credentials in env vars, server-side only; HTTPS enforced; RSS URL validation; React-safe rendering (no raw `innerHTML`) |
| **Reliability** | Isolated error state per integration; durable state in SQLite survives page refresh; retry mechanisms for publish failures |
| **Usability** | Tab navigation with persistent state; keyboard-navigable controls (Tailwind focus-visible); WCAG 2.1 AA target; Dutch UI |
| **Maintainability** | Strict TypeScript; 300-line component limit; single-responsibility component design; AI provider behind a service module |
| **Performance** | Client-side tab rendering ≤ 300 ms (pure React re-render, no network); per-item AI generation to avoid one slow call blocking the UI |
