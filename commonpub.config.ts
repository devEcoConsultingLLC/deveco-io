import { defineCommonPubConfig } from '@commonpub/config';

export default defineCommonPubConfig({
  instance: {
    name: 'devEco.io',
    domain: 'deveco.io',
    description: 'Edge AI project sharing and community platform',
    contentTypes: ['project', 'blog'],
    contestCreation: 'staff',
  },
  features: {
    content: true,
    social: true,
    hubs: true,
    docs: false,
    video: false,
    contests: true,
    learning: false,
    explainers: false,
    editorial: true,
    federation: true,
    federateHubs: true,
    seamlessFederation: true,
    admin: true,
  },
  auth: {
    emailPassword: true,
    magicLink: false,
    passkeys: false,
    trustedInstances: ['commonpub.io'],
  },
  // Brand theme as a registered light/dark pair. With defaultTheme pinned the
  // instance no longer rides the layer's stoa fallback, so the data-theme attr
  // and the Light/Dark toggle resolve within the deveco family
  // (deveco <-> deveco-dark) instead of stoa/stoa-dark. CSS lives in
  // assets/deveco-theme.css (loaded via the nuxt.config css array).
  themes: [
    {
      id: 'deveco',
      name: 'devEco Light',
      description: 'Mint accent on warm gray, rounded geometry',
      family: 'deveco',
      isDark: false,
      pairId: 'deveco-dark',
    },
    {
      id: 'deveco-dark',
      name: 'devEco Dark',
      description: 'Deep teal dark mode with the mint accent',
      family: 'deveco',
      isDark: true,
      pairId: 'deveco',
    },
  ],
  defaultTheme: 'deveco',
});
