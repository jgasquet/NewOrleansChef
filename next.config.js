/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'localhost',
      's1.ticketm.net',
      'img.evbuc.com',
      'd36tnp772eyphs.cloudfront.net',
      'maps.googleapis.com'
    ],
  },
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_TICKETMASTER_KEY: process.env.NEXT_PUBLIC_TICKETMASTER_KEY,
    NEXT_PUBLIC_UBER_CLIENT_ID: process.env.NEXT_PUBLIC_UBER_CLIENT_ID,
    NEXT_PUBLIC_GOOGLE_MAPS_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
  },
}

module.exports = nextConfig
