# arc42 – Chapter 12: Glossary

**Smokeless Generation NL – Newsletter AI Assistant**
*Document version: 1.0 — March 10, 2026*

---

| Term | Definition |
|------|-----------|
| **AI Service** | The external large-language-model API used for news categorisation and Dutch article draft generation (e.g., OpenAI GPT-4o). Accessed exclusively from server-side code via `aiService`. |
| **API Route** | A Next.js server-side HTTP handler located in `src/app/api/`. Processes requests from the React client and calls external services. Credentials are available only in this context. |
| **App Router** | The Next.js 14 routing paradigm based on a file-system convention under `src/app/`. Supports Server Components, Client Components, and API routes in a unified structure. |
| **Article Draft** | An AI-generated tuple of `{ title, intro, summary }` for a selected news item, written in Dutch and subject to inline editing and approval by the editor before publishing. |
| **Auto-publish** | A publish mode where all approved drafts in the publish queue are sent to the Joomla CMS sequentially in one triggered action (FR-PUB-03). |
| **AVG** | *Algemene Verordening Gegevensbescherming* — the Dutch implementation of the EU General Data Protection Regulation (GDPR). Governs the processing of personal data. |
| **`better-sqlite3`** | The Node.js native add-on that provides synchronous SQLite access for the Next.js server process. Requires native build tools (`python3`, `make`, `g++`) to be present in the Docker image. |
| **Categorisation** | The AI step that assigns a topic label (e.g., Smoking, E-cigarettes, Vaping, Tobacco Policy, Youth Health) to each news item to assist editorial filtering. |
| **CMS** | Content Management System. In this project, the target CMS is **Joomla 4.x**. |
| **Client Component** | A Next.js / React component marked with `'use client'` that renders and executes in the browser. Cannot access server-side secrets. |
| **configService** | A planned server-side module (`src/services/configService.ts`) that validates required environment variables at startup and exposes a typed configuration object. |
| **cmsService** | A planned server-side module (`src/services/cmsService.ts`) that encapsulates all communication with the Joomla 4.x REST API. |
| **Draft** | See *Article Draft*. |
| **Drizzle ORM** | A TypeScript-first ORM used for all SQLite database access. The schema is defined in `src/db/schema.ts`; interactions are performed through repository modules (`feedRepository`, `itemRepository`, `selectionRepository`, `draftRepository`). |
| **Editor** | The primary user of the application — a newsletter editor at Smokeless Generation NL responsible for selecting, reviewing, and approving content for the *Opgelucht* newsletter. |
| **Feed** | An RSS or Atom URL that provides a stream of news items on a relevant topic (typically a Google Alert). Configured in the RSS Feeds tab. |
| **GDPR** | General Data Protection Regulation — EU regulation on data privacy. Implemented in the Netherlands as AVG. |
| **Google Alerts** | A Google service that generates RSS feeds for keyword-based news monitoring, used as the primary news source for this application. |
| **Joomla 4.x** | The target Content Management System. Articles are published via its REST API at `/api/index.php/v1/content/articles`. |
| **LCP** | Largest Contentful Paint — a Core Web Vitals metric measuring the time until the largest visible content element is rendered. Target: ≤ 2 seconds (PF-01). |
| **Manual publish** | A publish mode where the editor triggers each article's CMS publish action individually (FR-PUB-02). |
| **nl-NL** | Dutch locale identifier (language: Dutch, country: Netherlands). Used for UI language, date formatting, and AI output language. |
| **Onboarding** | The process by which a new editor learns to use the application. Target: full workflow completion without external help within 30 minutes (US-01). |
| **Opgelucht** | The name of the newsletter published by Smokeless Generation NL. Circulation: 50,000. |
| **Pipeline** | The four-stage automated + editorial workflow: RSS Feed Collection → News Selection → Article Drafting → CMS Publishing. |
| **Prompt template** | A configurable text template passed to the AI service to instruct it on how to categorise news items or generate article drafts. Stored server-side, configurable via environment variables (FR-CFG-03). |
| **Publish queue** | The list of approved drafts awaiting publication to the Joomla CMS (FR-PUB-01). |
| **React** | The JavaScript library used for building the client-side user interface. Version 18 is used. |
| **React Hook Form** | The library used for all form state management in the React client. Minimises re-renders and integrates with Zod via `@hookform/resolvers/zod` for schema-driven validation. |
| **Repository module** | A server-side TypeScript module (e.g., `feedRepository.ts`) that encapsulates all CRUD operations for a single database entity. The only permitted layer for raw Drizzle ORM calls. |
| **RSS** | Really Simple Syndication — an XML-based feed format for distributing regularly updated content. Also encompasses Atom feeds. |
| **rssService** | A planned server-side module (`src/services/rssService.ts`) that validates feed URLs, fetches RSS/Atom content, and parses it into typed news items. |
| **Server Action** | A Next.js feature allowing async server-side functions to be called directly from client components, without a separate API route. An alternative to API routes for some integration patterns. |
| **Server Component** | A Next.js React component that renders on the server. Can access environment variables and perform database/API calls but cannot use client-side hooks or event handlers. |
| **Session** | A single browser session — the period from when an editor opens the application to when they close or refresh the browser tab. Transient UI state (e.g., active tab) is scoped to the session; persistent data (feeds, selections, drafts) survives session end via the SQLite database. |
| **Smokeless Generation NL** | The Dutch public-health organisation that operates this application to produce the *Opgelucht* newsletter. |
| **SQLite** | An embedded file-based relational database. Tier 1 of the 2-tier architecture; stores `feeds`, `news_items`, `selections`, and `article_drafts` in a single file (`app.db`). Accessed exclusively through Drizzle ORM. |
| **SSRF** | Server-Side Request Forgery — a security vulnerability where an attacker causes the server to make HTTP requests to unintended internal or external targets. Mitigated by validating RSS feed URLs server-side (SE-03). |
| **Tab** | One of the five workflow views in the application: RSS Feeds, Selection, Draft, Publish, Workflow. Rendered client-side based on `activeTab` state. |
| **TLS** | Transport Layer Security — the cryptographic protocol used to secure HTTPS connections. All external communications must use TLS 1.2 or higher (SE-01). |
| **TypeScript** | A typed superset of JavaScript. Used throughout the codebase with `strict: true` (MA-01). |
| **Vitest** | The ESM-native unit and integration test runner used throughout the project. Provides `vi.mock()` for dependency injection; repository tests use in-memory SQLite to avoid touching the production database. |
| **WCAG 2.1 AA** | Web Content Accessibility Guidelines version 2.1, Level AA — the international standard for web accessibility targeted by this application (AC-01). |
| **XSS** | Cross-Site Scripting — a security vulnerability where malicious scripts are injected into web pages. Prevented by using React's built-in JSX HTML escaping (SE-04). |
| **Zod** | A TypeScript-first runtime schema validation library. Used on the server (API route input validation) and on the client (React Hook Form validation via `@hookform/resolvers/zod`). Zod schemas are co-located with the Drizzle schema file and serve as the single source of truth for data shapes. Dutch error messages are configured per schema. |
