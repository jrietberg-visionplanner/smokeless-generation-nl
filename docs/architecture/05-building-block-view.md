# arc42 – Chapter 5: Building Block View

**Smokeless Generation NL – Newsletter AI Assistant**
*Document version: 1.0 — March 10, 2026*

---

## 5.1 Level 1 – Overall System

```
┌─────────────────────────────────────────────────────────────────┐
│                   Newsletter AI Assistant                        │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Client Layer (Browser)                  │  │
│  │  ┌──────────┐  ┌──────────────┐  ┌──────────────────────┐ │  │
│  │  │  Header  │  │   TabNav     │  │   Tab Components     │ │  │
│  │  └──────────┘  └──────────────┘  │  (RSS, Selection,    │ │  │
│  │                                  │   Draft, Publish,    │ │  │
│  │                                  │   Workflow)          │ │  │
│  │                                  └──────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   Server Layer (Next.js)                   │  │
│  │  ┌──────────────┐ ┌──────────────┐ ┌───────────────────┐  │  │
│  │  │  RSS API     │ │  AI API      │ │  CMS API          │  │  │
│  │  │  Route       │ │  Routes      │ │  Route            │  │  │
│  │  │  /api/rss    │ │  /api/ai/*   │ │  /api/cms/publish │  │  │
│  │  └──────┬───────┘ └──────┬───────┘ └────────┬──────────┘  │  │
│  │         │                │                   │             │  │
│  │  ┌──────┴───────┐ ┌──────┴───────┐ ┌────────┴──────────┐  │  │
│  │  │  RSS Service │ │  AI Service  │ │  CMS Service      │  │  │
│  │  └──────────────┘ └──────────────┘ └───────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
         │                     │                     │
    RSS Feed providers     AI Service           Joomla CMS 4.x
```

| Building Block | Responsibility |
|---------------|---------------|
| **Client Layer** | Renders the single-page UI; manages all in-session application state; calls Server Layer via fetch/Server Actions |
| **Server Layer** | Proxies external API calls; protects secrets; validates inputs; translates between client and external API contracts |
| **RSS Service** | Fetches and parses RSS/Atom feeds from configured URLs |
| **AI Service** | Calls AI provider for categorisation and article draft generation; applies prompt templates |
| **CMS Service** | Calls Joomla 4.x REST API to publish approved articles |

---

## 5.2 Level 2 – Client Layer

### 5.2.1 Component Hierarchy

```
HomePage (page.tsx)  — holds activeTab state, top-level pipeline state
│
├── Header             — product name, branding, publication info
├── TabNav             — renders five tab buttons; emits onChange(tab)
│
└── [active tab content — only one rendered at a time]
    ├── RssFeedsTab    — FR-RSS-01 – FR-RSS-08
    ├── SelectionTab   — FR-SEL-01 – FR-SEL-08
    ├── DraftTab       — FR-DFT-01 – FR-DFT-08
    ├── PublishTab     — FR-PUB-01 – FR-PUB-07
    └── WorkflowTab    — FR-WRK-01 – FR-WRK-04
```

### 5.2.2 Component Descriptions

| Component | Location | Responsibility | Key State |
|---------|----------|---------------|-----------|
| `HomePage` | `src/app/page.tsx` | Root shell; owns active tab; holds pipeline state passed as props | `activeTab`, RSS feeds, selected items, drafts, publish queue |
| `Header` | `src/components/Header.tsx` | Persistent branding header (product name, publication info) | None (stateless) |
| `TabNav` | `src/components/TabNav.tsx` | Renders 5 navigation tab buttons; highlights active tab | Controlled via props (`active`, `onChange`) |
| `RssFeedsTab` | `src/components/tabs/RssFeedsTab.tsx` | Feed list CRUD; add/toggle/delete; refresh; summary; error indicators | Feed list, add-form state, loading/error per feed |
| `SelectionTab` | `src/components/tabs/SelectionTab.tsx` | News item list; AI category badges; select/deselect; category filter; selection counter; proceed action | News items, selected IDs, active category filter |
| `DraftTab` | `src/components/tabs/DraftTab.tsx` | Draft cards; inline editing (title, intro, summary); approve/reject; regenerate; dirty indicators | Draft list (title, intro, summary, status, dirty flag) |
| `PublishTab` | `src/components/tabs/PublishTab.tsx` | Publish queue; per-article status badges; manual publish; auto-publish; retry; remove from queue | Publish queue with per-article status |
| `WorkflowTab` | `src/components/tabs/WorkflowTab.tsx` | Read-only pipeline overview; aggregates stats from other tabs; click-to-navigate | Derived from pipeline state (no own state) |

---

## 5.3 Level 2 – Server Layer

### 5.3.1 API Routes

| Route | Method | Description | External call |
|-------|--------|-------------|--------------|
| `/api/rss/refresh` | POST | Fetches all active feeds; returns parsed items with source, title, date, excerpt | RSS feed URLs (HTTPS GET) |
| `/api/ai/categorise` | POST | Categorises a batch of news items using the AI service | AI Service (HTTPS POST) |
| `/api/ai/draft` | POST | Generates a Dutch article draft (title, intro, summary) for a single news item | AI Service (HTTPS POST) |
| `/api/cms/publish` | POST | Publishes a single article to Joomla CMS | Joomla REST API (HTTPS POST) |

### 5.3.2 Service Modules

| Module | Location (planned) | Responsibility |
|--------|-------------------|---------------|
| `rssService` | `src/services/rssService.ts` | Validates feed URL (Zod), performs HTTP GET, parses RSS/Atom XML, persists items via `itemRepository` |
| `aiService` | `src/services/aiService.ts` | Loads prompt templates from env/config; constructs API request; calls AI provider; parses and returns typed response |
| `cmsService` | `src/services/cmsService.ts` | Builds Joomla-compatible article payload; calls Joomla REST API with auth token from env |
| `configService` | `src/services/configService.ts` | Validates required environment variables at startup using Zod; exposes typed config object to all services |

### 5.3.3 Database Layer (Drizzle ORM)

| Module | Location (planned) | Responsibility |
|--------|-------------------|---------------|
| `db/schema.ts` | `src/db/schema.ts` | Drizzle schema definitions for all tables; exports inferred TypeScript types and Zod schemas |
| `db/index.ts` | `src/db/index.ts` | Initialises the `better-sqlite3` connection; exports the Drizzle `db` instance |
| `feedRepository` | `src/db/repositories/feedRepository.ts` | CRUD for RSS feed configurations (`feeds` table) |
| `itemRepository` | `src/db/repositories/itemRepository.ts` | Insert and query news items (`news_items` table) |
| `selectionRepository` | `src/db/repositories/selectionRepository.ts` | Persist and retrieve editor item selections (`selections` table) |
| `draftRepository` | `src/db/repositories/draftRepository.ts` | CRUD for article drafts including title, intro, summary, approval status (`article_drafts` table) |

### 5.3.4 SQLite Schema (Tier 1)

| Table | Key Columns | Description |
|-------|------------|-------------|
| `feeds` | `id`, `name`, `url`, `active`, `items_today`, `error` | Persists RSS feed configurations |
| `news_items` | `id`, `feed_id`, `title`, `source`, `published_at`, `excerpt`, `category`, `fetched_at` | Stores aggregated news items from active feeds |
| `selections` | `id`, `item_id`, `selected_at` | Records editor-selected item IDs for the current newsletter run |
| `article_drafts` | `id`, `item_id`, `title`, `intro`, `summary`, `status`, `publish_status`, `published_at`, `error` | Persists AI-generated drafts and their editorial state |
