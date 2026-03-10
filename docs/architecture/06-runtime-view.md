# arc42 – Chapter 6: Runtime View

**Smokeless Generation NL – Newsletter AI Assistant**
*Document version: 1.0 — March 10, 2026*

---

## 6.1 Scenario: Editor completes the full newsletter workflow

This is the primary happy-path runtime scenario covering all four pipeline stages.

### Stage 1 – RSS Feed Refresh

```
Editor           Browser (React)          Next.js Server          RSS Providers
  │                    │                        │                      │
  │─── click Refresh ─▶│                        │                      │
  │                    │── POST /api/rss/refresh▶│                      │
  │                    │    (active feed URLs)   │                      │
  │                    │                        │── HTTPS GET feed 1 ─▶│
  │                    │                        │◀─ RSS/Atom XML ───────│
  │                    │                        │── HTTPS GET feed 2 ─▶│
  │                    │                        │◀─ RSS/Atom XML ───────│
  │                    │                        │  (parallel, ≤5 s)    │
  │                    │◀─ parsed items (JSON) ──│                      │
  │◀── updated feed    │                        │                      │
  │    item counts ────│                        │                      │
```

### Stage 2 – News Selection with AI Categorisation

```
Editor           Browser (React)          Next.js Server          AI Service
  │                    │                        │                      │
  │─── open Selection  │                        │                      │
  │       tab ────────▶│                        │                      │
  │                    │── POST /api/ai/        │                      │
  │                    │   categorise ─────────▶│                      │
  │                    │   (news items batch)   │── HTTPS POST ───────▶│
  │                    │                        │   (prompt + items)   │
  │                    │                        │◀─ category labels ───│
  │                    │                        │   (≤ 30 s for 200)   │
  │                    │◀─ categorised items ───│                      │
  │◀── category badges │                        │                      │
  │    per item ───────│                        │                      │
  │                    │                        │                      │
  │─── select items ──▶│ (local state update)   │                      │
  │─── Proceed to Draft│                        │                      │
```

### Stage 3 – Article Draft Generation

```
Editor           Browser (React)          Next.js Server          AI Service
  │                    │                        │                      │
  │─── open Draft tab ▶│                        │                      │
  │                    │ (per selected item):   │                      │
  │                    │── POST /api/ai/draft ─▶│                      │
  │                    │   (item N)             │── HTTPS POST ───────▶│
  │                    │                        │   (prompt + item N)  │
  │                    │                        │◀─ {title,intro,sum} ─│
  │                    │                        │   (≤ 10 s each)      │
  │                    │◀─ draft for item N ────│                      │
  │◀── draft card ─────│                        │                      │
  │    rendered        │                        │                      │
  │                    │                        │                      │
  │─── edit title ────▶│ (React state update,   │                      │
  │                    │  no network call)      │                      │
  │─── approve draft ─▶│ (local status update)  │                      │
```

### Stage 4 – Publishing to Joomla CMS

```
Editor           Browser (React)          Next.js Server          Joomla CMS
  │                    │                        │                      │
  │─── click Publish ─▶│                        │                      │
  │    (article N)     │── POST /api/cms/ ─────▶│                      │
  │                    │   publish              │── HTTPS POST ───────▶│
  │                    │   (article payload)    │   /api/v1/content/   │
  │                    │                        │   articles           │
  │                    │                        │◀─ 201 Created ───────│
  │                    │                        │   (≤ 5 s)            │
  │                    │◀─ { status:'published',│                      │
  │                    │    timestamp }          │                      │
  │◀── status badge    │                        │                      │
  │    "Published" +   │                        │                      │
  │    timestamp ──────│                        │                      │
```

---

## 6.2 Scenario: RSS feed fetch fails

```
Editor           Browser (React)          Next.js Server          RSS Provider (broken)
  │                    │                        │                      │
  │─── Refresh ───────▶│── POST /api/rss/refresh▶│                      │
  │                    │                        │── HTTPS GET ────────▶│
  │                    │                        │                      X  (timeout/error)
  │                    │                        │  other feeds succeed │
  │                    │◀─ { feeds: [...],       │                      │
  │                    │    errors: [{id, msg}] }│                      │
  │◀── error indicator │                        │                      │
  │    on broken feed; │                        │                      │
  │    other feeds OK  │                        │                      │
```

> RE-02: A single feed failure does not crash the feed list; other feeds continue to show correct data.

---

## 6.3 Scenario: AI service unavailable

```
Editor           Browser (React)          Next.js Server          AI Service
  │                    │                        │                      │
  │─── open Draft tab ▶│── POST /api/ai/draft ─▶│── HTTPS POST ───────▶│
  │                    │                        │                      X (unavailable)
  │                    │◀─ { error: 'AI_UNAVAIL'}│                      │
  │◀── degradation msg │                        │                      │
  │    + manual edit   │                        │                      │
  │    fields enabled  │                        │                      │
```

> RE-03: The editor can still manually write the title, intro, and summary when the AI service is down.

---

## 6.4 Scenario: Publish fails and editor retries

```
Editor           Browser (React)          Next.js Server          Joomla CMS
  │                    │                        │                      │
  │─── Publish ───────▶│── POST /api/cms/publish▶│── HTTPS POST ───────▶│
  │                    │                        │                      X (API error)
  │                    │◀─ { error: 'CMS_FAIL', │                      │
  │                    │     reason: '...' }     │                      │
  │◀── "Failed" badge  │                        │                      │
  │    + error reason  │                        │                      │
  │    + Retry button  │                        │                      │
  │                    │                        │                      │
  │─── click Retry ───▶│── POST /api/cms/publish▶│── HTTPS POST ───────▶│
  │                    │                        │◀─ 201 Created ───────│
  │◀── "Published"     │                        │                      │
  │    + timestamp     │                        │                      │
```

> RE-04: Draft content is fully preserved after a failure; no data is lost.
