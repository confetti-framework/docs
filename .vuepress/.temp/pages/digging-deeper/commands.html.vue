<template><h1 id="commands" tabindex="-1"><a class="header-anchor" href="#commands" aria-hidden="true">#</a> Commands</h1>
<h2 id="introduction" tabindex="-1"><a class="header-anchor" href="#introduction" aria-hidden="true">#</a> Introduction</h2>
<p>Confetti comes with a handy command line interface and provides a SOLID solution. Because of that you can create commands quickly and keep them organized. Confetti Commands exists at the root of your application and is part of your the main.go script.</p>
<h2 id="installation" tabindex="-1"><a class="header-anchor" href="#installation" aria-hidden="true">#</a> Installation</h2>
<p>Confetti Commands is included by default in the <a href="https://github.com/confetti-framework/confetti" target="_blank" rel="noopener noreferrer">framework<ExternalLinkIcon/></a>, but you can also use Confetti Commands separately if you only run need to run commands and don't process http requests.</p>
<ol>
<li>Download Confetti Commands template code from <a href="https://github.com/confetti-framework/commands" target="_blank" rel="noopener noreferrer">GitHub<ExternalLinkIcon/></a></li>
<li>To install Go, go to <a href="https://golang.org/doc/install" target="_blank" rel="noopener noreferrer">golang.org<ExternalLinkIcon/></a> and follow the instructions.</li>
</ol>
<h2 id="usage" tabindex="-1"><a class="header-anchor" href="#usage" aria-hidden="true">#</a> Usage</h2>
<p>To view a list of all available commands, you may run the script without further commands:</p>
<pre><code>go run main.go
</code></pre>
<p>Or if the application is built, you can use the executable binary:</p>
<pre><code>main
</code></pre>
<p>Every command also includes a &quot;help&quot; screen which displays and describes the command's available arguments and options. To view a help screen, suffix your command with the <code v-pre>--help</code> flag:</p>
<pre><code>go run main.go your:command --help
</code></pre>
<p>With command flag --env-file you can define a path for your env file:</p>
<pre><code>go run main.go your:command --env-file &quot;.env.testing&quot;
</code></pre>
<h2 id="baker-repl" tabindex="-1"><a class="header-anchor" href="#baker-repl" aria-hidden="true">#</a> Baker (REPL)</h2>
<p>Baker is a powerful REPL for the Confetti framework, forked from the motemen/gore package. Baker allows you to interact with your entire Confetti application on the command line.</p>
<h3 id="usage-1" tabindex="-1"><a class="header-anchor" href="#usage-1" aria-hidden="true">#</a> Usage</h3>
<p>To enter the Baker environment, run the <code v-pre>baker</code> subcommando:</p>
<pre><code>go run main.go baker
</code></pre>
<h2 id="writing-commands" tabindex="-1"><a class="header-anchor" href="#writing-commands" aria-hidden="true">#</a> Writing Commands</h2>
<p>In addition to the commands provided by default, you may build your own custom commands. Commands are typically stored in the <code v-pre>app/console/commands</code> directory; however, you are free to choose your own storage location as long as you don't have circular import.</p>
<h3 id="your-first-command" tabindex="-1"><a class="header-anchor" href="#your-first-command" aria-hidden="true">#</a> Your First Command</h3>
<p>As an example you can use the <code v-pre>example:command</code> command. The <code v-pre>ExampleCommand</code> struct is located in <code v-pre>app/console/commands/example_command.go</code>. Feel free to copy and modify it to your wishes.</p>
<h3 id="command-structure" tabindex="-1"><a class="header-anchor" href="#command-structure" aria-hidden="true">#</a> Command Structure</h3>
<p>In every command you should define appropriate values in the <code v-pre>Name</code> and <code v-pre>Description</code> methods of the struct. These properties will be used when displaying your command on the <code v-pre>index</code> screen. The <code v-pre>Name</code> method also allows you to define your commando's name without flags. Your commando's <a href="#defining-input-expectations">input expectations</a> are automatically generated when you define the fields. The <code v-pre>Handle</code> method will be called when your command is executed. You may place your command logic in this method.</p>
<p>Let's take a look at an example command:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">package</span> commands

