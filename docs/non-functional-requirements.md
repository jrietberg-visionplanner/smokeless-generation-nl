# Non-Functional Requirements
**Smokeless Generation NL – Newsletter AI Assistant**

---

## 1. Performance

| ID | Requirement |
|----|-------------|
| PF-01 | The application must load the initial page (LCP) within **2 seconds** on a standard broadband connection (≥ 25 Mbps). |
| PF-02 | Tab switching must render within **300 ms** after user interaction, without a full page reload. |
| PF-03 | RSS feed refresh must complete within **5 seconds** for up to 10 active feeds. |
| PF-04 | AI categorisation of a daily batch (≤ 200 news items) must complete within **30 seconds**. |
| PF-05 | AI draft generation per article must complete within **10 seconds**. |
| PF-06 | Publishing a draft to Joomla CMS must complete within **5 seconds** under normal network conditions. |

---

## 2. Usability

| ID | Requirement |
|----|-------------|
| US-01 | A newsletter editor with no prior AI tool experience must be able to complete the full workflow (select → draft → publish) without external help after a maximum of **30 minutes** of onboarding. |
| US-02 | All interactive controls (buttons, toggles, inputs) must have visible focus states and clear hover feedback. |
| US-03 | Error messages must be human-readable and actionable (e.g., specify which field is invalid and how to fix it). |
| US-04 | The interface must be fully operable using a keyboard alone (keyboard-navigable tabs, forms, and actions). |
| US-05 | The application must be responsive and fully usable on desktop viewports (≥ 1280 px wide); tablet support (≥ 768 px) is desirable. |

---

## 3. Accessibility

| ID | Requirement |
|----|-------------|
| AC-01 | The application must conform to **WCAG 2.1 Level AA** guidelines. |
| AC-02 | All images, icons, and non-text content must have descriptive `alt` text or `aria-label` attributes. |
| AC-03 | Colour contrast ratios must meet a minimum of **4.5 : 1** for normal text and **3 : 1** for large text. |
| AC-04 | The application must be usable with a screen reader (NVDA/JAWS on Windows, VoiceOver on macOS). |

---

## 4. Reliability & Availability

| ID | Requirement |
|----|-------------|
| RE-01 | The application must have an uptime of **≥ 99.5 %** during business hours (Mon–Fri, 08:00–18:00 CET). |
| RE-02 | If an RSS feed fetch fails, the application must display a clear error indicator per feed without crashing the entire feed list. |
| RE-03 | If the AI service is unavailable, the application must display a user-friendly degradation message and allow manual editing of drafts. |
| RE-04 | If the Joomla CMS API call fails, the publish action must show an error, retain the draft, and allow the user to retry without data loss. |
| RE-05 | User-made edits (title, intro, summary) in the Draft tab must not be lost during normal browser usage within the same session. |

---

## 5. Security

| ID | Requirement |
|----|-------------|
| SE-01 | All communication with external services (RSS feeds, AI API, Joomla CMS API) must use **HTTPS/TLS 1.2+**. |
| SE-02 | API keys and CMS credentials must never be exposed in client-side code or browser network responses; they must be stored as server-side environment variables. |
| SE-03 | RSS feed URLs entered by users must be validated and sanitised before use to prevent SSRF attacks. |
| SE-04 | AI-generated content rendered in the UI must be treated as untrusted input and rendered safely to prevent XSS (use framework-provided sanitisation, not raw `innerHTML`). |
| SE-05 | The application must not log or persist personally identifiable information (PII) unless legally required under the **AVG/GDPR**. |
| SE-06 | Dependencies must be kept up to date; known critical vulnerabilities (`npm audit` HIGH/CRITICAL) must be resolved within **5 business days** of disclosure. |

---

## 6. Maintainability

| ID | Requirement |
|----|-------------|
| MA-01 | The codebase must be written in **TypeScript** with strict type-checking enabled (`strict: true` in `tsconfig.json`). |
| MA-02 | Components must follow a clear single-responsibility principle; no single component file should exceed **300 lines** of code. |
| MA-03 | The project must include a `README.md` that allows a new developer to run the application locally within **15 minutes**. |
| MA-04 | All environment-specific configuration (API endpoints, keys, feature flags) must be managed via `.env` files and not hardcoded. |
| MA-05 | The project must pass ESLint (Next.js recommended ruleset) with zero errors before each production build. |

---

## 7. Scalability

| ID | Requirement |
|----|-------------|
| SC-01 | The RSS feed manager must support at least **50 feeds** without degradation in UI performance. |
| SC-02 | The Selection tab must handle at least **500 news items** per day without pagination errors or UI freezes. |
| SC-03 | The architecture must allow the AI provider (e.g., OpenAI) to be swapped out by changing a single service module, without modifying UI components. |

---

## 8. Compatibility

| ID | Requirement |
|----|-------------|
| CO-01 | The application must function correctly in the latest two major versions of **Chrome**, **Edge**, **Firefox**, and **Safari**. |
| CO-02 | The application must be deployable on **Node.js ≥ 18 LTS** and compatible with standard Next.js hosting platforms (Vercel, self-hosted Docker). |
| CO-03 | The Joomla CMS integration must be compatible with **Joomla 4.x** and its REST API. |

---

## 9. Internationalisation & Content

| ID | Requirement |
|----|-------------|
| IN-01 | The interface language is **Dutch (nl-NL)**; all UI labels, tooltips, and error messages must be in Dutch. |
| IN-02 | Dates and times must be displayed in the **Europe/Amsterdam** time zone. |
| IN-03 | AI-generated article drafts must default to Dutch and use language appropriate for a public-health newsletter audience. |

---

*Document version: 1.0 — March 10, 2026*
