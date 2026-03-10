# arc42 – Chapter 2: Architecture Constraints

**Smokeless Generation NL – Newsletter AI Assistant**
*Document version: 1.0 — March 10, 2026*

---

## 2.1 Technical Constraints

| ID | Constraint | Rationale |
|----|-----------|-----------|
| TC-01 | The application **must** be built with **Next.js 14** (App Router) and **React 18**. | The chosen framework provides both server-side rendering / API routes (to protect secrets) and a rich client-side component model. |
| TC-02 | The codebase **must** use **TypeScript** with `strict: true` enabled in `tsconfig.json`. | MA-01 — type safety is a non-negotiable quality constraint. |
| TC-03 | Styling **must** use **Tailwind CSS**. | Approved toolchain; consistent utility-first styling without custom CSS sprawl. |
| TC-04 | The runtime **must** be **Node.js ≥ 18 LTS**. | CO-02 — aligns with Next.js 14 server requirements and long-term support guarantees. |
| TC-05 | All communication with external services (RSS, AI API, Joomla) **must** use **HTTPS/TLS 1.2+**. | SE-01 — data in transit must be encrypted. |
| TC-06 | API keys and CMS credentials **must never** appear in client-side JavaScript bundles or browser network responses. | SE-02 — credentials exposed to the browser constitute a critical security breach. |
| TC-07 | The Joomla integration **must** be compatible with **Joomla 4.x REST API**. | CO-03 — the target CMS is fixed by the organisation. |
| TC-08 | Dependencies with known **HIGH/CRITICAL npm audit** vulnerabilities must be resolved within **5 business days** of disclosure. | SE-06 — proactive dependency hygiene. |
| TC-09 | The project must pass **ESLint** (Next.js recommended ruleset) with zero errors before each production build. | MA-05 — automated quality gate. |
| TC-10 | The persistence layer **must** use **SQLite** as the embedded database. | Lightweight, zero-configuration, file-based database that requires no separate server process; ideal for a single-team internal tool. |
| TC-11 | All database interactions **must** go through **Drizzle ORM** with TypeScript schema definitions. | Provides compile-time type safety for all SQL operations; reduces runtime errors from schema drift (MA-01). |
| TC-12 | Form state and validation in the frontend **must** use **React Hook Form**. | Simplifies form handling; reduces re-renders; integrates cleanly with Zod schema validation. |
| TC-13 | Data validation on both frontend and backend **must** use **Zod schemas**. | Ensures runtime data integrity at system boundaries; integrates with React Hook Form and Drizzle; single source of truth for data shapes. |
| TC-14 | Unit and integration tests **must** use **Vitest**. | Fast, ESM-native test runner that integrates well with the Next.js / TypeScript toolchain. |

---

## 2.2 Organisational Constraints

| ID | Constraint | Rationale |
|----|-----------|-----------|
| OC-01 | The application interface language is **Dutch (nl-NL)**. All UI labels, tooltips, and error messages must be in Dutch. | IN-01 — the editorial team operates in Dutch. |
| OC-02 | Dates and times must be displayed in the **Europe/Amsterdam** time zone. | IN-02 — the organisation is based in the Netherlands. |
| OC-03 | AI-generated article drafts must default to **Dutch** and use language appropriate for a public-health newsletter audience. | IN-03 — editorial quality requirement. |
| OC-04 | The application **must not** log or persist **personally identifiable information (PII)** unless legally required under the **AVG/GDPR**. | SE-05 — legal compliance. |
| OC-05 | All environment-specific configuration (API endpoints, keys, feature flags) **must** be managed exclusively via `.env` files; hardcoding is prohibited. | MA-04. |
| OC-06 | A new developer must be able to run the application locally within **15 minutes** following the `README.md`. | MA-03 — developer onboarding standard. |

---

## 2.3 Conventions

| ID | Convention |
|----|-----------|
| CV-01 | No single component file may exceed **300 lines** of code (MA-02). |
| CV-02 | Each component must follow the **single-responsibility principle** (MA-02). |
| CV-03 | AI provider logic must be encapsulated in a dedicated **service module**; UI components must not call AI APIs directly (SC-03). |
| CV-04 | Joomla CMS API calls must be made exclusively from **server-side code** (Next.js API routes or Server Actions). |
| CV-05 | All RSS feed fetching must be proxied through the **server side** to prevent SSRF exposure on the client (SE-03). || CV-06 | All database read/write operations must go through **Drizzle ORM repository modules**; raw SQL is prohibited except in migration files. |
| CV-07 | Every form in the application must use **React Hook Form** with a corresponding **Zod schema** for validation; inline ad-hoc validation logic is prohibited. |
| CV-08 | Zod schemas that define database entity shapes must be co-located with the **Drizzle schema** file so that the same schema can be reused for API validation and client-side form validation. |