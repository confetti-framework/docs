export const data = {
  "key": "v-6a349cfa",
  "path": "/architecture-concepts/providers.html",
  "title": "Service Providers",
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
      "title": "Writing Service Providers",
      "slug": "writing-service-providers",
      "children": [
        {
          "level": 3,
          "title": "The Register Method",
          "slug": "the-register-method",
          "children": []
        },
        {
          "level": 3,
          "title": "The Boot Method",
          "slug": "the-boot-method",
          "children": []
        }
      ]
    },
    {
      "level": 2,
      "title": "Registering Providers",
      "slug": "registering-providers",
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
  "filePathRelative": "architecture-concepts/providers.md"
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
