import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Base Power Survey App',
  description: 'Mobile-first site survey application with AR guidance',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-primary bg-aluminum text-grounded antialiased">
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}
