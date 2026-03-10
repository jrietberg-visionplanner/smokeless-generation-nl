# Smokeless Generation NL – Newsletter AI Assistant

AI-Assisted Newsletter Workflow for **Smokeless Generation NL** (Opgelucht Newsletter, 50,000 circulation).

Streamline your newsletter creation with automated RSS feed processing, intelligent categorization, and seamless Joomla CMS publishing.

## Features

| Tab | Description |
|---|---|
| **RSS Feeds** | Manage Google Alerts RSS feeds; add, toggle, and refresh sources |
| **Selection** | Review AI-categorized news items and select articles for drafting |
| **Draft** | AI-generated article drafts with inline editing (title, intro, summary) |
| **Publish** | Push approved drafts to Joomla CMS (manual or auto-publish mode) |
| **Workflow** | Visual overview of the full automated + manual pipeline |

## Tech Stack

- [Next.js 14](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/) icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── globals.css        # Tailwind base styles
│   ├── layout.tsx         # Root layout & metadata
│   └── page.tsx           # Main page with tab routing
└── components/
    ├── Header.tsx         # App-wide header
    ├── TabNav.tsx         # Tab navigation bar
    └── tabs/
        ├── RssFeedsTab.tsx  # RSS feed management
        ├── SelectionTab.tsx # News selection & review
        ├── DraftTab.tsx     # Article draft preview & editing
        ├── PublishTab.tsx   # CMS publishing interface
        └── WorkflowTab.tsx  # Complete workflow overview
```

## Deployment

Deploy instantly on [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jrietberg-visionplanner/smokeless-generation-nl)
