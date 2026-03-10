import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Newsletter AI Assistant – Smokeless Generation NL',
  description:
    'AI-Assisted Newsletter Workflow: automated RSS feed processing, intelligent categorization, and seamless CMS publishing for Smokeless Generation NL.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
