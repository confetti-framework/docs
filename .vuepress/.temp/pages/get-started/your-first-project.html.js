export const data = {
  "key": "v-ecc184ce",
  "path": "/get-started/your-first-project.html",
  "title": "Your First Project",
  "lang": "en-US",
  "frontmatter": {},
  "excerpt": "",
  "headers": [
    {
      "level": 2,
      "title": "Create A Web Page",
      "slug": "create-a-web-page",
      "children": [
        {
          "level": 3,
          "title": "Controller",
          "slug": "controller",
          "children": []
        },
        {
          "level": 3,
          "title": "Route",
          "slug": "route",
          "children": []
        }
      ]
    },
    {
      "level": 2,
      "title": "Create An API Endpoint",
      "slug": "create-an-api-endpoint",
      "children": [
        {
          "level": 3,
          "title": "Controller",
          "slug": "controller-1",
          "children": []
        },
        {
          "level": 3,
          "title": "Route",
          "slug": "route-1",
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
  "filePathRelative": "get-started/your-first-project.md"
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
