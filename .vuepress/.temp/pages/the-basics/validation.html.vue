<template><div><h1 id="validation" tabindex="-1"><a class="header-anchor" href="#validation" aria-hidden="true">#</a> Validation</h1>
<h2 id="introduction" tabindex="-1"><a class="header-anchor" href="#introduction" aria-hidden="true">#</a> Introduction</h2>
<p>Good validation prevents bugs and will make your application more secure. Confetti provides several different approaches
to validate your application's incoming data.</p>
<h3 id="writing-the-validation-logic" tabindex="-1"><a class="header-anchor" href="#writing-the-validation-logic" aria-hidden="true">#</a> Writing The Validation Logic</h3>
<p>With Confetti it is very easy to validate incoming data. With the first parameter you enter the data you want to
validate. Furthermore, you enter fields with rules.</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>failures <span class="token operator">:=</span> val<span class="token punctuation">.</span><span class="token function">Validate</span><span class="token punctuation">(</span>request<span class="token punctuation">.</span><span class="token function">App</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> request<span class="token punctuation">.</span><span class="token function">Content</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    val<span class="token punctuation">.</span><span class="token function">Verify</span><span class="token punctuation">(</span><span class="token string">"name"</span><span class="token punctuation">,</span> rule<span class="token punctuation">.</span>Required<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> rule<span class="token punctuation">.</span>String<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    val<span class="token punctuation">.</span><span class="token function">Verify</span><span class="token punctuation">(</span><span class="token string">"email"</span><span class="token punctuation">,</span> rule<span class="token punctuation">.</span>Required<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> rule<span class="token punctuation">.</span>Email<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>If a validation error occurs, you will receive a slice with errors.</p>
<h4 id="nested-attributes" tabindex="-1"><a class="header-anchor" href="#nested-attributes" aria-hidden="true">#</a> Nested Attributes</h4>
<p>If your data contains &quot;nested&quot; parameters, you may specify them in your validation rules using &quot;dot&quot; syntax:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>failures <span class="token operator">:=</span> val<span class="token punctuation">.</span><span class="token function">Validate</span><span class="token punctuation">(</span>request<span class="token punctuation">.</span><span class="token function">App</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> request<span class="token punctuation">.</span><span class="token function">Content</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    val<span class="token punctuation">.</span><span class="token function">Verify</span><span class="token punctuation">(</span><span class="token string">"title"</span><span class="token punctuation">,</span> rule<span class="token punctuation">.</span>Required<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> rule<span class="token punctuation">.</span>String<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    val<span class="token punctuation">.</span><span class="token function">Verify</span><span class="token punctuation">(</span><span class="token string">"author.name"</span><span class="token punctuation">,</span> rule<span class="token punctuation">.</span>Required<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    val<span class="token punctuation">.</span><span class="token function">Verify</span><span class="token punctuation">(</span><span class="token string">"author.description"</span><span class="token punctuation">,</span> rule<span class="token punctuation">.</span>Required<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>If you want to validate all fields in a slice or in a map, you can use an asterisk:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>failures <span class="token operator">:=</span> val<span class="token punctuation">.</span><span class="token function">Validate</span><span class="token punctuation">(</span>request<span class="token punctuation">.</span><span class="token function">App</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> request<span class="token punctuation">.</span><span class="token function">Content</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    val<span class="token punctuation">.</span><span class="token function">Verify</span><span class="token punctuation">(</span><span class="token string">"orders"</span><span class="token punctuation">,</span> rule<span class="token punctuation">.</span>Size<span class="token punctuation">{</span>Len<span class="token punctuation">:</span> <span class="token number">3</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    val<span class="token punctuation">.</span><span class="token function">Verify</span><span class="token punctuation">(</span><span class="token string">"orders.*.street"</span><span class="token punctuation">,</span> rule<span class="token punctuation">.</span>Required<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> rule<span class="token punctuation">.</span>String<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="displaying-the-validation-errors" tabindex="-1"><a class="header-anchor" href="#displaying-the-validation-errors" aria-hidden="true">#</a> Displaying The Validation Errors</h3>
<p>So, what if the incoming request parameters do not pass the given validation rules? As mentioned previously, after
validation you will receive the errors in a slice.</p>
<h4 id="return-errors-as-response" tabindex="-1"><a class="header-anchor" href="#return-errors-as-response" aria-hidden="true">#</a> Return Errors As Response</h4>
<p>You can choose to return the errors immediately. In that case, the customer will immediately see the correct HTML page
or JSON response.</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">func</span> <span class="token function">UserStore</span><span class="token punctuation">(</span>request inter<span class="token punctuation">.</span>Request<span class="token punctuation">)</span> inter<span class="token punctuation">.</span>Response <span class="token punctuation">{</span>
    failures <span class="token operator">:=</span> val<span class="token punctuation">.</span><span class="token function">Validate</span><span class="token punctuation">(</span>request<span class="token punctuation">.</span><span class="token function">App</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> request<span class="token punctuation">.</span><span class="token function">Content</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
        val<span class="token punctuation">.</span><span class="token function">Verify</span><span class="token punctuation">(</span><span class="token string">"title"</span><span class="token punctuation">,</span> rule<span class="token punctuation">.</span>Required<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> rule<span class="token punctuation">.</span>String<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token punctuation">)</span>
    <span class="token keyword">if</span> <span class="token function">len</span><span class="token punctuation">(</span>failures<span class="token punctuation">)</span> <span class="token operator">></span> <span class="token number">0</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> outcome<span class="token punctuation">.</span><span class="token function">Html</span><span class="token punctuation">(</span>failures<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>

    <span class="token comment">//</span>
<span class="token punctuation">}</span>
</code></pre><div class="highlight-lines"><br><br><br><br><br><div class="highlight-line">&nbsp;</div><br><br><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote>
<p>You can edit the error view yourself in response_service_provider.go. For more information about adjusting error responses, I refer you to the <RouterLink to="/the-basics/errors.html#custom-http-error-pages">error documentation</RouterLink>.</p>
</blockquote>
<h4 id="use-errors-in-views" tabindex="-1"><a class="header-anchor" href="#use-errors-in-views" aria-hidden="true">#</a> Use Errors In Views</h4>
<p>Or you pass the errors to a view. That way you can, for example, place the errors next to the fields in a form:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">func</span> <span class="token function">UserStore</span><span class="token punctuation">(</span>request inter<span class="token punctuation">.</span>Request<span class="token punctuation">)</span> inter<span class="token punctuation">.</span>Response <span class="token punctuation">{</span>
    app <span class="token operator">:=</span> request<span class="token punctuation">.</span><span class="token function">App</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    content <span class="token operator">:=</span> request<span class="token punctuation">.</span><span class="token function">Content</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    failures <span class="token operator">:=</span> val<span class="token punctuation">.</span><span class="token function">Validate</span><span class="token punctuation">(</span>app<span class="token punctuation">,</span> content<span class="token punctuation">,</span>
        val<span class="token punctuation">.</span><span class="token function">Verify</span><span class="token punctuation">(</span><span class="token string">"title"</span><span class="token punctuation">,</span> rule<span class="token punctuation">.</span>Required<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> rule<span class="token punctuation">.</span>String<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token punctuation">)</span>

    <span class="token keyword">return</span> outcome<span class="token punctuation">.</span><span class="token function">Html</span><span class="token punctuation">(</span>views<span class="token punctuation">.</span><span class="token function">UserCreate</span><span class="token punctuation">(</span>
        app<span class="token punctuation">,</span>
        failures<span class="token punctuation">,</span>
        content<span class="token punctuation">.</span><span class="token function">Get</span><span class="token punctuation">(</span><span class="token string">"title"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">String</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="highlight-lines"><br><br><br><br><br><br><br><br><br><div class="highlight-line">&nbsp;</div><br><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Once in the template you can do whatever you want with the errors:</p>
<div class="language-html ext-html line-numbers-mode"><pre v-pre class="language-html"><code>{{- /*gotype: confetti/resources/views.UserCreateView*/ -}}

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h1</span><span class="token punctuation">></span></span>Create Post<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h1</span><span class="token punctuation">></span></span>

{{ if .Failures }}
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>alert alert-danger<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ul</span><span class="token punctuation">></span></span>
        {{ range $key, $value := .Failures }}
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span><span class="token punctuation">></span></span>{{ $value }}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">></span></span>
        {{ end }}
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>ul</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span>
{{ end }}

<span class="token comment">&lt;!-- Create Post Form --></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="fetch-error-by-field" tabindex="-1"><a class="header-anchor" href="#fetch-error-by-field" aria-hidden="true">#</a> Fetch Error By Field</h4>
<p>You may also use the <code v-pre>Error</code> function to quickly check if validation error messages exist for a given field:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token operator">-</span> <span class="token comment">/*gotype: confetti/resources/views.UserCreateView*/</span> <span class="token operator">-</span><span class="token punctuation">}</span><span class="token punctuation">}</span>

<span class="token operator">&lt;</span>label <span class="token keyword">for</span><span class="token operator">=</span><span class="token string">"name"</span><span class="token operator">></span>User Name<span class="token operator">&lt;</span><span class="token operator">/</span>label<span class="token operator">></span>

<span class="token operator">&lt;</span>input id<span class="token operator">=</span><span class="token string">"name"</span> <span class="token keyword">type</span><span class="token operator">=</span><span class="token string">"text"</span> class<span class="token operator">=</span><span class="token string">"{{ if Error .Failures "</span>name<span class="token string">" }} is-invalid {{ end }}"</span><span class="token operator">></span>

<span class="token punctuation">{</span><span class="token punctuation">{</span> <span class="token keyword">if</span> Error <span class="token punctuation">.</span>Failures <span class="token string">"name"</span> <span class="token punctuation">}</span><span class="token punctuation">}</span>
    <span class="token operator">&lt;</span>div class<span class="token operator">=</span><span class="token string">"alert"</span><span class="token operator">></span><span class="token punctuation">{</span><span class="token punctuation">{</span> Error <span class="token punctuation">.</span>Failures <span class="token string">"name"</span> <span class="token punctuation">}</span><span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">></span>
<span class="token punctuation">{</span><span class="token punctuation">{</span> end <span class="token punctuation">}</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="custom-validation-rules" tabindex="-1"><a class="header-anchor" href="#custom-validation-rules" aria-hidden="true">#</a> Custom Validation Rules</h2>
<h3 id="using-rule-objects" tabindex="-1"><a class="header-anchor" href="#using-rule-objects" aria-hidden="true">#</a> Using Rule Objects</h3>
<p>Confetti provides a variety of helpful validation rules; however, you may wish to specify some of your own. The rule only
needs to meet the <code v-pre>inter.Rule</code> interface with the <code v-pre>Verify</code> method. If the value does not meet the rule, you need to return
an error:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">package</span> custom_rule

<span class="token keyword">import</span> <span class="token punctuation">(</span>
    <span class="token string">"github.com/confetti-framework/support"</span>
    <span class="token string">"github.com/confetti-framework/validation/rule"</span>
    <span class="token string">"strings"</span>
<span class="token punctuation">)</span>

<span class="token keyword">type</span> Uppercase <span class="token keyword">struct</span><span class="token punctuation">{</span><span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>u Uppercase<span class="token punctuation">)</span> <span class="token function">Verify</span><span class="token punctuation">(</span>value support<span class="token punctuation">.</span>Value<span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
    val<span class="token punctuation">,</span> err <span class="token operator">:=</span> value<span class="token punctuation">.</span><span class="token function">StringE</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> rule<span class="token punctuation">.</span>MustBeAStringError
    <span class="token punctuation">}</span>

    <span class="token keyword">if</span> strings<span class="token punctuation">.</span><span class="token function">ToUpper</span><span class="token punctuation">(</span>val<span class="token punctuation">)</span> <span class="token operator">==</span> val <span class="token punctuation">{</span>
        <span class="token keyword">return</span> rule<span class="token punctuation">.</span>ValidationError<span class="token punctuation">.</span><span class="token function">Wrap</span><span class="token punctuation">(</span><span class="token string">"the :attribute must be uppercase"</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">return</span> <span class="token boolean">nil</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Once the rule has been defined, you may attach it to a validator by passing an instance of the rule object with your
other validation rules:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>failures <span class="token operator">:=</span> val<span class="token punctuation">.</span><span class="token function">Validate</span><span class="token punctuation">(</span>app<span class="token punctuation">,</span> content<span class="token punctuation">,</span>
    val<span class="token punctuation">.</span><span class="token function">Verify</span><span class="token punctuation">(</span><span class="token string">"title"</span><span class="token punctuation">,</span> rule<span class="token punctuation">.</span>Required<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> custom_rule<span class="token punctuation">.</span>Uppercase<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="requirements" tabindex="-1"><a class="header-anchor" href="#requirements" aria-hidden="true">#</a> Requirements</h3>
<p>Should your rule execute other rules first? You can use interface <code v-pre>inter.RuleWithRequirements</code> with method <code v-pre>Requirements</code> to determine which
other rules should be executed first. The above example would then become:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">package</span> custom_rule

<span class="token keyword">import</span> <span class="token punctuation">(</span>
    <span class="token string">"github.com/confetti-framework/contract/inter"</span>
    <span class="token string">"github.com/confetti-framework/support"</span>
    <span class="token string">"github.com/confetti-framework/validation/rule"</span>
    <span class="token string">"strings"</span>
<span class="token punctuation">)</span>

<span class="token keyword">type</span> Uppercase <span class="token keyword">struct</span><span class="token punctuation">{</span><span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>u Uppercase<span class="token punctuation">)</span> <span class="token function">Requirements</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>inter<span class="token punctuation">.</span>Rule <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>inter<span class="token punctuation">.</span>Rule<span class="token punctuation">{</span>
        rule<span class="token punctuation">.</span>String<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>u Uppercase<span class="token punctuation">)</span> <span class="token function">Verify</span><span class="token punctuation">(</span>value support<span class="token punctuation">.</span>Value<span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> strings<span class="token punctuation">.</span><span class="token function">ToUpper</span><span class="token punctuation">(</span>value<span class="token punctuation">.</span><span class="token function">String</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">==</span> value<span class="token punctuation">.</span><span class="token function">String</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> rule<span class="token punctuation">.</span>ValidationError<span class="token punctuation">.</span><span class="token function">Wrap</span><span class="token punctuation">(</span><span class="token string">"the :attribute must be uppercase"</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> <span class="token boolean">nil</span>
<span class="token punctuation">}</span>
</code></pre><div class="highlight-lines"><br><br><br><br><br><br><br><br><br><br><br><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><br><br><br><br><br><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="dependency-injection" tabindex="-1"><a class="header-anchor" href="#dependency-injection" aria-hidden="true">#</a> Dependency Injection</h3>
<p>If you need dependency injection in your rule? Then you can implement interface <code v-pre>inter.RuleWithApp</code> with method <code v-pre>SetApp</code> to
set up <code v-pre>inter.AppReader</code> for dependency injection:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">package</span> custom_rule
<span class="token keyword">import</span> <span class="token punctuation">(</span>
    <span class="token string">"github.com/confetti-framework/contract/inter"</span>
    <span class="token string">"github.com/confetti-framework/support"</span>
<span class="token punctuation">)</span>

<span class="token keyword">type</span> TimeZone <span class="token keyword">struct</span> <span class="token punctuation">{</span>
    app inter<span class="token punctuation">.</span>AppReader
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>r TimeZone<span class="token punctuation">)</span> <span class="token function">SetApp</span><span class="token punctuation">(</span>app inter<span class="token punctuation">.</span>AppReader<span class="token punctuation">)</span> inter<span class="token punctuation">.</span>Rule <span class="token punctuation">{</span>
    r<span class="token punctuation">.</span>app <span class="token operator">=</span> app
    <span class="token keyword">return</span> r
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>r TimeZone<span class="token punctuation">)</span> <span class="token function">Verify</span><span class="token punctuation">(</span>value support<span class="token punctuation">.</span>Value<span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
    currentTimeZone <span class="token operator">:=</span> r<span class="token punctuation">.</span>app<span class="token punctuation">.</span><span class="token function">Make</span><span class="token punctuation">(</span><span class="token string">"config.App.TimeZone"</span><span class="token punctuation">)</span>

    <span class="token comment">//</span>
<span class="token punctuation">}</span>
</code></pre><div class="highlight-lines"><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><div class="highlight-line">&nbsp;</div><br><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="available-validation-rules" tabindex="-1"><a class="header-anchor" href="#available-validation-rules" aria-hidden="true">#</a> Available Validation Rules</h2>
<ul>
<li><a href="#accepted">Accepted</a></li>
<li><a href="#after">After</a></li>
<li><a href="#after-or-equal">After Or Equal</a></li>
<li><a href="#before">Before</a></li>
<li><a href="#before-or-equal">Before Or Equal</a></li>
<li><a href="#boolean">Boolean</a></li>
<li><a href="#date">Date</a></li>
<li><a href="#date-equals">Date Equals</a></li>
<li><a href="#ends-with">Ends With</a></li>
<li><a href="#filled">Filled</a></li>
<li><a href="#in">In</a></li>
<li><a href="#integer">Integer</a></li>
<li><a href="#integer-able">Integer Able</a></li>
<li><a href="#map">Map</a></li>
<li><a href="#max">Max</a></li>
<li><a href="#min">Min</a></li>
<li><a href="#present">Present</a></li>
<li><a href="#required">Required</a></li>
<li><a href="#size">Size</a></li>
<li><a href="#slice">Slice</a></li>
<li><a href="#start-with">Start With</a></li>
<li><a href="#string">String</a></li>
</ul>
<h4 id="accepted" tabindex="-1"><a class="header-anchor" href="#accepted" aria-hidden="true">#</a> Accepted</h4>
<p>The field under validation must be <em>yes</em>, <em>on</em>, <em>1</em>, or <em>true</em>. This is useful for validating &quot;Terms of Service&quot;
acceptance.</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>rule<span class="token punctuation">.</span>Accepted<span class="token punctuation">{</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="after" tabindex="-1"><a class="header-anchor" href="#after" aria-hidden="true">#</a> After</h4>
<p>The field under validation must be a value after a given date:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>val<span class="token punctuation">.</span><span class="token function">Verify</span><span class="token punctuation">(</span><span class="token string">"start_date"</span><span class="token punctuation">,</span> rule<span class="token punctuation">.</span>Required<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> rule<span class="token punctuation">.</span>After<span class="token punctuation">{</span>Date<span class="token punctuation">:</span> carbon<span class="token punctuation">.</span><span class="token function">Now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">AddDay</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>Beside <code v-pre>Date</code>, you can enter a normal datetime format (default <code v-pre>yyyy-mm-dd HH:MM:SS</code> / <code v-pre>2006-01-02 15:04:05</code>) and a
timezone (default <code v-pre>Local</code>):</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>rule<span class="token punctuation">.</span>After<span class="token punctuation">{</span>
    Date<span class="token punctuation">:</span>     carbon<span class="token punctuation">.</span><span class="token function">Now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">AddDay</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    Format<span class="token punctuation">:</span>   <span class="token string">"yyyy-mm-dd HH:MM:SS Z"</span><span class="token punctuation">,</span>
    TimeZone<span class="token punctuation">:</span> <span class="token string">"UTC"</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="after-or-equal" tabindex="-1"><a class="header-anchor" href="#after-or-equal" aria-hidden="true">#</a> After Or Equal</h4>
<p>The field under validation must be a value after or equal to the given date. For more options, see the <a href="#after">After</a>
rule.</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>rule<span class="token punctuation">.</span>AfterOrEqual<span class="token punctuation">{</span>Date<span class="token punctuation">:</span> carbon<span class="token punctuation">.</span><span class="token function">Now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">AddDay</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="before" tabindex="-1"><a class="header-anchor" href="#before" aria-hidden="true">#</a> Before</h4>
<p>The field under validation must be a value after a given date. For more options, see the <a href="#after">After</a> rule.</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>rule<span class="token punctuation">.</span>Before<span class="token punctuation">{</span>Date<span class="token punctuation">:</span> carbon<span class="token punctuation">.</span><span class="token function">Now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">AddDay</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="before-or-equal" tabindex="-1"><a class="header-anchor" href="#before-or-equal" aria-hidden="true">#</a> Before Or Equal</h4>
<p>The field under validation must be a value preceding or equal to the given date. For more options, see
the <a href="#after">After</a> rule.</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>rule<span class="token punctuation">.</span>BeforeOrEqual<span class="token punctuation">{</span>Date<span class="token punctuation">:</span> carbon<span class="token punctuation">.</span><span class="token function">Now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">AddDay</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="boolean" tabindex="-1"><a class="header-anchor" href="#boolean" aria-hidden="true">#</a> Boolean</h4>
<p>The field under validation must be able to be cast as a boolean. Accepted input are <code v-pre>true</code>, <code v-pre>false</code>, <code v-pre>1</code>, <code v-pre>0</code>, <code v-pre>&quot;1&quot;</code>,
and <code v-pre>&quot;0&quot;</code>.</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>rule<span class="token punctuation">.</span>Boolean<span class="token punctuation">{</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="date" tabindex="-1"><a class="header-anchor" href="#date" aria-hidden="true">#</a> Date</h4>
<p>The field under validation must be a valid date according to the format (default format is <code v-pre>yyyy-mm-dd HH:MM:SS</code> /
<code v-pre>2006-01-02 15:04:05</code>).</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>rule<span class="token punctuation">.</span>Date<span class="token punctuation">{</span>Format<span class="token punctuation">:</span> carbon<span class="token punctuation">.</span>HourMinuteFormat<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="date-equals" tabindex="-1"><a class="header-anchor" href="#date-equals" aria-hidden="true">#</a> Date Equals</h4>
<p>The field under validation must be equal to the given date. For more options, see the <a href="#after">After</a> rule.</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>rule<span class="token punctuation">.</span>DateEqual<span class="token punctuation">{</span>Date<span class="token punctuation">:</span> carbon<span class="token punctuation">.</span><span class="token function">Now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> Format<span class="token punctuation">:</span> carbon<span class="token punctuation">.</span>DateFormat<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="ends-with" tabindex="-1"><a class="header-anchor" href="#ends-with" aria-hidden="true">#</a> Ends With</h4>
<p>The field under validation must end with one of the given values.</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>rule<span class="token punctuation">.</span>Ends<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">.</span><span class="token function">With</span><span class="token punctuation">(</span><span class="token string">".com"</span><span class="token punctuation">,</span> <span class="token string">".nl"</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="filled" tabindex="-1"><a class="header-anchor" href="#filled" aria-hidden="true">#</a> Filled</h4>
<p>The field under validation must not be empty when it is present.</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>rule<span class="token punctuation">.</span>Filled<span class="token punctuation">{</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="in" tabindex="-1"><a class="header-anchor" href="#in" aria-hidden="true">#</a> In</h4>
<p>The field under validation must be included in the given list of values.</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>rule<span class="token punctuation">.</span>In<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">.</span><span class="token function">With</span><span class="token punctuation">(</span><span class="token string">"admin"</span><span class="token punctuation">,</span> <span class="token string">"manager"</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="integer" tabindex="-1"><a class="header-anchor" href="#integer" aria-hidden="true">#</a> Integer</h4>
<p>The field under validation must be an integer.</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>rule<span class="token punctuation">.</span>Integer<span class="token punctuation">{</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="integer-able" tabindex="-1"><a class="header-anchor" href="#integer-able" aria-hidden="true">#</a> Integer Able</h4>
<p>The field being validated can be cast to an integer.</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>rule<span class="token punctuation">.</span>IntegerAble<span class="token punctuation">{</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="map" tabindex="-1"><a class="header-anchor" href="#map" aria-hidden="true">#</a> Map</h4>
<p>The field under validation must be a <code v-pre>map</code>.</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>rule<span class="token punctuation">.</span>Map<span class="token punctuation">{</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="max" tabindex="-1"><a class="header-anchor" href="#max" aria-hidden="true">#</a> Max</h4>
<p>The field under validation must be less than or equal to a maximum amount of items in a map or slice or maximum number.</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>val<span class="token punctuation">.</span><span class="token function">Verify</span><span class="token punctuation">(</span><span class="token string">"age"</span><span class="token punctuation">,</span> rule<span class="token punctuation">.</span>Integer<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> rule<span class="token punctuation">.</span>Max<span class="token punctuation">{</span>Len<span class="token punctuation">:</span> <span class="token number">120</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
val<span class="token punctuation">.</span><span class="token function">Verify</span><span class="token punctuation">(</span><span class="token string">"items"</span><span class="token punctuation">,</span> rule<span class="token punctuation">.</span>Slice<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> rule<span class="token punctuation">.</span>Max<span class="token punctuation">{</span>Len<span class="token punctuation">:</span> <span class="token number">5</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="min" tabindex="-1"><a class="header-anchor" href="#min" aria-hidden="true">#</a> Min</h4>
<p>The field under validation must be at least amount of items in a map or slice or maximum number.</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>val<span class="token punctuation">.</span><span class="token function">Verify</span><span class="token punctuation">(</span><span class="token string">"age"</span><span class="token punctuation">,</span> rule<span class="token punctuation">.</span>Integer<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> rule<span class="token punctuation">.</span>Min<span class="token punctuation">{</span>Len<span class="token punctuation">:</span> <span class="token number">0</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
val<span class="token punctuation">.</span><span class="token function">Verify</span><span class="token punctuation">(</span><span class="token string">"items"</span><span class="token punctuation">,</span> rule<span class="token punctuation">.</span>Slice<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> rule<span class="token punctuation">.</span>Min<span class="token punctuation">{</span>Len<span class="token punctuation">:</span> <span class="token number">5</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="present" tabindex="-1"><a class="header-anchor" href="#present" aria-hidden="true">#</a> Present</h4>
<p>The field under validation must be present in the input data but can be empty.</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>rule<span class="token punctuation">.</span>Present<span class="token punctuation">{</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="required" tabindex="-1"><a class="header-anchor" href="#required" aria-hidden="true">#</a> Required</h4>
<p>The field under validation must be present in the input data and not empty.</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>rule<span class="token punctuation">.</span>Required<span class="token punctuation">{</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><blockquote>
<p>A field is considered &quot;empty&quot; if one of the following conditions are true:</p>
<ul>
<li>The value is <code v-pre>nil</code>.</li>
<li>The value is an empty <code v-pre>string</code>.</li>
<li>The value is an empty <code v-pre>slice</code> or empty <code v-pre>map</code> object.</li>
</ul>
</blockquote>
<h4 id="size" tabindex="-1"><a class="header-anchor" href="#size" aria-hidden="true">#</a> Size</h4>
<p>The field under validation must have a size matching the given value.</p>
<h5 id="validate-that-a-provided-integer-equals-10" tabindex="-1"><a class="header-anchor" href="#validate-that-a-provided-integer-equals-10" aria-hidden="true">#</a> Validate that a provided integer equals 10...</h5>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>val<span class="token punctuation">.</span><span class="token function">Verify</span><span class="token punctuation">(</span><span class="token string">"age"</span><span class="token punctuation">,</span> rule<span class="token punctuation">.</span>Integer<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> rule<span class="token punctuation">.</span>Size<span class="token punctuation">{</span>Len<span class="token punctuation">:</span> <span class="token number">12</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h5 id="validate-that-an-slice-has-exactly-5-elements" tabindex="-1"><a class="header-anchor" href="#validate-that-an-slice-has-exactly-5-elements" aria-hidden="true">#</a> Validate that an slice has exactly 5 elements...</h5>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>val<span class="token punctuation">.</span><span class="token function">Verify</span><span class="token punctuation">(</span><span class="token string">"items"</span><span class="token punctuation">,</span> rule<span class="token punctuation">.</span>Slice<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> rule<span class="token punctuation">.</span>Size<span class="token punctuation">{</span>Len<span class="token punctuation">:</span> <span class="token number">5</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="slice" tabindex="-1"><a class="header-anchor" href="#slice" aria-hidden="true">#</a> Slice</h4>
<p>The field under validation must be a <code v-pre>slice</code>.</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>rule<span class="token punctuation">.</span>Slice<span class="token punctuation">{</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="start-with" tabindex="-1"><a class="header-anchor" href="#start-with" aria-hidden="true">#</a> Start With</h4>
<p>The field under validation must start with one of the given values.</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>rule<span class="token punctuation">.</span>Start<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">.</span><span class="token function">With</span><span class="token punctuation">(</span><span class="token string">"06-"</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="string" tabindex="-1"><a class="header-anchor" href="#string" aria-hidden="true">#</a> String</h4>
<p>The field under validation must be a <code v-pre>string</code>.</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>rule<span class="token punctuation">.</span>String<span class="token punctuation">{</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></div></template>


