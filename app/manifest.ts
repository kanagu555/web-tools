import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'KodeKit - Your Ultimate Development Toolkit',
    short_name: 'KodeKit',
    description: 'KodeKit offers free online developer tools including PDF converters, text translators, code formatters, and design utilities.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3f51b5',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}