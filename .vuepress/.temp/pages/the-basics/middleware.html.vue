<template><h1 id="middleware" tabindex="-1"><a class="header-anchor" href="#middleware" aria-hidden="true">#</a> Middleware</h1>
<h2 id="introduction" tabindex="-1"><a class="header-anchor" href="#introduction" aria-hidden="true">#</a> Introduction</h2>
<p>Middleware provide a convenient mechanism for filtering HTTP requests entering your application. Additional middleware
can be written to perform a variety of tasks. A CORS middleware might be responsible for adding the proper headers to
all responses leaving your application. A logging middleware might log all incoming requests to your application.</p>
<p>There are several middleware included in the Confetti framework. All of these middleware are located in
the <code v-pre>app/http/middleware</code> directory.</p>
<h2 id="defining-middleware" tabindex="-1"><a class="header-anchor" href="#defining-middleware" aria-hidden="true">#</a> Defining Middleware</h2>
<p>Let's place a new <code v-pre>EnsureTokenIsValid</code> struct within your <code v-pre>app/http/middleware</code> directory. In this middleware, we will only allow access to the route if the supplied <code v-pre>token</code> is valid. Otherwise, we will redirect the users back to the <code v-pre>home</code> URI:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">package</span> middleware

<span class="token keyword">import</span> <span class="token punctuation">(</span>
    <span class="token string">"github.com/confetti-framework/contract/inter"</span>
    <span class="token string">"github.com/confetti-framework/routing/outcome"</span>
<span class="token punctuation">)</span>

