<template><div><h1 id="logging" tabindex="-1"><a class="header-anchor" href="#logging" aria-hidden="true">#</a> Logging</h1>
<h2 id="introduction" tabindex="-1"><a class="header-anchor" href="#introduction" aria-hidden="true">#</a> Introduction</h2>
<p>To help you learn more about what's happening within your application, Confetti provides robust logging services that allow you to log messages to files, the system error log, and even to Slack to notify your entire team.</p>
<p>Under the hood, Confetti utilizes the <a href="https://github.com/confetti-framework/syslog" target="_blank" rel="noopener noreferrer">Syslog<ExternalLinkIcon/></a> library, which provides
support for
a variety of powerful log handlers. Confetti makes it a cinch to configure these handlers, allowing you to mix and match them to customize your application's log handling.</p>
<h2 id="configuration" tabindex="-1"><a class="header-anchor" href="#configuration" aria-hidden="true">#</a> Configuration</h2>
<p>All of the configuration for your application's logging system is housed in the <code v-pre>config/logging.go</code> configuration
file. This file allows you to configure your application's log channels, so be sure to review each of the available
channels and their options. We'll review a few common options below.</p>
<p>By default, Confetti will use the <code v-pre>stack</code> channel when logging messages. The <code v-pre>stack</code> channel is used to aggregate
multiple log channels into a single channel. For more information on building stacks, check out
the <a href="#building-log-stacks">documentation below</a>.</p>
<h3 id="configuring-the-channel-name" tabindex="-1"><a class="header-anchor" href="#configuring-the-channel-name" aria-hidden="true">#</a> Configuring The Channel Name</h3>
<p>The name provided is for reference only, so you can log specifically to that channel.</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token string">"daily"</span><span class="token punctuation">:</span> loggers<span class="token punctuation">.</span>Syslog<span class="token punctuation">{</span>
    Path<span class="token punctuation">:</span>           Path<span class="token punctuation">.</span>Storage <span class="token operator">+</span> <span class="token string">"/logs/{yyyy-mm-dd}_default.log"</span><span class="token punctuation">,</span>
    MinLevel<span class="token punctuation">:</span>       syslog<span class="token punctuation">.</span>DEBUG<span class="token punctuation">,</span>
    AppName<span class="token punctuation">:</span>        App<span class="token punctuation">.</span>Name<span class="token punctuation">,</span>
    MaxFiles<span class="token punctuation">:</span>       <span class="token number">14</span><span class="token punctuation">,</span>
    HideStackTrace<span class="token punctuation">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="preconceived-channels" tabindex="-1"><a class="header-anchor" href="#preconceived-channels" aria-hidden="true">#</a> Preconceived Channels</h3>
