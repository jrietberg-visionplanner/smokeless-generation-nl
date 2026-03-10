# Feature: RSS Feed Management

> Functional requirements: FR-RSS-01 – FR-RSS-08
> Status: Preliminary — March 10, 2026

---

## Description

RSS Feed Management is the entry point of the newsletter workflow. Editors configure a set of Google Alerts RSS feeds that automatically collect relevant news items on topics such as smoking, e-cigarettes, vaping, tobacco policy, and youth health. The feature allows adding, toggling, deleting, and manually refreshing feeds, and provides a live summary of how many items have been collected today. A healthy feed configuration is the prerequisite for every downstream step (selection, drafting, publishing).

---

## INVEST Analysis

| Criterion | Assessment |
|-----------|------------|
| **Independent** | Feed management has no dependency on AI services or the CMS; it can be built and deployed in isolation. The only external dependency is the availability of the RSS URLs themselves. |
| **Negotiable** | The scope of feed management (add/toggle/delete/refresh) is the core. Enhancements such as scheduling automatic refresh intervals, grouping feeds by topic, or showing historical item counts are explicitly out of scope for v1 and can be negotiated for later iterations. |
| **Valuable** | Without configured feeds no news items flow into the workflow. This feature is the foundational enabler for the entire AI newsletter pipeline and directly reduces the manual effort of finding source material. |
| **Estimable** | The UI is straightforward (list + form) with no AI integration. Effort can be estimated at 3–5 story points for the full CRUD interface and 2 points for the refresh mechanism, totalling approximately 5–8 points. |
| **Small** | The feature can be completed within a single sprint (≤ 2 weeks). The eight functional requirements map to a limited, well-understood surface area. |
| **Testable** | All behaviours (add, toggle, delete, refresh, error display, summary counts) are deterministic and can be covered by unit tests (form validation, state mutations) and integration tests (mocked RSS fetch). |

---

## User Stories

### US-RSS-01 — Add a feed
> **As an** editor,
> **I want to** add a new RSS feed by entering a name and URL,
> **so that** news items from that source are automatically collected for the next workflow cycle.

### US-RSS-02 — Validate feed input
> **As an** editor,
> **I want to** be informed immediately when I submit an incomplete or malformed feed form,
> **so that** I don't accidentally save an invalid feed that would silently fail to collect items.

### US-RSS-03 — Toggle a feed on/off
> **As an** editor,
> **I want to** temporarily disable a feed without deleting it,
> **so that** I can pause a noisy or irrelevant source and re-enable it later without re-entering the URL.

### US-RSS-04 — Delete a feed
> **As an** editor,
> **I want to** permanently remove a feed I no longer need,
> **so that** the feed list stays clean and only active, relevant sources remain.

### US-RSS-05 — Manually refresh all feeds
> **As an** editor,
> **I want to** trigger an immediate refresh of all active feeds,
> **so that** I can get the latest news items before starting the selection step without waiting for the next scheduled cycle.

### US-RSS-06 — See a daily items summary
> **As an** editor,
> **I want to** see the total number of items collected today and how many feeds are active,
> **so that** I can assess whether I have sufficient material for the newsletter at a glance.

### US-RSS-07 — Know when a feed is broken
> **As an** editor,
> **I want to** see a clear error indicator next to any feed that could not be fetched or parsed,
> **so that** I can investigate and fix or replace the broken source without the entire feed list being affected.

---

## Acceptance Criteria

### FR-RSS-01 / US-RSS-01 — Add a feed
- [ ] A form with "Feed Name" and "RSS Feed URL" fields is visible on the RSS Feeds tab.
- [ ] Submitting valid name and URL adds the feed to the list immediately with `active: true` and `itemsToday: 0`.
- [ ] After adding, the form fields are cleared and no error is shown.

### FR-RSS-02 / US-RSS-02 — Input validation
- [ ] Submitting with an empty "Feed Name" shows the error: _"Feed name is required."_
- [ ] Submitting with an empty "URL" shows the error: _"RSS Feed URL is required."_
- [ ] Submitting with a non-URL value in the URL field shows a validation error.
- [ ] The feed is not added to the list while errors are present.

### FR-RSS-03 — Feed list display
- [ ] All configured feeds are listed, each showing: name, URL, active/inactive badge, and items-today count.
- [ ] Inactive feeds are visually distinct from active feeds (e.g., muted style).

### FR-RSS-04 / US-RSS-03 — Toggle
- [ ] Clicking the toggle for an active feed marks it inactive; clicking again marks it active.
- [ ] The toggle change is reflected immediately in the list without a page reload.
- [ ] An inactive feed's items-today count displays as `0`.

### FR-RSS-05 / US-RSS-04 — Delete
- [ ] Clicking the delete action for a feed removes it from the list immediately.
- [ ] The deleted feed does not reappear after deletion within the same session.

### FR-RSS-06 / US-RSS-05 — Refresh
- [ ] Clicking "Refresh" triggers a loading/spinner state on the button.
- [ ] Only active feeds are polled during refresh.
- [ ] After refresh completes, items-today counts are updated.
- [ ] The button returns to its default state after refresh completes (success or error).

### FR-RSS-07 / US-RSS-06 — Summary
- [ ] The summary displays the correct count of active feeds.
- [ ] The summary displays the correct total items-today across all active feeds.
- [ ] Summary updates immediately when feeds are toggled, added, or deleted.

### FR-RSS-08 / US-RSS-07 — Feed error indicator
- [ ] If a feed fetch fails during refresh, an error icon/badge is shown next to that feed.
- [ ] The error indicator does not affect the display of other feeds.
- [ ] A successful subsequent refresh clears the error indicator.

---

*Feature version: 1.0 — March 10, 2026*