<span class="token keyword">type</span> EnsureTokenIsValid <span class="token keyword">struct</span><span class="token punctuation">{</span><span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>c EnsureTokenIsValid<span class="token punctuation">)</span> <span class="token function">Handle</span><span class="token punctuation">(</span>request inter<span class="token punctuation">.</span>Request<span class="token punctuation">,</span> next inter<span class="token punctuation">.</span>Next<span class="token punctuation">)</span> inter<span class="token punctuation">.</span>Response <span class="token punctuation">{</span>
    <span class="token keyword">if</span> request<span class="token punctuation">.</span><span class="token function">Parameter</span><span class="token punctuation">(</span><span class="token string">"token"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">String</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token string">"my-secret-token"</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> outcome<span class="token punctuation">.</span><span class="token function">RedirectTemporary</span><span class="token punctuation">(</span><span class="token string">"home"</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">return</span> <span class="token function">next</span><span class="token punctuation">(</span>request<span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br></div></div><p>To pass the request deeper into the application (allowing the middleware to &quot;pass&quot;), call the <code v-pre>next</code> callback with the <code v-pre>request</code>. Then the request will be passed further into the application.</p>
<p>It's best to envision middleware as a series of &quot;layers&quot; HTTP requests must pass through before they hit your application. Each layer can examine the request and even reject it entirely.</p>
<blockquote>
<p>The request contains the <a href="../architecture-concepts/container">service container</a>, so you may fetch any dependencies you need with <code v-pre>request.Make(...)</code>.</p>
</blockquote>
<h3 id="before-after-middleware" tabindex="-1"><a class="header-anchor" href="#before-after-middleware" aria-hidden="true">#</a> Before &amp; After Middleware</h3>
<p>Whether a middleware runs before or after a request depends on the middleware itself. For example, the following middleware would perform some task <strong>before</strong> the request is handled by the application:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">package</span> middleware

<span class="token keyword">import</span> <span class="token punctuation">(</span>
    <span class="token string">"github.com/confetti-framework/contract/inter"</span>
<span class="token punctuation">)</span>

<span class="token keyword">type</span> BeforeMiddleware <span class="token keyword">struct</span><span class="token punctuation">{</span><span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>c BeforeMiddleware<span class="token punctuation">)</span> <span class="token function">Handle</span><span class="token punctuation">(</span>request inter<span class="token punctuation">.</span>Request<span class="token punctuation">,</span> next inter<span class="token punctuation">.</span>Next<span class="token punctuation">)</span> inter<span class="token punctuation">.</span>Response <span class="token punctuation">{</span>

    <span class="token comment">// Perform action</span>

    <span class="token keyword">return</span> <span class="token function">next</span><span class="token punctuation">(</span>request<span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="highlight-lines"><br><br><br><br><br><br><br><br><br><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><br><br></div><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><p>However, this middleware would perform its task <strong>after</strong> the request is handled by the application:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">package</span> middleware

<span class="token keyword">import</span> <span class="token punctuation">(</span>
    <span class="token string">"github.com/confetti-framework/contract/inter"</span>
<span class="token punctuation">)</span>

<span class="token keyword">type</span> AfterMiddleware <span class="token keyword">struct</span><span class="token punctuation">{</span><span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>c AfterMiddleware<span class="token punctuation">)</span> <span class="token function">Handle</span><span class="token punctuation">(</span>request inter<span class="token punctuation">.</span>Request<span class="token punctuation">,</span> next inter<span class="token punctuation">.</span>Next<span class="token punctuation">)</span> inter<span class="token punctuation">.</span>Response <span class="token punctuation">{</span>
    response <span class="token operator">:=</span> <span class="token function">next</span><span class="token punctuation">(</span>request<span class="token punctuation">)</span>

    <span class="token comment">// Perform action</span>

    <span class="token keyword">return</span> response
<span class="token punctuation">}</span>
</code></pre><div class="highlight-lines"><br><br><br><br><br><br><br><br><br><br><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><br><br></div><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><h2 id="registering-middleware" tabindex="-1"><a class="header-anchor" href="#registering-middleware" aria-hidden="true">#</a> Registering Middleware</h2>
<h3 id="global-middleware" tabindex="-1"><a class="header-anchor" href="#global-middleware" aria-hidden="true">#</a> Global Middleware</h3>
<p>If you want a middleware to run during every HTTP request to your application, list the middleware struct in
the <code v-pre>globalMiddlewares</code> variable in your <code v-pre>providers.RouteServiceProvider</code> located
in <code v-pre>app/providers/route_service_provider.go</code>.</p>
<h3 id="assigning-middleware-to-routes" tabindex="-1"><a class="header-anchor" href="#assigning-middleware-to-routes" aria-hidden="true">#</a> Assigning Middleware To Routes</h3>
<p>If you would like to assign middleware to specific routes, you can use the <code v-pre>Middleware</code> method to pass the struct of the middleware:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token function">Get</span><span class="token punctuation">(</span><span class="token string">"/admin/profile"</span><span class="token punctuation">,</span> controllers<span class="token punctuation">.</span>AdminProfileStore<span class="token punctuation">)</span><span class="token punctuation">.</span>
    <span class="token function">Middleware</span><span class="token punctuation">(</span>
        middleware<span class="token punctuation">.</span>ValidatePostSize<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
        middleware<span class="token punctuation">.</span>CheckAge<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">)</span>
</code></pre><div class="highlight-lines"><br><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div></div><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>When assigning middleware to a group of routes, you may occasionally need to prevent the middleware from being applied to an individual route within the group. You may accomplish this using the <code v-pre>WithoutMiddleware</code> method:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>routes <span class="token operator">:=</span> <span class="token function">Group</span><span class="token punctuation">(</span>
    <span class="token function">Get</span><span class="token punctuation">(</span><span class="token string">"/roles"</span><span class="token punctuation">,</span> controllers<span class="token punctuation">.</span>Roles<span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token function">Get</span><span class="token punctuation">(</span><span class="token string">"/comments"</span><span class="token punctuation">,</span> controllers<span class="token punctuation">.</span>Comments<span class="token punctuation">)</span><span class="token punctuation">.</span>
        <span class="token function">WithoutMiddleware</span><span class="token punctuation">(</span>middleware<span class="token punctuation">.</span>CheckAge<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Middleware</span><span class="token punctuation">(</span>
    middleware<span class="token punctuation">.</span>ValidatePostSize<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
    middleware<span class="token punctuation">.</span>CheckAge<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">)</span>
</code></pre><div class="highlight-lines"><br><br><br><div class="highlight-line">&nbsp;</div><br><br><br><br></div><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p>The <code v-pre>WithoutMiddleware</code> method can only remove route middleware and does not apply to <a href="#global-middleware">global middleware</a>. Supply parameters to the struct of WithoutMiddleware has no effect and is therefore superfluous.</p>
<h3 id="middleware-groups" tabindex="-1"><a class="header-anchor" href="#middleware-groups" aria-hidden="true">#</a> Middleware Groups</h3>
<p>Sometimes you may want to group several middleware under a single key to make them easier to assign to routes. We call this Middleware Groups.</p>
<p>Out of the box, Confetti comes with <code v-pre>Web</code> and <code v-pre>Api</code> middleware groups that contain common middlewares you may want to apply to your web UI and API routes. Let's see how the Web middleware group might look like:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">package</span> middleware

<span class="token keyword">import</span> <span class="token string">"github.com/confetti-framework/contract/inter"</span>

<span class="token keyword">var</span> Web <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>inter<span class="token punctuation">.</span>HttpMiddleware<span class="token punctuation">{</span>
    EncryptCookies<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
    AddQueuedCookiesToResponse<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
    StartSession<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
    ShareErrorsFromSession<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
    VerifyCsrfToken<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
    SubstituteBindings<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><p>Middleware groups can be loaded by using the spread operator in the <code v-pre>Middleware</code> method. Again, middleware groups make it more convenient to assign many middlewares to a route at once:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token function">Group</span><span class="token punctuation">(</span>
    <span class="token comment">//</span>
<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Middleware</span><span class="token punctuation">(</span>middleware<span class="token punctuation">.</span>Web<span class="token operator">...</span><span class="token punctuation">)</span>
</code></pre><div class="highlight-lines"><br><br><div class="highlight-line">&nbsp;</div></div><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><blockquote>
<p>Out of the box, the <code v-pre>Web</code> middleware group is automatically applied to your web routes by <code v-pre>routes/web.go</code>.</p>
</blockquote>
<h2 id="middleware-parameters" tabindex="-1"><a class="header-anchor" href="#middleware-parameters" aria-hidden="true">#</a> Middleware Parameters</h2>
<p>Middleware can also receive additional parameters. For example, if your application needs to verify that the authenticated user has a given &quot;role&quot; before performing a given action, you could create a <code v-pre>CheckRole</code> middleware that receives a role name as an additional public field.</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">package</span> middleware

<span class="token keyword">import</span> <span class="token punctuation">(</span>
    <span class="token string">"github.com/confetti-framework/contract/inter"</span>
    <span class="token string">"github.com/confetti-framework/routing/outcome"</span>
    <span class="token string">"confetti/src/request-adapter"</span>
<span class="token punctuation">)</span>

<span class="token keyword">type</span> CheckRole <span class="token keyword">struct</span><span class="token punctuation">{</span>
    Role <span class="token builtin">string</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>c CheckRole<span class="token punctuation">)</span> <span class="token function">Handle</span><span class="token punctuation">(</span>request inter<span class="token punctuation">.</span>Request<span class="token punctuation">,</span> next inter<span class="token punctuation">.</span>Next<span class="token punctuation">)</span> inter<span class="token punctuation">.</span>Response <span class="token punctuation">{</span>
    <span class="token keyword">if</span> requestAdapter<span class="token punctuation">.</span><span class="token function">CurrentUser</span><span class="token punctuation">(</span>request<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Role</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">!=</span> c<span class="token punctuation">.</span>Role <span class="token punctuation">{</span>
        <span class="token keyword">return</span> outcome<span class="token punctuation">.</span><span class="token function">RedirectTemporary</span><span class="token punctuation">(</span><span class="token string">"/home"</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">return</span> <span class="token function">next</span><span class="token punctuation">(</span>request<span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="highlight-lines"><br><br><br><br><br><br><br><br><br><div class="highlight-line">&nbsp;</div><br><br><br><div class="highlight-line">&nbsp;</div><br><br><br><br><br></div><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br></div></div><p>You can pass the parameters to the public fields of the middleware:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token function">Group</span><span class="token punctuation">(</span>
    <span class="token comment">//</span>
<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Middleware</span><span class="token punctuation">(</span>middleware<span class="token punctuation">.</span>CheckRole<span class="token punctuation">{</span>Role<span class="token punctuation">:</span> <span class="token string">"editor"</span><span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div></template>
