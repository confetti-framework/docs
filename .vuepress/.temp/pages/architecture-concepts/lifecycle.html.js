export const data = {
  "key": "v-bae7299c",
  "path": "/architecture-concepts/lifecycle.html",
  "title": "Request Lifecycle",
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
      "title": "Lifecycle Overview",
      "slug": "lifecycle-overview",
      "children": [
        {
          "level": 3,
          "title": "Service Providers",
          "slug": "service-providers",
          "children": []
        },
        {
          "level": 3,
          "title": "Incoming Request",
          "slug": "incoming-request",
          "children": []
        },
        {
          "level": 3,
          "title": "HTTP / Console Kernels",
          "slug": "http-console-kernels",
          "children": []
        }
      ]
    },
    {
      "level": 2,
      "title": "Focus On Service Providers",
      "slug": "focus-on-service-providers",
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
  "filePathRelative": "architecture-concepts/lifecycle.md"
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
