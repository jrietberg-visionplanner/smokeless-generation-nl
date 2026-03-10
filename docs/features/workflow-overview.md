# Feature: Workflow Overview

> Functional requirements: FR-WRK-01 – FR-WRK-04
> Status: Preliminary — March 10, 2026

---

## Description

The Workflow Overview tab provides editors and stakeholders with a high-level, visual representation of the full AI-assisted newsletter pipeline: RSS Feed Collection → News Selection → Article Drafting → CMS Publishing. Each stage is presented with its current status — including item counts and completion state — giving the editor situational awareness at a glance. The view also makes the boundary between automated pipeline steps and manual editorial decisions explicit, helping editors understand where their input is required. Clicking a stage navigates directly to the corresponding tab.

---

## INVEST Analysis

| Criterion | Assessment |
|-----------|------------|
| **Independent** | The Workflow tab is purely a read-only aggregation view. It depends on state from other tabs (feed count, selected items, draft status, publish status) but introduces no new data-writing operations. It can be built last or first without blocking other features. |
| **Negotiable** | Core: visual pipeline with stage status, item counts, automated-vs-manual distinction, navigate-to-stage. Negotiable for later: per-run history, timing/duration metrics per stage, exportable workflow summary, real-time live progress animation during auto-publish. |
| **Valuable** | It reduces cognitive load for editors who need a quick health check of the entire workflow. For a newsletter with multiple contributors or managers, it serves as a shared dashboard to track progress across the pipeline. |
| **Estimable** | Purely presentational; data comes from existing state. Estimated at 3–5 story points including stage-status aggregation logic and navigation wiring. |
| **Small** | Completable in a single sprint. No new backend calls or AI integration required. |
| **Testable** | Stage item counts, status labels, automated-vs-manual indicators, and navigation links are all deterministic given known input state; fully unit and component testable. |

---

## User Stories

### US-WRK-01 — See the full pipeline at a glance
> **As an** editor,
> **I want to** see all four pipeline stages (RSS, Selection, Draft, Publish) in a single view,
> **so that** I can understand the overall progress of the current newsletter edition without switching tabs.

### US-WRK-02 — Check the status of each stage
> **As an** editor,
> **I want to** see the current status and key metrics of each pipeline stage (e.g., number of feeds active, items collected, items selected, drafts approved, articles published),
> **so that** I can immediately spot where the pipeline is blocked or awaiting action.

### US-WRK-03 — Navigate to a stage from the workflow view
> **As an** editor,
> **I want to** click on a pipeline stage in the workflow view and be taken directly to that tab,
> **so that** I can act on a bottleneck without manually finding the correct tab in the navigation bar.

### US-WRK-04 — Distinguish automated steps from manual steps
> **As an** editor,
> **I want to** see which pipeline steps are handled automatically (AI processing) and which require my manual input,
> **so that** I know exactly where my attention and decisions are needed.

---

## Acceptance Criteria

### FR-WRK-01 / US-WRK-01 — Full pipeline view
- [ ] The Workflow tab displays all four stages: RSS Feed Collection, News Selection, Article Drafting, CMS Publishing.
- [ ] The stages are displayed in the correct sequential order.
- [ ] The view renders correctly regardless of the current state of any stage (e.g., empty feeds, no items selected).

### FR-WRK-02 / US-WRK-02 — Stage status and metrics
- [ ] Each stage card/node displays at minimum: a stage name, a status label (e.g., "Active", "Pending", "Complete"), and a relevant item count.
  - RSS stage: number of active feeds, total items today.
  - Selection stage: number of items available, number selected.
  - Draft stage: number of drafts generated, number approved.
  - Publish stage: number published, number pending, number failed.
- [ ] Displayed values reflect the current application state at the time the tab is opened or refreshed.

### FR-WRK-03 / US-WRK-03 — Navigate to stage
- [ ] Each stage in the workflow view is clickable.
- [ ] Clicking a stage navigates to the corresponding tab (RSS Feeds, Selection, Draft, or Publish).
- [ ] Navigation from the workflow view preserves the state of the destination tab (i.e., no data reset occurs).

### FR-WRK-04 / US-WRK-04 — Automated vs. manual distinction
- [ ] Each pipeline stage is visually labelled or tagged as either "Automated" (AI/system-driven) or "Manual" (editor decision required).
  - Automated: RSS feed polling, AI categorisation, AI draft generation.
  - Manual: news item selection, draft approval/rejection, publish action.
- [ ] The visual distinction uses icons, colours, or labels that are clearly legible.

---

*Feature version: 1.0 — March 10, 2026*
