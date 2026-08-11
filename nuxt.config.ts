import siteConfig from './commonpub.config';
export default defineNuxtConfig({
  extends: ['@commonpub/layer'],
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
        // Mirrors commonpub.config.ts's features.analytics. This block only
        // carries NUXT_PUBLIC_FEATURES_* env overrides; the value the app reads
        // comes from commonpub.config.ts merged with the DB overrides, so the
        // real switch is there, not here.
        analytics: true,
      },
      contentTypes: 'project,blog',
      contestCreation: 'staff',
      // Wired from commonpub.config.ts rather than hand-copied. Until this
      // existed NOTHING from that file reached the client, which is why the
      // cookie-consent banner could never render here: it only appears once the
      // instance declares a non-essential cookie, and it had no way to learn of
      // one. The analytics provider's cookies are derived from the registry, so
      // declaring the provider is enough.
      instanceCookies: siteConfig.config.cookies ?? [],
      analytics: siteConfig.config.analytics ?? { provider: 'none' },
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

