# arc42 – Chapter 1: Introduction and Goals

**Smokeless Generation NL – Newsletter AI Assistant**
*Document version: 1.0 — March 10, 2026*

---

## 1.1 Requirements Overview

The **Newsletter AI Assistant** is an internal web application built for the editorial team of *Smokeless Generation NL*, the organisation behind the *Opgelucht* newsletter (50,000 circulation). Its purpose is to eliminate the most time-consuming parts of the weekly newsletter production cycle by combining automated RSS feed aggregation with AI-powered article drafting and one-click CMS publishing.

The system supports a four-stage editorial pipeline:

| Stage | Description |
|-------|-------------|
| **1. RSS Feed Collection** | Configured feeds (e.g., Google Alerts) are polled; news items are aggregated. |
| **2. News Selection** | An editor reviews AI-categorised news items and curates the subset for the newsletter. |
| **3. Article Drafting** | An AI service generates a Dutch-language draft (title, intro, summary) for every selected item; the editor reviews, edits, and approves. |
| **4. CMS Publishing** | Approved drafts are pushed to the Joomla 4.x CMS via its REST API, either individually or in batch. |

### Top-level functional requirements (summary)

- **FR-RSS**: Add, toggle, delete, and refresh RSS feeds; per-feed error indicators (FR-RSS-01 – FR-RSS-08).
- **FR-SEL**: AI categorisation of news items; filter/select/deselect; proceed to draft (FR-SEL-01 – FR-SEL-08).
- **FR-DFT**: AI draft generation per article; inline editing; approve/reject; regenerate (FR-DFT-01 – FR-DFT-08).
- **FR-PUB**: Publish queue; manual and auto-publish modes; retry on failure (FR-PUB-01 – FR-PUB-07).
- **FR-WRK**: Visual pipeline overview with stage status and navigation (FR-WRK-01 – FR-WRK-04).
- **FR-NAV**: Persistent tab navigation; state preservation across tab switches (FR-NAV-01 – FR-NAV-04).
- **FR-CFG**: All credentials and AI configuration via server-side environment variables (FR-CFG-01 – FR-CFG-03).

---

## 1.2 Quality Goals

The following quality goals are ordered by priority for this system. They drive all significant architectural decisions.

| Priority | Quality Attribute | Key Scenario |
|----------|------------------|--------------|
| 1 | **Security** | API keys and CMS credentials must never appear in client-side bundles or browser responses (SE-02). RSS URLs must be validated against SSRF (SE-03). AI output must be rendered XSS-safe (SE-04). |
| 2 | **Reliability** | Failures in one integration (RSS, AI, CMS) must not cascade to crash the rest of the UI (RE-02 – RE-04). Session edits must survive tab navigation within the same browser session (RE-05). |
| 3 | **Usability** | A new editor must complete the full workflow without external help after 30 minutes of onboarding (US-01). The UI must be keyboard-navigable and meet WCAG 2.1 AA (US-04, AC-01). |
| 4 | **Maintainability** | TypeScript strict mode enforced; no component exceeds 300 lines (MA-01, MA-02). AI provider swappable by changing a single service module (SC-03). |
| 5 | **Performance** | LCP ≤ 2 s; tab switch ≤ 300 ms; AI draft generation ≤ 10 s; publish ≤ 5 s (PF-01 – PF-06). |

---

## 1.3 Stakeholders

| Role | Name / Group | Expectations |
|------|-------------|--------------|
| Primary user | Newsletter editor(s) | Fast, reliable, keyboard-navigable workflow; Dutch-language UI; no data loss |
| System administrator | Smokeless Generation NL IT | Straightforward deployment via Vercel or Docker; env-var-based configuration |
| Developer | Feature team | Clear TypeScript types; testable service boundaries; swap-friendly AI provider |
| Organisation | Smokeless Generation NL | GDPR/AVG compliance (SE-05); secure handling of CMS credentials |
| External system | Joomla 4.x CMS | Valid REST API calls; authenticated via env-var credentials |
| External system | AI service (e.g., OpenAI) | Authenticated API calls; prompt templates configurable without code changes |
| External system | RSS feed providers | Validated, HTTPS-only outbound GET requests; graceful handling of feed failures |
