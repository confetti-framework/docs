<template><h1 id="views" tabindex="-1"><a class="header-anchor" href="#views" aria-hidden="true">#</a> Views</h1>
<h2 id="creating-views" tabindex="-1"><a class="header-anchor" href="#creating-views" aria-hidden="true">#</a> Creating Views</h2>
<blockquote>
<p>Looking for more information on how to write Go templates? Check out the <a href="https://golang.org/pkg/text/template/#hdr-Text_and_spaces" target="_blank" rel="noopener noreferrer">Text template documentation<ExternalLinkIcon/></a> and subsequent <a href="https://golang.org/pkg/html/template/" target="_blank" rel="noopener noreferrer">HTML template documentation<ExternalLinkIcon/></a> to get started.</p>
</blockquote>
<p>Views and templates are there to separate your controller/application logic from your presentation logic. A template consists of HTML, while a view contains data that you can use in the template. Views and templates are stored in the <code v-pre>resources/views</code> directory.</p>
<h3 id="html-response" tabindex="-1"><a class="header-anchor" href="#html-response" aria-hidden="true">#</a> HTML Response</h3>
<p>A simple view for an HTML response might look something like this:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">package</span> views

<span class="token keyword">import</span> <span class="token punctuation">(</span>
    <span class="token string">"github.com/confetti-framework/contract/inter"</span>
    <span class="token string">"confetti/config"</span>
<span class="token punctuation">)</span>

<span class="token comment">//go:embed homepage.gohtml</span>
<span class="token keyword">var</span> homepageTemplate <span class="token builtin">string</span>

