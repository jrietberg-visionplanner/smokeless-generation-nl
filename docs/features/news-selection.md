# Feature: News Selection

> Functional requirements: FR-SEL-01 – FR-SEL-08
> Status: Preliminary — March 10, 2026

---

## Description

The News Selection feature presents editors with all news items collected from active RSS feeds and empowers them to curate the subset that will become newsletter articles. An AI service pre-categorises every item, reducing cognitive load and allowing the editor to quickly scan by topic. The editor reviews items, selects the most relevant ones, and proceeds to the drafting step. This feature bridges automated feed ingestion and human editorial judgement.

---

## INVEST Analysis

| Criterion | Assessment |
|-----------|------------|
| **Independent** | The selection UI depends on the RSS feed collection step having produced items, but it does not depend on AI draft generation or CMS publishing. The AI categorisation can be stubbed for early UI development. |
| **Negotiable** | Core scope: display items, show AI category, select/deselect, filter, proceed. Negotiable enhancements for later: keyword search, bulk select/deselect, sorting by date or relevance score, persisting selections across sessions. |
| **Valuable** | This is the primary editorial touch-point. Without item selection the AI draft and publish pipeline cannot start. It directly replaces a previously manual news-review process for a 50,000-circulation newsletter. |
| **Estimable** | UI list with selection state: 3 points. AI categorisation integration: 3 points. Filter controls: 2 points. Total: approximately 8 story points. |
| **Small** | Completable within one sprint. The feature has a clear boundary: items in, selected IDs out. |
| **Testable** | Selection state, filter logic, item count display, and the "Proceed" button guard are all deterministic and testable with unit and component tests. AI categorisation can be tested via mocked API responses. |

---

## User Stories

### US-SEL-01 — View collected news items
> **As an** editor,
> **I want to** see all news items collected from active RSS feeds in one list,
> **so that** I have a complete picture of today's relevant news before making editorial decisions.

### US-SEL-02 — Understand AI-assigned categories
> **As an** editor,
> **I want to** see the AI-assigned category for each news item,
> **so that** I can quickly assess its topic relevance without reading the full article.

### US-SEL-03 — Read item details
> **As an** editor,
> **I want to** see each item's title, source, publication date, and excerpt,
> **so that** I have enough context to make an informed selection decision.

### US-SEL-04 — Select items for drafting
> **As an** editor,
> **I want to** select one or more news items to include in the newsletter,
> **so that** only editorially approved items proceed to the AI drafting step.

### US-SEL-05 — Deselect items
> **As an** editor,
> **I want to** deselect a previously chosen item,
> **so that** I can change my mind without losing my other selections.

### US-SEL-06 — Filter by category
> **As an** editor,
> **I want to** filter the item list by AI-assigned category,
> **so that** I can focus on one topic at a time and avoid scrolling through unrelated items.

### US-SEL-07 — Track selection progress
> **As an** editor,
> **I want to** see how many items are available and how many I have selected,
> **so that** I know whether I have chosen enough material to produce a complete newsletter edition.

### US-SEL-08 — Proceed to drafting
> **As an** editor,
> **I want to** proceed to the Draft tab with my selected items,
> **so that** the AI can generate article drafts only for the items I have approved.

---

## Acceptance Criteria

### FR-SEL-01 / US-SEL-01 — Item list
- [ ] All news items from active feeds are displayed in the Selection tab.
- [ ] The list renders correctly with 0 items (empty state message shown) and with 500+ items (no UI freeze).

### FR-SEL-02 / US-SEL-02 — AI categorisation
- [ ] Each item displays its AI-assigned category as a visible badge or label.
- [ ] Items that could not be categorised display a "Uncategorised" fallback label.
- [ ] The AI categorisation call is made automatically when the Selection tab is opened or refreshed.

### FR-SEL-03 / US-SEL-03 — Item details
- [ ] Each item shows: title, source name, publication date (formatted in nl-NL, Europe/Amsterdam timezone), category, and a short excerpt (≤ 3 sentences or 300 characters).

### FR-SEL-04 / US-SEL-04 — Select an item
- [ ] Clicking/checking an item marks it as selected (visually highlighted).
- [ ] Multiple items can be selected simultaneously.
- [ ] The selected count in the summary increments correctly.

### FR-SEL-05 / US-SEL-05 — Deselect an item
- [ ] Clicking/unchecking a selected item removes the selection highlight.
- [ ] The selected count in the summary decrements correctly.
- [ ] Deselecting one item does not affect other selected items.

### FR-SEL-06 / US-SEL-06 — Category filter
- [ ] A filter control lists all available AI categories plus an "All" option.
- [ ] Selecting a category shows only items with that category; other items are hidden.
- [ ] Selecting "All" restores the full list.
- [ ] Category-filtered items retain their selection state when switching filters.

### FR-SEL-07 / US-SEL-07 — Summary counters
- [ ] A summary line shows total items available and total items selected.
- [ ] Counters update in real time as items are selected/deselected.

### FR-SEL-08 / US-SEL-08 — Proceed to Draft
- [ ] The "Proceed to Draft" button is disabled when zero items are selected.
- [ ] The button is enabled when one or more items are selected.
- [ ] Clicking the button navigates to the Draft tab and passes the selected item IDs.
- [ ] Only selected items appear in the Draft tab after proceeding.

---

*Feature version: 1.0 — March 10, 2026*
