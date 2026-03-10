import { NextRequest, NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';

const ALLOWED_HOSTS = new Set(['feeds.nos.nl', 'alerts.google.com']);

export interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
}

function toStr(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return '';
}

function extractLink(raw: unknown): string {
  if (typeof raw === 'string') return raw;
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    return toStr(obj['@_href'] ?? obj['#text'] ?? '');
  }
  return '';
}

function toArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (value != null) return [value];
  return [];
}

function extractItems(channel: Record<string, unknown>): unknown[] {
  const rssItems = toArray(channel.item);
  if (rssItems.length > 0) return rssItems;
  return toArray(channel.entry);
}

function mapItem(item: unknown): FeedItem {
  const i = item as Record<string, unknown>;
  return {
    title: toStr(i.title),
    link: extractLink(i.link),
    pubDate: toStr(i.pubDate ?? i.published ?? i.updated ?? ''),
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get('url');

  if (!rawUrl) {
    return NextResponse.json({ error: 'Missing url parameter.' }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: 'Invalid URL.' }, { status: 400 });
  }

  if (!ALLOWED_HOSTS.has(parsed.hostname)) {
    return NextResponse.json({ error: 'Feed host not allowed.' }, { status: 403 });
  }

  let xml: string;
  try {
    const res = await fetch(rawUrl, {
      headers: { 'User-Agent': 'smokeless-generation-nl/1.0 RSS reader' },
      // Only follow a limited number of redirects to the same allowed host
      redirect: 'follow',
    });
    if (!res.ok) {
      return NextResponse.json({ error: `Upstream error: ${res.status}` }, { status: 502 });
    }
    xml = await res.text();
  } catch {
    return NextResponse.json({ error: 'Failed to fetch feed.' }, { status: 502 });
  }

  const parser = new XMLParser({ ignoreAttributes: false });
  const doc = parser.parse(xml);

  const channel = doc?.rss?.channel ?? doc?.feed;
  if (!channel) {
    return NextResponse.json({ error: 'Could not parse feed.' }, { status: 422 });
  }

  // Support both RSS <item> and Atom <entry>
  const rawItems = extractItems(channel);
  const items: FeedItem[] = rawItems.slice(0, 50).map(mapItem);
  return NextResponse.json(items);
}
