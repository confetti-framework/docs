<template><h1 id="your-first-project" tabindex="-1"><a class="header-anchor" href="#your-first-project" aria-hidden="true">#</a> Your First Project</h1>
<p>Where do you start to create a page or set up an API endpoint? Here is a brief explanation of the steps you can take to create your first application. We will explain how to create a page and how to create an API endpoint. You will soon see that the possibilities are endless.</p>
<h2 id="create-a-web-page" tabindex="-1"><a class="header-anchor" href="#create-a-web-page" aria-hidden="true">#</a> Create A Web Page</h2>
<p>Confetti has a homepage ready by default. For now, we will create a contact page.</p>
<h3 id="controller" tabindex="-1"><a class="header-anchor" href="#controller" aria-hidden="true">#</a> Controller</h3>
<p>First, you want to create a function where the request comes in and a response is returned. We call that type of function a controller. Make a file <code v-pre>contact.go</code> in <code v-pre>app/http/controllers</code> with the following content:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">package</span> controllers

<span class="token keyword">import</span> <span class="token punctuation">(</span>
	<span class="token string">"github.com/confetti-framework/contract/inter"</span>
	<span class="token string">"github.com/confetti-framework/routing/outcome"</span>
<span class="token punctuation">)</span>

<span class="token keyword">func</span> <span class="token function">Contact</span><span class="token punctuation">(</span>request inter<span class="token punctuation">.</span>Request<span class="token punctuation">)</span> inter<span class="token punctuation">.</span>Response <span class="token punctuation">{</span>
	<span class="token keyword">return</span> outcome<span class="token punctuation">.</span><span class="token function">Html</span><span class="token punctuation">(</span><span class="token string">"Hello world"</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><p>This is the place where you can place your logic. Of course you can make other functions and structs to keep everything organized.</p>
<p>Now we return HTML directly. Usually it is better to use a view and template for this. It is advisable to read the <a href="../the-basics/views">View Documentation</a>. If you want to get values from the request, then you can read the <a href="../the-basics/requests">Request Documentation</a>.</p>
<h3 id="route" tabindex="-1"><a class="header-anchor" href="#route" aria-hidden="true">#</a> Route</h3>
<p>In order for Confetti to know which controller belongs to which url, you must register your controller in <code v-pre>routes/web.go</code>. There you can also see how the homepage has already been set. Add <code v-pre>Get(&quot;/contact&quot;, controllers.Contact),</code> to register your contact controller. View the <a href="../the-basics/routing">Route Documentation</a> for more information.</p>
<p>Once your code is rebuilt, the contact page is available at <a href="http://localhost/contact" target="_blank" rel="noopener noreferrer">http://localhost/contact<ExternalLinkIcon/></a>.</p>
<h2 id="create-an-api-endpoint" tabindex="-1"><a class="header-anchor" href="#create-an-api-endpoint" aria-hidden="true">#</a> Create An API Endpoint</h2>
<p>If you don't want to build a page, but want to transfer another data, you would want to use API endpoints. Confetti makes it very easy to create these endpoints.</p>
<h3 id="controller-1" tabindex="-1"><a class="header-anchor" href="#controller-1" aria-hidden="true">#</a> Controller</h3>
<p>Again, you need a function where you determine what should be done and what should be returned. Make a file <code v-pre>contact.go</code> in <code v-pre>app/http/controllers</code> with the following content:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">package</span> controllers

<span class="token keyword">import</span> <span class="token punctuation">(</span>
	<span class="token string">"github.com/confetti-framework/contract/inter"</span>
	<span class="token string">"github.com/confetti-framework/routing/outcome"</span>
<span class="token punctuation">)</span>

<span class="token keyword">func</span> <span class="token function">Contact</span><span class="token punctuation">(</span>request inter<span class="token punctuation">.</span>Request<span class="token punctuation">)</span> inter<span class="token punctuation">.</span>Response <span class="token punctuation">{</span>
	data <span class="token operator">:=</span> <span class="token keyword">map</span><span class="token punctuation">[</span><span class="token builtin">string</span><span class="token punctuation">]</span><span class="token builtin">string</span><span class="token punctuation">{</span>
		<span class="token string">"name"</span><span class="token punctuation">:</span> <span class="token string">"Singh"</span><span class="token punctuation">,</span>
		<span class="token string">"city"</span><span class="token punctuation">:</span> <span class="token string">"New Delhi"</span><span class="token punctuation">,</span>
	<span class="token punctuation">}</span>
	<span class="token keyword">return</span> outcome<span class="token punctuation">.</span><span class="token function">Json</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><p><code v-pre>outcome.Json(data)</code> is responsible for converting the data to json and it automatically gets the correct headers. More information about responses, consult the <a href="../the-basics/responses">Response Documentation</a>. If you want to get values from the request, then you can read the <a href="../the-basics/requests">Request Documentation</a>. It is recommended to validate incoming data. Take a look at the <a href="../the-basics/validation">Validation Documentation</a>.</p>
<h3 id="route-1" tabindex="-1"><a class="header-anchor" href="#route-1" aria-hidden="true">#</a> Route</h3>
<p>Of course Confetti must know at which url this function should be addressed. You can register your controller in <code v-pre>routes/api.go</code>. There you can also see how the ping endpoint has already been set. Add <code v-pre>Get(&quot;/contact&quot;, controllers.Contact),</code> to register your contact controller. View the <a href="../the-basics/routing">Route Documentation</a> for more information.</p>
<p>Once your code is rebuilt, the contact page is available at <a href="http://localhost/api/contact" target="_blank" rel="noopener noreferrer">http://localhost/api/contact<ExternalLinkIcon/></a>.</p>
<blockquote>
<p>If you want to make your endpoints available through a subdomain (for example <code v-pre>http://api.localhost/contact</code>), look at the <RouterLink to="/the-basics/routing.html#subdomain-routing">Subdomain Routing</RouterLink> section.</p>
</blockquote>
</template>
