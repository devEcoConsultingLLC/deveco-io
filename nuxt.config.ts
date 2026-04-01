export default defineNuxtConfig({
  extends: ['../commonpub/layers/base'],
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },
  css: [
    '~/assets/deveco-theme.css',
  ],
  runtimeConfig: {
    public: {
      siteName: 'devEco.io',
      siteDescription: 'Edge AI project sharing and community platform',
      features: {
        content: true,
        social: true,
        hubs: true,
        docs: false,
        video: false,
        contests: true,
        learning: false,
        explainers: false,
        federation: true,
        admin: true,
      },
      contentTypes: 'project,blog',
      contestCreation: 'staff',
    },
  },
  nitro: {
    preset: 'node-server',
    publicAssets: [
      {
        dir: '../uploads',
        baseURL: '/uploads',
        maxAge: 60 * 60 * 24,
      },
    ],
  },
  vite: {
    server: {
      fs: {
        allow: ['..'],
      },
    },
  },
});
