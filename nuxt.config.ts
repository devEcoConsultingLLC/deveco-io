
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  components: {
    dirs: [
      { path: '~/components' },
    ],
  },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
          crossorigin: 'anonymous',
        },
      ],
    },
  },
  css: [
    '@commonpub/ui/theme/base.css',
    '@commonpub/ui/theme/dark.css',
    '@commonpub/ui/theme/components.css',
    '@commonpub/ui/theme/prose.css',
    '@commonpub/ui/theme/layouts.css',
    '@commonpub/ui/theme/forms.css',
    '@commonpub/ui/theme/editor-panels.css',
    '~/assets/deveco-theme.css',
  ],
  modules: [],
  runtimeConfig: {
    databaseUrl: '',
    authSecret: 'dev-secret-change-me',
    // Email — "console" (dev), "smtp" (nodemailer), or "resend" (Resend API)
    emailAdapter: 'console',
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPass: '',
    smtpFrom: '',
    resendApiKey: '',
    resendFrom: '',
    // Storage — set S3_BUCKET to enable S3/DO Spaces/MinIO, otherwise local filesystem
    s3Bucket: '',
    s3Region: 'us-east-1',
    s3Endpoint: '',
    s3AccessKey: '',
    s3SecretKey: '',
    s3PublicUrl: '',
    uploadDir: './uploads',
    public: {
      siteUrl: 'http://localhost:3000',
      domain: 'localhost:3000',
      siteName: 'devEco.io',
      siteDescription: 'Edge AI project sharing and community platform',
      // Feature flags — override with NUXT_PUBLIC_FEATURES_HUBS=false etc.
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
      // Enabled content types (comma-separated) — override with NUXT_PUBLIC_CONTENT_TYPES=project,blog
      contentTypes: 'project,blog',
      // Who can create contests — override with NUXT_PUBLIC_CONTEST_CREATION=staff
      contestCreation: 'staff',
    },
  },
  routeRules: {
    ...(process.env.NUXT_PUBLIC_FEATURES_DOCS !== 'false' && {
      '/docs/**': { prerender: true },
    }),
  },
  nitro: {
    preset: 'node-server',
    // Serve local uploads directory in dev (production uses S3/Spaces)
    publicAssets: [
      {
        dir: '../uploads',
        baseURL: '/uploads',
        maxAge: 60 * 60 * 24, // 1 day cache
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
