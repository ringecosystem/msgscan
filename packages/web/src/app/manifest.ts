import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Msgport scan',
    short_name: 'Msgport',
    icons: [
      {
        src: '/images/msgport192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/images/msgport512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ],
    theme_color: '#000',
    background_color: '#000',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    description:
      'The Msgport Scan is a one-stop solution for tracking the cross-chain message status and execution results for applications integrated with the Msgport protocol.'
  };
}
