<template><div><h1 id="service-providers" tabindex="-1"><a class="header-anchor" href="#service-providers" aria-hidden="true">#</a> Service Providers</h1>
<h2 id="introduction" tabindex="-1"><a class="header-anchor" href="#introduction" aria-hidden="true">#</a> Introduction</h2>
<p>Service providers are the central place of all Confetti application bootstrapping. Your own application, as well as all of Confetti's core services are bootstrapped via service providers.</p>
<p>Service providers are loaded once (so before requests takes place). And can therefore lead to a performance profit.</p>
<p>But, what do we mean by &quot;bootstrapped&quot;? In general, we mean <strong>registering</strong> things, including registering service container bindings, event listeners, and even routes. Service providers are the central place to configure your application.</p>
<p>If you open the <code v-pre>app/providers/provider_index.go</code> file included with Confetti, you will see a <code v-pre>Providers</code> struct. These are all the service providers that will be loaded for your application.</p>
<p>In this overview you will learn how to write your own service providers and register them with your Confetti application.</p>
<h2 id="writing-service-providers" tabindex="-1"><a class="header-anchor" href="#writing-service-providers" aria-hidden="true">#</a> Writing Service Providers</h2>
<p>All service providers implements the <code v-pre>inter.RegisterServiceProvider</code> or <code v-pre>inter.BootServiceProvider</code> interface. The service providers contain a <code v-pre>Register</code> and/or a <code v-pre>Boot</code> method. Within the <code v-pre>Register</code> method, you should <strong>only bind things into the <a href="container">service container</a></strong>. You should never attempt to register any event listeners, routes, or any other piece of functionality within the <code v-pre>Register</code> method. You can have a service provider with a register and a boot method. Then you have to add this service to the RegisterProviders slice, and the BootProviders slice.</p>
<h3 id="the-register-method" tabindex="-1"><a class="header-anchor" href="#the-register-method" aria-hidden="true">#</a> The Register Method</h3>
<p>As mentioned previously, within the <code v-pre>Register</code> method, you should only bind things into the <a href="container">service container</a>. You should never attempt to register any event listeners, routes, or any other piece of functionality within the <code v-pre>Register</code> method. Otherwise, you may accidentally use a service that is provided by a service provider which has not loaded yet.</p>
<p>Let's take a look at a basic service provider. Within any of your service provider methods, you always have access to the <code v-pre>inter.Container</code> property which provides access to the service container:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">package</span> providers

<span class="token keyword">import</span> <span class="token punctuation">(</span>
    <span class="token string">"github.com/confetti-framework/foundation"</span>
    <span class="token string">"github.com/riak/riak"</span>
<span class="token punctuation">)</span>

<span class="token keyword">type</span> RiakServiceProvider <span class="token keyword">struct</span><span class="token punctuation">{</span><span class="token punctuation">}</span>

<span class="token comment">// Register any application services.</span>
<span class="token keyword">func</span> <span class="token punctuation">(</span>r RiakServiceProvider<span class="token punctuation">)</span> <span class="token function">Register</span><span class="token punctuation">(</span>container inter<span class="token punctuation">.</span>Container<span class="token punctuation">)</span> inter<span class="token punctuation">.</span>Container <span class="token punctuation">{</span>

    container<span class="token punctuation">.</span><span class="token function">Singleton</span><span class="token punctuation">(</span>database<span class="token punctuation">.</span>Connection<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token keyword">func</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> riak<span class="token punctuation">.</span><span class="token function">NewConnection</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

    <span class="token keyword">return</span> container
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>This service provider only defines a <code v-pre>Register</code> method, and uses that method to define an implementation of <code v-pre>riak</code> in the service container. If you don't understand how the service container works, check out <a href="container">its documentation</a>.</p>
<h3 id="the-boot-method" tabindex="-1"><a class="header-anchor" href="#the-boot-method" aria-hidden="true">#</a> The Boot Method</h3>
<p>The <code v-pre>Boot</code> method is called after all other service providers have been registered, meaning you have access to all other
services that have been registered by the framework:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">type</span> DataDog <span class="token keyword">struct</span><span class="token punctuation">{</span><span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>d DataDog<span class="token punctuation">)</span> <span class="token function">Boot</span><span class="token punctuation">(</span>container inter<span class="token punctuation">.</span>Container<span class="token punctuation">)</span> inter<span class="token punctuation">.</span>Container <span class="token punctuation">{</span>
    <span class="token boolean">_</span><span class="token punctuation">,</span> err <span class="token operator">:=</span> statsd<span class="token punctuation">.</span><span class="token function">New</span><span class="token punctuation">(</span><span class="token string">"127.0.0.1:8125"</span><span class="token punctuation">)</span>
    <span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
        <span class="token function">panic</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">return</span> container
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="boot-method-dependency-injection" tabindex="-1"><a class="header-anchor" href="#boot-method-dependency-injection" aria-hidden="true">#</a> Boot Method Dependency Injection</h4>
<p>You may use Container for your dependencies in your service provider's <code v-pre>Boot</code> method. The <a href="container">service container</a> will automatically inject any dependencies you need:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">func</span> <span class="token punctuation">(</span>r ComposerServiceProvider<span class="token punctuation">)</span> <span class="token function">Boot</span><span class="token punctuation">(</span>container inter<span class="token punctuation">.</span>Container<span class="token punctuation">)</span> inter<span class="token punctuation">.</span>Container <span class="token punctuation">{</span>
    eventPusher <span class="token operator">:=</span> container<span class="token punctuation">.</span><span class="token function">Make</span><span class="token punctuation">(</span><span class="token string">"EventPusher"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token punctuation">(</span>contract<span class="token punctuation">.</span>EventPusher<span class="token punctuation">)</span>
    <span class="token comment">//</span>

    <span class="token keyword">return</span> container
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="registering-providers" tabindex="-1"><a class="header-anchor" href="#registering-providers" aria-hidden="true">#</a> Registering Providers</h2>
<p>All service providers are registered in the <code v-pre>app/providers/provider_index.go</code> file. This file contains a <code v-pre>Providers</code> struct where you can list the struct names of your service providers. By default, a set of Confetti core service providers are listed in this struct. These providers bootstrap the core Confetti components, such as the mailer, queue, cache, and others.</p>
<p>To register your provider, add it to the slices:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>RegisterProviders<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>decorator<span class="token punctuation">.</span>RegisterServiceProvider<span class="token punctuation">{</span>
    providers<span class="token punctuation">.</span>AppServiceProvider<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
    providers<span class="token punctuation">.</span>ComposerServiceProvider<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>

    <span class="token comment">//</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>
BootProviders<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>decorator<span class="token punctuation">.</span>BootServiceProvider<span class="token punctuation">{</span>
    providers<span class="token punctuation">.</span>AppServiceProvider<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
    providers<span class="token punctuation">.</span>RouteServiceProvider<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
    providers<span class="token punctuation">.</span>ComposerServiceProvider<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>

    <span class="token comment">//</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>If you have a service provider with a register and a boot method, you have to add this service to the RegisterProviders slice, and the BootProviders slice.</p>
</div></template>


