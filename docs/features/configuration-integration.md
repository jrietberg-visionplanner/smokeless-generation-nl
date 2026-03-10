# Feature: Configuration & Integration

> Functional requirements: FR-CFG-01 – FR-CFG-03
> Status: Preliminary — March 10, 2026

---

## Description

The Configuration & Integration feature governs how the application connects to its two external systems — the Joomla CMS REST API and the AI service — and how those connections are configured without code changes. All credentials and endpoints are stored as server-side environment variables, ensuring they are never exposed in client-side bundles or network responses. AI prompt templates are also externalised from code, allowing editorial and prompt-engineering adjustments to be made without a redeployment. This feature is non-visual but critical for security, operational flexibility, and maintainability.

---

## INVEST Analysis

| Criterion | Assessment |
|-----------|------------|
| **Independent** | Configuration is a cross-cutting concern but does not depend on any specific UI feature being built. It should be set up early as a prerequisite to integration testing of the RSS, Draft, and Publish features. It is independent of UI layout work. |
| **Negotiable** | Core: env-var-driven secrets for Joomla and AI, prompt template externalisation. Negotiable for later: per-environment config UI (admin panel), secret rotation support, multi-tenant CMS target configuration, A/B prompt template testing. |
| **Valuable** | Without this feature, credentials would be hardcoded, posing a critical security risk. Externalised prompt templates allow non-developer editors or prompt engineers to tune AI output quality without developer involvement, directly improving newsletter quality over time. |
| **Estimable** | Environment variable wiring (Next.js): 1 point. Joomla API client module: 3 points. AI service client module: 3 points. Prompt template loading: 2 points. Total: approximately 9 story points. |
| **Small** | The feature is modular. Each integration (Joomla client, AI client, prompt loader) can be delivered as a separate, independently testable module within one sprint. |
| **Testable** | Environment variable reading can be tested via process.env mocking. API client modules can be tested with mocked HTTP responses. Prompt template loading is testable by providing fixture template files. Missing or malformed env vars should produce clear startup errors that are verifiable. |

---

## User Stories

### US-CFG-01 — Configure Joomla CMS connection without code changes
> **As a** system administrator or developer,
> **I want to** configure the Joomla CMS API endpoint and credentials through environment variables,
> **so that** the CMS connection can be updated for different environments (development, staging, production) without modifying or redeploying application code.

### US-CFG-02 — Configure AI service without code changes
> **As a** system administrator or developer,
> **I want to** configure the AI service API key and model via environment variables,
> **so that** the AI provider or model can be changed without touching source code, and API keys are never committed to version control.

### US-CFG-03 — Adjust AI prompt templates without a code deployment
> **As a** developer or prompt engineer,
> **I want to** update the AI prompt templates used for news categorisation and article draft generation via a configuration file or environment variable,
> **so that** I can iterate on and improve AI output quality without requiring a full code release.

### US-CFG-04 — Fail fast on missing configuration
> **As a** developer,
> **I want** the application to throw a clear startup error when a required environment variable is missing,
> **so that** misconfigured deployments are caught immediately rather than failing silently at runtime when an API call is made.

---

## Acceptance Criteria

### FR-CFG-01 / US-CFG-01 — Joomla CMS configuration
- [ ] The Joomla API base URL is read from the environment variable `JOOMLA_API_URL`.
- [ ] The Joomla API authentication token/key is read from the environment variable `JOOMLA_API_KEY` (or equivalent).
- [ ] Neither variable is ever included in client-side JavaScript bundles (must be server-side only, e.g. Next.js API routes or Server Actions).
- [ ] A missing or empty `JOOMLA_API_URL` or `JOOMLA_API_KEY` causes the application to log a clear error at startup (or at the point of first use in production).

### FR-CFG-02 / US-CFG-02 — AI service configuration
- [ ] The AI service API endpoint or provider identifier is read from an environment variable (e.g., `AI_API_URL` or provider-specific equivalent).
- [ ] The AI API key is read from an environment variable (e.g., `AI_API_KEY`).
- [ ] The AI model name/version is configurable via an environment variable (e.g., `AI_MODEL`).
- [ ] None of these values are present in client-side code or network responses visible to the browser.
- [ ] A missing AI API key causes a clear error message; the application does not crash the UI — it surfaces the degraded-service message defined in NFR-RE-03.

### FR-CFG-03 / US-CFG-03 — Prompt template externalisation
- [ ] The prompt template for news categorisation is stored outside of component code (e.g., in a `.env` variable, a `config/prompts.ts` module, or an external config file).
- [ ] The prompt template for article draft generation (title, intro, summary) is separately configurable.
- [ ] Updating a prompt template does not require changes to UI components or business-logic code.
- [ ] Both prompt templates are available server-side only and are not exposed in the browser.

### US-CFG-04 — Fail-fast validation
- [ ] At application startup (or at server-side module initialisation), all required environment variables are validated.
- [ ] Missing required variables produce a descriptive error message identifying the variable name and its purpose.
- [ ] The application does not attempt external API calls when required configuration is missing.

---

*Feature version: 1.0 — March 10, 2026*
