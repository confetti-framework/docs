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
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: '#00828e' }],
    ['link', { rel: "shortcut icon", href: "https://raw.githubusercontent.com/confetti-framework/docs/gh-pages/favicon.ico"}]
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
        text: 'Github',
        link: 'https://github.com/confetti-framework/confetti',
      },
      {
        text: 'Twitter / News',
        link: 'https://twitter.com/ConfettiFw',
      },
      {
        text: 'Becoming a sponsor',
        link: 'https://www.patreon.com/confetti_framework',
      },
    ],
    sidebarDepth: 10,
    activeHeaderLinks: false,
    sidebar:
      [
        {
          title: 'Get Started',
          collapsable: false,
          sidebarDepth: 0,
          children: [
            '/get-started/meet',
            '/get-started/installation',
            '/get-started/your-first-project',
          ]
        },
        {
          title: 'Architecture Concepts',
          collapsable: false,
          sidebarDepth: 1,
          children: [
            '/architecture-concepts/lifecycle',
            '/architecture-concepts/container',
            '/architecture-concepts/providers',
          ]
        },
        {
          title: 'The Basics',
          collapsable: false,
          sidebarDepth: 3,
          children: [
              '/the-basics/configuration',
              '/the-basics/routing',
              '/the-basics/middleware',
              '/the-basics/requests',
              '/the-basics/responses',
              '/the-basics/views',
              '/the-basics/validation',
              '/the-basics/errors',
              '/the-basics/logging',
          ]
        },
        {
          title: 'Digging Deeper',
          collapsable: false,
          sidebarDepth: 3,
          children: [
              '/digging-deeper/commands',
          ]
        },
        {
          title: 'Discussions',
          collapsable: true,
          sidebarDepth: 1,
          children: [
              ['https://github.com/confetti-framework/confetti/discussions/110', 'ORM & Database '],
          ]
        },
      ],
    algolia: {
      apiKey: '0dcf5e48e640b2a4050ab34effe02650',
      indexName: 'confetti-framework'
    }
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
    '@dovyp/vuepress-plugin-clipboard-copy',
    ['minimal-analytics', {ga: 'UA-188653694-1'}],
  ]
}
