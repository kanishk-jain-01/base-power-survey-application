import type { Metadata } from 'next';
import './globals.css';
import PageTransition from '@/components/PageTransition';

export const metadata: Metadata = {
  title: 'Base Power Survey App',
  description: 'Mobile-first site survey application with AR guidance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-primary bg-aluminum text-grounded antialiased">
        <main className="min-h-dvh">
          <PageTransition>{children}</PageTransition>
        </main>
      </body>
    </html>
  );
}
