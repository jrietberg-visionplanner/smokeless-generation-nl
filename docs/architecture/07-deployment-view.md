# arc42 – Chapter 7: Deployment View

**Smokeless Generation NL – Newsletter AI Assistant**
*Document version: 1.0 — March 10, 2026*

---

## 7.1 Infrastructure Overview

The application is a **2-tier single Next.js deployment**: the SQLite database file is co-located on the same server as the Next.js process, accessed via the `better-sqlite3` driver.

| Target | Description | Suitable For |
|--------|-------------|-------------|
| **Self-hosted Docker** | `node:18-alpine` base image; SQLite file stored in a persistent volume | Production (primary) |
| **Vercel** | Managed PaaS; zero-config Next.js — **note**: SQLite requires a persistent volume not available on Vercel's serverless infrastructure; only suitable with Vercel's `@vercel/blob` or an alternative like Turso (libSQL) | Staging / prototyping |

> **SQLite on Vercel**: Because Vercel deploys Next.js as serverless functions, the local filesystem is ephemeral. For production use, **self-hosted Docker** is the recommended target. If Vercel is required, the SQLite layer must be replaced with a remote-compatible alternative (e.g., Turso / libSQL) or Vercel Storage.

---

## 7.2 Deployment Diagram – Vercel (Production)

```
┌──────────────────────────────────────────────────┐
│  Vercel Edge Network                              │
│                                                  │
│  ┌────────────────────────────────────────────┐  │
│  │  Next.js Application (Node.js ≥ 18 LTS)   │  │
│  │                                            │  │
│  │  ┌─────────────────┐  ┌─────────────────┐ │  │
│  │  │  React Client   │  │  API Routes     │ │  │
│  │  │  (browser build)│  │  /api/rss/*     │ │  │
│  │  │                 │  │  /api/ai/*      │ │  │
│  │  │                 │  │  /api/cms/*     │ │  │
│  │  └─────────────────┘  └────────┬────────┘ │  │
│  │                                │           │  │
│  │  Environment Variables (secret)│           │  │
│  │  JOOMLA_API_URL                │           │  │
│  │  JOOMLA_API_KEY                │           │  │
│  │  AI_API_KEY                    │           │  │
│  │  AI_API_URL                    │           │  │
│  │  AI_MODEL                      │           │  │
│  └────────────────────────────────┼───────────┘  │
│                                   │              │
└───────────────────────────────────┼──────────────┘
                                    │ HTTPS
              ┌─────────────────────┼───────────────────────┐
              │                     │                        │
     ┌────────▼────────┐  ┌─────────▼──────────┐  ┌────────▼────────┐
     │  AI Service     │  │  Joomla CMS 4.x    │  │  RSS Feed       │
     │  (e.g. OpenAI)  │  │  REST API          │  │  Providers      │
     └─────────────────┘  └────────────────────┘  └─────────────────┘
```

---

## 7.3 Deployment Diagram – Self-Hosted Docker

```
┌─────────────────────────────────────────────────────────────┐
│  Host Server (Linux, on-premises or private cloud)          │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Docker Container (node:18-alpine)                    │  │
│  │                                                       │  │
│  │  Next.js Application  (PORT 3000)                     │  │
│  │    ├── Static assets served by Next.js                │  │
│  │    └── API Routes  /api/**                            │  │
│  │                                                       │  │
│  │  Environment: .env file or container env vars         │  │
│  └──────────────────────────┬────────────────────────────┘  │
│                              │                              │
│  ┌───────────────────────────▼──────────────────────────┐   │
│  │  Reverse Proxy (e.g., Nginx)  — port 443 (HTTPS)     │   │
│  │  TLS termination + forwarding to container:3000       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Dockerfile (reference)

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 7.4 Environment Configuration

All configuration is injected at runtime via environment variables. No secrets are baked into the container image.

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Absolute path to the SQLite file (e.g., `/data/app.db`); used by Drizzle ORM via `better-sqlite3` |
| `JOOMLA_API_URL` | Yes | Base URL of the Joomla 4.x REST API (e.g., `https://cms.example.nl`) |
| `JOOMLA_API_KEY` | Yes | Authentication token for the Joomla REST API |
| `AI_API_URL` | Yes | Base URL of the AI provider API |
| `AI_API_KEY` | Yes | Secret API key for the AI service |
| `AI_MODEL` | Yes | Model identifier (e.g., `gpt-4o`) |
| `AI_PROMPT_CATEGORISE` | No | Override for the categorisation prompt template |
| `AI_PROMPT_DRAFT` | No | Override for the article draft generation prompt template |
| `NODE_ENV` | Yes | `production` in all deployed environments |

> **Security**: None of these variables must appear in client-side JavaScript bundles. In Next.js, only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser; all variables listed above must remain unprefixed and server-side only.

---

## 7.5 Availability and Uptime

- Target uptime: **≥ 99.5 %** during business hours Mon–Fri 08:00–18:00 CET (RE-01).
- Vercel deployment uses automatic HTTPS, global CDN for static assets, and zero-downtime deployments by default.
- Docker deployments should configure a process manager (e.g., Docker restart policy `always`) and a health check endpoint (`/api/health`).
