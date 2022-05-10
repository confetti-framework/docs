<template><h1 id="error-handling" tabindex="-1"><a class="header-anchor" href="#error-handling" aria-hidden="true">#</a> Error Handling</h1>
<h2 id="introduction" tabindex="-1"><a class="header-anchor" href="#introduction" aria-hidden="true">#</a> Introduction</h2>
<p>Error handling is very different in Go than in other languages. With Go the following applies: The more time you spend
on errors, the faster bugs can be found. It therefore deserves its own chapter.</p>
<h2 id="panic-and-return-errors" tabindex="-1"><a class="header-anchor" href="#panic-and-return-errors" aria-hidden="true">#</a> Panic And Return Errors</h2>
<p>In other languages you throw an exception (or error). If the caller wants to do something based on that error, then you
have to catch the error. This is very different with Go. The error is passed on until you can do something with it.
If you want to stop the process and just fire the error, you can use <code v-pre>panic</code>.</p>
<h3 id="return-errors" tabindex="-1"><a class="header-anchor" href="#return-errors" aria-hidden="true">#</a> Return Errors</h3>
<p>The most common way is to return the error from the function:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">import</span> <span class="token string">"github.com/confetti-framework/errors"</span>

<span class="token keyword">var</span> NoUserFound <span class="token operator">=</span> errors<span class="token punctuation">.</span><span class="token function">New</span><span class="token punctuation">(</span><span class="token string">"no user found"</span><span class="token punctuation">)</span>

<span class="token keyword">func</span> <span class="token function">GetUser</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">(</span>model<span class="token punctuation">.</span>User<span class="token punctuation">,</span> <span class="token builtin">error</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">//</span>

    <span class="token keyword">if</span> <span class="token punctuation">(</span>user <span class="token operator">==</span> <span class="token boolean">nil</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> users<span class="token punctuation">.</span><span class="token function">NewUnregistredUser</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> NoUserFound
    <span class="token punctuation">}</span>

    <span class="token keyword">return</span> user<span class="token punctuation">,</span> <span class="token boolean">nil</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><p>The following example shows how the caller can handle the error.</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>user<span class="token punctuation">,</span> err <span class="token operator">:=</span> <span class="token function">GetUser</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token keyword">if</span> err <span class="token operator">==</span> NoUserFound <span class="token punctuation">{</span>
    <span class="token comment">//</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><h4 id="ignore-errors" tabindex="-1"><a class="header-anchor" href="#ignore-errors" aria-hidden="true">#</a> Ignore Errors</h4>
