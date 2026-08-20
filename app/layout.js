import { Geist, Playfair_Display } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata = {
  title: 'CreationStation Printing — Design Assistant',
  description:
    'Chat with CreationStation\u2019s design assistant to create business cards, flyers, posters, brochures, and more. See live proofs and approve before you print.',
}

export const viewport = {
  themeColor: '#1e3a8a',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${playfair.variable} bg-background`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
