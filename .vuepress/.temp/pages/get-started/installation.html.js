export const data = {
  "key": "v-2b0004c1",
  "path": "/get-started/installation.html",
  "title": "Installation",
  "lang": "en-US",
  "frontmatter": {},
  "excerpt": "",
  "headers": [
    {
      "level": 2,
      "title": "Local Development",
      "slug": "local-development",
      "children": [
        {
          "level": 3,
          "title": "Standard",
          "slug": "standard",
          "children": []
        },
        {
          "level": 3,
          "title": "IDE Goland",
          "slug": "ide-goland",
          "children": []
        },
        {
          "level": 3,
          "title": "Docker",
          "slug": "docker",
          "children": []
        },
        {
          "level": 3,
          "title": "Update Modules",
          "slug": "update-modules",
          "children": []
        }
      ]
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
  "filePathRelative": "get-started/installation.md"
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
