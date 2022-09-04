import { docsearchPlugin } from '@vuepress/plugin-docsearch'
import { backToTopPlugin } from '@vuepress/plugin-back-to-top'
import { defaultTheme } from '@vuepress/theme-default'
import { mediumZoomPlugin } from '@vuepress/plugin-medium-zoom'
import { googleAnalyticsPlugin } from '@vuepress/plugin-google-analytics'
const { description } = require('../package.json')


const config = {
    title: 'Confetti',
    description: description,
    base: '/docs/',
    head: [
        ['meta', { name: 'theme-color', content: '#00828e' }],
        ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
        ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: '#00828e' }],
        ['link', { rel: 'stylesheet', href: 'https://use.typekit.net/ins2wgm.css' }],
        ['link', { rel: "shortcut icon", href: "https://raw.githubusercontent.com/confetti-framework/docs/gh-pages/favicon.ico"}]
    ],
    theme: defaultTheme({
        sidebarDepth: 10,
        activeHeaderLinks: false,
        logo: 'https://avatars1.githubusercontent.com/u/57274804?s=400&u=058242df13e206950c08efd68a540445ce4da17f&v=4',
        lastUpdated: false,
        navbar: [
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
        sidebar: [
          {
            text: 'Get Started',
            collapsible: true,
            sidebarDepth: 0,
            children: [
              '/get-started/meet',
              '/get-started/installation',
              '/get-started/your-first-project',
            ]
          },
          {
            text: 'Architecture Concepts',
            collapsible: true,
            sidebarDepth: 1,
            children: [
              '/architecture-concepts/lifecycle',
              '/architecture-concepts/container',
              '/architecture-concepts/providers',
            ]
          },
          {
            text: 'The Basics',
            collapsible: true,
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
            text: 'Digging Deeper',
            collapsible: true,
            sidebarDepth: 3,
            children: [
                '/digging-deeper/commands',
            ]
          },
          {
            text: 'Discussions',
            collapsible: true,
            sidebarDepth: 1,
            children: [
                ['https://github.com/confetti-framework/confetti/discussions/110', 'ORM & Database '],
            ]
          },
        ],
    }),
    plugins: [
        docsearchPlugin({
            apiKey: '0dcf5e48e640b2a4050ab34effe02650',
            indexName: 'confetti-framework'
        }),
        backToTopPlugin(),
        mediumZoomPlugin({}),
        googleAnalyticsPlugin({
            id: 'UA-188653694-1',
        }),
    ],
}

export default config
