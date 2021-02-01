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

  base: '',

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
        text: 'Documentation',
        link: '/docs/get-started/meet.html',
      },
      {
        text: 'Github',
        link: 'https://github.com/confetti-framework/confetti',
      },
      {
        text: 'Twitter',
        link: 'https://twitter.com/ConfettiFw',
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
            '/docs/get-started/meet',
            '/docs/get-started/installation',
            '/docs/get-started/your-first-project',
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
              '/docs/the-basics/configuration',
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
  ]
}