<p>If you want to use the default user when the error occurs, you could ignore the error by an underscore:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>user<span class="token punctuation">,</span> <span class="token boolean">_</span> <span class="token operator">:=</span> <span class="token function">GetUser</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><h4 id="wrap" tabindex="-1"><a class="header-anchor" href="#wrap" aria-hidden="true">#</a> Wrap</h4>
<p>By applying multiple layers, you can add more information to the error. You can use the <code v-pre>Wrap</code> method to prefix a
message (with <code v-pre>validation error: no user found</code> as a result).</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>user<span class="token punctuation">,</span> err <span class="token operator">:=</span> <span class="token function">GetUser</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
err<span class="token punctuation">.</span><span class="token function">Wrap</span><span class="token punctuation">(</span><span class="token string">"validation error"</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h4 id="unwrap" tabindex="-1"><a class="header-anchor" href="#unwrap" aria-hidden="true">#</a> Unwrap</h4>
<p>To receive the original error (after <code v-pre>Wrap</code>), you can use <code v-pre>Unwrap</code> (with <code v-pre>no user found</code> as a result):</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>err <span class="token operator">:=</span> errors<span class="token punctuation">.</span><span class="token function">New</span><span class="token punctuation">(</span><span class="token string">"no user found"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Wrap</span><span class="token punctuation">(</span><span class="token string">"validation error"</span><span class="token punctuation">)</span>
err<span class="token punctuation">.</span><span class="token function">Unwrap</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Error</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h4 id="apply-stack-trace" tabindex="-1"><a class="header-anchor" href="#apply-stack-trace" aria-hidden="true">#</a> Apply Stack Trace</h4>
<p>If you have a standard error, it does not contain a stack trace. Use function <code v-pre>Wrap</code> or <code v-pre>WithStack</code> To put the trace on
it:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>errors<span class="token punctuation">.</span><span class="token function">Wrap</span><span class="token punctuation">(</span>err<span class="token punctuation">,</span> <span class="token string">"can't connect to database"</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>errors<span class="token punctuation">.</span><span class="token function">WithStack</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><h4 id="log-level" tabindex="-1"><a class="header-anchor" href="#log-level" aria-hidden="true">#</a> Log Level</h4>
<p>The default log level is <code v-pre>Emergency</code>. To determine the log level you can use the <code v-pre>Level</code> method:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>errros<span class="token punctuation">.</span><span class="token function">New</span><span class="token punctuation">(</span><span class="token string">"username not found"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Level</span><span class="token punctuation">(</span>log_level<span class="token punctuation">.</span>INFO<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><h4 id="http-status" tabindex="-1"><a class="header-anchor" href="#http-status" aria-hidden="true">#</a> HTTP Status</h4>
<p>The default HTTP status is <code v-pre>500 Internal Server Error</code>. To determine the response status you can use the <code v-pre>Status</code>
method:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>err <span class="token operator">:=</span> errros<span class="token punctuation">.</span><span class="token function">New</span><span class="token punctuation">(</span><span class="token string">"username not found"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Status</span><span class="token punctuation">(</span>http<span class="token punctuation">.</span>StatusNotFound<span class="token punctuation">)</span>
<span class="token keyword">return</span> outcome<span class="token punctuation">.</span><span class="token function">Html</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h4 id="custom" tabindex="-1"><a class="header-anchor" href="#custom" aria-hidden="true">#</a> Custom</h4>
<p>Do you want to add extra data to an error? In other languages you would extend a class. Go has a SOLID solution for
this: Each error can be wrapped in multiple structs. To add data to an error you just have to create a wrapper
yourself (which then also contains the original error). If you want to add an error code to your error, you can make te
following:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">func</span> <span class="token function">WithCode</span><span class="token punctuation">(</span>err <span class="token builtin">error</span><span class="token punctuation">,</span> code <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token operator">*</span>withCode <span class="token punctuation">{</span>
    <span class="token keyword">if</span> err <span class="token operator">==</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token boolean">nil</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> <span class="token operator">&amp;</span>withCode<span class="token punctuation">{</span>
        err<span class="token punctuation">,</span>
        code<span class="token punctuation">,</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">type</span> withCode <span class="token keyword">struct</span> <span class="token punctuation">{</span>
    cause <span class="token builtin">error</span>
    code <span class="token builtin">string</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>w <span class="token operator">*</span>withCode<span class="token punctuation">)</span> <span class="token function">Error</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token builtin">string</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> w<span class="token punctuation">.</span>cause<span class="token punctuation">.</span><span class="token function">Error</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">" with code "</span> <span class="token operator">+</span> w<span class="token punctuation">.</span>code
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>w <span class="token operator">*</span>withCode<span class="token punctuation">)</span> <span class="token function">Unwrap</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> w<span class="token punctuation">.</span>cause
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>w <span class="token operator">*</span>withCode<span class="token punctuation">)</span> <span class="token function">Code</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token builtin">string</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> w<span class="token punctuation">.</span>code
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br></div></div><p>Then the error can build up like this:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token function">WithCode</span><span class="token punctuation">(</span>errros<span class="token punctuation">.</span><span class="token function">New</span><span class="token punctuation">(</span><span class="token string">"username not found"</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token string">"external_error"</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>In method <code v-pre>Error()</code> above, we put 'code' behind the message. But if you want to adjust the response, you can determine
this in <code v-pre>ResponseServiceProvider</code>.</p>
<h3 id="panic" tabindex="-1"><a class="header-anchor" href="#panic" aria-hidden="true">#</a> Panic</h3>
<p>In case of a server error where the request cannot proceed, you could choose to use <code v-pre>panic</code>:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">func</span> <span class="token function">GetUser</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">(</span>model<span class="token punctuation">.</span>User<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    con<span class="token punctuation">,</span> err <span class="token operator">:=</span> db<span class="token punctuation">.</span><span class="token function">Connection</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>err <span class="token operator">!=</span> <span class="token boolean">nil</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">panic</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>

    <span class="token comment">//</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p>Confetti automatically ensures that the correct http response is generated.</p>
<blockquote>
<p>Using panic can save you a lot of time. However, if you want to build a robust application, use <code v-pre>panic</code> only for critical or unexpected errors.</p>
</blockquote>
<h3 id="message-convention" tabindex="-1"><a class="header-anchor" href="#message-convention" aria-hidden="true">#</a> Message Convention</h3>
<p>As you can see above, you can supplement the error with more information. Therefore, it is a convention to use a
lowercase letter at the beginning of an error. Also, a dot at the end of the sentence can cause that the sentence can't
be made longer. The errors are eventually automatically capitalized at the beginning of the sense.</p>
<h2 id="helpers" tabindex="-1"><a class="header-anchor" href="#helpers" aria-hidden="true">#</a> Helpers</h2>
<h3 id="is" tabindex="-1"><a class="header-anchor" href="#is" aria-hidden="true">#</a> Is</h3>
<p>An error can be made up of several layers with structs. If you want to know if a certain struct is present, you can use
the <code v-pre>Is</code> helper. In the running example, <code v-pre>validateUser()</code> returns a <code v-pre>validationError</code> error:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">var</span> noUserFound <span class="token operator">=</span> <span class="token function">New</span><span class="token punctuation">(</span><span class="token string">"no user found"</span><span class="token punctuation">)</span>
<span class="token keyword">var</span> validationError <span class="token operator">=</span> <span class="token function">Wrap</span><span class="token punctuation">(</span>noUserFound<span class="token punctuation">,</span> <span class="token string">"validation error"</span><span class="token punctuation">)</span>

err <span class="token operator">:=</span> <span class="token function">validateUser</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token keyword">if</span> errors<span class="token punctuation">.</span><span class="token function">Is</span><span class="token punctuation">(</span>err<span class="token punctuation">,</span> noUserFound<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// validationError contains noUserFound error</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><h3 id="as" tabindex="-1"><a class="header-anchor" href="#as" aria-hidden="true">#</a> As</h3>
<p>If you want to retrieve a specific struct, you can use the <code v-pre>As</code> helper. Before calling <code v-pre>As</code>, you have to define what
needs to be searched and filled (which may be a struct or an interface).</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">func</span> <span class="token function">FindCode</span><span class="token punctuation">(</span>err <span class="token builtin">error</span><span class="token punctuation">)</span> <span class="token punctuation">(</span><span class="token builtin">string</span><span class="token punctuation">,</span> <span class="token builtin">bool</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">var</span> code <span class="token builtin">string</span>
    <span class="token keyword">var</span> codeHolder <span class="token operator">*</span>withCode

    <span class="token keyword">if</span> <span class="token operator">!</span><span class="token function">As</span><span class="token punctuation">(</span>err<span class="token punctuation">,</span> <span class="token operator">&amp;</span>codeHolder<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token string">"unkown code"</span><span class="token punctuation">,</span> <span class="token boolean">false</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">return</span> codeHolder<span class="token punctuation">.</span>code<span class="token punctuation">,</span> <span class="token boolean">true</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><p>If you call As, a bool is returned on which you can check whether it was successful.</p>
<h2 id="configuration" tabindex="-1"><a class="header-anchor" href="#configuration" aria-hidden="true">#</a> Configuration</h2>
<h2 id="defining-errors" tabindex="-1"><a class="header-anchor" href="#defining-errors" aria-hidden="true">#</a> Defining Errors</h2>
<p>For the sake of simplicity, you have seen examples where we place the errors above the functions. It would be better to
have an overview of all errors that can occur in the system. You can define your errors in <code v-pre>app/report/errors.go</code>:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">var</span> UserNotFound <span class="token operator">=</span> errors<span class="token punctuation">.</span><span class="token function">New</span><span class="token punctuation">(</span><span class="token string">"user not found"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Status</span><span class="token punctuation">(</span>net<span class="token punctuation">.</span>StatusBadRequest
<span class="token keyword">var</span> Unauthorized <span class="token operator">=</span> UserError<span class="token punctuation">.</span><span class="token function">Status</span><span class="token punctuation">(</span>net<span class="token punctuation">.</span>StatusUnauthorized<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h3 id="global-log-context" tabindex="-1"><a class="header-anchor" href="#global-log-context" aria-hidden="true">#</a> Global Log Context</h3>
<p>If you want to add information to all errors, you can append that in <code v-pre>app/report/errors.go</code>. In the following example
you can see that we apply <code v-pre>Status</code> and log <code v-pre>Level</code> globally:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">var</span> UserError <span class="token operator">=</span> errors<span class="token punctuation">.</span><span class="token function">New</span><span class="token punctuation">(</span><span class="token string">""</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Status</span><span class="token punctuation">(</span>net<span class="token punctuation">.</span>StatusBadRequest<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Level</span><span class="token punctuation">(</span>log_level<span class="token punctuation">.</span>INFO<span class="token punctuation">)</span>
<span class="token keyword">var</span> Unauthorized <span class="token operator">=</span> UserError<span class="token punctuation">.</span><span class="token function">Status</span><span class="token punctuation">(</span>net<span class="token punctuation">.</span>StatusUnauthorized<span class="token punctuation">)</span>
<span class="token keyword">var</span> SessionInvalid <span class="token operator">=</span> Unauthorized<span class="token punctuation">.</span><span class="token function">Wrap</span><span class="token punctuation">(</span><span class="token string">"session is not valid"</span><span class="token punctuation">)</span>
<span class="token keyword">var</span> SessionExpired <span class="token operator">=</span> Unauthorized<span class="token punctuation">.</span><span class="token function">Wrap</span><span class="token punctuation">(</span><span class="token string">"session expired"</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><h3 id="information-provision" tabindex="-1"><a class="header-anchor" href="#information-provision" aria-hidden="true">#</a> Information Provision</h3>
<p>The <code v-pre>Debug</code> option in your <code v-pre>config/app.go</code> configuration file determines how much information about an error is actually
displayed to the user. By default, this option is set to respect the value of the <code v-pre>APP_DEBUG</code> environment variable,
which is stored in your <code v-pre>.env</code> file.</p>
<p>For local development, you should set the <code v-pre>APP_DEBUG</code> environment variable to <code v-pre>true</code>. In your production environment,
this value should always be <code v-pre>false</code>. If the value is set to <code v-pre>true</code> in production, you risk exposing sensitive
configuration values to your application's end users.</p>
<h3 id="ignoring-errors-by-type" tabindex="-1"><a class="header-anchor" href="#ignoring-errors-by-type" aria-hidden="true">#</a> Ignoring Errors By Type</h3>
<p>The <code v-pre>NoLogging</code> field in <code v-pre>config/errors.go</code> contains a slice of errors that will not be logged. For example, errors
resulting from 404 errors, as well as several other types of errors, are not written to your log files. You may add
other error types to this array as needed:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>NoLogging<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">error</span><span class="token punctuation">{</span>
    report<span class="token punctuation">.</span>ValidationError<span class="token punctuation">,</span>
    report<span class="token punctuation">.</span>NotFoundError<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><h3 id="custom-http-error-pages" tabindex="-1"><a class="header-anchor" href="#custom-http-error-pages" aria-hidden="true">#</a> Custom HTTP Error Pages</h3>
<p>Confetti makes it easy to display custom error pages. You can edit template <code v-pre>resources/views/error.gohtml</code> design your
own error page. The following variables can be used when using this template:</p>
<div class="language-html ext-html line-numbers-mode"><pre v-pre class="language-html"><code>{{- /*gotype: github.com/confetti-framework/foundation/encoder.ErrorView*/ -}}
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>html</span> <span class="token attr-name">lang</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>{{.Locale}}<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h1</span><span class="token punctuation">></span></span>{{.AppName}}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h1</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h2</span><span class="token punctuation">></span></span>{{.Status}} | {{.Message}}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h2</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">></span></span>{{.StackTrace}}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>To add your own variables, you can edit the view placed in <code v-pre>resources/views/error.go</code>. Do you want to have even more
control over how you convert errors to html? Than you can replace the <code v-pre>encoder.ErrorToHtml</code> in <code v-pre>ResponseServiceProvider</code>
with your own encoder.</p>
</template>
