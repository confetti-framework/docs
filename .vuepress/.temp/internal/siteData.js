export const siteData = JSON.parse("{\"base\":\"/docs/\",\"lang\":\"en-US\",\"title\":\"Confetti\",\"description\":\"Confetti is a Go (Golang) web application framework with an expressive, elegant syntax. Confetti combines the elegance of Confetti and the simplicity of Go.\",\"head\":[[\"meta\",{\"name\":\"theme-color\",\"content\":\"#00828e\"}],[\"meta\",{\"name\":\"apple-mobile-web-app-capable\",\"content\":\"yes\"}],[\"meta\",{\"name\":\"apple-mobile-web-app-status-bar-style\",\"content\":\"#00828e\"}],[\"link\",{\"rel\":\"stylesheet\",\"href\":\"https://use.typekit.net/ins2wgm.css\"}],[\"link\",{\"rel\":\"shortcut icon\",\"href\":\"https://raw.githubusercontent.com/confetti-framework/docs/gh-pages/favicon.ico\"}]],\"locales\":{}}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateSiteData) {
    __VUE_HMR_RUNTIME__.updateSiteData(siteData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ siteData }) => {
    __VUE_HMR_RUNTIME__.updateSiteData(siteData)
  })
}
