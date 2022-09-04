<template><div><h1 id="request-lifecycle" tabindex="-1"><a class="header-anchor" href="#request-lifecycle" aria-hidden="true">#</a> Request Lifecycle</h1>
<h2 id="introduction" tabindex="-1"><a class="header-anchor" href="#introduction" aria-hidden="true">#</a> Introduction</h2>
<p>When using any tool in the &quot;real world&quot;, you feel more confident if you understand how that tool works. Application
development is no different. When you understand how your development tools function, you feel more comfortable and
confident using them.</p>
<p>The goal of this document is to give you a good, high-level overview of how the Confetti framework works. By getting to
know the overall framework better, everything feels less &quot;magical&quot; and you will be more confident building your
applications. If you don't understand all of the terms right away, don't lose heart! Just try to get a basic grasp of
what is going on, and your knowledge will grow as you explore other sections of the documentation.</p>
<h2 id="lifecycle-overview" tabindex="-1"><a class="header-anchor" href="#lifecycle-overview" aria-hidden="true">#</a> Lifecycle Overview</h2>
<h3 id="service-providers" tabindex="-1"><a class="header-anchor" href="#service-providers" aria-hidden="true">#</a> Service Providers</h3>
<p>One of the most important bootstrapping actions is loading the <a href="providers">service providers</a> for your application. All of the service providers for the application are configured in the <code v-pre>app/providers/provider_index.go</code> file. First, the <code v-pre>Register</code> method will be called on all RegisterProviders. Then, once all providers have been registered, the <code v-pre>Boot</code> method will be called on the BootProviders.</p>
<p>Service providers are responsible for bootstrapping all the framework's various components, such as the database,
configuration, queue, validation, and routing components. Since they bootstrap and configure every feature offered by the framework, service providers are the most important aspect of the entire Confetti bootstrap process. Feel free to create a service provider yourself.</p>
<blockquote>
<p>Service providers are loaded once (so before requests takes place). And can therefore lead to a performance profit. For example, you can have a cache warmup in a 'service provider'.</p>
</blockquote>
<h3 id="incoming-request" tabindex="-1"><a class="header-anchor" href="#incoming-request" aria-hidden="true">#</a> Incoming Request</h3>
<p>The entry point for all requests to a Confetti application is the <code v-pre>main.go</code> file. This file listens to all incoming requests. The <code v-pre>main.go</code> file retrieves an instance of the Confetti application from <code v-pre>bootstrap/app.go</code> script. The first action taken by Confetti itself is to create an instance of the application / <a href="container">service container</a>.</p>
<h3 id="http-console-kernels" tabindex="-1"><a class="header-anchor" href="#http-console-kernels" aria-hidden="true">#</a> HTTP / Console Kernels</h3>
<p>Next, the incoming request is sent to either the HTTP kernel or the console kernel, depending on the type of request
that is entering the application. The <code v-pre>inter.Request</code> will be handed off to the router for dispatching. The router
will run any route specific <RouterLink to="/the-basics/middleware.html#assigning-middleware-to-routes">middleware</RouterLink> and dispatch the request to a controller.</p>
<h2 id="focus-on-service-providers" tabindex="-1"><a class="header-anchor" href="#focus-on-service-providers" aria-hidden="true">#</a> Focus On Service Providers</h2>
<p>Service providers are truly the key to bootstrapping a Confetti application. The application instance is created
once and the service providers are bootstrapped once. Then when a request comes in, it is handed through global
middlewares and route middlewares. It's really that simple!</p>
<p>Having a firm grasp of how a Confetti application is built and bootstrapped via service providers is very valuable. Your application's default service providers are stored in the <code v-pre>app/providers</code> directory.</p>
<p>By default, <code v-pre>app/providers/app_service_provider.go</code> is fairly empty. This provider is a great place to add your application's own bootstrapping and service container bindings. For large applications, you may wish to create several service providers, each with a more granular type of bootstrapping.</p>
</div></template>


