import{_ as n,o as s,c as a,b as e}from"./app.cd0b8009.js";const t={},i=e(`<h1 id="middleware" tabindex="-1"><a class="header-anchor" href="#middleware" aria-hidden="true">#</a> Middleware</h1><h2 id="introduction" tabindex="-1"><a class="header-anchor" href="#introduction" aria-hidden="true">#</a> Introduction</h2><p>Middleware are components that sit between the incoming HTTP request and your controller logic. They allow you to execute code before and/or after a request is handled. This is particularly useful for tasks such as authentication, logging, request modification, and response transformation. In Confetti, middleware helps keep your controller code clean by handling cross-cutting concerns in a centralized manner.</p><h2 id="creating-a-middleware" tabindex="-1"><a class="header-anchor" href="#creating-a-middleware" aria-hidden="true">#</a> Creating a Middleware</h2><p>A middleware in Confetti is typically implemented as a type that provides a <code>Handle</code> method. This method wraps your controller function, allowing you to execute custom logic before and/or after the controller is called.</p><h3 id="basic-middleware-example" tabindex="-1"><a class="header-anchor" href="#basic-middleware-example" aria-hidden="true">#</a> Basic Middleware Example</h3><p>Below is an example of a simple logging middleware that logs the request method and URL before passing control to the next handler:</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token keyword">package</span> middleware

<span class="token keyword">import</span> <span class="token punctuation">(</span>
	<span class="token string">&quot;log&quot;</span>
	<span class="token string">&quot;net/http&quot;</span>
	<span class="token string">&quot;src/internal/pkg/handler&quot;</span>
<span class="token punctuation">)</span>

<span class="token comment">// LoggingMiddleware is a simple middleware that logs requests.</span>
<span class="token keyword">type</span> LoggingMiddleware <span class="token keyword">struct</span><span class="token punctuation">{</span><span class="token punctuation">}</span>

<span class="token comment">// Handle wraps a controller with logging functionality.</span>
<span class="token keyword">func</span> <span class="token punctuation">(</span>l LoggingMiddleware<span class="token punctuation">)</span> <span class="token function">Handle</span><span class="token punctuation">(</span>next handler<span class="token punctuation">.</span>Controller<span class="token punctuation">)</span> handler<span class="token punctuation">.</span>Controller <span class="token punctuation">{</span>
	<span class="token keyword">return</span> <span class="token keyword">func</span><span class="token punctuation">(</span>w http<span class="token punctuation">.</span>ResponseWriter<span class="token punctuation">,</span> req <span class="token operator">*</span>http<span class="token punctuation">.</span>Request<span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
		<span class="token comment">// Before: Log the incoming request</span>
		log<span class="token punctuation">.</span><span class="token function">Printf</span><span class="token punctuation">(</span><span class="token string">&quot;Incoming request: %s %s&quot;</span><span class="token punctuation">,</span> req<span class="token punctuation">.</span>Method<span class="token punctuation">,</span> req<span class="token punctuation">.</span>URL<span class="token punctuation">.</span>Path<span class="token punctuation">)</span>
		
		<span class="token comment">// Call the next handler in the chain</span>
		err <span class="token operator">:=</span> <span class="token function">next</span><span class="token punctuation">(</span>w<span class="token punctuation">,</span> req<span class="token punctuation">)</span>
		
		<span class="token comment">// After: Optionally log the outcome (if needed)</span>
		<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
			log<span class="token punctuation">.</span><span class="token function">Printf</span><span class="token punctuation">(</span><span class="token string">&quot;Error processing request: %v&quot;</span><span class="token punctuation">,</span> err<span class="token punctuation">)</span>
		<span class="token punctuation">}</span>
		
		<span class="token keyword">return</span> err
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="registering-middleware" tabindex="-1"><a class="header-anchor" href="#registering-middleware" aria-hidden="true">#</a> Registering Middleware</h2><p>Once you\u2019ve created your middleware, you need to register it with your routes. In Confetti, routes are defined with the helper <code>handler.New</code> function. You can append middleware to a route using a method like <code>AppendMiddleware</code>.</p><h3 id="registering-a-middleware-for-a-route" tabindex="-1"><a class="header-anchor" href="#registering-a-middleware-for-a-route" aria-hidden="true">#</a> Registering a Middleware for a Route</h3><p>Below is an example of how to register the <code>LoggingMiddleware</code> with a specific route:</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token keyword">package</span> routes

<span class="token keyword">import</span> <span class="token punctuation">(</span>
	<span class="token string">&quot;src/internal/pkg/handler&quot;</span>
	<span class="token string">&quot;src/internal/controllers&quot;</span>
	<span class="token string">&quot;src/internal/middleware&quot;</span>
<span class="token punctuation">)</span>

<span class="token keyword">var</span> ApiRoutes <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>handler<span class="token punctuation">.</span>Route<span class="token punctuation">{</span>
	handler<span class="token punctuation">.</span><span class="token function">New</span><span class="token punctuation">(</span><span class="token string">&quot;GET /api/example&quot;</span><span class="token punctuation">,</span> controllers<span class="token punctuation">.</span>ExampleController<span class="token punctuation">)</span><span class="token punctuation">.</span>
		<span class="token function">AppendMiddleware</span><span class="token punctuation">(</span>middleware<span class="token punctuation">.</span>LoggingMiddleware<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>In this example, every time the <code>/api/example</code> endpoint is hit, the <code>LoggingMiddleware</code> will execute before the <code>ExampleController</code> is called.</p><h2 id="handy-middleware-examples" tabindex="-1"><a class="header-anchor" href="#handy-middleware-examples" aria-hidden="true">#</a> Handy Middleware Examples</h2><h3 id="_1-authentication-middleware" tabindex="-1"><a class="header-anchor" href="#_1-authentication-middleware" aria-hidden="true">#</a> 1. Authentication Middleware</h3><p>This middleware checks whether the request contains the proper authentication token or permission before allowing it to proceed.</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token keyword">package</span> middleware

<span class="token keyword">import</span> <span class="token punctuation">(</span>
	<span class="token string">&quot;net/http&quot;</span>
	<span class="token string">&quot;src/internal/pkg/handler&quot;</span>
<span class="token punctuation">)</span>

<span class="token comment">// AuthMiddleware checks for the required permission.</span>
<span class="token keyword">type</span> AuthMiddleware <span class="token keyword">struct</span> <span class="token punctuation">{</span>
	Permission <span class="token builtin">string</span>
<span class="token punctuation">}</span>

<span class="token comment">// Handle wraps a controller with authentication logic.</span>
<span class="token keyword">func</span> <span class="token punctuation">(</span>a AuthMiddleware<span class="token punctuation">)</span> <span class="token function">Handle</span><span class="token punctuation">(</span>next handler<span class="token punctuation">.</span>Controller<span class="token punctuation">)</span> handler<span class="token punctuation">.</span>Controller <span class="token punctuation">{</span>
	<span class="token keyword">return</span> <span class="token keyword">func</span><span class="token punctuation">(</span>w http<span class="token punctuation">.</span>ResponseWriter<span class="token punctuation">,</span> req <span class="token operator">*</span>http<span class="token punctuation">.</span>Request<span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
		<span class="token comment">// Perform authentication check (this is just a placeholder).</span>
		<span class="token keyword">if</span> req<span class="token punctuation">.</span>Header<span class="token punctuation">.</span><span class="token function">Get</span><span class="token punctuation">(</span><span class="token string">&quot;Authorization&quot;</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token string">&quot;&quot;</span> <span class="token punctuation">{</span>
			<span class="token keyword">return</span> handler<span class="token punctuation">.</span><span class="token function">NewUserError</span><span class="token punctuation">(</span><span class="token string">&quot;Unauthorized: missing token&quot;</span><span class="token punctuation">,</span> http<span class="token punctuation">.</span>StatusUnauthorized<span class="token punctuation">)</span>
		<span class="token punctuation">}</span>
		<span class="token comment">// Optionally check for specific permissions.</span>
		<span class="token comment">// if !hasPermission(req, a.Permission) { ... }</span>

		<span class="token comment">// Proceed to the next handler if authenticated.</span>
		<span class="token keyword">return</span> <span class="token function">next</span><span class="token punctuation">(</span>w<span class="token punctuation">,</span> req<span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-request-validation-middleware" tabindex="-1"><a class="header-anchor" href="#_2-request-validation-middleware" aria-hidden="true">#</a> 2. Request Validation Middleware</h3><p>This middleware validates the incoming request data before it reaches the controller.</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token keyword">package</span> middleware

<span class="token keyword">import</span> <span class="token punctuation">(</span>
	<span class="token string">&quot;encoding/json&quot;</span>
	<span class="token string">&quot;net/http&quot;</span>
	<span class="token string">&quot;src/internal/pkg/handler&quot;</span>
<span class="token punctuation">)</span>

<span class="token comment">// ValidateMiddleware ensures that the request body conforms to expected structure.</span>
<span class="token keyword">type</span> ValidateMiddleware <span class="token keyword">struct</span><span class="token punctuation">{</span><span class="token punctuation">}</span>

<span class="token comment">// Handle parses and validates the request body.</span>
<span class="token keyword">func</span> <span class="token punctuation">(</span>v ValidateMiddleware<span class="token punctuation">)</span> <span class="token function">Handle</span><span class="token punctuation">(</span>next handler<span class="token punctuation">.</span>Controller<span class="token punctuation">)</span> handler<span class="token punctuation">.</span>Controller <span class="token punctuation">{</span>
	<span class="token keyword">return</span> <span class="token keyword">func</span><span class="token punctuation">(</span>w http<span class="token punctuation">.</span>ResponseWriter<span class="token punctuation">,</span> req <span class="token operator">*</span>http<span class="token punctuation">.</span>Request<span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
		<span class="token keyword">var</span> data <span class="token keyword">map</span><span class="token punctuation">[</span><span class="token builtin">string</span><span class="token punctuation">]</span>any
		decoder <span class="token operator">:=</span> json<span class="token punctuation">.</span><span class="token function">NewDecoder</span><span class="token punctuation">(</span>req<span class="token punctuation">.</span>Body<span class="token punctuation">)</span>
		<span class="token keyword">if</span> err <span class="token operator">:=</span> decoder<span class="token punctuation">.</span><span class="token function">Decode</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>data<span class="token punctuation">)</span><span class="token punctuation">;</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
			<span class="token keyword">return</span> handler<span class="token punctuation">.</span><span class="token function">NewUserError</span><span class="token punctuation">(</span><span class="token string">&quot;Invalid request payload&quot;</span><span class="token punctuation">,</span> http<span class="token punctuation">.</span>StatusBadRequest<span class="token punctuation">)</span>
		<span class="token punctuation">}</span>

		<span class="token comment">// You could attach validated data to the request context here.</span>
		<span class="token comment">// For simplicity, we proceed to the next handler.</span>
		<span class="token keyword">return</span> <span class="token function">next</span><span class="token punctuation">(</span>w<span class="token punctuation">,</span> req<span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="conclusion" tabindex="-1"><a class="header-anchor" href="#conclusion" aria-hidden="true">#</a> Conclusion</h2><p>Middleware in Confetti offers a powerful and flexible way to handle common tasks such as logging, authentication, and validation without cluttering your controller logic. By creating reusable middleware components and registering them with your routes, you can ensure a clean separation of concerns, maintainable code, and a consistent behavior across your application.</p>`,23),o=[i];function p(l,c){return s(),a("div",null,o)}const u=n(t,[["render",p],["__file","middleware.html.vue"]]);export{u as default};
