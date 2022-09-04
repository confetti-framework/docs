<template><div><h1 id="configuration" tabindex="-1"><a class="header-anchor" href="#configuration" aria-hidden="true">#</a> Configuration</h1>
<h2 id="introduction" tabindex="-1"><a class="header-anchor" href="#introduction" aria-hidden="true">#</a> Introduction</h2>
<p>All the configuration files for the Confetti framework are stored in the <code v-pre>config</code> directory. Each option is documented, so feel free to look through the files and get familiar with the options available to you.</p>
<p>These configuration files allow you to configure things like your database connection information, your mail server information, as well as various other core configuration values such as your application timezone and encryption key.</p>
<h2 id="environment-configuration" tabindex="-1"><a class="header-anchor" href="#environment-configuration" aria-hidden="true">#</a> Environment Configuration</h2>
<p>It is often helpful to have different configuration values based on the environment where the application is running. For example, you may wish to use a different cache driver locally than you do on your production server.</p>
<p>To make this a cinch, Confetti utilizes the <a href="https://github.com/joho/godotenv" target="_blank" rel="noopener noreferrer">GoDotEnv<ExternalLinkIcon/></a> library by John Barton. In a fresh Confetti installation, the root directory of your application will contain a <code v-pre>.env.example</code> file. Copy this to <code v-pre>.env</code> file.</p>
<p>Your <code v-pre>.env</code> file should not be committed to your application's source control, since each developer / server using your application could require a different environment configuration. Furthermore, this would be a security risk in the event an intruder gains access to your source control repository, since any sensitive credentials would get exposed.</p>
<p>If you are developing with a team, you may wish to edit the <code v-pre>.env.example</code> file with your application. By putting placeholder values in the example configuration file, other developers on your team can clearly see which environment variables are needed to run your application.</p>
<blockquote>
<p>With command flag --env-file you can define a path for your env file: <code v-pre>go run . app:serve --env-file &quot;.env.testing&quot;</code></p>
</blockquote>
<h3 id="retrieving-environment-configuration" tabindex="-1"><a class="header-anchor" href="#retrieving-environment-configuration" aria-hidden="true">#</a> Retrieving Environment Configuration</h3>
<p>All the variables listed in this file will be loaded when your application is running for the first time. However, you may use the <code v-pre>env</code> package to retrieve values from these variables in your configuration files. In fact, if you view the Confetti configuration files, you will notice several of the options already using this package:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>env<span class="token punctuation">.</span><span class="token function">String</span><span class="token punctuation">(</span><span class="token string">"APP_URL"</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
env<span class="token punctuation">.</span><span class="token function">StringOr</span><span class="token punctuation">(</span><span class="token string">"APP_URL"</span><span class="token punctuation">,</span> <span class="token string">"http://localhost"</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
env<span class="token punctuation">.</span><span class="token function">Bool</span><span class="token punctuation">(</span><span class="token string">"DEBUG"</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
env<span class="token punctuation">.</span><span class="token function">BoolOr</span><span class="token punctuation">(</span><span class="token string">"DEBUG"</span><span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>The second value passed to the <code v-pre>StringOr</code> function is the &quot;default value&quot;. This value will be used if no environment variable exists for the given key.</p>
<h3 id="determining-the-current-environment" tabindex="-1"><a class="header-anchor" href="#determining-the-current-environment" aria-hidden="true">#</a> Determining The Current Environment</h3>
<p>The current application environment is determined via the <code v-pre>APP_ENV</code> variable from your <code v-pre>.env</code> file. You may access this value via the <code v-pre>Environment</code> method on the <code v-pre>Application</code> struct:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>app<span class="token punctuation">.</span><span class="token function">Environment</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>You may also pass arguments to the <code v-pre>IsEnvironment</code> method to check if the environment matches a given value. The method will return <code v-pre>true</code> if the environment matches any of the given values:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">if</span> app<span class="token punctuation">.</span><span class="token function">IsEnvironment</span><span class="token punctuation">(</span><span class="token string">"local"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// The environment is local</span>
<span class="token punctuation">}</span>

<span class="token keyword">if</span> app<span class="token punctuation">.</span><span class="token function">IsEnvironment</span><span class="token punctuation">(</span><span class="token string">"local"</span><span class="token punctuation">,</span> <span class="token string">"testing"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// The environment is either local OR testing...</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote>
<p>The current application environment detection can be overridden by a server-level <code v-pre>APP_ENV</code> environment variable. This can be useful when you need to share the same application for different environment configurations, so you can set up a given host to match a given environment in your server's configurations.</p>
</blockquote>
<h2 id="accessing-configuration-values" tabindex="-1"><a class="header-anchor" href="#accessing-configuration-values" aria-hidden="true">#</a> Accessing Configuration Values</h2>
<p>Retrieving a configuration is very easy. Because of strict typing you have fully autocomplete:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>config<span class="token punctuation">.</span>App<span class="token punctuation">.</span>LineSeparator
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>If you are a developer of a package, you can get the configuration from an <code v-pre>inter.App</code> instance:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>app<span class="token punctuation">.</span><span class="token function">Make</span><span class="token punctuation">(</span><span class="token string">"config.App.LineSeparator"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token punctuation">(</span><span class="token builtin">string</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><blockquote>
<p>To get configuration from <code v-pre>inter.App</code>, the config must be present in the <code v-pre>config/index.go</code> file</p>
</blockquote>
<h2 id="configuration-caching" tabindex="-1"><a class="header-anchor" href="#configuration-caching" aria-hidden="true">#</a> Configuration Caching</h2>
<p>Configuration is built at the start when you run the application. So you don't have to cache the configuration manually.</p>
</div></template>


