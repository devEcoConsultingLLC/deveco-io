export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss', '@nuxt/fonts'],

  css: ['~/assets/css/main.css'],

  fonts: {
    families: [
      { name: 'Poppins', weights: [400, 500, 600, 700, 800] },
      { name: 'Nunito', weights: [700, 800, 900] },
      { name: 'JetBrains Mono', weights: [400, 500] },
    ],
  },

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    authSecret: process.env.AUTH_SECRET,
    s3Endpoint: process.env.S3_ENDPOINT,
    s3AccessKey: process.env.S3_ACCESS_KEY,
    s3SecretKey: process.env.S3_SECRET_KEY,
    s3Bucket: process.env.S3_BUCKET,
    meilisearchHost: process.env.MEILISEARCH_HOST,
    meilisearchApiKey: process.env.MEILISEARCH_API_KEY,
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3001',
    },
  },

  app: {
    head: {
      title: 'devEco.io — Edge AI Projects & Community',
      meta: [
        { name: 'description', content: 'Open-source Edge AI project sharing and community platform backed by Edge AI Foundation.' },
        { property: 'og:title', content: 'devEco.io — Edge AI Projects & Community' },
        { property: 'og:description', content: 'Share Edge AI projects with code, schematics, and bills of materials.' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  typescript: {
    strict: true,
  },
});
