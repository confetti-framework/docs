import{_ as n,o as a,c as s,b as t}from"./app.d05353ee.js";const e={},o=t(`<h1 id="meet-confetti" tabindex="-1"><a class="header-anchor" href="#meet-confetti" aria-hidden="true">#</a> Meet Confetti</h1><p>Confetti is a lightweight web framework written in Go (Golang) that provides all the essential components to build your web application. Its purpose is to equip you with the tools necessary to write fast, secure, and scalable code.</p><p>Whether you\u2019re new to Go and web frameworks or a seasoned developer, Confetti is designed to seamlessly integrate into any web development project.</p><h2 id="why-confetti" tabindex="-1"><a class="header-anchor" href="#why-confetti" aria-hidden="true">#</a> Why Confetti?</h2><p>Writing idiomatic Go code often requires a different approach compared to frameworks like Ruby on Rails or Laravel. Confetti offers a standardized set of features that streamline development, making it easier to maintain high-quality code.</p><blockquote><p>Confetti combines the elegance of a framework with the simplicity and power of Go.</p></blockquote><h2 id="feel-at-home" tabindex="-1"><a class="header-anchor" href="#feel-at-home" aria-hidden="true">#</a> Feel at Home</h2><p>Our goal is for you to feel right at home with Confetti. To help you get started, here\u2019s a quick example. Don\u2019t worry if it looks unfamiliar at first\u2014the comprehensive documentation will guide you every step of the way.</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token keyword">package</span> status

<span class="token keyword">func</span> <span class="token function">Index</span><span class="token punctuation">(</span>response http<span class="token punctuation">.</span>ResponseWriter<span class="token punctuation">,</span> request <span class="token operator">*</span>http<span class="token punctuation">.</span>Request<span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
	<span class="token comment">// Create a map to store status information</span>
	data <span class="token operator">:=</span> <span class="token keyword">map</span><span class="token punctuation">[</span><span class="token builtin">string</span><span class="token punctuation">]</span>any<span class="token punctuation">{</span><span class="token punctuation">}</span>

	<span class="token comment">// Set the status to &quot;active&quot;</span>
	data<span class="token punctuation">[</span><span class="token string">&quot;status&quot;</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token string">&quot;active&quot;</span>

	<span class="token keyword">return</span> handler<span class="token punctuation">.</span><span class="token function">ToJson</span><span class="token punctuation">(</span>response<span class="token punctuation">,</span> data<span class="token punctuation">,</span> http<span class="token punctuation">.</span>StatusOK<span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>With built-in routing and middleware support:</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token keyword">var</span> ApiRoutes <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>handler<span class="token punctuation">.</span>Route<span class="token punctuation">{</span>
	handler<span class="token punctuation">.</span><span class="token function">New</span><span class="token punctuation">(</span><span class="token string">&quot;GET /status&quot;</span><span class="token punctuation">,</span> status<span class="token punctuation">.</span>Index<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">AppendMiddleware</span><span class="token punctuation">(</span>auth<span class="token punctuation">.</span><span class="token function">Middleware</span><span class="token punctuation">(</span><span class="token string">&quot;status/index&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div style="display:flex;align-items:center;margin-top:60px;font-family:sans-serif;"><img src="https://avatars.githubusercontent.com/u/25671390?v=4" alt="Alex Wulfheart" style="width:60px;height:60px;border-radius:50%;margin-right:15px;"><div><p style="font-size:16px;font-weight:bold;margin:0;">&quot;Using Confetti feels like coming home.&quot;</p><p style="font-size:14px;margin:0;">\u2014 Alex Wulfheart</p></div></div>`,12),i=[o];function p(c,l){return a(),s("div",null,i)}const r=n(e,[["render",p],["__file","meet.html.vue"]]);export{r as default};
