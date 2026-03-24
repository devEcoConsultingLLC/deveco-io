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
    federation: true,
    admin: true,
  },
  auth: {
    emailPassword: true,
    magicLink: false,
    passkeys: false,
  },
});
