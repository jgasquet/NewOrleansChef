import './globals.css'
import { Playfair_Display, Crimson_Pro, Bebas_Neue } from 'next/font/google'

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const crimson = Crimson_Pro({ 
  subsets: ['latin'],
  variable: '--font-crimson',
  display: 'swap',
})

const bebas = Bebas_Neue({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

export const metadata = {
  title: 'New Orleans Chef | Discover the Soul of NOLA Cuisine',
  description: 'Your gateway to New Orleans\' legendary food scene. Discover restaurants, book tables, find events, and coordinate rides with Uber.',
  keywords: 'New Orleans restaurants, NOLA dining, Creole food, Cajun cuisine, New Orleans events, restaurant reservations',
  authors: [{ name: 'GetNth / NthTrip LLC' }],
  openGraph: {
    title: 'New Orleans Chef',
    description: 'Discover the soul of New Orleans cuisine',
    url: 'https://neworleanschef.com',
    siteName: 'New Orleans Chef',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'New Orleans Chef',
    description: 'Discover the soul of New Orleans cuisine',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${crimson.variable} ${bebas.variable}`}>
      <body>
        {children}
      </body>
    </html>
  )
}
