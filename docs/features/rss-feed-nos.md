# Implementation Plan: NOS RSS Feed — General News

**Feature:** Add a real NOS RSS feed for the subject "General news" pointing to `https://feeds.nos.nl/nosnieuwsalgemeen`.

---

## Task 1 — Add the NOS feed to the initial feed list

**What:** Add a new entry to `INITIAL_FEEDS` in `src/components/tabs/RssFeedsTab.tsx`.

**File to modify:** `src/components/tabs/RssFeedsTab.tsx`

**Change:**
```ts
{ id: '6', name: 'General news (NOS)', url: 'https://feeds.nos.nl/nosnieuwsalgemeen', active: true, itemsToday: 0 },
```

**Prerequisites:** None.

---

## Task 2 — Create a server-side RSS proxy API route

**What:** Because browsers block cross-origin RSS fetches, create a Next.js API route that fetches the feed server-side and returns parsed items.

**File to create:** `src/app/api/rss/route.ts`

**Logic:**
- Accept a `url` query parameter.
- `fetch()` the RSS URL from the server.
- Parse the XML response using `fast-xml-parser`.
- Return a JSON array of `{ title, link, pubDate }` items.
- Validate the `url` against an allowlist of permitted feed domains to prevent SSRF (e.g. `feeds.nos.nl`, `alerts.google.com`).

**Prerequisites:** Task 3 (parser package must be installed first).

---

## Task 3 — Install an XML parsing dependency

**What:** Install `fast-xml-parser` to parse the RSS/XML response in the API route.

**Command:**
```bash
npm install fast-xml-parser
```

**Files modified:** `package.json`, `package-lock.json` (auto-updated).

**Prerequisites:** None.

---

## Task 4 — Update the `Feed` interface to hold fetched items

**What:** Extend the `Feed` type in `RssFeedsTab.tsx` to store real fetched article data.

**File to modify:** `src/components/tabs/RssFeedsTab.tsx`

**Change:**
```ts
interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
}

interface Feed {
  id: string;
  name: string;
  url: string;
  active: boolean;
  itemsToday: number;
  items?: FeedItem[];    // ← add this
}
```

**Prerequisites:** Task 1.

---

## Task 5 — Wire `handleRefresh` to call the API route

**What:** Replace the `setTimeout` mock in `handleRefresh` with a real `fetch` call to `/api/rss?url=<encoded-url>` for each active feed, updating `itemsToday` and `items` from the response.

**File to modify:** `src/components/tabs/RssFeedsTab.tsx`

**Change:**
```ts
async function handleRefresh() {
  setRefreshing(true);
  const updated = await Promise.all(
    feeds.map(async (feed) => {
      if (!feed.active) return feed;
      const res = await fetch(`/api/rss?url=${encodeURIComponent(feed.url)}`);
      if (!res.ok) return feed;
      const items: FeedItem[] = await res.json();
      return { ...feed, items, itemsToday: items.length };
    }),
  );
  setFeeds(updated);
  setRefreshing(false);
}
```

**Prerequisites:** Tasks 2, 3, 4.

---

## Task 6 — Display fetched NOS articles in the UI

**What:** Below each active feed row, render its latest `items` (title + link) when they are available.

**File to modify:** `src/components/tabs/RssFeedsTab.tsx`

**Change:** Add an inline list of article titles/links under the feed card row, only visible when `feed.items` is populated.

**Prerequisites:** Task 5.

---

## Summary

| Task | File | Action |
|------|------|--------|
| 1 | `src/components/tabs/RssFeedsTab.tsx` | Add NOS feed to `INITIAL_FEEDS` |
| 2 | `src/app/api/rss/route.ts` | Create RSS proxy API route |
| 3 | `package.json` | Install `fast-xml-parser` |
| 4 | `src/components/tabs/RssFeedsTab.tsx` | Extend `Feed` interface with `items` |
| 5 | `src/components/tabs/RssFeedsTab.tsx` | Wire `handleRefresh` to real API |
| 6 | `src/components/tabs/RssFeedsTab.tsx` | Display fetched articles in UI |

**Recommended execution order:** 3 → 2 → 1 → 4 → 5 → 6
