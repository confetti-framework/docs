import{_ as n,o as s,c as a,b as e}from"./app.c51d4dcb.js";const t={},o=e(`<h1 id="service-container" tabindex="-1"><a class="header-anchor" href="#service-container" aria-hidden="true">#</a> Service Container</h1><h2 id="introduction" tabindex="-1"><a class="header-anchor" href="#introduction" aria-hidden="true">#</a> Introduction</h2><p>The Confetti service container is a powerful tool for managing struct dependencies and performing dependency injection. Dependency injection is a fancy phrase that essentially means this: struct dependencies are &quot;injected&quot; into the struct via the constructor or, in some cases, &quot;setter&quot; methods.</p><p>Let&#39;s look at a simple example:</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token keyword">package</span> model

<span class="token keyword">import</span> <span class="token punctuation">(</span>
    <span class="token string">&quot;github.com/confetti-framework/contract/inter&quot;</span>
    <span class="token string">&quot;github.com/confetti-framework/foundation&quot;</span>
    <span class="token string">&quot;confetti/app/repository&quot;</span>
<span class="token punctuation">)</span>

<span class="token keyword">type</span> User <span class="token keyword">struct</span> <span class="token punctuation">{</span>
    app        inter<span class="token punctuation">.</span>App
    repository repository<span class="token punctuation">.</span>User
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token function">NewUser</span><span class="token punctuation">(</span>app inter<span class="token punctuation">.</span>App<span class="token punctuation">)</span> User <span class="token punctuation">{</span>

    <span class="token comment">// Receive the repository from the application container</span>
    userRepository <span class="token operator">:=</span> app<span class="token punctuation">.</span><span class="token function">Make</span><span class="token punctuation">(</span>repository<span class="token punctuation">.</span>User<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token punctuation">(</span>repository<span class="token punctuation">.</span>UserInterface<span class="token punctuation">)</span>

    <span class="token keyword">return</span> User<span class="token punctuation">{</span>app<span class="token punctuation">:</span> app<span class="token punctuation">,</span> repository<span class="token punctuation">:</span> userRepository<span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>u User<span class="token punctuation">)</span> <span class="token function">IsAdmin</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token builtin">bool</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> u<span class="token punctuation">.</span>repository<span class="token punctuation">.</span><span class="token function">HasRole</span><span class="token punctuation">(</span>u<span class="token punctuation">,</span> <span class="token string">&quot;admin&quot;</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="highlight-lines"><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><div class="highlight-line">\xA0</div><br><br><br><br><br><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>In this example, the <code>User</code> struct needs to retrieve users from a data source. So, we will <strong>inject</strong> a service is able to retrieve users. In this context, our <code>User</code> struct most likely uses <code>UserRepository</code> to retrieve user information from the database. However, since the repository is injected, we are able to easily swap it out with another implementation. We are also able to easily &quot;mock&quot;, or create a dummy implementation of the <code>repository.User</code> when testing our application.</p><p>A deep understanding of the Confetti service container is essential to building a powerful, large application, as well as for contributing to the Confetti core itself.</p><h2 id="binding" tabindex="-1"><a class="header-anchor" href="#binding" aria-hidden="true">#</a> Binding</h2><h3 id="binding-basics" tabindex="-1"><a class="header-anchor" href="#binding-basics" aria-hidden="true">#</a> Binding Basics</h3><p>Almost all of your service container bindings will be registered within <a href="providers">service providers</a>, so most of these examples will demonstrate using the container in that context.</p><blockquote><p>There is no need to bind structs into the container if they do not depend on any interfaces. The container does not need to be instructed on how to build these objects, since it can automatically resolve these objects.</p></blockquote><h4 id="simple-bindings" tabindex="-1"><a class="header-anchor" href="#simple-bindings" aria-hidden="true">#</a> Simple Bindings</h4><p>We can register a binding using the <code>Bind</code> method, passing the struct or interface that we wish to register along with a <code>Closure</code> that returns an instance of the struct:</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code>app<span class="token punctuation">.</span><span class="token function">Bind</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token operator">*</span>contract<span class="token punctuation">.</span>ErrorHandling<span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token boolean">nil</span><span class="token punctuation">)</span><span class="token punctuation">,</span> function <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> logging<span class="token punctuation">.</span>Error<span class="token punctuation">{</span>app<span class="token punctuation">,</span> app<span class="token punctuation">.</span><span class="token function">Make</span><span class="token punctuation">(</span>http<span class="token punctuation">.</span>Client<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token punctuation">(</span>http<span class="token punctuation">.</span>Client<span class="token punctuation">)</span><span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Note that we can then use the container to resolve sub-dependencies of the object we are building.</p><h4 id="binding-a-singleton" tabindex="-1"><a class="header-anchor" href="#binding-a-singleton" aria-hidden="true">#</a> Binding A Singleton</h4><p>The <code>Singleton</code> method binds a struct or interface into the container that should only be resolved one time. Once a singleton binding is resolved, the same object instance will be returned on subsequent calls into the container:</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code>app<span class="token punctuation">.</span><span class="token function">Singleton</span><span class="token punctuation">(</span>
    model<span class="token punctuation">.</span>User<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token keyword">func</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">interface</span><span class="token punctuation">{</span><span class="token punctuation">}</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> model<span class="token punctuation">.</span>User<span class="token punctuation">{</span><span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="binding-instances" tabindex="-1"><a class="header-anchor" href="#binding-instances" aria-hidden="true">#</a> Binding Instances</h4><p>You may also bind an existing object instance into the container using the <code>Instance</code> method. The given instance will always be returned on subsequent calls into the container:</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code>user <span class="token operator">:=</span> model<span class="token punctuation">.</span><span class="token function">NewUser</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
app<span class="token punctuation">.</span><span class="token function">Instance</span><span class="token punctuation">(</span><span class="token string">&quot;admin.User&quot;</span><span class="token punctuation">,</span> user<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="binding-interfaces-to-implementations" tabindex="-1"><a class="header-anchor" href="#binding-interfaces-to-implementations" aria-hidden="true">#</a> Binding Interfaces To Implementations</h3><p>A very powerful feature of the service container is its ability to bind an interface to a given implementation. For example, let&#39;s assume we have an <code>contract.EventPusher</code> interface and a <code>redis.EventPusher</code> implementation. Once we have coded our <code>redis.EventPusher</code> implementation of this interface, we can register it with the service container like so:</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code>app<span class="token punctuation">.</span><span class="token function">Bind</span><span class="token punctuation">(</span>
    <span class="token punctuation">(</span><span class="token operator">*</span>contract<span class="token punctuation">.</span>EventPusher<span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token boolean">nil</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    redis<span class="token punctuation">.</span>EventPusher<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>This statement tells the container that it should inject the <code>redis.EventPusher</code> when a struct needs an implementation of <code>contract.EventPusher</code>. Now we can type-hint the <code>contract.EventPusher</code> interface in a constructor, or any other location where dependencies are injected by the service container:</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code>eventPusher <span class="token operator">:=</span> app<span class="token punctuation">.</span><span class="token function">Make</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token operator">*</span>contract<span class="token punctuation">.</span>EventPusher<span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token boolean">nil</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token punctuation">(</span>contract<span class="token punctuation">.</span>EventPusher<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="binding-without-abstract" tabindex="-1"><a class="header-anchor" href="#binding-without-abstract" aria-hidden="true">#</a> Binding Without Abstract</h3><p>If you want to bind a struct, but do not want to use an abstract, you can also omit the abstract:</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code>app<span class="token punctuation">.</span><span class="token function">BindStruct</span><span class="token punctuation">(</span>http<span class="token punctuation">.</span>Client<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span>

client <span class="token operator">:=</span> app<span class="token punctuation">.</span><span class="token function">Make</span><span class="token punctuation">(</span>http<span class="token punctuation">.</span>Client<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token punctuation">(</span>http<span class="token punctuation">.</span>Client<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="extending-bindings" tabindex="-1"><a class="header-anchor" href="#extending-bindings" aria-hidden="true">#</a> Extending Bindings</h3><p>The <code>Extend</code> method allows the modification of resolved services. For example, when a service is resolved, you may run additional code to decorate or configure the service. The <code>Extend</code> method accepts a Closure, which should return the modified service, as its only argument. The Closure receives the service being resolved and the container instance:</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token punctuation">(</span><span class="token operator">*</span>app<span class="token punctuation">.</span><span class="token function">Container</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Extend</span><span class="token punctuation">(</span>redis<span class="token punctuation">.</span>connection<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token keyword">func</span><span class="token punctuation">(</span>service <span class="token keyword">interface</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span> <span class="token keyword">interface</span><span class="token punctuation">{</span><span class="token punctuation">}</span> <span class="token punctuation">{</span>
    service <span class="token operator">:=</span> service<span class="token punctuation">.</span><span class="token punctuation">(</span>redis<span class="token punctuation">.</span>Connection<span class="token punctuation">)</span>
    service<span class="token punctuation">.</span><span class="token function">SetName</span><span class="token punctuation">(</span><span class="token string">&quot;cache&quot;</span><span class="token punctuation">)</span>

    <span class="token keyword">return</span> service
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="resolving" tabindex="-1"><a class="header-anchor" href="#resolving" aria-hidden="true">#</a> Resolving</h2><p>You may use the <code>Make</code> method to resolve a concrete struct instance out of the container.</p><p>The <code>Make</code> method accepts the name of the struct:</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code>client <span class="token operator">:=</span> app<span class="token punctuation">.</span><span class="token function">Make</span><span class="token punctuation">(</span><span class="token string">&quot;http.Client&quot;</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token punctuation">(</span>http<span class="token punctuation">.</span>Client<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>An interface you wish to resolve:</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code>client <span class="token operator">:=</span> app<span class="token punctuation">.</span><span class="token function">Make</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token operator">*</span>http<span class="token punctuation">.</span>ClientInterface<span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token boolean">nil</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token punctuation">(</span>http<span class="token punctuation">.</span>ClientInterface<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>An struct you wish to resolve:</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code>client <span class="token operator">:=</span> app<span class="token punctuation">.</span><span class="token function">Make</span><span class="token punctuation">(</span>http<span class="token punctuation">.</span>Client<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token punctuation">(</span>http<span class="token punctuation">.</span>Client<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>An pointer/reference you wish to resolve:</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token keyword">var</span> client http<span class="token punctuation">.</span>Client
app<span class="token punctuation">.</span><span class="token function">Make</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>client<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>Use <code>MakeE</code> to get more control over the errors. For example, if you don&#39;t know if it can be resolved:</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code>client<span class="token punctuation">,</span> err <span class="token operator">:=</span> app<span class="token punctuation">.</span><span class="token function">MakeE</span><span class="token punctuation">(</span>http<span class="token punctuation">.</span>Client<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,44),p=[o];function i(c,u){return s(),a("div",null,p)}const r=n(t,[["render",i],["__file","container.html.vue"]]);export{r as default};