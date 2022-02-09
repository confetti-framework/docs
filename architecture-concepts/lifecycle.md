# Request Lifecycle
<ToggleDarkMode/>

## Introduction

When using any tool in the "real world", you feel more confident if you understand how that tool works. Application
development is no different. When you understand how your development tools function, you feel more comfortable and
confident using them.

The goal of this document is to give you a good, high-level overview of how the Confetti framework works. By getting to
know the overall framework better, everything feels less "magical" and you will be more confident building your
applications. If you don't understand all of the terms right away, don't lose heart! Just try to get a basic grasp of
what is going on, and your knowledge will grow as you explore other sections of the documentation.

## Lifecycle Overview

### Service Providers

One of the most important bootstrapping actions is loading the [service providers](providers) for your application. All of the service providers for the application are configured in the `app/providers/provider_index.go` file. First, the `Register` method will be called on all RegisterProviders. Then, once all providers have been registered, the `Boot` method will be called on the BootProviders.

Service providers are responsible for bootstrapping all the framework's various components, such as the database,
configuration, queue, validation, and routing components. Since they bootstrap and configure every feature offered by the framework, service providers are the most important aspect of the entire Confetti bootstrap process. Feel free to create a service provider yourself.

> Service providers are loaded once (so before requests takes place). And can therefore lead to a performance profit. For example, you can have a cache warmup in a 'service provider'.

### Incoming Request

The entry point for all requests to a Confetti application is the `main.go` file. This file listens to all incoming requests. The `main.go` file retrieves an instance of the Confetti application from `bootstrap/app.go` script. The first action taken by Confetti itself is to create an instance of the application / [service container](container).

### HTTP / Console Kernels

Next, the incoming request is sent to either the HTTP kernel or the console kernel, depending on the type of request
that is entering the application. The `inter.Request` will be handed off to the router for dispatching. The router
will run any route specific [middleware](../the-basics/middleware.html#assigning-middleware-to-routes) and dispatch the request to a controller.

## Focus On Service Providers

Service providers are truly the key to bootstrapping a Confetti application. The application instance is created
once and the service providers are bootstrapped once. Then when a request comes in, it is handed through global
 middlewares and route middlewares. It's really that simple!

Having a firm grasp of how a Confetti application is built and bootstrapped via service providers is very valuable. Your application's default service providers are stored in the `app/providers` directory.

By default, `app/providers/app_service_provider.go` is fairly empty. This provider is a great place to add your application's own bootstrapping and service container bindings. For large applications, you may wish to create several service providers, each with a more granular type of bootstrapping.
