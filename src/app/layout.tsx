import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RAJ AI APP BUILDER - Generate React Apps with AI',
  description: 'Build beautiful React applications instantly using AI. Powered by Cerebras AI.',
  keywords: ['AI', 'React', 'Code Generator', 'Cerebras', 'Next.js', 'TypeScript'],
  openGraph: { title: 'RAJ AI APP BUILDER', description: 'Generate React apps with AI' },
  twitter: { card: 'summary_large_image', title: 'RAJ AI APP BUILDER', description: 'Generate React apps with AI' },
};

export const viewport = 'width=device-width, initial-scale=1';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