<table>
<thead>
<tr>
<th>Name</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>stack</code></td>
<td>A wrapper to facilitate creating &quot;multi-channel&quot; channels</td>
</tr>
<tr>
<td><code v-pre>single</code></td>
<td>A single file or path based logger channel</td>
</tr>
<tr>
<td><code v-pre>daily</code></td>
<td>A new log file every day, old ones are automatically deleted</td>
</tr>
<tr>
<td><code v-pre>slack</code></td>
<td>A channel that pushes messages to Slack</td>
</tr>
<tr>
<td><code v-pre>stderr</code></td>
<td>Logs are written to stderr</td>
</tr>
</tbody>
</table>
<blockquote>
<p>It is very easy to create a channel yourself. Use an existing logger or create your own. The loggers only need to implement interface <code v-pre>inter.Logger</code>.</p>
</blockquote>
<h3 id="configuring-most-common-loggers" tabindex="-1"><a class="header-anchor" href="#configuring-most-common-loggers" aria-hidden="true">#</a> Configuring Most Common Loggers</h3>
<p>Most channels are based on <code v-pre>loggers.Syslog</code>. This logger can write files, but can also be used by any ʻio.Writer`.</p>
<table>
<thead>
<tr>
<th>Name</th>
<th>Description</th>
<th>Default</th>
</tr>
</thead>
<tbody>
<tr>
<td><code v-pre>Path</code></td>
<td>The path to the log file</td>
<td></td>
</tr>
<tr>
<td><code v-pre>Permission</code></td>
<td>The log file's permissions</td>
<td><code v-pre>0644</code></td>
</tr>
<tr>
<td><code v-pre>MinLevel</code></td>
<td>The minimum &quot;level&quot; a message must be in order to be logged</td>
<td>EMERG</td>
</tr>
<tr>
<td><code v-pre>MaxFiles</code></td>
<td>Automatically clean up old logs when overwriting x number of logs</td>
<td>0 (off)</td>
</tr>
<tr>
<td><code v-pre>HideStackTrace</code></td>
<td>If true, no stack trace will be logged</td>
<td>false</td>
</tr>
<tr>
<td><code v-pre>Facility</code></td>
<td>Specify the type of program that is logging the message</td>
<td>8 (USER)</td>
</tr>
<tr>
<td><code v-pre>Writer</code></td>
<td>Define your own writer here</td>
<td></td>
</tr>
</tbody>
</table>
<h3 id="configuring-the-slack-channel" tabindex="-1"><a class="header-anchor" href="#configuring-the-slack-channel" aria-hidden="true">#</a> Configuring The Slack Channel</h3>
<p>The <code v-pre>slack</code> channel requires a <code v-pre>WebhookUrl</code> configuration option. This URL should match a URL for
an <a href="https://slack.com/apps/A0F7XDUAZ-incoming-webhooks" target="_blank" rel="noopener noreferrer">incoming webhook<ExternalLinkIcon/></a> that you have configured for your Slack team.
By default, Slack will only receive logs at the <code v-pre>critical</code> level and above; however, you can adjust this in
your <code v-pre>logging</code> configuration file.</p>
<h3 id="building-log-stacks" tabindex="-1"><a class="header-anchor" href="#building-log-stacks" aria-hidden="true">#</a> Building Log Stacks</h3>
<p>As previously mentioned, the <code v-pre>stack</code> driver allows you to combine multiple channels into a single log channel. To
illustrate how to use log stacks, let's take a look at an example configuration that you might see in a production
application:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>Channels<span class="token punctuation">:</span> <span class="token keyword">map</span><span class="token punctuation">[</span><span class="token builtin">string</span><span class="token punctuation">]</span>inter<span class="token punctuation">.</span>Logger<span class="token punctuation">{</span>
    <span class="token string">"stack"</span><span class="token punctuation">:</span> loggers<span class="token punctuation">.</span>Stack<span class="token punctuation">{</span>
        Channels<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">string</span><span class="token punctuation">{</span><span class="token string">"daily"</span><span class="token punctuation">,</span> <span class="token string">"slack"</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>

    <span class="token string">"daily"</span><span class="token punctuation">:</span> loggers<span class="token punctuation">.</span>Syslog<span class="token punctuation">{</span>
        Path<span class="token punctuation">:</span>     Path<span class="token punctuation">.</span>Storage <span class="token operator">+</span> <span class="token string">"/logs/{yyyy-mm-dd}_default.log"</span><span class="token punctuation">,</span>
        MinLevel<span class="token punctuation">:</span> syslog<span class="token punctuation">.</span>DEBUG<span class="token punctuation">,</span>
        MaxFiles<span class="token punctuation">:</span> <span class="token number">14</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>

    <span class="token string">"slack"</span><span class="token punctuation">:</span> loggers<span class="token punctuation">.</span>Slack<span class="token punctuation">{</span>
        WebhookUrl<span class="token punctuation">:</span> env<span class="token punctuation">.</span><span class="token function">StringOr</span><span class="token punctuation">(</span><span class="token string">"LOG_SLACK_WEBHOOK_URL"</span><span class="token punctuation">,</span> <span class="token string">""</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
        MinLevel<span class="token punctuation">:</span>   syslog<span class="token punctuation">.</span>CRIT<span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Let's dissect this configuration. First, notice our <code v-pre>stack</code> channel aggregates two other channels via its <code v-pre>Channels</code>
option: <code v-pre>daily</code> and <code v-pre>slack</code>. So, when logging messages, both of these channels will have the opportunity to log the
message.</p>
<h3 id="log-levels" tabindex="-1"><a class="header-anchor" href="#log-levels" aria-hidden="true">#</a> Log Levels</h3>
<p>Take note of the <code v-pre>MinLevel</code> configuration option present on the <code v-pre>daily</code> and <code v-pre>slack</code> channel configurations in the
example above. This option determines the minimum &quot;level&quot; a message must be in order to be logged by the channel.
loggers.Syslog, which powers Confetti's logging services, offers all of the log levels defined in
the <a href="https://tools.ietf.org/html/rfc5424" target="_blank" rel="noopener noreferrer">RFC 5424 specification<ExternalLinkIcon/></a>: <strong>emergency</strong>, <strong>alert</strong>, <strong>critical</strong>, <strong>error</strong>, <strong>warning</strong>, <strong>notice</strong>, <strong>info</strong>, and <strong>debug</strong>.</p>
<p>So, imagine we log a message using the <code v-pre>debug</code> method:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>app<span class="token punctuation">.</span><span class="token function">Log</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Debug</span><span class="token punctuation">(</span><span class="token string">"An informational message."</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>Given our configuration, the <code v-pre>daily</code> channel will write the message to the system log; however, since the error message
is not <code v-pre>critical</code> or above, it will not be sent to Slack. However, if we log an <code v-pre>emergency</code> message, it will be sent to
both the system log and Slack since the <code v-pre>emergency</code> level is above our minimum level threshold for both channels:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>app<span class="token punctuation">.</span><span class="token function">Log</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Emergency</span><span class="token punctuation">(</span><span class="token string">"The system is down!"</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="creating-custom-channels-and-loggers" tabindex="-1"><a class="header-anchor" href="#creating-custom-channels-and-loggers" aria-hidden="true">#</a> Creating Custom Channels And Loggers</h3>
<p>As indicated earlier: it is very easy to create channels and loggers yourself. A channel is a combination between a
name (present as a key in config.Logging.Channels) and a logger. A logger is simply a struct that conforms to
interface <code v-pre>inter.Logger()</code>.</p>
<p>Let's create a NewRelic channel:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token string">"new_relic"</span><span class="token punctuation">:</span> new_relic<span class="token punctuation">.</span>LogFacade<span class="token punctuation">{</span>
    AppName<span class="token punctuation">:</span> App<span class="token punctuation">.</span>Name<span class="token punctuation">,</span>
    Labels<span class="token punctuation">:</span>  App<span class="token punctuation">.</span>Env<span class="token punctuation">,</span>
    License<span class="token punctuation">:</span> env<span class="token punctuation">.</span><span class="token function">Str</span><span class="token punctuation">(</span><span class="token string">"NEW_RELIC_LICENSE"</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>The logger <code v-pre>new_relic.LogFacade{}</code> only needs to support interface <code v-pre>inter.Logger{}</code>.</p>
<h2 id="writing-log-messages" tabindex="-1"><a class="header-anchor" href="#writing-log-messages" aria-hidden="true">#</a> Writing Log Messages</h2>
<p>You may write information to the logs using the <code v-pre>Log</code> facade. As previously mentioned, the logger provides the eight
logging levels defined in the <a href="https://tools.ietf.org/html/rfc5424" target="_blank" rel="noopener noreferrer">RFC 5424 specification<ExternalLinkIcon/></a>: <strong>emergency</strong>, <strong>alert</strong>
, <strong>critical</strong>, <strong>error</strong>, <strong>warning</strong>, <strong>notice</strong>, <strong>info</strong> and <strong>debug</strong>:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>app<span class="token punctuation">.</span><span class="token function">Log</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Emergency</span><span class="token punctuation">(</span>message<span class="token punctuation">)</span>
app<span class="token punctuation">.</span><span class="token function">Log</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Alert</span><span class="token punctuation">(</span>message<span class="token punctuation">)</span>
app<span class="token punctuation">.</span><span class="token function">Log</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Critical</span><span class="token punctuation">(</span>message<span class="token punctuation">)</span>
app<span class="token punctuation">.</span><span class="token function">Log</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Error</span><span class="token punctuation">(</span>message<span class="token punctuation">)</span>
app<span class="token punctuation">.</span><span class="token function">Log</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Warning</span><span class="token punctuation">(</span>message<span class="token punctuation">)</span>
app<span class="token punctuation">.</span><span class="token function">Log</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Notice</span><span class="token punctuation">(</span>message<span class="token punctuation">)</span>
app<span class="token punctuation">.</span><span class="token function">Log</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Info</span><span class="token punctuation">(</span>message<span class="token punctuation">)</span>
app<span class="token punctuation">.</span><span class="token function">Log</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Debug</span><span class="token punctuation">(</span>message<span class="token punctuation">)</span>
app<span class="token punctuation">.</span><span class="token function">Log</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Log</span><span class="token punctuation">(</span>syslog<span class="token punctuation">.</span>ALERT<span class="token punctuation">,</span> message<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>So, you may call any of these methods to log a message for the corresponding level. By default, the message will be
written to the default log channel as configured by your <code v-pre>config/logging.go</code> configuration file:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">package</span> controller

<span class="token keyword">import</span> <span class="token punctuation">(</span>
    <span class="token string">"github.com/confetti-framework/contract/inter"</span>
    <span class="token string">"github.com/confetti-framework/routing/outcome"</span>
<span class="token punctuation">)</span>

<span class="token keyword">func</span> <span class="token function">ShowProfile</span><span class="token punctuation">(</span>request inter<span class="token punctuation">.</span>Request<span class="token punctuation">)</span> inter<span class="token punctuation">.</span>Response <span class="token punctuation">{</span>
    name <span class="token operator">:=</span> request<span class="token punctuation">.</span><span class="token function">Parameter</span><span class="token punctuation">(</span><span class="token string">"name"</span><span class="token punctuation">)</span>
    request<span class="token punctuation">.</span><span class="token function">App</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Log</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Info</span><span class="token punctuation">(</span><span class="token string">"Showing user profile for user: %v"</span><span class="token punctuation">,</span> name<span class="token punctuation">.</span><span class="token function">String</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
    <span class="token comment">//</span>
<span class="token punctuation">}</span>
</code></pre><div class="highlight-lines"><br><br><br><br><br><br><br><br><br><div class="highlight-line">&nbsp;</div><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="contextual-information" tabindex="-1"><a class="header-anchor" href="#contextual-information" aria-hidden="true">#</a> Contextual Information</h3>
<p>If you have data that you want to include in the logs, you can use the other parameters. Use <code v-pre>%v</code> as a placeholder:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>app<span class="token punctuation">.</span><span class="token function">Log</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Info</span><span class="token punctuation">(</span><span class="token string">"User %v visit page %v."</span><span class="token punctuation">,</span> <span class="token string">"Vapor"</span><span class="token punctuation">,</span> <span class="token string">"/features"</span><span class="token punctuation">)</span>

logData <span class="token operator">:=</span> <span class="token keyword">map</span><span class="token punctuation">[</span><span class="token builtin">string</span><span class="token punctuation">]</span><span class="token builtin">int</span><span class="token punctuation">{</span><span class="token string">"name"</span><span class="token punctuation">:</span> <span class="token string">"Horizon"</span><span class="token punctuation">}</span>
app<span class="token punctuation">.</span><span class="token function">Log</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Info</span><span class="token punctuation">(</span><span class="token string">"User failed to login. %v"</span><span class="token punctuation">,</span> logData<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>More complex contextual data may also be passed to the log <code v-pre>...With()</code> methods. This contextual data will be
formatted to JSON and displayed with the log message:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>logData <span class="token operator">:=</span> <span class="token keyword">map</span><span class="token punctuation">[</span><span class="token builtin">string</span><span class="token punctuation">]</span><span class="token builtin">string</span><span class="token punctuation">{</span><span class="token string">"id"</span><span class="token punctuation">:</span> id<span class="token punctuation">.</span><span class="token function">String</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">}</span>
app<span class="token punctuation">.</span><span class="token function">Log</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">InfoWith</span><span class="token punctuation">(</span><span class="token string">"User failed to login."</span><span class="token punctuation">,</span> logData<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>If you want to log data as prescribed by the standards, use <code v-pre>syslog.StructuredData</code>:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>logData <span class="token operator">:=</span> syslog<span class="token punctuation">.</span>StructuredData<span class="token punctuation">{</span>syslog<span class="token punctuation">.</span>SDElement<span class="token punctuation">{</span><span class="token string">"id"</span><span class="token punctuation">:</span> id<span class="token punctuation">.</span><span class="token function">String</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">}</span>
app<span class="token punctuation">.</span><span class="token function">Log</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">InfoWith</span><span class="token punctuation">(</span><span class="token string">"User failed to login."</span><span class="token punctuation">,</span> logData<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="writing-to-specific-channels" tabindex="-1"><a class="header-anchor" href="#writing-to-specific-channels" aria-hidden="true">#</a> Writing To Specific Channels</h3>
<p>Sometimes you may wish to log a message to a channel other than your application's default channel. You may use the
first parameter from the <code v-pre>Log</code> method to log to any channel defined in your configuration file:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>app<span class="token punctuation">.</span><span class="token function">Log</span><span class="token punctuation">(</span><span class="token string">"slack"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Alert</span><span class="token punctuation">(</span><span class="token string">"Something happened!"</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>If you would like to create an on-demand logging stack consisting of multiple channels, you can use multiple parameters:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>app<span class="token punctuation">.</span><span class="token function">Log</span><span class="token punctuation">(</span><span class="token string">"single"</span><span class="token punctuation">,</span> <span class="token string">"slack"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Info</span><span class="token punctuation">(</span><span class="token string">"Something happened!"</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="groups" tabindex="-1"><a class="header-anchor" href="#groups" aria-hidden="true">#</a> Groups</h3>
<p>If you have a large system, it might be smart to group logs together. This makes it easier to filter your logs. For
example, you could create a group named <code v-pre>external</code> to log request and responses, and a group named <code v-pre>worker</code> for
background jobs.</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>log <span class="token operator">:=</span> app<span class="token punctuation">.</span><span class="token function">Log</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">Group</span><span class="token punctuation">(</span><span class="token string">"external"</span><span class="token punctuation">)</span>

log<span class="token punctuation">.</span><span class="token function">Info</span><span class="token punctuation">(</span><span class="token string">"Task started"</span><span class="token punctuation">)</span>
log<span class="token punctuation">.</span><span class="token function">Alert</span><span class="token punctuation">(</span><span class="token string">"Something happened!"</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>The above example (in combination with <code v-pre>loggers.Syslog</code>) results in the following:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>&lt;6>1 2020-11-01T21:42:51.439+01:00 MacBook-Pro.local YourApp 95375 external [level severity="info"] Task started
&lt;1>1 2020-11-01T21:42:52.134+01:00 MacBook-Pro.local YourApp 95375 external [level severity="alert"] Something happened!
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


