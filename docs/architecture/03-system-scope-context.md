# arc42 – Chapter 3: System Scope and Context

**Smokeless Generation NL – Newsletter AI Assistant**
*Document version: 1.0 — March 10, 2026*

---

## 3.1 Business Context

The diagram below describes the system's external partners and the nature of data exchanged.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        System Boundary                                        │
│                                                                              │
│              Newsletter AI Assistant (Next.js application)                   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
         ▲                     ▲                     ▲                  ▲
         │ Tab interactions    │ Env-var config       │                  │
         │                     │ (startup only)       │                  │
    ┌────┴────┐          ┌──────┴──────┐    ┌─────────┴──────┐  ┌──────┴──────┐
    │ Editor  │          │  .env file  │    │   AI Service   │  │ Joomla CMS  │
    │ (user)  │          │  (server)   │    │  (e.g. OpenAI) │  │  REST API   │
    └─────────┘          └─────────────┘    └────────────────┘  └─────────────┘
                                                      ▲                  ▲
                                             HTTPS    │         HTTPS    │
                                                      │                  │
                                              ┌───────┴───────┐  ┌──────┴───────┐
                                              │  RSS Feed     │  │  Joomla 4.x  │
                                              │  Providers    │  │  (CMS)       │
                                              │ (Google Alert │  └──────────────┘
                                              │  & others)    │
                                              └───────────────┘
```

| External Actor | Communication Direction | Data Exchanged |
|---------------|------------------------|----------------|
| **Editor** | Browser → Application | Tab interactions, form inputs, approve/reject/publish actions |
| **RSS Feed Providers** | Application → Provider (HTTPS GET) | Feed URLs; response: RSS/Atom XML with news items |
| **AI Service** (e.g., OpenAI) | Application → AI API (HTTPS POST) | Prompt + news item text; response: category label or article draft (title, intro, summary) in Dutch |
| **Joomla CMS** | Application → Joomla REST API (HTTPS) | Article payload (title, body); response: success confirmation or error with HTTP status |
| **.env / environment** | Server process environment | `JOOMLA_API_URL`, `JOOMLA_API_KEY`, `AI_API_KEY`, `AI_MODEL`, `AI_API_URL`, prompt template variables |

---

## 3.2 Technical Context

All calls to external services are made from **server-side code** (Next.js API routes or Server Actions). The browser (client) only communicates with the Next.js server; it never holds credentials or calls external APIs directly.

```
Browser (React client)
    │  fetch / Server Action calls
    ▼
Next.js Server (Node.js process)
    ├──▶  /api/rss          →  RSS feed providers (HTTPS)
    ├──▶  /api/ai/categorise →  AI Service (HTTPS)
    ├──▶  /api/ai/draft      →  AI Service (HTTPS)
    └──▶  /api/cms/publish   →  Joomla CMS REST API (HTTPS)
```

### Interface summary

| Server Endpoint | Protocol | Authentication | Notes |
|----------------|----------|---------------|-------|
| RSS feed fetch proxy | HTTPS GET | None (public feeds) | URL validated server-side against allowlist / format rules (SSRF prevention) |
| AI categorisation | HTTPS POST (JSON) | Bearer token from `AI_API_KEY` | Prompt template loaded from env/config; response parsed and returned to client |
| AI draft generation | HTTPS POST (JSON) | Bearer token from `AI_API_KEY` | Dutch-language prompt; model configured via `AI_MODEL` |
| Joomla CMS publish | HTTPS POST (JSON) | Token from `JOOMLA_API_KEY` | Joomla 4.x REST API `/api/index.php/v1/content/articles` |
