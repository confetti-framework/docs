export const themeData = {
  "sidebarDepth": 10,
  "activeHeaderLinks": false,
  "logo": "https://avatars1.githubusercontent.com/u/57274804?s=400&u=058242df13e206950c08efd68a540445ce4da17f&v=4",
  "lastUpdated": false,
  "navbar": [
    {
      "text": "Github",
      "link": "https://github.com/confetti-framework/confetti"
    },
    {
      "text": "Twitter / News",
      "link": "https://twitter.com/ConfettiFw"
    },
    {
      "text": "Becoming a sponsor",
      "link": "https://www.patreon.com/confetti_framework"
    }
  ],
  "sidebar": [
    {
      "text": "Get Started",
      "collapsible": true,
      "sidebarDepth": 0,
      "children": [
        "/get-started/meet",
        "/get-started/installation",
        "/get-started/your-first-project"
      ]
    },
    {
      "text": "Architecture Concepts",
      "collapsible": true,
      "sidebarDepth": 1,
      "children": [
        "/architecture-concepts/lifecycle",
        "/architecture-concepts/container",
        "/architecture-concepts/providers"
      ]
    },
    {
      "text": "The Basics",
      "collapsible": true,
      "sidebarDepth": 3,
      "children": [
        "/the-basics/configuration",
        "/the-basics/routing",
        "/the-basics/middleware",
        "/the-basics/requests",
        "/the-basics/responses",
        "/the-basics/views",
        "/the-basics/validation",
        "/the-basics/errors",
        "/the-basics/logging"
      ]
    },
    {
      "text": "Digging Deeper",
      "collapsible": true,
      "sidebarDepth": 3,
      "children": [
        "/digging-deeper/commands"
      ]
    },
    {
      "text": "Discussions",
      "collapsible": true,
      "sidebarDepth": 1,
      "children": [
        [
          "https://github.com/confetti-framework/confetti/discussions/110",
          "ORM & Database "
        ]
      ]
    }
  ],
  "locales": {
    "/": {
      "selectLanguageName": "English"
    }
  },
  "darkMode": true,
  "repo": null,
  "selectLanguageText": "Languages",
  "selectLanguageAriaLabel": "Select language",
  "editLink": true,
  "editLinkText": "Edit this page",
  "lastUpdatedText": "Last Updated",
  "contributors": true,
  "contributorsText": "Contributors",
  "notFound": [
    "There's nothing here.",
    "How did we get here?",
    "That's a Four-Oh-Four.",
    "Looks like we've got some broken links."
  ],
  "backToHome": "Take me home",
  "openInNewWindow": "open in new window",
  "toggleDarkMode": "toggle dark mode",
  "toggleSidebar": "toggle sidebar"
}

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateThemeData) {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ themeData }) => {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  })
}
