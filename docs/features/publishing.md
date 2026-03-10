# Feature: Publishing

> Functional requirements: FR-PUB-01 – FR-PUB-07
> Status: Preliminary — March 10, 2026

---

## Description

The Publishing feature is the final step of the newsletter workflow. Approved article drafts are collected into a publish queue from which the editor can push content directly to the Joomla CMS via its REST API. The feature supports both a manual mode — where the editor publishes each article individually at their own pace — and an auto-publish mode that processes all queued articles in sequence. Clear per-article status feedback (pending → publishing → published / failed) ensures editors always know what has and hasn't been sent to the CMS, and failed items can be retried without data loss.

---

## INVEST Analysis

| Criterion | Assessment |
|-----------|------------|
| **Independent** | Publishing depends on approved drafts existing (from FR-DFT-06) but is independent of all other features at runtime. The Joomla API integration can be developed against a stub/mock endpoint, keeping it decoupled from earlier pipeline stages during development. |
| **Negotiable** | Core: queue display, manual publish, auto-publish, status tracking, retry on failure, remove from queue. Negotiable for later: scheduled publishing (date/time picker), preview in CMS before publish, category/tag mapping to Joomla taxonomy, rollback/unpublish action from this UI. |
| **Valuable** | This feature closes the loop — without it, editors would still need to manually copy AI-generated content into Joomla. It is the key time-saving step that justifies the entire workflow for a 50,000-circulation newsletter. |
| **Estimable** | Queue UI + status state machine: 3 points. Manual publish (single API call): 3 points. Auto-publish sequencing: 3 points. Error handling + retry: 2 points. Total: approximately 11 story points. |
| **Small** | Can be split across two sprints: Sprint A covers manual publish + status display; Sprint B adds auto-publish mode and retry logic. |
| **Testable** | The status state machine (pending → publishing → published/failed) is fully deterministic. API success/failure paths can be tested with mocked Joomla API responses. Queue mutation (add, remove) is unit-testable. |

---

## User Stories

### US-PUB-01 — View the publish queue
> **As an** editor,
> **I want to** see all approved drafts in a publish queue,
> **so that** I have a clear overview of what is ready to send to the CMS before taking action.

### US-PUB-02 — Publish an article manually
> **As an** editor,
> **I want to** publish a single article to Joomla CMS with one click,
> **so that** I can control which articles go live and in what order.

### US-PUB-03 — Auto-publish all approved articles
> **As an** editor,
> **I want to** trigger automatic sequential publishing of all queued articles,
> **so that** I can push a complete newsletter edition to the CMS in one action without clicking individually for each article.

### US-PUB-04 — Track publish status per article
> **As an** editor,
> **I want to** see the real-time publish status of each article (pending, publishing, published, failed),
> **so that** I always know what has and hasn't been successfully sent to the CMS.

### US-PUB-05 — Know when a publish succeeded
> **As an** editor,
> **I want to** see a confirmation with a timestamp when an article is successfully published,
> **so that** I have a record of when each item went live and can verify it in the CMS.

### US-PUB-06 — Handle and retry a failed publish
> **As an** editor,
> **I want to** see a clear error message when a publish fails and be able to retry,
> **so that** a network or API error does not silently prevent an article from reaching the CMS and I don't have to re-enter or recreate the content.

### US-PUB-07 — Remove an article from the queue
> **As an** editor,
> **I want to** remove an article from the publish queue before it is published,
> **so that** I can pull a last-minute decision without it going live accidentally.

---

## Acceptance Criteria

### FR-PUB-01 / US-PUB-01 — Publish queue display
- [ ] The Publish tab lists all drafts that have been approved in the Draft tab.
- [ ] Each queued article shows its title and current publish status badge.
- [ ] Articles rejected in DraftTab do not appear in the publish queue.
- [ ] The queue shows an empty state message when no approved drafts are available.

### FR-PUB-02 / US-PUB-02 — Manual publish
- [ ] Each queued article has a "Publish" button.
- [ ] Clicking "Publish" triggers a Joomla CMS API call for that article only.
- [ ] The article's status changes to "Publishing" (loading state) while the request is in flight.
- [ ] On success, the status changes to "Published" and the timestamp is displayed.
- [ ] Manual publish completes within 5 seconds under normal network conditions (NFR-PF-06).

### FR-PUB-03 / US-PUB-03 — Auto-publish
- [ ] An "Auto-Publish All" button is present and active only when one or more articles are in pending state.
- [ ] Clicking it sends all pending articles to the CMS in sequence (one at a time to avoid API rate issues).
- [ ] The UI shows per-article progress as each one is published.
- [ ] Auto-publish stops the sequence on the first failure and shows the error; previously published articles retain their "Published" status.

### FR-PUB-04 / US-PUB-04 — Status tracking
- [ ] Each article displays one of four statuses: Pending, Publishing, Published, Failed.
- [ ] Status badges are visually distinct (e.g., different colours or icons per state).
- [ ] Status updates are reflected immediately in the UI without a page reload.

### FR-PUB-05 / US-PUB-05 — Publish success confirmation
- [ ] Successfully published articles display a "Published" badge and the date-time of publication (Europe/Amsterdam, nl-NL format).
- [ ] Published articles are visually distinct from pending items (e.g., greyed out or moved to a "Done" section).

### FR-PUB-06 / US-PUB-06 — Failure handling and retry
- [ ] Failed articles display a "Failed" badge and the error reason (e.g., "CMS API unreachable", "Authentication error").
- [ ] A "Retry" button is shown for each failed article.
- [ ] Clicking Retry re-attempts the publish API call for that article only.
- [ ] The draft content is preserved intact after a failure; no data is lost.

### FR-PUB-07 / US-PUB-07 — Remove from queue
- [ ] Each pending article has a "Remove" action.
- [ ] Clicking Remove removes the article from the publish queue.
- [ ] Removal is only available for articles in "Pending" or "Failed" status; already-published articles cannot be removed.
- [ ] Removed articles are not sent to the CMS.

---

*Feature version: 1.0 — March 10, 2026*
