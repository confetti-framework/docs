const { description } = require('../package.json')

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'Confetti',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  base: '/docs/',

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#00828e' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    editLinks: false,
    editLinkText: '',
    logo: 'https://avatars1.githubusercontent.com/u/57274804?s=400&u=058242df13e206950c08efd68a540445ce4da17f&v=4',
    lastUpdated: false,
    nav: [
      {
        text: 'Documentation',
        link: '/docs/',
      },
      {
        text: 'Github',
        link: 'https://github.com/confetti-framework',
      },
      {
        text: 'Edit',
        link: 'https://github.com/confetti-framework/docs/tree/main/docs/docs',
      },
    ],
    sidebarDepth: 10,
    activeHeaderLinks: false,
    sidebar:
      [
        {
          title: 'Get Started',
          collapsable: false,
          sidebarDepth: 1,
          children: [
            '/docs/get-started/installation',
            '/docs/get-started/configuration',
          ]
        },
        {
          title: 'Architecture Concepts',
          collapsable: false,
          sidebarDepth: 1,
          children: [
            '/docs/architecture-concepts/lifecycle',
            '/docs/architecture-concepts/container',
            '/docs/architecture-concepts/providers',
          ]
        },
        {
          title: 'The Basics',
          collapsable: false,
          sidebarDepth: 3,
          children: [
              '/docs/the-basics/routing',
              '/docs/the-basics/middleware',
              '/docs/the-basics/requests',
              '/docs/the-basics/responses',
              '/docs/the-basics/views',
              '/docs/the-basics/validation',
              '/docs/the-basics/errors',
              '/docs/the-basics/logging',
          ]
        },
      ]
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
  ]
}
