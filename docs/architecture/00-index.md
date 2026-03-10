# arc42 Architecture Documentation
**Smokeless Generation NL – Newsletter AI Assistant**
*Document version: 1.0 — March 10, 2026*

---

> arc42 is a template for documenting software and system architectures.
> See [arc42.org](https://arc42.org) for details.

---

## Table of Contents

| Chapter | Title | Description |
|---------|-------|-------------|
| [01](01-introduction-goals.md) | **Introduction and Goals** | Requirements overview, top quality goals, and stakeholders |
| [02](02-constraints.md) | **Architecture Constraints** | Technical, organisational, and convention constraints |
| [03](03-system-scope-context.md) | **System Scope and Context** | External actors, data flows, and technical interface summary |
| [04](04-solution-strategy.md) | **Solution Strategy** | Technology choices and architectural patterns |
| [05](05-building-block-view.md) | **Building Block View** | Component hierarchy, server modules, API routes |
| [06](06-runtime-view.md) | **Runtime View** | Key runtime scenarios including happy paths and failure cases |
| [07](07-deployment-view.md) | **Deployment View** | Vercel and Docker deployment diagrams; environment config |
| [08](08-crosscutting-concepts.md) | **Cross-cutting Concepts** | Security, error handling, state management, i18n, accessibility, performance, testability |
| [09](09-architecture-decisions.md) | **Architecture Decisions** | ADRs for all major architectural choices |
| [10](10-quality-requirements.md) | **Quality Requirements** | Quality tree and measurable quality scenarios |
| [11](11-risks-technical-debt.md) | **Risks and Technical Debt** | Identified risks with mitigations; current technical debt backlog |
| [12](12-glossary.md) | **Glossary** | Definitions of domain and technical terms |

---

## System at a Glance

This is a **2-tier application** contained in a single Next.js deployment:

- **Tier 1 – SQLite database**: persists RSS feed configurations, news items, user selections, and generated article drafts.
- **Tier 2 – Next.js application**: serves as both the frontend (React SPA) and backend (API routes / Server Actions) for the entire content pipeline.

```
Editor (browser)
    │  Tab interactions
    ▼
┌──────────────────────────────────────────────────────────┐
│         Newsletter AI Assistant  (Next.js 14)            │
│                                                          │
│  React Client  (tab UI, React Hook Form, Zod)            │
│       ↕  fetch / Server Actions                          │
│  Next.js API Routes  /api/rss  /api/ai  /api/cms  /api/db│
│       ↕  Drizzle ORM                                     │
│  SQLite database  (feeds · items · selections · drafts)  │
└──────────┬─────────────────┬────────────────┬────────────┘
           │                 │                │
      RSS Feeds          AI Service      Joomla CMS
   (HTTPS GET)         (HTTPS POST)    (HTTPS POST)
```

**Stack**: Next.js 14 · React 18 · TypeScript (strict) · Tailwind CSS · SQLite · Drizzle ORM · React Hook Form · Zod · Vitest · Node.js ≥ 18 LTS
**Deployment**: Self-hosted Docker (primary) or Vercel (see §7 for SQLite constraints on Vercel)
**Language**: Dutch (nl-NL)
**External integrations**: RSS/Atom feeds · AI provider (e.g., OpenAI) · Joomla 4.x CMS REST API
