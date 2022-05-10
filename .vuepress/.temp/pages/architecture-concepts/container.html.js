export const data = {
  "key": "v-2d7c9c7b",
  "path": "/architecture-concepts/container.html",
  "title": "Service Container",
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
      "title": "Binding",
      "slug": "binding",
      "children": [
        {
          "level": 3,
          "title": "Binding Basics",
          "slug": "binding-basics",
          "children": []
        },
        {
          "level": 3,
          "title": "Binding Interfaces To Implementations",
          "slug": "binding-interfaces-to-implementations",
          "children": []
        },
        {
          "level": 3,
          "title": "Binding Without Abstract",
          "slug": "binding-without-abstract",
          "children": []
        },
        {
          "level": 3,
          "title": "Extending Bindings",
          "slug": "extending-bindings",
          "children": []
        }
      ]
    },
    {
      "level": 2,
      "title": "Resolving",
      "slug": "resolving",
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
  "filePathRelative": "architecture-concepts/container.md"
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
