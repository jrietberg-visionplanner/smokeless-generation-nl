# Functional Requirements
**Smokeless Generation NL – Newsletter AI Assistant**

> Status: Preliminary — March 10, 2026

---

## 1. RSS Feed Management

| ID | Requirement |
|----|-------------|
| FR-RSS-01 | The system must allow users to add a new RSS feed by providing a name and a valid RSS/Atom URL. |
| FR-RSS-02 | The system must validate that the URL field is non-empty and well-formed before saving a feed. |
| FR-RSS-03 | The system must display all configured feeds in a list, showing name, URL, active/inactive status, and number of items fetched today. |
| FR-RSS-04 | The user must be able to toggle individual feeds on or off without deleting them. |
| FR-RSS-05 | The user must be able to delete a feed from the list. |
| FR-RSS-06 | The system must provide a "Refresh" action that polls all active feeds and updates the item counts. |
| FR-RSS-07 | The system must display a summary of total active feeds and total items collected today. |
| FR-RSS-08 | The system must show a per-feed error indicator if a feed URL cannot be reached or parsed. |

---

## 2. News Selection

| ID | Requirement |
|----|-------------|
| FR-SEL-01 | The system must retrieve all news items collected from active RSS feeds and present them in the Selection tab. |
| FR-SEL-02 | The system must use an AI service to automatically categorise each news item (e.g., Smoking, E-cigarettes, Vaping, Tobacco Policy, Youth Health). |
| FR-SEL-03 | Each news item must display its title, source, publication date, category, and a short excerpt. |
| FR-SEL-04 | The user must be able to select one or more news items to include in the newsletter draft. |
| FR-SEL-05 | The user must be able to deselect previously selected items. |
| FR-SEL-06 | The user must be able to filter news items by category. |
| FR-SEL-07 | The system must display the total number of items available and the number currently selected. |
| FR-SEL-08 | The system must provide a "Proceed to Draft" action that is only enabled when at least one item is selected. |

---

## 3. Article Drafting

| ID | Requirement |
|----|-------------|
| FR-DFT-01 | The system must use an AI service to generate a draft article for each selected news item, consisting of a title, introduction paragraph, and summary. |
| FR-DFT-02 | Each draft must be displayed individually with all three generated fields visible. |
| FR-DFT-03 | The user must be able to inline-edit the title, introduction, and summary of each draft. |
| FR-DFT-04 | Edits made by the user must be preserved within the session and reflected immediately in the UI. |
| FR-DFT-05 | The user must be able to regenerate the AI draft for a single article without affecting other drafts. |
| FR-DFT-06 | The user must be able to approve or reject individual drafts. |
| FR-DFT-07 | Rejected drafts must be excluded from the publish queue. |
| FR-DFT-08 | The system must indicate drafts that have unsaved or unapproved edits. |

---

## 4. Publishing

| ID | Requirement |
|----|-------------|
| FR-PUB-01 | The system must display a publish queue containing all approved drafts. |
| FR-PUB-02 | The system must allow the user to publish individual articles to Joomla CMS via its REST API. |
| FR-PUB-03 | The system must support a manual publish mode (user triggers each article individually) and an auto-publish mode (all approved drafts are published in sequence). |
| FR-PUB-04 | The system must show the publish status of each article (pending, publishing, published, failed). |
| FR-PUB-05 | On a successful publish, the article status must update to "published" and include a timestamp. |
| FR-PUB-06 | On a failed publish, the system must display the error reason and allow the user to retry. |
| FR-PUB-07 | The user must be able to remove an article from the publish queue before it is published. |

---

## 5. Workflow Overview

| ID | Requirement |
|----|-------------|
| FR-WRK-01 | The system must provide a Workflow tab that gives a visual overview of the complete pipeline: RSS → Selection → Draft → Publish. |
| FR-WRK-02 | Each pipeline stage must show its current status (e.g., number of items, completion state). |
| FR-WRK-03 | The workflow view must allow the user to navigate directly to any pipeline stage. |
| FR-WRK-04 | The workflow view must distinguish between automated steps (AI processing) and manual steps (user decisions). |

---

## 6. Navigation & General UI

| ID | Requirement |
|----|-------------|
| FR-NAV-01 | The application must provide a persistent tab navigation bar with the following tabs: RSS Feeds, Selection, Draft, Publish, Workflow. |
| FR-NAV-02 | The active tab must be visually highlighted. |
| FR-NAV-03 | Switching tabs must preserve the state of all other tabs within the same session. |
| FR-NAV-04 | The application must display a persistent header with the product name and branding. |

---

## 7. Configuration & Integration

| ID | Requirement |
|----|-------------|
| FR-CFG-01 | The system must read the Joomla CMS API endpoint and credentials from server-side environment variables. |
| FR-CFG-02 | The system must read the AI service API key and model configuration from server-side environment variables. |
| FR-CFG-03 | The system must support configuration of the AI prompt templates used for categorisation and draft generation without code changes (e.g., via env or config file). |

---

*Document version: 1.0 — March 10, 2026*
