# Request Lifecycle

- [Introduction](#introduction)
- [Lifecycle Overview](#lifecycle-overview)
- [Focus On Service Providers](#focus-on-service-providers)

<a name="introduction"></a>
## Introduction

When using any tool in the "real world", you feel more confident if you understand how that tool works. Application development is no different. When you understand how your development tools function, you feel more comfortable and confident using them.

The goal of this document is to give you a good, high-level overview of how the Lanvard framework works. By getting to know the overall framework better, everything feels less "magical" and you will be more confident building your applications. If you don't understand all of the terms right away, don't lose heart! Just try to get a basic grasp of what is going on, and your knowledge will grow as you explore other sections of the documentation.

<a name="lifecycle-overview"></a>
## Lifecycle Overview

### First Things

The entry point for all requests to a Lanvard application is the `lanvard/main.go` file. This file listens to all incoming requests (without apache or nginx). Feel free to adjust main.go so that lanvard no longer listens to a port. That way you can for example use Apache or Nginx to call `lanvard/main`.

The `main.go` file retrieves an instance of the Lanvard application from `bootstrap/app.php` script. The first action
 taken by Lanvard itself is to create an instance of the application / [service container](/docs/{{version}}/container).

### HTTP / Console Kernels

Next, the incoming request is sent to either the HTTP kernel or the console kernel, depending on the type of request that is entering the application. These two kernels serve as the central location that all requests flow through. For now, let's just focus on the HTTP kernel, which is located in `app/http/kernel.php`.

The HTTP kernel constructs the `http/kernel` struct, which defines an slice of `bootstrappers` that will be run
 before the request is executed. ~~These bootstrappers configure error handling, configure logging~~, [detect the
  application environment](/docs/{{version}}/configuration#environment-configuration), and perform other tasks that need to be done before the request is actually handled.

The HTTP kernel also defines a list of HTTP [middleware](/docs/{{version}}/middleware) that all requests must pass
 through before being handled by the application. These middleware handle reading and writing the [HTTP session
 ](/docs/{{version}}/session), ~~determining if the application is in maintenance mode~~, ~~[verifying the CSRF token
 ](/docs/{{version}}/csrf)~~, and more. Feel free to add your own middleware.

#### Service Providers

One of the most important Kernel bootstrapping actions is loading the [service providers](/docs/{{version}}/providers
) for your application. All of the service providers for the application are configured in the `config/providers
/providers.go` configuration file. First, the `Register` method will be called on all RegisterProviders (at compile time), then, once
 all providers have been registered, the `Boot` method will be called on the RegisterProviders (at compile time).
 
 You can have a service provider with a register and a boot method. Than you have to add this service to RegisterProviders and BootProviders.

Service providers are responsible for bootstrapping all of the framework's various components, such as the database, queue, validation, and routing components. Since they bootstrap and configure every feature offered by the framework, service providers are the most important aspect of the entire Lanvard bootstrap process.

#### Dispatch Request

Once the application has been bootstrapped and all service providers have been registered, the `http.Request` will be
 handed off to the router for dispatching. The router will run any route specific middleware and dispatch the request to a controller.

<a name="focus-on-service-providers"></a>
## Focus On Service Providers

Service providers are truly the key to bootstrapping a Lanvard application. The application instance is created, the
 service providers are registered, and the request is handed to the bootstrapped application. It's really that simple!

Having a firm grasp of how a Lanvard application is built and bootstrapped via service providers is very valuable. Your
 application's default service providers are stored in the `app/providers` directory.

By default, `app_service_provider.go` is fairly empty. This provider is a great place to add your application's own
 bootstrapping and service container bindings. For large applications, you may wish to create several service providers, each with a more granular type of bootstrapping.