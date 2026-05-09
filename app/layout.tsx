import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Forge — One clear next step for today',
  description: 'A few questions. No device required. Get one clear action for today.',
  openGraph: {
    images: [],
  },
  twitter: {
    card: 'summary_large_image',
    images: [],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
