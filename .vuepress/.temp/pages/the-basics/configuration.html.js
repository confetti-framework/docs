export const data = {
  "key": "v-397cb990",
  "path": "/the-basics/configuration.html",
  "title": "Configuration",
  "lang": "en-US",
  "frontmatter": {},
  "excerpt": "",
  "headers": [
    {
      "level": 2,
      "title": "Introduction",
      "slug": "introduction",
      "children": []
    },
    {
      "level": 2,
      "title": "Environment Configuration",
      "slug": "environment-configuration",
      "children": [
        {
          "level": 3,
          "title": "Retrieving Environment Configuration",
          "slug": "retrieving-environment-configuration",
          "children": []
        },
        {
          "level": 3,
          "title": "Determining The Current Environment",
          "slug": "determining-the-current-environment",
          "children": []
        }
      ]
    },
    {
      "level": 2,
      "title": "Accessing Configuration Values",
      "slug": "accessing-configuration-values",
      "children": []
    },
    {
      "level": 2,
      "title": "Configuration Caching",
      "slug": "configuration-caching",
      "children": []
    }
  ],
  "git": {
    "contributors": [
      {
        "name": "Reindert Vetter",
        "email": "reindert@plugandpay.nl",
        "commits": 1
      }
    ]
  },
  "filePathRelative": "the-basics/configuration.md"
}

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}