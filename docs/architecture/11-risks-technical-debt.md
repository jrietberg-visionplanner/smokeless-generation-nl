# arc42 – Chapter 11: Risks and Technical Debt

**Smokeless Generation NL – Newsletter AI Assistant**
*Document version: 1.0 — March 10, 2026*

---

## 11.1 Identified Risks

| ID | Risk | Likelihood | Impact | Mitigation |
|----|------|-----------|--------|-----------|
| R-01 | **AI service latency / unavailability** causes draft generation to time out or fail, blocking the editorial workflow. | Medium | High | Graceful degradation with manual editing mode (RE-03); per-item error state with retry; configurable timeout in `aiService`. |
| R-02 | **Joomla CMS API breaking change** (API version upgrade or authentication change) causes publish failures. | Low | High | CMS integration isolated in `cmsService`; integration tests with mocked API detect contract drift early; version pinning in documentation. |
| R-03 | **RSS feed URL SSRF** — a malicious or misconfigured URL reaches an internal network resource. | Low | Critical | Server-side URL validation in `rssService` via Zod (SE-03); strict allowlist of `https://` scheme; block private IP ranges and localhost. |
| R-04 | **SQLite file loss** — the Docker volume containing `app.db` is accidentally deleted, destroying all feed configurations, drafts, and history. | Low | High | Nightly backup of the Docker volume to off-site storage; document backup procedure in the deployment runbook. |
| R-05 | **SQLite concurrent-write contention** — simultaneous requests from multiple editors block or corrupt database writes (SQLite single-writer constraint). | Low | Medium | Acceptable for a 1–2 editor team; `better-sqlite3` serialises writes within a single process; revisit if team size grows. |
| R-06 | **AI-generated content quality** does not meet editorial standards, requiring heavy manual editing that negates time savings. | Medium | Medium | Prompt templates externalised and tunable without deployment (FR-CFG-03); regenerate action per article (FR-DFT-05). |
| R-07 | **Credentials accidentally committed** to version control via `.env` file. | Low | Critical | `.env` and `.env.local` in `.gitignore`; only `.env.example` (with placeholder values) committed; documented in README. |
| R-08 | **Component scope creep** — tab components grow beyond 300 lines, reducing maintainability. | Medium | Low | MA-02 enforced via ESLint `max-lines` rule; PR review checklist includes component size check. |
| R-09 | **Joomla authentication token expiry** causes publish failures mid-session. | Medium | Medium | `cmsService` detects 401 response, surfaces clear error to editor, and prompts for re-configuration via env-var update. |
| R-10 | **Dependency vulnerability** (HIGH/CRITICAL npm audit finding) not addressed within SLA. | Low | High | Automated `npm audit` in CI pipeline; alert on HIGH/CRITICAL; fix within 5 business days (SE-06). |
| R-11 | **`better-sqlite3` native module build failure** — missing Python/build tools in the runtime image causes container startup failure. | Low | Medium | Add `apk add python3 make g++` to the Dockerfile before `npm ci`; validate in CI build step (see Chapter 7). |
| R-12 | **Drizzle migration failure on deployment** — a failed migration leaves the schema in a partial state, causing startup errors. | Low | High | Run `drizzle-kit migrate` as a pre-start step; back up `app.db` before each migration; test migrations in CI. |

---

## 11.2 Technical Debt

| ID | Debt Item | Category | Proposed Resolution | Priority |
|----|----------|---------|---------------------|----------|
| TD-01 | **Service modules not yet implemented**: `rssService`, `aiService`, `cmsService`, `configService`, and all Drizzle repository modules are specified in the architecture but not yet created. | Build backlog | Implement as first-class backlog items parallel to UI feature stories; start with the DB schema and repository modules as prerequisites for all other services. | High |
| TD-02 | **No automated test suite**: Vitest unit, component, and integration tests are not yet in place. | Quality | Add Vitest with React Testing Library; target ≥ 80 % coverage of service modules, repository modules, and Zod schemas; use `vi.mock()` for dependency injection and in-memory SQLite for repository tests. | High |
| TD-03 | **Drizzle migrations not initialised**: the `drizzle/` migrations folder and `drizzle.config.ts` are not yet created. | Build backlog | Run `drizzle-kit generate` once the initial schema is defined; wire `drizzle-kit migrate` into the Docker startup sequence. | High |
| TD-04 | **No ESLint `max-lines` rule** currently enforcing the 300-line component limit (MA-02). | Tooling | Add `max-lines` rule to `.eslintrc` with `max: 300`. | Low |
| TD-05 | **No accessibility audit** has been performed on the current scaffolding. | Quality | Integrate `vitest-axe` into component tests; run Lighthouse accessibility audit before first production deploy. | Medium |
| TD-06 | **Prop drilling from `HomePage`**: as pipeline state grows, passing props through multiple levels will become brittle. | Architecture | With SQLite persistence, `HomePage` no longer needs to hold all pipeline state; load data from API routes per tab; use React Context or SWR for shared transient UI state only. | Medium |
| TD-07 | **Dutch strings hardcoded**: no i18n abstraction. | Maintainability | Acceptable for v1; extract to a `translations/nl.ts` module if a second locale is ever required. | Low |
| TD-08 | **No health-check endpoint** for Docker deployment monitoring. | Operations | Add `/api/health` returning `{ status: 'ok', db: 'connected', version }` — including a Drizzle DB connectivity check. | Low |
| TD-09 | **SQLite backup procedure not automated**: data loss risk if Docker volume is not backed up externally (see R-04). | Operations | Implement a nightly volume backup script and document the restore procedure in the deployment runbook. | Medium |
