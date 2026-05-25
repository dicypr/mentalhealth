// ============================================================
// app/layout.tsx — Root layout, fonts, metadata
// ============================================================

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Serene — Mental Wellness Companion',
  description: 'A private, empathetic mental health monitoring platform powered by AI. Track your wellness, get personalised support, and connect with specialists when you need it.',
  keywords: ['mental health', 'wellness', 'therapy', 'anxiety', 'depression', 'support'],
  authors: [{ name: 'Serene Health' }],
  openGraph: {
    title: 'Serene — Mental Wellness Companion',
    description: 'Private, empathetic mental health support powered by AI.',
    type: 'website',
    locale: 'en_IN'
  },
  robots: { index: true, follow: true },
  viewport: 'width=device-width, initial-scale=1'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-stone-50 text-stone-900`}>
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  )
}