<span class="token keyword">type</span> homepage <span class="token keyword">struct</span> <span class="token punctuation">{</span>
    Name <span class="token builtin">string</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token function">Homepage</span><span class="token punctuation">(</span>name <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token operator">*</span>homepage <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token operator">&amp;</span>homepage<span class="token punctuation">{</span>
        Name<span class="token punctuation">:</span> name<span class="token punctuation">,</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>e homepage<span class="token punctuation">)</span> <span class="token function">Template</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token builtin">string</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> homepageTemplate
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br></div></div><p>Since the view is stored at <code v-pre>resources/views/homepage.go</code> and <code v-pre>//go:embed</code> points to <code v-pre>homepage.gohtml</code>, you have to
create <code v-pre>resources/views/homepage.gohtml</code>:</p>
<div class="language-html ext-html line-numbers-mode"><pre v-pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>html</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>body</span><span class="token punctuation">></span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h1</span><span class="token punctuation">></span></span>Hello, {{ .Name }}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h1</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>body</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>html</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>In a controller you can then return the view as a response.</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">func</span> <span class="token function">Welcome</span><span class="token punctuation">(</span>request inter<span class="token punctuation">.</span>Request<span class="token punctuation">)</span> inter<span class="token punctuation">.</span>Response <span class="token punctuation">{</span>
    <span class="token keyword">return</span> outcome<span class="token punctuation">.</span><span class="token function">Html</span><span class="token punctuation">(</span>views<span class="token punctuation">.</span><span class="token function">Homepage</span><span class="token punctuation">(</span><span class="token string">"James"</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h3 id="json-response" tabindex="-1"><a class="header-anchor" href="#json-response" aria-hidden="true">#</a> JSON Response</h3>
<p>You can also use a view for JSON responses. Then the struct do not need to contain a <code v-pre>Template</code> method. Use the <code v-pre>json</code> tag to specify the field that will be included in the json response. Use <code v-pre>json:&quot;title&quot;</code> to lowercase the key:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">package</span> views

<span class="token keyword">type</span> book <span class="token keyword">struct</span> <span class="token punctuation">{</span>
    Title <span class="token builtin">string</span> <span class="token string">`json:"title"`</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token function">Book</span><span class="token punctuation">(</span>title <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token operator">*</span>book <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token operator">&amp;</span>book<span class="token punctuation">{</span>
        Title<span class="token punctuation">:</span> title<span class="token punctuation">,</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><p>You can then use the view as a json response:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">func</span> <span class="token function">ShowBook</span><span class="token punctuation">(</span>request inter<span class="token punctuation">.</span>Request<span class="token punctuation">)</span> inter<span class="token punctuation">.</span>Response <span class="token punctuation">{</span>
    <span class="token keyword">return</span> outcome<span class="token punctuation">.</span><span class="token function">Json</span><span class="token punctuation">(</span>views<span class="token punctuation">.</span><span class="token function">Book</span><span class="token punctuation">(</span><span class="token string">"James"</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><blockquote>
<p>Although we now call this a View, no one is preventing you from putting these in a folder 'responses'.</p>
</blockquote>
<h2 id="combine-multiple-views" tabindex="-1"><a class="header-anchor" href="#combine-multiple-views" aria-hidden="true">#</a> Combine Multiple Views</h2>
<p>Each website consists of several small templates. For example, you need a menu and footer on every page of your website.
Confetti makes it easy to reuse predefined templates.</p>
<h3 id="define-templates" tabindex="-1"><a class="header-anchor" href="#define-templates" aria-hidden="true">#</a> Define Templates</h3>
<p>You can define a template by using the tag <code v-pre>define</code> with a reference name. A template that you want to reuse later can
look like this:</p>
<div class="language-html ext-html line-numbers-mode"><pre v-pre class="language-html"><code>{{ define "footer" }}
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>footer</span><span class="token punctuation">></span></span>Mackays Hotel<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>br</span><span class="token punctuation">/></span></span>No. 1 Bistro<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>br</span><span class="token punctuation">/></span></span>Elgin Street<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>br</span><span class="token punctuation">/></span></span>Lancashire<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>footer</span><span class="token punctuation">></span></span>
{{end}}
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h3 id="use-defined-templates" tabindex="-1"><a class="header-anchor" href="#use-defined-templates" aria-hidden="true">#</a> Use Defined Templates</h3>
<p>You can use the <code v-pre>template</code> tag to import predefined templates:</p>
<div class="language-html ext-html line-numbers-mode"><pre v-pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>html</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>body</span><span class="token punctuation">></span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h1</span><span class="token punctuation">></span></span>World's shortest street<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h1</span><span class="token punctuation">></span></span>
        {{template "footer"}}
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>body</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>html</span><span class="token punctuation">></span></span>
</code></pre><div class="highlight-lines"><br><br><br><div class="highlight-line">&nbsp;</div><br><br></div><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><h3 id="template-builder" tabindex="-1"><a class="header-anchor" href="#template-builder" aria-hidden="true">#</a> Template Builder</h3>
<p>By default, all templates are loaded from <code v-pre>resources/views</code> 5 directories deep. If you want to expand it or just want to
use very specific templates, you can customize <code v-pre>template_builder</code> in <code v-pre>providers.ViewServiceProvider</code>. Here you can
adjust the built-in Golang <code v-pre>*Template</code>. For more information on all possible methods, take a look
at <a href="https://golang.org/pkg/text/template/#Template.AddParseTree" target="_blank" rel="noopener noreferrer">the manual<ExternalLinkIcon/></a>.</p>
<h2 id="helper-functions" tabindex="-1"><a class="header-anchor" href="#helper-functions" aria-hidden="true">#</a> Helper Functions</h2>
<p>You can define functions in providers.ViewServiceProvider. You can use those functions in any template:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>templateBuilder<span class="token punctuation">.</span><span class="token function">Funcs</span><span class="token punctuation">(</span>template<span class="token punctuation">.</span>FuncMap<span class="token punctuation">{</span>
    <span class="token keyword">return</span> templateBuilder<span class="token punctuation">.</span><span class="token function">Funcs</span><span class="token punctuation">(</span>template<span class="token punctuation">.</span>FuncMap<span class="token punctuation">{</span>
        <span class="token string">"Replace"</span><span class="token punctuation">:</span> <span class="token keyword">func</span><span class="token punctuation">(</span>input<span class="token punctuation">,</span> from<span class="token punctuation">,</span> to <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token builtin">string</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> strings<span class="token punctuation">.</span><span class="token function">Replace</span><span class="token punctuation">(</span>input<span class="token punctuation">,</span> from<span class="token punctuation">,</span> to<span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token string">"Trim"</span><span class="token punctuation">:</span> strings<span class="token punctuation">.</span>Trim<span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="highlight-lines"><br><br><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><br><br></div><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p>You can then use that function in the template. Use the function followed by the parameters:</p>
<div class="language-html ext-html line-numbers-mode"><pre v-pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h1</span><span class="token punctuation">></span></span>{{ Trim .Title " " }}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h1</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">></span></span>{{ Replace .Description " " "_" }}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h2 id="content-by-view" tabindex="-1"><a class="header-anchor" href="#content-by-view" aria-hidden="true">#</a> Content By View</h2>
<p>You may want to use the view for a different purpose. You can get the content of a view by using the <code v-pre>view_helper</code>
package:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>builder <span class="token operator">:=</span> app<span class="token punctuation">.</span><span class="token function">Make</span><span class="token punctuation">(</span><span class="token string">"template_builder"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token punctuation">(</span>inter<span class="token punctuation">.</span>TemplateBuilder<span class="token punctuation">)</span>
result <span class="token operator">:=</span> view_helper<span class="token punctuation">.</span><span class="token function">ContentByView</span><span class="token punctuation">(</span>view<span class="token punctuation">,</span> builder<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div></template>
