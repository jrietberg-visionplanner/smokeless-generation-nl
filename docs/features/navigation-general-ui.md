# Feature: Navigation & General UI

> Functional requirements: FR-NAV-01 – FR-NAV-04
> Status: Preliminary — March 10, 2026

---

## Description

The Navigation & General UI feature encompasses the structural shell of the application: the persistent header that identifies the product and its context, and the tab navigation bar that allows editors to move between the five workflow stages. While individually simple, this feature underpins the usability of the entire application. Stable tab state preservation ensures editors can switch contexts freely without losing work. Consistent branding and clear active-tab indication reduce disorientation during a multi-step workflow session.

---

## INVEST Analysis

| Criterion | Assessment |
|-----------|------------|
| **Independent** | Navigation and the header shell are completely independent of all domain features. They can be built first as the application scaffold before any tab content is implemented, and changes to navigation do not impact content logic. |
| **Negotiable** | Core: five-tab nav, active highlight, state preservation on switch, persistent header. Negotiable for later: breadcrumb trail, mobile hamburger menu, notification badges per tab (e.g., "3 drafts awaiting approval"), collapsible sidebar alternative layout. |
| **Valuable** | The navigation shell is the first thing an editor sees and interacts with. Clear tab labelling and state persistence directly reduce errors and re-work caused by accidental navigation during the workflow. |
| **Estimable** | Straightforward layout and state work. Estimated at 2–3 story points total (header: 1 point, tab nav + state management: 2 points). |
| **Small** | Can be completed in a single short sprint or as part of the initial project scaffold. Very limited scope. |
| **Testable** | Tab switching, active-tab highlighting, state persistence, and header rendering are all deterministic and fully unit/component-testable. |

---

## User Stories

### US-NAV-01 — Navigate between workflow tabs
> **As an** editor,
> **I want to** switch between the five workflow tabs (RSS Feeds, Selection, Draft, Publish, Workflow) using a persistent navigation bar,
> **so that** I can move between pipeline stages at any time without losing my current context.

### US-NAV-02 — Know which tab is active
> **As an** editor,
> **I want to** see the currently active tab clearly highlighted in the navigation bar,
> **so that** I always know which pipeline stage I am working in.

### US-NAV-03 — Preserve tab state when switching
> **As an** editor,
> **I want** the content and state of each tab to be preserved when I navigate away and return,
> **so that** my selections, edits, and drafts are not lost due to tab switching.

### US-NAV-04 — See consistent product branding
> **As an** editor,
> **I want to** see the product name and relevant branding in a persistent header at the top of every page,
> **so that** I always know which tool I am using and feel confident in the editorial environment.

---

## Acceptance Criteria

### FR-NAV-01 / US-NAV-01 — Tab navigation bar
- [ ] A navigation bar is visible on all views of the application.
- [ ] The navigation bar contains exactly five tabs in this order: RSS Feeds, Selection, Draft, Publish, Workflow.
- [ ] Clicking any tab renders that tab's content in the main content area.
- [ ] Tab labels match the feature names defined in the functional requirements.

### FR-NAV-02 / US-NAV-02 — Active tab highlight
- [ ] The currently active tab is visually distinct from inactive tabs (e.g., different background, underline, or text colour).
- [ ] Only one tab can be visually active at a time.
- [ ] The active indicator updates immediately on tab click without delay.

### FR-NAV-03 / US-NAV-03 — State preservation
- [ ] Navigating from Tab A to Tab B and back to Tab A does not reset form inputs, selections, or component state in Tab A.
- [ ] State is preserved for all five tabs throughout the same browser session.
- [ ] State preservation applies to: feed list (RSS tab), selected items (Selection tab), draft edits and approval state (Draft tab), publish queue status (Publish tab).

### FR-NAV-04 / US-NAV-04 — Persistent header
- [ ] A header component is rendered above the navigation bar on all views.
- [ ] The header displays the product name: "Smokeless Generation NL – Newsletter AI Assistant" (or abbreviated equivalent).
- [ ] The header is visible without scrolling on all supported viewport widths (≥ 768 px).
- [ ] The header does not obscure navigation or content when the page is scrolled.

---

*Feature version: 1.0 — March 10, 2026*
