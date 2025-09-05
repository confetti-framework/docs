import{_ as n,o as s,c as a,b as t}from"./app.cd0b8009.js";const e={},p=t(`<h2 id="introduction" tabindex="-1"><a class="header-anchor" href="#introduction" aria-hidden="true">#</a> Introduction</h2><p>Confetti comes with a handy command-line interface that provides a SOLID solution for building commands quickly and keeping them organized.</p><h2 id="usage" tabindex="-1"><a class="header-anchor" href="#usage" aria-hidden="true">#</a> Usage</h2><p>To view a list of all available commands, run the script without further commands:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>go run main.go
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>Or, if the application is built, use the executable binary:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>main
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="writing-commands" tabindex="-1"><a class="header-anchor" href="#writing-commands" aria-hidden="true">#</a> Writing Commands</h2><h3 id="your-first-command" tabindex="-1"><a class="header-anchor" href="#your-first-command" aria-hidden="true">#</a> Your First Command</h3><p>In Confetti Framework, each command implements the <code>Command</code> interface:</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token keyword">type</span> Command <span class="token keyword">interface</span> <span class="token punctuation">{</span>
    <span class="token function">Name</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token builtin">string</span>
    <span class="token function">Description</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token builtin">string</span>
    <span class="token function">Handle</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token builtin">error</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Each command must define a name, description, and a handler function to execute its logic. Commands should be placed inside the <code>command</code> package and registered in <code>cmd/api/main.go</code>.</p><h2 id="defining-input-expectations-with-the-standard-go-approach" tabindex="-1"><a class="header-anchor" href="#defining-input-expectations-with-the-standard-go-approach" aria-hidden="true">#</a> Defining Input Expectations with the Standard Go Approach</h2><h3 id="flags" tabindex="-1"><a class="header-anchor" href="#flags" aria-hidden="true">#</a> Flags</h3><p>Commands can accept flags to modify their behavior. The idiomatic Go way is to use the built-in <code>flag</code> package.</p><h4 id="options-with-values" tabindex="-1"><a class="header-anchor" href="#options-with-values" aria-hidden="true">#</a> Options With Values</h4><p>For example, to create a command that accepts a name flag:</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token keyword">package</span> command

<span class="token keyword">import</span> <span class="token punctuation">(</span>
    <span class="token string">&quot;flag&quot;</span>
    <span class="token string">&quot;fmt&quot;</span>
    <span class="token string">&quot;os&quot;</span>
<span class="token punctuation">)</span>

<span class="token keyword">type</span> UserCreate <span class="token keyword">struct</span><span class="token punctuation">{</span><span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>u UserCreate<span class="token punctuation">)</span> <span class="token function">Name</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token builtin">string</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token string">&quot;user:create&quot;</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>u UserCreate<span class="token punctuation">)</span> <span class="token function">Description</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token builtin">string</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token string">&quot;Create a new user with the specified name&quot;</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>u UserCreate<span class="token punctuation">)</span> <span class="token function">Handle</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
    <span class="token comment">// Define a flag for the user&#39;s name.</span>
    name <span class="token operator">:=</span> flag<span class="token punctuation">.</span><span class="token function">String</span><span class="token punctuation">(</span><span class="token string">&quot;name&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;Name of the user&quot;</span><span class="token punctuation">)</span>
    <span class="token comment">// Alternatively, you can also support a shorthand flag.</span>
    n <span class="token operator">:=</span> flag<span class="token punctuation">.</span><span class="token function">String</span><span class="token punctuation">(</span><span class="token string">&quot;n&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;Name of the user (shorthand)&quot;</span><span class="token punctuation">)</span>
    
    <span class="token comment">// Parse command-line flags.</span>
    flag<span class="token punctuation">.</span><span class="token function">Parse</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

    <span class="token comment">// Prefer the long flag if provided, otherwise use the short flag.</span>
    userName <span class="token operator">:=</span> <span class="token operator">*</span>name
    <span class="token keyword">if</span> userName <span class="token operator">==</span> <span class="token string">&quot;&quot;</span> <span class="token punctuation">{</span>
        userName <span class="token operator">=</span> <span class="token operator">*</span>n
    <span class="token punctuation">}</span>

    <span class="token keyword">if</span> userName <span class="token operator">==</span> <span class="token string">&quot;&quot;</span> <span class="token punctuation">{</span>
        fmt<span class="token punctuation">.</span><span class="token function">Fprintln</span><span class="token punctuation">(</span>os<span class="token punctuation">.</span>Stderr<span class="token punctuation">,</span> <span class="token string">&quot;Error: --name or -n flag is required&quot;</span><span class="token punctuation">)</span>
        os<span class="token punctuation">.</span><span class="token function">Exit</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>

    fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">&quot;Name provided:&quot;</span><span class="token punctuation">,</span> userName<span class="token punctuation">)</span>
    <span class="token keyword">return</span> <span class="token boolean">nil</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>You can run the command as follows:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>go run main.go user:create <span class="token parameter variable">--name</span> <span class="token string">&quot;John Doe&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="flag-arrays" tabindex="-1"><a class="header-anchor" href="#flag-arrays" aria-hidden="true">#</a> Flag Arrays</h4><p>When a flag expects multiple input values, accept a comma-separated string and split it:</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token keyword">package</span> command

<span class="token keyword">import</span> <span class="token punctuation">(</span>
    <span class="token string">&quot;flag&quot;</span>
    <span class="token string">&quot;fmt&quot;</span>
    <span class="token string">&quot;os&quot;</span>
    <span class="token string">&quot;strings&quot;</span>
<span class="token punctuation">)</span>

<span class="token keyword">type</span> MailSend <span class="token keyword">struct</span><span class="token punctuation">{</span><span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>m MailSend<span class="token punctuation">)</span> <span class="token function">Name</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token builtin">string</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token string">&quot;mail:send&quot;</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>m MailSend<span class="token punctuation">)</span> <span class="token function">Description</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token builtin">string</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token string">&quot;Send mail to a list of user IDs&quot;</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>m MailSend<span class="token punctuation">)</span> <span class="token function">Handle</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
    <span class="token comment">// Define a flag that accepts a comma-separated list of IDs.</span>
    idsStr <span class="token operator">:=</span> flag<span class="token punctuation">.</span><span class="token function">String</span><span class="token punctuation">(</span><span class="token string">&quot;ids&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;Comma-separated list of user IDs (e.g., 1,2,3)&quot;</span><span class="token punctuation">)</span>
    flag<span class="token punctuation">.</span><span class="token function">Parse</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

    <span class="token keyword">if</span> <span class="token operator">*</span>idsStr <span class="token operator">==</span> <span class="token string">&quot;&quot;</span> <span class="token punctuation">{</span>
        fmt<span class="token punctuation">.</span><span class="token function">Fprintln</span><span class="token punctuation">(</span>os<span class="token punctuation">.</span>Stderr<span class="token punctuation">,</span> <span class="token string">&quot;Error: --ids flag is required&quot;</span><span class="token punctuation">)</span>
        os<span class="token punctuation">.</span><span class="token function">Exit</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// Split the string into a slice.</span>
    ids <span class="token operator">:=</span> strings<span class="token punctuation">.</span><span class="token function">Split</span><span class="token punctuation">(</span><span class="token operator">*</span>idsStr<span class="token punctuation">,</span> <span class="token string">&quot;,&quot;</span><span class="token punctuation">)</span>
    fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">&quot;IDs provided:&quot;</span><span class="token punctuation">,</span> ids<span class="token punctuation">)</span>
    <span class="token keyword">return</span> <span class="token boolean">nil</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="checking-if-a-flag-is-provided" tabindex="-1"><a class="header-anchor" href="#checking-if-a-flag-is-provided" aria-hidden="true">#</a> Checking If a Flag Is Provided</h3><p>In the Go approach, you check whether a flag was provided by validating its value (e.g., checking for an empty string):</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token keyword">package</span> command

<span class="token keyword">import</span> <span class="token punctuation">(</span>
    <span class="token string">&quot;flag&quot;</span>
    <span class="token string">&quot;fmt&quot;</span>
    <span class="token string">&quot;os&quot;</span>
<span class="token punctuation">)</span>

<span class="token keyword">type</span> CheckFlag <span class="token keyword">struct</span><span class="token punctuation">{</span><span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>c CheckFlag<span class="token punctuation">)</span> <span class="token function">Name</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token builtin">string</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token string">&quot;flag:check&quot;</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>c CheckFlag<span class="token punctuation">)</span> <span class="token function">Description</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token builtin">string</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token string">&quot;Check if the name flag is provided&quot;</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>c CheckFlag<span class="token punctuation">)</span> <span class="token function">Handle</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
    name <span class="token operator">:=</span> flag<span class="token punctuation">.</span><span class="token function">String</span><span class="token punctuation">(</span><span class="token string">&quot;name&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;Name of the user&quot;</span><span class="token punctuation">)</span>
    flag<span class="token punctuation">.</span><span class="token function">Parse</span><span class="token punctuation">(</span><span class="token punctuation">)</span>

    <span class="token keyword">if</span> <span class="token operator">*</span>name <span class="token operator">!=</span> <span class="token string">&quot;&quot;</span> <span class="token punctuation">{</span>
        fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">&quot;Name provided:&quot;</span><span class="token punctuation">,</span> <span class="token operator">*</span>name<span class="token punctuation">)</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        fmt<span class="token punctuation">.</span><span class="token function">Fprintln</span><span class="token punctuation">(</span>os<span class="token punctuation">.</span>Stderr<span class="token punctuation">,</span> <span class="token string">&quot;Error: --name flag is required&quot;</span><span class="token punctuation">)</span>
        os<span class="token punctuation">.</span><span class="token function">Exit</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> <span class="token boolean">nil</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="command-i-o" tabindex="-1"><a class="header-anchor" href="#command-i-o" aria-hidden="true">#</a> Command I/O</h2><h3 id="retrieving-input" tabindex="-1"><a class="header-anchor" href="#retrieving-input" aria-hidden="true">#</a> Retrieving Input</h3><p>Using the standard library, simply retrieve the flag values as shown above.</p><h3 id="prompting-for-input" tabindex="-1"><a class="header-anchor" href="#prompting-for-input" aria-hidden="true">#</a> Prompting For Input</h3><p>For interactive input (when flags are not enough), use Go\u2019s standard input methods:</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token keyword">package</span> command

<span class="token keyword">import</span> <span class="token punctuation">(</span>
    <span class="token string">&quot;bufio&quot;</span>
    <span class="token string">&quot;fmt&quot;</span>
    <span class="token string">&quot;os&quot;</span>
<span class="token punctuation">)</span>

<span class="token keyword">type</span> Interactive <span class="token keyword">struct</span><span class="token punctuation">{</span><span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>i Interactive<span class="token punctuation">)</span> <span class="token function">Name</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token builtin">string</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token string">&quot;interactive:prompt&quot;</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>i Interactive<span class="token punctuation">)</span> <span class="token function">Description</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token builtin">string</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token string">&quot;Prompt the user for input interactively&quot;</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>i Interactive<span class="token punctuation">)</span> <span class="token function">Handle</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
    reader <span class="token operator">:=</span> bufio<span class="token punctuation">.</span><span class="token function">NewReader</span><span class="token punctuation">(</span>os<span class="token punctuation">.</span>Stdin<span class="token punctuation">)</span>
    fmt<span class="token punctuation">.</span><span class="token function">Print</span><span class="token punctuation">(</span><span class="token string">&quot;Enter your name: &quot;</span><span class="token punctuation">)</span>
    name<span class="token punctuation">,</span> <span class="token boolean">_</span> <span class="token operator">:=</span> reader<span class="token punctuation">.</span><span class="token function">ReadString</span><span class="token punctuation">(</span><span class="token char">&#39;\\n&#39;</span><span class="token punctuation">)</span>
    fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">&quot;Hello,&quot;</span><span class="token punctuation">,</span> name<span class="token punctuation">)</span>
    <span class="token keyword">return</span> <span class="token boolean">nil</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="writing-output" tabindex="-1"><a class="header-anchor" href="#writing-output" aria-hidden="true">#</a> Writing Output</h3><p>Output to the console using:</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code>fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token string">&quot;Hello, World!&quot;</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>For error messages, write to standard error:</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code>fmt<span class="token punctuation">.</span><span class="token function">Fprintln</span><span class="token punctuation">(</span>os<span class="token punctuation">.</span>Stderr<span class="token punctuation">,</span> <span class="token string">&quot;An error occurred&quot;</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="registering-commands" tabindex="-1"><a class="header-anchor" href="#registering-commands" aria-hidden="true">#</a> Registering Commands</h2><p>When building a CLI with multiple commands, register each command in <code>cmd/api/main.go</code>:</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token keyword">package</span> main

<span class="token keyword">import</span> <span class="token punctuation">(</span>
    <span class="token string">&quot;yourproject/command&quot;</span>
<span class="token punctuation">)</span>

<span class="token keyword">var</span> commands <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>command<span class="token punctuation">.</span>Command<span class="token punctuation">{</span>
    command<span class="token punctuation">.</span>UserCreate<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
    command<span class="token punctuation">.</span>MailSend<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
    command<span class="token punctuation">.</span>CheckFlag<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
    command<span class="token punctuation">.</span>Interactive<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
    command<span class="token punctuation">.</span>AppStatus<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// Your logic to select and execute the command based on input.</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="example-checking-application-status-and-uptime" tabindex="-1"><a class="header-anchor" href="#example-checking-application-status-and-uptime" aria-hidden="true">#</a> Example: Checking Application Status and Uptime</h2><p>Below is an example of a command that checks the application status and uptime, with flag parsing performed directly in the <code>Handle()</code> method:</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token keyword">package</span> command

<span class="token keyword">import</span> <span class="token punctuation">(</span>
    <span class="token string">&quot;flag&quot;</span>
    <span class="token string">&quot;fmt&quot;</span>
    <span class="token string">&quot;os&quot;</span>
    <span class="token string">&quot;time&quot;</span>
<span class="token punctuation">)</span>

<span class="token keyword">type</span> AppStatus <span class="token keyword">struct</span> <span class="token punctuation">{</span>
    startTime time<span class="token punctuation">.</span>Time
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>s AppStatus<span class="token punctuation">)</span> <span class="token function">Name</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token builtin">string</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token string">&quot;app:status&quot;</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>s AppStatus<span class="token punctuation">)</span> <span class="token function">Description</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token builtin">string</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token string">&quot;Check the current status of the application and uptime&quot;</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>s AppStatus<span class="token punctuation">)</span> <span class="token function">Handle</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
    <span class="token comment">// Define a flag for demonstration purposes.</span>
    dummyFlag <span class="token operator">:=</span> flag<span class="token punctuation">.</span><span class="token function">String</span><span class="token punctuation">(</span><span class="token string">&quot;dummy&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;A dummy flag for example purposes&quot;</span><span class="token punctuation">)</span>
    
    <span class="token comment">// Parse the command-line flags.</span>
    flag<span class="token punctuation">.</span><span class="token function">Parse</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    
    <span class="token comment">// Validate that the dummy flag is provided.</span>
    <span class="token keyword">if</span> <span class="token operator">*</span>dummyFlag <span class="token operator">==</span> <span class="token string">&quot;&quot;</span> <span class="token punctuation">{</span>
        fmt<span class="token punctuation">.</span><span class="token function">Fprintln</span><span class="token punctuation">(</span>os<span class="token punctuation">.</span>Stderr<span class="token punctuation">,</span> <span class="token string">&quot;Error: --dummy flag is required&quot;</span><span class="token punctuation">)</span>
        os<span class="token punctuation">.</span><span class="token function">Exit</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    
    <span class="token comment">// Calculate and print the application uptime.</span>
    uptime <span class="token operator">:=</span> time<span class="token punctuation">.</span><span class="token function">Since</span><span class="token punctuation">(</span>s<span class="token punctuation">.</span>startTime<span class="token punctuation">)</span>
    fmt<span class="token punctuation">.</span><span class="token function">Printf</span><span class="token punctuation">(</span><span class="token string">&quot;Application is running. Uptime: %s\\n&quot;</span><span class="token punctuation">,</span> uptime<span class="token punctuation">)</span>
    
    <span class="token keyword">return</span> <span class="token boolean">nil</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>In this example, flag parsing and validation are done within the <code>Handle()</code> method. If the <code>--dummy</code> flag is not provided, an error is printed to standard error and the application exits. Otherwise, the command calculates and displays the application uptime.</p>`,44),i=[p];function o(c,l){return s(),a("div",null,i)}const r=n(e,[["render",o],["__file","commands.html.vue"]]);export{r as default};
