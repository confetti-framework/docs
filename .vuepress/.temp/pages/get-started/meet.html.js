export const data = {
  "key": "v-1c3fde58",
  "path": "/get-started/meet.html",
  "title": "Meet Confetti",
  "lang": "en-US",
  "frontmatter": {},
  "excerpt": "",
  "headers": [
    {
      "level": 2,
      "title": "Why Confetti?",
      "slug": "why-confetti",
      "children": []
    },
    {
      "level": 2,
      "title": "Feel at home",
      "slug": "feel-at-home",
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
  "filePathRelative": "get-started/meet.md"
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