<span class="token keyword">import</span> <span class="token punctuation">(</span>
	<span class="token string">"src/app/support"</span>
	<span class="token string">"github.com/confetti-framework/contract/inter"</span>
	<span class="token string">"io"</span>
<span class="token punctuation">)</span>

<span class="token keyword">type</span> SendEmails <span class="token keyword">struct</span> <span class="token punctuation">{</span>
	Email <span class="token builtin">string</span> <span class="token string">`flag:"email"`</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>s SendEmails<span class="token punctuation">)</span> <span class="token function">Name</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token builtin">string</span> <span class="token punctuation">{</span>
	<span class="token keyword">return</span> <span class="token string">"mail:send"</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>s SendEmails<span class="token punctuation">)</span> <span class="token function">Description</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token builtin">string</span> <span class="token punctuation">{</span>
	<span class="token keyword">return</span> <span class="token string">"Send a marketing email to a user."</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>s SendEmails<span class="token punctuation">)</span> <span class="token function">Handle</span><span class="token punctuation">(</span>c inter<span class="token punctuation">.</span>Cli<span class="token punctuation">)</span> inter<span class="token punctuation">.</span>ExitCode <span class="token punctuation">{</span>
	mailer <span class="token operator">:=</span> support<span class="token punctuation">.</span>DripEmailer<span class="token punctuation">{</span><span class="token punctuation">}</span>
	mailer<span class="token punctuation">.</span><span class="token function">Send</span><span class="token punctuation">(</span>s<span class="token punctuation">.</span>Email<span class="token punctuation">)</span>

	c<span class="token punctuation">.</span><span class="token function">Info</span><span class="token punctuation">(</span><span class="token string">"Email send to: %s"</span><span class="token punctuation">,</span> s<span class="token punctuation">.</span>Email<span class="token punctuation">)</span>

	<span class="token keyword">return</span> inter<span class="token punctuation">.</span>Success
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br></div></div><h2 id="defining-input-expectations" tabindex="-1"><a class="header-anchor" href="#defining-input-expectations" aria-hidden="true">#</a> Defining Input Expectations</h2>
<p>When writing console commands, it is common to gather input from the user through the flags. Confetti makes it very convenient to define the input you expect from the user using the fields on your commands. The fields on your commands allows you to define the type, normal flag name, short flag name and description for the command in a single, expressive syntax.</p>
<h3 id="flags" tabindex="-1"><a class="header-anchor" href="#flags" aria-hidden="true">#</a> Flags</h3>
<p>Flags are prefixed by two hyphens (<code v-pre>--</code>) when they are provided via the command line. There are two types of flags: those that receive a value and those that don't. Flags that don't receive a value serve as a boolean &quot;switch&quot;. Let's take a look at an example of this type of flag:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">type</span> SendEmails <span class="token keyword">struct</span> <span class="token punctuation">{</span>
	Queue <span class="token builtin">bool</span> <span class="token string">`flag:"queue"`</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>In this example, the <code v-pre>--queue</code> switch may be specified when calling the command. If the <code v-pre>--queue</code> switch is passed, the value of the field will be <code v-pre>true</code>. Otherwise, the value will be <code v-pre>false</code>:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>go run main.go mail:send --queue
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><h4 id="options-with-values" tabindex="-1"><a class="header-anchor" href="#options-with-values" aria-hidden="true">#</a> Options With Values</h4>
<p>Next, let's take a look at an flag that expects a value. If the user must specify a value for a flag, then you simply define a different type. By default you can choose from <code v-pre>string</code>, <code v-pre>int</code>, <code v-pre>float</code>, <code v-pre>[]string</code>, <code v-pre>[]int</code> and <code v-pre>duration</code>, but you can also implement <a href="#custom-types-getters">Custom Getters</a> to cast the flags to the fields.</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">type</span> SendEmails <span class="token keyword">struct</span> <span class="token punctuation">{</span>
	Queue <span class="token builtin">string</span> <span class="token string">`flag:"queue"`</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>In this example, the user may pass a value for the flag like so. If the argument of a flag is not specified when invoking the command, you will get an <code v-pre>flag needs an argument</code> error. If the flag itself is not specified when invoking the command, the default value of the field of the struct will not be changed.</p>
<h4 id="option-shortcuts" tabindex="-1"><a class="header-anchor" href="#option-shortcuts" aria-hidden="true">#</a> Option Shortcuts</h4>
<p>Short lags are prefixed by one hyphen (<code v-pre>-</code>) when they are provided via the command line. To assign a shortcut when defining an flag, you may specify it with the tag <code v-pre>short</code>:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">type</span> SendEmails <span class="token keyword">struct</span> <span class="token punctuation">{</span>
	Queue <span class="token builtin">string</span> <span class="token string">`short:"Q" flag:"queue"`</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h4 id="flag-arrays" tabindex="-1"><a class="header-anchor" href="#flag-arrays" aria-hidden="true">#</a> Flag Arrays</h4>
<p>When defining an flag that expects multiple input values, then use a string slice or array slice:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">type</span> SendEmails <span class="token keyword">struct</span> <span class="token punctuation">{</span>
	Names <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">string</span> <span class="token string">`short:"N" flag:"names"`</span>
	Ids <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">int</span> <span class="token string">`short:"I" flag:"ids"`</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>go run main.go mail:send --ids 1,2,3
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><h3 id="input-descriptions" tabindex="-1"><a class="header-anchor" href="#input-descriptions" aria-hidden="true">#</a> Input Descriptions</h3>
<p>You can assign descriptions to flags by defining the <code v-pre>description</code> tag:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">type</span> SendEmails <span class="token keyword">struct</span> <span class="token punctuation">{</span>
	Subject <span class="token builtin">string</span> <span class="token string">`flag:"subject" description:"The subject of the mail"`</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h3 id="required-fields" tabindex="-1"><a class="header-anchor" href="#required-fields" aria-hidden="true">#</a> Required Fields</h3>
<p>Provide the required tag to ensure that the value is different from the default value of the field.</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">type</span> SendEmails <span class="token keyword">struct</span> <span class="token punctuation">{</span>
	Subject <span class="token builtin">string</span> <span class="token string">`flag:"subject" required:"true"`</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>In the above example, you can be sure that <code v-pre>Subject</code> is not an empty string.</p>
<h3 id="custom-types-getters" tabindex="-1"><a class="header-anchor" href="#custom-types-getters" aria-hidden="true">#</a> Custom Types (Getters)</h3>
<p>In addition to the above types, you can create custom types to cast the flags to a value. Create a struct that follows the <code v-pre>flag.Getter</code> interface. The <code v-pre>Get</code> method returns the value with a type which must be the same type as defined in a field of a command.</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">package</span> getters

<span class="token keyword">import</span> <span class="token punctuation">(</span>
	<span class="token string">"fmt"</span>
	<span class="token string">"strings"</span>
<span class="token punctuation">)</span>

<span class="token keyword">type</span> StringList <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">string</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>s <span class="token operator">*</span>StringList<span class="token punctuation">)</span> <span class="token function">String</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token builtin">string</span> <span class="token punctuation">{</span>
	<span class="token keyword">return</span> fmt<span class="token punctuation">.</span><span class="token function">Sprintf</span><span class="token punctuation">(</span><span class="token string">"%v"</span><span class="token punctuation">,</span> <span class="token operator">*</span>s<span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>s <span class="token operator">*</span>StringList<span class="token punctuation">)</span> <span class="token function">Set</span><span class="token punctuation">(</span>value <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
	<span class="token operator">*</span>s <span class="token operator">=</span> strings<span class="token punctuation">.</span><span class="token function">Split</span><span class="token punctuation">(</span>value<span class="token punctuation">,</span> <span class="token string">","</span><span class="token punctuation">)</span>
	<span class="token keyword">return</span> <span class="token boolean">nil</span>
<span class="token punctuation">}</span>

<span class="token comment">// Get returns the value of type which must be</span>
<span class="token comment">// the same type as defined in a field of a command.</span>
<span class="token keyword">func</span> <span class="token punctuation">(</span>s <span class="token operator">*</span>StringList<span class="token punctuation">)</span> <span class="token function">Get</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">interface</span><span class="token punctuation">{</span><span class="token punctuation">}</span> <span class="token punctuation">{</span>
	<span class="token keyword">return</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token function">string</span><span class="token punctuation">(</span><span class="token operator">*</span>s<span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br></div></div><p>You have to register these getters in <code v-pre>app/console/kernel.go</code>.</p>
<h2 id="command-i-o" tabindex="-1"><a class="header-anchor" href="#command-i-o" aria-hidden="true">#</a> Command I/O</h2>
<h3 id="retrieving-input" tabindex="-1"><a class="header-anchor" href="#retrieving-input" aria-hidden="true">#</a> Retrieving Input</h3>
<p>While your command is executing, you will likely need to access the values from the flags. You can simply use the fields of the struct:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">type</span> SendEmails <span class="token keyword">struct</span> <span class="token punctuation">{</span>
	Subject <span class="token builtin">string</span> <span class="token string">`flag:"subject" required:"true"`</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>s SendEmails<span class="token punctuation">)</span> <span class="token function">Handle</span><span class="token punctuation">(</span>c inter<span class="token punctuation">.</span>Cli<span class="token punctuation">)</span> inter<span class="token punctuation">.</span>ExitCode <span class="token punctuation">{</span>
  c<span class="token punctuation">.</span><span class="token function">Info</span><span class="token punctuation">(</span>output<span class="token punctuation">,</span> <span class="token string">"The subject: "</span><span class="token operator">+</span>s<span class="token punctuation">.</span>Subject<span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><h3 id="prompting-for-input" tabindex="-1"><a class="header-anchor" href="#prompting-for-input" aria-hidden="true">#</a> Prompting For Input</h3>
<p>In addition to displaying output, you may also ask the user to provide input during the execution of your command. The <code v-pre>Ask</code> method will prompt the user with the given question, accept their input, and then return the user's input back to your command:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">func</span> <span class="token punctuation">(</span>s SendEmails<span class="token punctuation">)</span> <span class="token function">Handle</span><span class="token punctuation">(</span>c inter<span class="token punctuation">.</span>Cli<span class="token punctuation">)</span> inter<span class="token punctuation">.</span>ExitCode <span class="token punctuation">{</span>
	name <span class="token operator">:=</span> c<span class="token punctuation">.</span><span class="token function">Ask</span><span class="token punctuation">(</span><span class="token string">"What is your name?"</span><span class="token punctuation">)</span>
	<span class="token comment">//</span>
	<span class="token keyword">return</span> inter<span class="token punctuation">.</span>Success
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>The <code v-pre>Secret</code> method is similar to <code v-pre>Ask</code>, but the user's input will not be visible to them as they type in the console. This method is useful when asking for sensitive information such as passwords:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>password <span class="token operator">:=</span> c<span class="token punctuation">.</span><span class="token function">Secret</span><span class="token punctuation">(</span><span class="token string">"What is the password?"</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><h4 id="asking-for-confirmation" tabindex="-1"><a class="header-anchor" href="#asking-for-confirmation" aria-hidden="true">#</a> Asking For Confirmation</h4>
<p>If you need to ask the user for a simple &quot;yes or no&quot; confirmation, you may use the <code v-pre>Confirm</code> method. If the user enters <code v-pre>y</code> or <code v-pre>yes</code> in response to the prompt, the method will return <code v-pre>true</code>.</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">if</span> c<span class="token punctuation">.</span><span class="token function">Confirm</span><span class="token punctuation">(</span><span class="token string">"Do you wish to continue?"</span><span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">//</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>If necessary, you may specify that the confirmation prompt should return <code v-pre>true</code> by default by passing <code v-pre>true</code> as the second argument to the <code v-pre>Confirm</code> method:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">if</span> c<span class="token punctuation">.</span><span class="token function">Confirm</span><span class="token punctuation">(</span><span class="token string">"Do you wish to continue?"</span><span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">//</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h4 id="multiple-choice-questions" tabindex="-1"><a class="header-anchor" href="#multiple-choice-questions" aria-hidden="true">#</a> Multiple Choice Questions</h4>
<p>If you need to give the user a predefined set of choices when asking a question, you may use the <code v-pre>choice</code> method. You may set the array index of the default value to be returned if no option is chosen by passing the index as the third argument to the method:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>name <span class="token operator">:=</span> c<span class="token punctuation">.</span><span class="token function">Choice</span><span class="token punctuation">(</span><span class="token string">"Select Day"</span><span class="token punctuation">,</span> <span class="token string">"Monday"</span><span class="token punctuation">,</span> <span class="token string">"Tuesday"</span><span class="token punctuation">,</span> <span class="token string">"Wednesday"</span><span class="token punctuation">,</span> <span class="token string">"Thursday"</span><span class="token punctuation">,</span> <span class="token string">"Friday"</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><h3 id="writing-output" tabindex="-1"><a class="header-anchor" href="#writing-output" aria-hidden="true">#</a> Writing Output</h3>
<p>To send output to the console, you may use the <code v-pre>Line</code>, <code v-pre>Info</code>, <code v-pre>Comment</code> and <code v-pre>Error</code> methods. Each of these methods will use appropriate ANSI colors for their purpose. For example, let's display some general information to the user. Typically, the <code v-pre>Info</code> method will display in the console as green colored text:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">func</span> <span class="token punctuation">(</span>s SendEmails<span class="token punctuation">)</span> <span class="token function">Handle</span><span class="token punctuation">(</span>c inter<span class="token punctuation">.</span>Cli<span class="token punctuation">)</span> inter<span class="token punctuation">.</span>ExitCode <span class="token punctuation">{</span>
	<span class="token comment">//</span>
	c<span class="token punctuation">.</span><span class="token function">Info</span><span class="token punctuation">(</span><span class="token string">"The command was successful!"</span><span class="token punctuation">)</span>
	<span class="token keyword">return</span> inter<span class="token punctuation">.</span>Success
<span class="token punctuation">}</span>
</code></pre><div class="highlight-lines"><br><br><div class="highlight-line">&nbsp;</div><br><br></div><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>To display an error message, use the <code v-pre>Error</code> method. Error message text is typically displayed in red (and to stderr):</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">func</span> <span class="token punctuation">(</span>s SendEmails<span class="token punctuation">)</span> <span class="token function">Handle</span><span class="token punctuation">(</span>c inter<span class="token punctuation">.</span>Cli<span class="token punctuation">)</span> inter<span class="token punctuation">.</span>ExitCode <span class="token punctuation">{</span>
	<span class="token comment">//</span>
	c<span class="token punctuation">.</span><span class="token function">Error</span><span class="token punctuation">(</span><span class="token string">"Something went wrong!"</span><span class="token punctuation">)</span>
	<span class="token keyword">return</span> inter<span class="token punctuation">.</span>Failure
<span class="token punctuation">}</span>
</code></pre><div class="highlight-lines"><br><br><div class="highlight-line">&nbsp;</div><br><br></div><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>You may use the <code v-pre>Line</code> method to display plain, uncolored text:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">func</span> <span class="token punctuation">(</span>s SendEmails<span class="token punctuation">)</span> <span class="token function">Handle</span><span class="token punctuation">(</span>c inter<span class="token punctuation">.</span>Cli<span class="token punctuation">)</span> inter<span class="token punctuation">.</span>ExitCode <span class="token punctuation">{</span>
	<span class="token comment">//</span>
	c<span class="token punctuation">.</span><span class="token function">Line</span><span class="token punctuation">(</span><span class="token string">"Display this on the screen"</span><span class="token punctuation">)</span>
	<span class="token keyword">return</span> inter<span class="token punctuation">.</span>Success
<span class="token punctuation">}</span>
</code></pre><div class="highlight-lines"><br><br><div class="highlight-line">&nbsp;</div><br><br></div><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><h4 id="tables" tabindex="-1"><a class="header-anchor" href="#tables" aria-hidden="true">#</a> Tables</h4>
<p>The <code v-pre>Table</code> method makes it easy to correctly format multiple rows and columns of data. All you need to do is provide the column names and the data for the table and method <code v-pre>Render</code> will automatically calculate the appropriate width and height of the table for you:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>t <span class="token operator">:=</span> c<span class="token punctuation">.</span><span class="token function">Table</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
t<span class="token punctuation">.</span><span class="token function">AppendHeader</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token keyword">interface</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">{</span><span class="token string">"Name"</span><span class="token punctuation">,</span> <span class="token string">"Email"</span><span class="token punctuation">}</span><span class="token punctuation">)</span>
t<span class="token punctuation">.</span><span class="token function">AppendRow</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token keyword">interface</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">{</span><span class="token string">"Piet"</span><span class="token punctuation">,</span> <span class="token string">"piet@niet.nl"</span><span class="token punctuation">}</span><span class="token punctuation">)</span>
t<span class="token punctuation">.</span><span class="token function">Render</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><blockquote>
<p>Confetti uses the <a href="https://github.com/jedib0t/go-pretty" target="_blank" rel="noopener noreferrer">go-pretty<ExternalLinkIcon/></a> package. Many more options are available to generate tables. Take a look at the <a href="https://github.com/jedib0t/go-pretty/tree/master/table" target="_blank" rel="noopener noreferrer">readme<ExternalLinkIcon/></a>.</p>
</blockquote>
<h4 id="progress-bars" tabindex="-1"><a class="header-anchor" href="#progress-bars" aria-hidden="true">#</a> Progress Bars</h4>
<p>For long running tasks, it can be helpful to show a progress bar that informs users how complete the task is. First, define the total number of steps the process will iterate through (with an optional description). Then, use <code v-pre>Add(1)</code> after processing each item:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>bar <span class="token operator">:=</span> c<span class="token punctuation">.</span><span class="token function">ProgressBar</span><span class="token punctuation">(</span><span class="token number">4</span><span class="token punctuation">,</span> <span class="token string">"Sending emails"</span><span class="token punctuation">)</span>
<span class="token keyword">for</span> <span class="token boolean">_</span><span class="token punctuation">,</span> user <span class="token operator">:=</span> <span class="token keyword">range</span> users <span class="token punctuation">{</span>
  <span class="token comment">//</span>
  <span class="token boolean">_</span> <span class="token operator">=</span> bar<span class="token punctuation">.</span><span class="token function">Add</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><blockquote>
<p>For more advanced options, check out the <a href="https://github.com/schollz/progressbar" target="_blank" rel="noopener noreferrer">schollz/progressbar<ExternalLinkIcon/></a> package.</p>
</blockquote>
<h2 id="registering-commands" tabindex="-1"><a class="header-anchor" href="#registering-commands" aria-hidden="true">#</a> Registering Commands</h2>
<p>All of your console commands are registered within your application's <code v-pre>app/console/kernel.go</code> file, which create your application's &quot;console kernel&quot;. You have to manually register commands by adding the command's struct to the <code v-pre>Commands</code> field of the <code v-pre>console.Kernel</code> struct. When Confetti boots, all the commands listed in this field will be registered:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">func</span> <span class="token function">NewKernel</span><span class="token punctuation">(</span>app inter<span class="token punctuation">.</span>App<span class="token punctuation">)</span> console<span class="token punctuation">.</span>Kernel <span class="token punctuation">{</span>
	<span class="token keyword">return</span> console<span class="token punctuation">.</span>Kernel<span class="token punctuation">{</span>
		App<span class="token punctuation">:</span> app<span class="token punctuation">,</span>
		Commands<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>inter<span class="token punctuation">.</span>Command<span class="token punctuation">{</span>
			commands<span class="token punctuation">.</span>AppServe<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
			commands<span class="token punctuation">.</span>SendEmails<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
		<span class="token punctuation">}</span><span class="token punctuation">,</span>
		FlagProviders<span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token keyword">func</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>flag<span class="token punctuation">.</span>Getter<span class="token punctuation">{</span>flagGetters<span class="token punctuation">}</span><span class="token punctuation">,</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="highlight-lines"><br><br><br><br><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><br><br><br><br></div><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><h2 id="programmatically-executing-commands" tabindex="-1"><a class="header-anchor" href="#programmatically-executing-commands" aria-hidden="true">#</a> Programmatically Executing Commands</h2>
<p>Sometimes you may wish to execute an command outside of the CLI. For example, you may wish to execute an command from a route or controller. Simply call the command with the required fields. Call the <code v-pre>Handle</code> method with a cli facade. The exit code will be returned:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code>exitCode <span class="token operator">:=</span> commands<span class="token punctuation">.</span>MailSend<span class="token punctuation">{</span>User<span class="token punctuation">:</span> user<span class="token punctuation">}</span><span class="token punctuation">.</span><span class="token function">Handle</span><span class="token punctuation">(</span>facade<span class="token punctuation">.</span><span class="token function">NewCli</span><span class="token punctuation">(</span>app<span class="token punctuation">)</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br></div></div><p>Want to capture all output from the command? Then give a writer as the second parameter.</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">var</span> writer bytes<span class="token punctuation">.</span>Buffer
cli <span class="token operator">:=</span> facade<span class="token punctuation">.</span><span class="token function">NewCli</span><span class="token punctuation">(</span>app<span class="token punctuation">,</span> <span class="token operator">&amp;</span>writer<span class="token punctuation">)</span>
exitCode <span class="token operator">:=</span> commands<span class="token punctuation">.</span>MailSend<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">.</span><span class="token function">Handle</span><span class="token punctuation">(</span>cli<span class="token punctuation">)</span>

output <span class="token operator">:=</span> writer<span class="token punctuation">.</span><span class="token function">String</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre><div class="highlight-lines"><br><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><br><br></div><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>If you want to separate the normal output from the errors, use the third parameter with an extra writer:</p>
<div class="language-go ext-go line-numbers-mode"><pre v-pre class="language-go"><code><span class="token keyword">var</span> writer bytes<span class="token punctuation">.</span>Buffer
<span class="token keyword">var</span> writerErr bytes<span class="token punctuation">.</span>Buffer

cli <span class="token operator">:=</span> facade<span class="token punctuation">.</span><span class="token function">NewCli</span><span class="token punctuation">(</span>app<span class="token punctuation">,</span> <span class="token operator">&amp;</span>writer<span class="token punctuation">,</span> <span class="token operator">&amp;</span>writerErr<span class="token punctuation">)</span>
exitCode <span class="token operator">:=</span> commands<span class="token punctuation">.</span>MailSend<span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">.</span><span class="token function">Handle</span><span class="token punctuation">(</span>cli<span class="token punctuation">)</span>

output <span class="token operator">:=</span> writer<span class="token punctuation">.</span><span class="token function">String</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
outputErr <span class="token operator">:=</span> writerErr<span class="token punctuation">.</span><span class="token function">String</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre><div class="highlight-lines"><br><br><br><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><br><br><br></div><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div></template>
