export const data = {
  "key": "v-25c3c2ea",
  "path": "/the-basics/validation.html",
  "title": "Validation",
  "lang": "en-US",
  "frontmatter": {},
  "excerpt": "",
  "headers": [
    {
      "level": 2,
      "title": "Introduction",
      "slug": "introduction",
      "children": [
        {
          "level": 3,
          "title": "Writing The Validation Logic",
          "slug": "writing-the-validation-logic",
          "children": []
        },
        {
          "level": 3,
          "title": "Displaying The Validation Errors",
          "slug": "displaying-the-validation-errors",
          "children": []
        }
      ]
    },
    {
      "level": 2,
      "title": "Custom Validation Rules",
      "slug": "custom-validation-rules",
      "children": [
        {
          "level": 3,
          "title": "Using Rule Objects",
          "slug": "using-rule-objects",
          "children": []
        },
        {
          "level": 3,
          "title": "Requirements",
          "slug": "requirements",
          "children": []
        },
        {
          "level": 3,
          "title": "Dependency Injection",
          "slug": "dependency-injection",
          "children": []
        }
      ]
    },
    {
      "level": 2,
      "title": "Available Validation Rules",
      "slug": "available-validation-rules",
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
  "filePathRelative": "the-basics/validation.md"
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
