/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'yhblxzdydirndlprmnan.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.cdn.filesafe.space',
      },
    ],
  },
  async redirects() {
    const propertyRedirects = [
      '332f-golf-course-way-jolly-harbour',
      '335c-jolly-harbour',
      '408a-north-finger-jolly-harbour-antigua',
      '408e-north-finger-jolly-harbour-antigua',
      '416d-north-finger-jolly-harbour',
      '421e-north-finger-jolly-harbour-antigua',
      '421f-north-finger-jolly-harbour-antigua',
      'beachsands-south-finger-jolly-harbour',
      'blue-haven-jolly-harbour',
      'cedar-valley-plots-antigua',
      'creekside-warehouse-big-creek-antigua',
      'driftwood-villa',
      'flamboyant-house',
      'foxtail-house-royal-gardens',
      'galley-bay-heights-plot-antigua',
      'harbour-island-townhouse-3-jolly-harbour',
      'hibiscus-house-valley-church-antigua',
      'horseferd-hill-antigua',
      'indian-creek-piccadilly-antigua',
      'jolly-beach-nikki-beach-condos',
      'jolly-beach-nikki-beach-villas',
      'jolly-manor-south-finger-jolly-harbour',
      'lot-729-seatons-antigua',
      'palm-villa-st-mary-antigua',
      'paradise-view-dickenson-bay-antigua',
      'pearns-point-antigua',
      'south-beach-jolly-harbour',
      'sugar-ridge-antigua',
      'sugar-ridge-condos-antigua',
      'the-escape-3304',
      'the-top-house-crabbe-hill-antigua',
      'the-white-house-mckinnons-antigua',
      'valley-church-artisan-retreat',
      'verandah-estates-plot-27',
      'verandah-estates-plot-35',
      'villa-seabreeze-st-paul-antigua',
    ].map(slug => ({
      source: `/${slug}`,
      destination: `/properties/${slug}`,
      permanent: true,
    }))

    const campaignRedirects = [
      {
        source: '/airport',
        destination: 'https://www.remax-365-antigua.com/?utm_source=airport&utm_medium=qr',
        permanent: false,
      },
      {
        source: '/containers',
        destination: 'https://www.remax-365-antigua.com/?utm_source=container&utm_medium=qr',
        permanent: false,
      },
      {
        source: '/homepage',
        destination: '/',
        permanent: true,
      },
    ]

    return [...propertyRedirects, ...campaignRedirects]
  },
}

module.exports = nextConfig