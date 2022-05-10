export const data = {
  "key": "v-c85d074e",
  "path": "/the-basics/errors.html",
  "title": "Error Handling",
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
      "title": "Panic And Return Errors",
      "slug": "panic-and-return-errors",
      "children": [
        {
          "level": 3,
          "title": "Return Errors",
          "slug": "return-errors",
          "children": []
        },
        {
          "level": 3,
          "title": "Panic",
          "slug": "panic",
          "children": []
        },
        {
          "level": 3,
          "title": "Message Convention",
          "slug": "message-convention",
          "children": []
        }
      ]
    },
    {
      "level": 2,
      "title": "Helpers",
      "slug": "helpers",
      "children": [
        {
          "level": 3,
          "title": "Is",
          "slug": "is",
          "children": []
        },
        {
          "level": 3,
          "title": "As",
          "slug": "as",
          "children": []
        }
      ]
    },
    {
      "level": 2,
      "title": "Configuration",
      "slug": "configuration",
      "children": []
    },
    {
      "level": 2,
      "title": "Defining Errors",
      "slug": "defining-errors",
      "children": [
        {
          "level": 3,
          "title": "Global Log Context",
          "slug": "global-log-context",
          "children": []
        },
        {
          "level": 3,
          "title": "Information Provision",
          "slug": "information-provision",
          "children": []
        },
        {
          "level": 3,
          "title": "Ignoring Errors By Type",
          "slug": "ignoring-errors-by-type",
          "children": []
        },
        {
          "level": 3,
          "title": "Custom HTTP Error Pages",
          "slug": "custom-http-error-pages",
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
  "filePathRelative": "the-basics/errors.md"
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
