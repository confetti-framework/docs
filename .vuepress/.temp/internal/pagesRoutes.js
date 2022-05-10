import { Vuepress } from '@vuepress/client'

const routeItems = [
  ["v-8daa1a0e","/",{"title":"The Confetti documentation."},["/index.html","/README.md"]],
  ["v-8daa1a0e","/",{"title":""},["/index.html","/index.md"]],
  ["v-2d7c9c7b","/architecture-concepts/container.html",{"title":"Service Container"},["/architecture-concepts/container","/architecture-concepts/container.md"]],
  ["v-bae7299c","/architecture-concepts/lifecycle.html",{"title":"Request Lifecycle"},["/architecture-concepts/lifecycle","/architecture-concepts/lifecycle.md"]],
  ["v-6a349cfa","/architecture-concepts/providers.html",{"title":"Service Providers"},["/architecture-concepts/providers","/architecture-concepts/providers.md"]],
  ["v-a0fbbff8","/digging-deeper/commands.html",{"title":"Commands"},["/digging-deeper/commands","/digging-deeper/commands.md"]],
  ["v-2b0004c1","/get-started/installation.html",{"title":"Installation"},["/get-started/installation","/get-started/installation.md"]],
  ["v-1c3fde58","/get-started/meet.html",{"title":"Meet Confetti"},["/get-started/meet","/get-started/meet.md"]],
  ["v-ecc184ce","/get-started/your-first-project.html",{"title":"Your First Project"},["/get-started/your-first-project","/get-started/your-first-project.md"]],
  ["v-397cb990","/the-basics/configuration.html",{"title":"Configuration"},["/the-basics/configuration","/the-basics/configuration.md"]],
  ["v-c85d074e","/the-basics/errors.html",{"title":"Error Handling"},["/the-basics/errors","/the-basics/errors.md"]],
  ["v-3a380ba2","/the-basics/logging.html",{"title":"Logging"},["/the-basics/logging","/the-basics/logging.md"]],
  ["v-83a8d5dc","/the-basics/middleware.html",{"title":"Middleware"},["/the-basics/middleware","/the-basics/middleware.md"]],
  ["v-6d85f640","/the-basics/requests.html",{"title":"Requests"},["/the-basics/requests","/the-basics/requests.md"]],
  ["v-50e6efdc","/the-basics/responses.html",{"title":"Responses"},["/the-basics/responses","/the-basics/responses.md"]],
  ["v-16e8a5b0","/the-basics/routing.html",{"title":"Routing"},["/the-basics/routing","/the-basics/routing.md"]],
  ["v-25c3c2ea","/the-basics/validation.html",{"title":"Validation"},["/the-basics/validation","/the-basics/validation.md"]],
  ["v-6e870dc0","/the-basics/views.html",{"title":"Views"},["/the-basics/views","/the-basics/views.md"]],
  ["v-3706649a","/404.html",{"title":""},["/404"]],
]

export const pagesRoutes = routeItems.reduce(
  (result, [name, path, meta, redirects]) => {
    result.push(
      {
        name,
        path,
        component: Vuepress,
        meta,
      },
      ...redirects.map((item) => ({
        path: item,
        redirect: path,
      }))
    )
    return result
  },
  [
    {
      name: '404',
      path: '/:catchAll(.*)',
      component: Vuepress,
    }
  ]
)
