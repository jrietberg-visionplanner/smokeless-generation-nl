# Feature: Article Drafting

> Functional requirements: FR-DFT-01 – FR-DFT-08
> Status: Preliminary — March 10, 2026

---

## Description

Article Drafting is the AI-powered authoring step of the workflow. For each news item the editor selected, the system calls an AI service to generate a Dutch-language article draft consisting of a title, an introductory paragraph, and a summary. The editor can review each draft, inline-edit any of the three fields, regenerate a draft they are unhappy with, and approve or reject each article individually. Only approved drafts proceed to the publishing queue. This feature is the primary value driver of the AI assistant, turning raw news items into publication-ready article content within seconds.

---

## INVEST Analysis

| Criterion | Assessment |
|-----------|------------|
| **Independent** | Drafting depends on the selection of items (FR-SEL-08) but is fully independent of the CMS publishing step. The AI generation can be developed against a mock API allowing UI work to proceed in parallel with backend prompt engineering. |
| **Negotiable** | Core: generate, display, edit, approve/reject. Negotiable for later iterations: version history of edits, rich-text formatting, word-count guidance, tone/style selection, multi-language output, collaborative review. |
| **Valuable** | This feature eliminates the most time-consuming part of the newsletter workflow — writing article copy. A single AI call per item replaces 15–30 minutes of manual writing per article, with an estimated 50,000-circulation impact per edition. |
| **Estimable** | AI generation + display per draft: 3 points. Inline editing: 3 points. Approve/reject state management: 2 points. Regenerate action: 2 points. Total: approximately 10 story points. |
| **Small** | Fits within two sprints at most. Can be split: Sprint A delivers generation + display + approve/reject; Sprint B adds inline editing and regenerate. |
| **Testable** | Generation calls are testable via mocked AI responses. Inline edit state, approve/reject flags, and dirty-draft indicators are deterministic UI state that can be fully unit-tested. |

---

## User Stories

### US-DFT-01 — AI draft generation
> **As an** editor,
> **I want** the system to automatically generate a draft article (title, intro, summary) for each selected news item,
> **so that** I start the editorial review with a ready-to-use Dutch text rather than a blank page.

### US-DFT-02 — View all drafts
> **As an** editor,
> **I want to** see all generated drafts listed together with their title, intro, and summary visible,
> **so that** I can review the full set at once and plan which ones need most editing.

### US-DFT-03 — Edit a draft title
> **As an** editor,
> **I want to** inline-edit the AI-generated title of a draft,
> **so that** I can adjust it to match our publication's style without leaving the page.

### US-DFT-04 — Edit a draft intro and summary
> **As an** editor,
> **I want to** inline-edit the introduction and summary of a draft,
> **so that** I can correct facts, improve tone, or add context from the source article.

### US-DFT-05 — Preserve edits within the session
> **As an** editor,
> **I want** my edits to be kept as I navigate between drafts within the same session,
> **so that** I don't lose work when switching back and forth between cards.

### US-DFT-06 — Regenerate a specific draft
> **As an** editor,
> **I want to** request a fresh AI-generated draft for a single article,
> **so that** if I am unhappy with the output I can get an alternative without re-running the entire batch.

### US-DFT-07 — Approve a draft
> **As an** editor,
> **I want to** explicitly approve a draft after reviewing and editing it,
> **so that** only editorially signed-off articles enter the publishing queue.

### US-DFT-08 — Reject a draft
> **As an** editor,
> **I want to** reject a draft I do not want to publish,
> **so that** it is excluded from the publishing queue without affecting other drafts.

### US-DFT-09 — Identify unsaved drafts
> **As an** editor,
> **I want to** see a visual indicator on drafts that have been edited but not yet approved,
> **so that** I don't accidentally publish unreviewed edits.

---

## Acceptance Criteria

### FR-DFT-01 / US-DFT-01 — AI draft generation
- [ ] On entering the Draft tab, a draft (title, intro, summary) is generated for each selected item.
- [ ] Generation is performed in Dutch (nl-NL).
- [ ] A loading indicator is shown per draft while the AI request is in progress.
- [ ] If the AI request fails, an error state is shown for that draft with a retry option.
- [ ] Each draft is generated within 10 seconds under normal conditions (NFR-PF-05).

### FR-DFT-02 / US-DFT-02 — Draft display
- [ ] Each draft is displayed as a card or section showing title, intro paragraph, and summary.
- [ ] All three fields are visible without requiring an expand/collapse interaction.

### FR-DFT-03 & FR-DFT-04 / US-DFT-03 & US-DFT-04 — Inline editing
- [ ] Each of the three fields (title, intro, summary) is editable inline (click-to-edit or always-editable textarea/input).
- [ ] Edits are reflected immediately in the UI without submitting a form.
- [ ] There is no character limit that prevents practical editorial content.

### FR-DFT-04 / US-DFT-05 — Session persistence
- [ ] Edits made to a draft are retained when the editor navigates to another tab and returns to Draft within the same browser session.
- [ ] Edits are retained when switching between draft cards.

### FR-DFT-05 / US-DFT-06 — Regenerate
- [ ] A "Regenerate" action is available per draft.
- [ ] Clicking Regenerate replaces only that draft's content with a new AI-generated version.
- [ ] All other drafts are unaffected by a single regeneration.
- [ ] A confirmation or undo mechanism prevents accidental loss of manual edits.

### FR-DFT-06 / US-DFT-07 — Approve
- [ ] Each draft has an "Approve" action.
- [ ] Approved drafts are visually marked as approved (e.g., green badge/checkmark).
- [ ] Approved drafts appear in the Publish tab's queue.

### FR-DFT-07 / US-DFT-08 — Reject
- [ ] Each draft has a "Reject" action.
- [ ] Rejected drafts are visually marked as rejected and visually distinguished from approved/pending ones.
- [ ] Rejected drafts do not appear in the Publish tab's queue.
- [ ] A rejected draft can be un-rejected (reinstated to pending) if the editor changes their mind.

### FR-DFT-08 / US-DFT-09 — Unsaved/unapproved indicator
- [ ] Drafts that have been edited but not approved show a distinct visual indicator (e.g., "Edited – pending approval" label).
- [ ] The indicator is cleared once the draft is approved.

---

*Feature version: 1.0 — March 10, 2026*
