import{_ as n,o as s,c as a,b as t}from"./app.cd0b8009.js";const e={},p=t(`<h1 id="validation" tabindex="-1"><a class="header-anchor" href="#validation" aria-hidden="true">#</a> Validation</h1><h2 id="introduction" tabindex="-1"><a class="header-anchor" href="#introduction" aria-hidden="true">#</a> Introduction</h2><p>Good validation prevents bugs and enhances the security of your application. In this guide, we demonstrate how to validate incoming data in a Go application without using external libraries.</p><h2 id="writing-the-validation-logic" tabindex="-1"><a class="header-anchor" href="#writing-the-validation-logic" aria-hidden="true">#</a> Writing the Validation Logic</h2><p>In this example, we validate the <code>CreateUser</code> request. The <code>ValidateCreateUser</code> function will handle the validation logic separately from the controller.</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token keyword">package</span> user

<span class="token keyword">import</span> <span class="token punctuation">(</span>
    <span class="token string">&quot;encoding/json&quot;</span>
    <span class="token string">&quot;errors&quot;</span>
    <span class="token string">&quot;net/http&quot;</span>
    <span class="token string">&quot;regexp&quot;</span>
    <span class="token string">&quot;strings&quot;</span>
    <span class="token string">&quot;github.com/confetti-framework/handler&quot;</span>
<span class="token punctuation">)</span>

<span class="token keyword">type</span> User <span class="token keyword">struct</span> <span class="token punctuation">{</span>
    Name  <span class="token builtin">string</span> <span class="token string">\`json:&quot;name&quot;\`</span>
    Email <span class="token builtin">string</span> <span class="token string">\`json:&quot;email&quot;\`</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token function">CreateUser</span><span class="token punctuation">(</span>response http<span class="token punctuation">.</span>ResponseWriter<span class="token punctuation">,</span> request <span class="token operator">*</span>http<span class="token punctuation">.</span>Request<span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
    <span class="token keyword">var</span> user User
    
    decoder <span class="token operator">:=</span> json<span class="token punctuation">.</span><span class="token function">NewDecoder</span><span class="token punctuation">(</span>request<span class="token punctuation">.</span>Body<span class="token punctuation">)</span>
    <span class="token keyword">if</span> err <span class="token operator">:=</span> decoder<span class="token punctuation">.</span><span class="token function">Decode</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>user<span class="token punctuation">)</span><span class="token punctuation">;</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> handler<span class="token punctuation">.</span><span class="token function">NewSystemError</span><span class="token punctuation">(</span>err<span class="token punctuation">,</span> <span class="token string">&quot;ag84r3g&quot;</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    
    <span class="token keyword">if</span> err <span class="token operator">:=</span> <span class="token function">ValidateCreateUser</span><span class="token punctuation">(</span>user<span class="token punctuation">)</span><span class="token punctuation">;</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> err
    <span class="token punctuation">}</span>
    
    response<span class="token punctuation">.</span><span class="token function">WriteHeader</span><span class="token punctuation">(</span>http<span class="token punctuation">.</span>StatusCreated<span class="token punctuation">)</span>
    response<span class="token punctuation">.</span><span class="token function">Write</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token function">byte</span><span class="token punctuation">(</span><span class="token string">&quot;User created successfully&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
    <span class="token keyword">return</span> <span class="token boolean">nil</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token function">ValidateCreateUser</span><span class="token punctuation">(</span>user User<span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> strings<span class="token punctuation">.</span><span class="token function">TrimSpace</span><span class="token punctuation">(</span>user<span class="token punctuation">.</span>Name<span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token string">&quot;&quot;</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> handler<span class="token punctuation">.</span><span class="token function">NewUserError</span><span class="token punctuation">(</span><span class="token string">&quot;Name is required&quot;</span><span class="token punctuation">,</span> http<span class="token punctuation">.</span>StatusUnprocessableEntity<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    
    <span class="token keyword">if</span> <span class="token operator">!</span><span class="token function">isValidEmail</span><span class="token punctuation">(</span>user<span class="token punctuation">.</span>Email<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> handler<span class="token punctuation">.</span><span class="token function">NewUserError</span><span class="token punctuation">(</span><span class="token string">&quot;Invalid email format&quot;</span><span class="token punctuation">,</span> http<span class="token punctuation">.</span>StatusUnprocessableEntity<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    
    <span class="token keyword">return</span> <span class="token boolean">nil</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token function">isValidEmail</span><span class="token punctuation">(</span>email <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token builtin">bool</span> <span class="token punctuation">{</span>
    emailRegex <span class="token operator">:=</span> <span class="token string">\`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$\`</span>
    re <span class="token operator">:=</span> regexp<span class="token punctuation">.</span><span class="token function">MustCompile</span><span class="token punctuation">(</span>emailRegex<span class="token punctuation">)</span>
    <span class="token keyword">return</span> re<span class="token punctuation">.</span><span class="token function">MatchString</span><span class="token punctuation">(</span>email<span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="handling-nested-attributes" tabindex="-1"><a class="header-anchor" href="#handling-nested-attributes" aria-hidden="true">#</a> Handling Nested Attributes</h2><p>For nested structures, we extend validation by checking nested fields.</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token keyword">type</span> Author <span class="token keyword">struct</span> <span class="token punctuation">{</span>
    Name        <span class="token builtin">string</span> <span class="token string">\`json:&quot;name&quot;\`</span>
    Description <span class="token builtin">string</span> <span class="token string">\`json:&quot;description&quot;\`</span>
<span class="token punctuation">}</span>

<span class="token keyword">type</span> Post <span class="token keyword">struct</span> <span class="token punctuation">{</span>
    Title  <span class="token builtin">string</span> <span class="token string">\`json:&quot;title&quot;\`</span>
    Author Author <span class="token string">\`json:&quot;author&quot;\`</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token function">ValidatePost</span><span class="token punctuation">(</span>post Post<span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> strings<span class="token punctuation">.</span><span class="token function">TrimSpace</span><span class="token punctuation">(</span>post<span class="token punctuation">.</span>Title<span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token string">&quot;&quot;</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> handler<span class="token punctuation">.</span><span class="token function">NewUserError</span><span class="token punctuation">(</span><span class="token string">&quot;Title is required&quot;</span><span class="token punctuation">,</span> http<span class="token punctuation">.</span>StatusUnprocessableEntity<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    
    <span class="token keyword">if</span> strings<span class="token punctuation">.</span><span class="token function">TrimSpace</span><span class="token punctuation">(</span>post<span class="token punctuation">.</span>Author<span class="token punctuation">.</span>Name<span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token string">&quot;&quot;</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> handler<span class="token punctuation">.</span><span class="token function">NewUserError</span><span class="token punctuation">(</span><span class="token string">&quot;Author name is required&quot;</span><span class="token punctuation">,</span> http<span class="token punctuation">.</span>StatusUnprocessableEntity<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    
    <span class="token keyword">if</span> strings<span class="token punctuation">.</span><span class="token function">TrimSpace</span><span class="token punctuation">(</span>post<span class="token punctuation">.</span>Author<span class="token punctuation">.</span>Description<span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token string">&quot;&quot;</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> handler<span class="token punctuation">.</span><span class="token function">NewUserError</span><span class="token punctuation">(</span><span class="token string">&quot;Author description is required&quot;</span><span class="token punctuation">,</span> http<span class="token punctuation">.</span>StatusUnprocessableEntity<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    
    <span class="token keyword">return</span> <span class="token boolean">nil</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="validating-lists" tabindex="-1"><a class="header-anchor" href="#validating-lists" aria-hidden="true">#</a> Validating Lists</h2><p>To validate lists of objects, we loop through each item.</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token keyword">type</span> Order <span class="token keyword">struct</span> <span class="token punctuation">{</span>
    Street <span class="token builtin">string</span> <span class="token string">\`json:&quot;street&quot;\`</span>
<span class="token punctuation">}</span>

<span class="token keyword">type</span> RequestData <span class="token keyword">struct</span> <span class="token punctuation">{</span>
    Orders <span class="token punctuation">[</span><span class="token punctuation">]</span>Order <span class="token string">\`json:&quot;orders&quot;\`</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token function">ValidateRequestData</span><span class="token punctuation">(</span>data RequestData<span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token function">len</span><span class="token punctuation">(</span>data<span class="token punctuation">.</span>Orders<span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token number">3</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> handler<span class="token punctuation">.</span><span class="token function">NewUserError</span><span class="token punctuation">(</span><span class="token string">&quot;Orders must contain exactly 3 items&quot;</span><span class="token punctuation">,</span> http<span class="token punctuation">.</span>StatusUnprocessableEntity<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    
    <span class="token keyword">for</span> i<span class="token punctuation">,</span> order <span class="token operator">:=</span> <span class="token keyword">range</span> data<span class="token punctuation">.</span>Orders <span class="token punctuation">{</span>
        <span class="token keyword">if</span> strings<span class="token punctuation">.</span><span class="token function">TrimSpace</span><span class="token punctuation">(</span>order<span class="token punctuation">.</span>Street<span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token string">&quot;&quot;</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> handler<span class="token punctuation">.</span><span class="token function">NewUserError</span><span class="token punctuation">(</span><span class="token string">&quot;Street in order &quot;</span><span class="token operator">+</span><span class="token function">string</span><span class="token punctuation">(</span>i<span class="token punctuation">)</span><span class="token operator">+</span><span class="token string">&quot; is required&quot;</span><span class="token punctuation">,</span> http<span class="token punctuation">.</span>StatusUnprocessableEntity<span class="token punctuation">)</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> <span class="token boolean">nil</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="custom-validation-rules" tabindex="-1"><a class="header-anchor" href="#custom-validation-rules" aria-hidden="true">#</a> Custom Validation Rules</h2><p>Using structs for validation improves reusability, maintainability, and testability. By encapsulating validation logic within a struct, you can reuse the same rule across multiple fields and controllers. This keeps the code clean and avoids duplication.</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token keyword">type</span> UppercaseRule <span class="token keyword">struct</span><span class="token punctuation">{</span><span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>u UppercaseRule<span class="token punctuation">)</span> <span class="token function">Validate</span><span class="token punctuation">(</span>value <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> value <span class="token operator">!=</span> strings<span class="token punctuation">.</span><span class="token function">ToUpper</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> handler<span class="token punctuation">.</span><span class="token function">NewUserError</span><span class="token punctuation">(</span><span class="token string">&quot;The value must be uppercase&quot;</span><span class="token punctuation">,</span> http<span class="token punctuation">.</span>StatusUnprocessableEntity<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> <span class="token boolean">nil</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Usage:</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code>uppercaseRule <span class="token operator">:=</span> UppercaseRule<span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token keyword">if</span> err <span class="token operator">:=</span> uppercaseRule<span class="token punctuation">.</span><span class="token function">Validate</span><span class="token punctuation">(</span>user<span class="token punctuation">.</span>Name<span class="token punctuation">)</span><span class="token punctuation">;</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> err
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="examples" tabindex="-1"><a class="header-anchor" href="#examples" aria-hidden="true">#</a> Examples</h2><h3 id="required" tabindex="-1"><a class="header-anchor" href="#required" aria-hidden="true">#</a> Required</h3><p><strong>Description:</strong><br> Validates that the input value is not empty or composed solely of whitespace.</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token keyword">package</span> rule

<span class="token keyword">import</span> <span class="token punctuation">(</span>
	<span class="token string">&quot;net/http&quot;</span>
	<span class="token string">&quot;strings&quot;</span>
<span class="token punctuation">)</span>

<span class="token keyword">type</span> Required <span class="token keyword">struct</span><span class="token punctuation">{</span><span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>r Required<span class="token punctuation">)</span> <span class="token function">Validate</span><span class="token punctuation">(</span>value <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
	<span class="token keyword">if</span> strings<span class="token punctuation">.</span><span class="token function">TrimSpace</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token string">&quot;&quot;</span> <span class="token punctuation">{</span>
		<span class="token keyword">return</span> handler<span class="token punctuation">.</span><span class="token function">NewUserError</span><span class="token punctuation">(</span><span class="token string">&quot;This field is required&quot;</span><span class="token punctuation">,</span> http<span class="token punctuation">.</span>StatusUnprocessableEntity<span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
	<span class="token keyword">return</span> <span class="token boolean">nil</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="email" tabindex="-1"><a class="header-anchor" href="#email" aria-hidden="true">#</a> Email</h3><p><strong>Description:</strong><br> Checks whether the input value is in a valid email address format.</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token keyword">package</span> rule

<span class="token keyword">import</span> <span class="token punctuation">(</span>
	<span class="token string">&quot;net/http&quot;</span>
	<span class="token string">&quot;regexp&quot;</span>
<span class="token punctuation">)</span>

<span class="token keyword">type</span> Email <span class="token keyword">struct</span><span class="token punctuation">{</span><span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>e Email<span class="token punctuation">)</span> <span class="token function">Validate</span><span class="token punctuation">(</span>value <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
	re <span class="token operator">:=</span> regexp<span class="token punctuation">.</span><span class="token function">MustCompile</span><span class="token punctuation">(</span><span class="token string">\`^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$\`</span><span class="token punctuation">)</span>
	<span class="token keyword">if</span> <span class="token operator">!</span>re<span class="token punctuation">.</span><span class="token function">MatchString</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token keyword">return</span> handler<span class="token punctuation">.</span><span class="token function">NewUserError</span><span class="token punctuation">(</span><span class="token string">&quot;The value must be a valid email address&quot;</span><span class="token punctuation">,</span> http<span class="token punctuation">.</span>StatusUnprocessableEntity<span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
	<span class="token keyword">return</span> <span class="token boolean">nil</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="url" tabindex="-1"><a class="header-anchor" href="#url" aria-hidden="true">#</a> URL</h3><p><strong>Description:</strong><br> Ensures the input value is a valid URL by parsing it.</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token keyword">package</span> rule

<span class="token keyword">import</span> <span class="token punctuation">(</span>
	<span class="token string">&quot;net/http&quot;</span>
	<span class="token string">&quot;net/url&quot;</span>
<span class="token punctuation">)</span>

<span class="token keyword">type</span> URL <span class="token keyword">struct</span><span class="token punctuation">{</span><span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>u URL<span class="token punctuation">)</span> <span class="token function">Validate</span><span class="token punctuation">(</span>value <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
	<span class="token keyword">if</span> <span class="token boolean">_</span><span class="token punctuation">,</span> err <span class="token operator">:=</span> url<span class="token punctuation">.</span><span class="token function">ParseRequestURI</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
		<span class="token keyword">return</span> handler<span class="token punctuation">.</span><span class="token function">NewUserError</span><span class="token punctuation">(</span><span class="token string">&quot;The value must be a valid URL&quot;</span><span class="token punctuation">,</span> http<span class="token punctuation">.</span>StatusUnprocessableEntity<span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
	<span class="token keyword">return</span> <span class="token boolean">nil</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="alpha" tabindex="-1"><a class="header-anchor" href="#alpha" aria-hidden="true">#</a> Alpha</h3><p><strong>Description:</strong><br> Validates that the input contains only alphabetic characters (A\u2013Z and a\u2013z).</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token keyword">package</span> rule

<span class="token keyword">import</span> <span class="token punctuation">(</span>
	<span class="token string">&quot;net/http&quot;</span>
	<span class="token string">&quot;regexp&quot;</span>
<span class="token punctuation">)</span>

<span class="token keyword">type</span> Alpha <span class="token keyword">struct</span><span class="token punctuation">{</span><span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>a Alpha<span class="token punctuation">)</span> <span class="token function">Validate</span><span class="token punctuation">(</span>value <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
	re <span class="token operator">:=</span> regexp<span class="token punctuation">.</span><span class="token function">MustCompile</span><span class="token punctuation">(</span><span class="token string">\`^[A-Za-z]+$\`</span><span class="token punctuation">)</span>
	<span class="token keyword">if</span> <span class="token operator">!</span>re<span class="token punctuation">.</span><span class="token function">MatchString</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token keyword">return</span> handler<span class="token punctuation">.</span><span class="token function">NewUserError</span><span class="token punctuation">(</span><span class="token string">&quot;The value must contain only alphabetic characters&quot;</span><span class="token punctuation">,</span> http<span class="token punctuation">.</span>StatusUnprocessableEntity<span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
	<span class="token keyword">return</span> <span class="token boolean">nil</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="alphanumeric" tabindex="-1"><a class="header-anchor" href="#alphanumeric" aria-hidden="true">#</a> AlphaNumeric</h3><p><strong>Description:</strong><br> Checks that the input consists solely of alphabetic and numeric characters.</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token keyword">package</span> rule

<span class="token keyword">import</span> <span class="token punctuation">(</span>
	<span class="token string">&quot;net/http&quot;</span>
	<span class="token string">&quot;regexp&quot;</span>
<span class="token punctuation">)</span>

<span class="token keyword">type</span> AlphaNumeric <span class="token keyword">struct</span><span class="token punctuation">{</span><span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>an AlphaNumeric<span class="token punctuation">)</span> <span class="token function">Validate</span><span class="token punctuation">(</span>value <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
	re <span class="token operator">:=</span> regexp<span class="token punctuation">.</span><span class="token function">MustCompile</span><span class="token punctuation">(</span><span class="token string">\`^[A-Za-z0-9]+$\`</span><span class="token punctuation">)</span>
	<span class="token keyword">if</span> <span class="token operator">!</span>re<span class="token punctuation">.</span><span class="token function">MatchString</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token keyword">return</span> handler<span class="token punctuation">.</span><span class="token function">NewUserError</span><span class="token punctuation">(</span><span class="token string">&quot;The value must be alphanumeric&quot;</span><span class="token punctuation">,</span> http<span class="token punctuation">.</span>StatusUnprocessableEntity<span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
	<span class="token keyword">return</span> <span class="token boolean">nil</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="numeric" tabindex="-1"><a class="header-anchor" href="#numeric" aria-hidden="true">#</a> Numeric</h3><p><strong>Description:</strong><br> Verifies that the input can be parsed as a numeric value (supports integers and floats).</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token keyword">package</span> rule

<span class="token keyword">import</span> <span class="token punctuation">(</span>
	<span class="token string">&quot;net/http&quot;</span>
	<span class="token string">&quot;strconv&quot;</span>
<span class="token punctuation">)</span>

<span class="token keyword">type</span> Numeric <span class="token keyword">struct</span><span class="token punctuation">{</span><span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>n Numeric<span class="token punctuation">)</span> <span class="token function">Validate</span><span class="token punctuation">(</span>value <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
	<span class="token keyword">if</span> <span class="token boolean">_</span><span class="token punctuation">,</span> err <span class="token operator">:=</span> strconv<span class="token punctuation">.</span><span class="token function">ParseFloat</span><span class="token punctuation">(</span>value<span class="token punctuation">,</span> <span class="token number">64</span><span class="token punctuation">)</span><span class="token punctuation">;</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
		<span class="token keyword">return</span> handler<span class="token punctuation">.</span><span class="token function">NewUserError</span><span class="token punctuation">(</span><span class="token string">&quot;The value must be numeric&quot;</span><span class="token punctuation">,</span> http<span class="token punctuation">.</span>StatusUnprocessableEntity<span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
	<span class="token keyword">return</span> <span class="token boolean">nil</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="minlength" tabindex="-1"><a class="header-anchor" href="#minlength" aria-hidden="true">#</a> MinLength</h3><p><strong>Description:</strong><br> Ensures that the input value has at least a specified minimum number of characters.</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token keyword">package</span> rule

<span class="token keyword">import</span> <span class="token punctuation">(</span>
	<span class="token string">&quot;net/http&quot;</span>
	<span class="token string">&quot;strconv&quot;</span>
	<span class="token string">&quot;unicode/utf8&quot;</span>
<span class="token punctuation">)</span>

<span class="token keyword">type</span> MinLength <span class="token keyword">struct</span> <span class="token punctuation">{</span>
	Min <span class="token builtin">int</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>m MinLength<span class="token punctuation">)</span> <span class="token function">Validate</span><span class="token punctuation">(</span>value <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
	<span class="token keyword">if</span> utf8<span class="token punctuation">.</span><span class="token function">RuneCountInString</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span> <span class="token operator">&lt;</span> m<span class="token punctuation">.</span>Min <span class="token punctuation">{</span>
		<span class="token keyword">return</span> handler<span class="token punctuation">.</span><span class="token function">NewUserError</span><span class="token punctuation">(</span><span class="token string">&quot;The value must be at least &quot;</span><span class="token operator">+</span>strconv<span class="token punctuation">.</span><span class="token function">Itoa</span><span class="token punctuation">(</span>m<span class="token punctuation">.</span>Min<span class="token punctuation">)</span><span class="token operator">+</span><span class="token string">&quot; characters long&quot;</span><span class="token punctuation">,</span> http<span class="token punctuation">.</span>StatusUnprocessableEntity<span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
	<span class="token keyword">return</span> <span class="token boolean">nil</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="maxlength" tabindex="-1"><a class="header-anchor" href="#maxlength" aria-hidden="true">#</a> MaxLength</h3><p><strong>Description:</strong><br> Checks that the input value does not exceed a specified maximum number of characters.</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token keyword">package</span> rule

<span class="token keyword">import</span> <span class="token punctuation">(</span>
	<span class="token string">&quot;net/http&quot;</span>
	<span class="token string">&quot;strconv&quot;</span>
	<span class="token string">&quot;unicode/utf8&quot;</span>
<span class="token punctuation">)</span>

<span class="token keyword">type</span> MaxLength <span class="token keyword">struct</span> <span class="token punctuation">{</span>
	Max <span class="token builtin">int</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>m MaxLength<span class="token punctuation">)</span> <span class="token function">Validate</span><span class="token punctuation">(</span>value <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
	<span class="token keyword">if</span> utf8<span class="token punctuation">.</span><span class="token function">RuneCountInString</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span> <span class="token operator">&gt;</span> m<span class="token punctuation">.</span>Max <span class="token punctuation">{</span>
		<span class="token keyword">return</span> handler<span class="token punctuation">.</span><span class="token function">NewUserError</span><span class="token punctuation">(</span><span class="token string">&quot;The value must be at most &quot;</span><span class="token operator">+</span>strconv<span class="token punctuation">.</span><span class="token function">Itoa</span><span class="token punctuation">(</span>m<span class="token punctuation">.</span>Max<span class="token punctuation">)</span><span class="token operator">+</span><span class="token string">&quot; characters long&quot;</span><span class="token punctuation">,</span> http<span class="token punctuation">.</span>StatusUnprocessableEntity<span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
	<span class="token keyword">return</span> <span class="token boolean">nil</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="betweenlength" tabindex="-1"><a class="header-anchor" href="#betweenlength" aria-hidden="true">#</a> BetweenLength</h3><p><strong>Description:</strong><br> Validates that the input\u2019s length falls between a defined minimum and maximum range.</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token keyword">package</span> rule

<span class="token keyword">import</span> <span class="token punctuation">(</span>
	<span class="token string">&quot;net/http&quot;</span>
	<span class="token string">&quot;strconv&quot;</span>
	<span class="token string">&quot;unicode/utf8&quot;</span>
<span class="token punctuation">)</span>

<span class="token keyword">type</span> BetweenLength <span class="token keyword">struct</span> <span class="token punctuation">{</span>
	Min <span class="token builtin">int</span>
	Max <span class="token builtin">int</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>b BetweenLength<span class="token punctuation">)</span> <span class="token function">Validate</span><span class="token punctuation">(</span>value <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
	length <span class="token operator">:=</span> utf8<span class="token punctuation">.</span><span class="token function">RuneCountInString</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span>
	<span class="token keyword">if</span> length <span class="token operator">&lt;</span> b<span class="token punctuation">.</span>Min <span class="token operator">||</span> length <span class="token operator">&gt;</span> b<span class="token punctuation">.</span>Max <span class="token punctuation">{</span>
		<span class="token keyword">return</span> handler<span class="token punctuation">.</span><span class="token function">NewUserError</span><span class="token punctuation">(</span><span class="token string">&quot;The value must be between &quot;</span><span class="token operator">+</span>strconv<span class="token punctuation">.</span><span class="token function">Itoa</span><span class="token punctuation">(</span>b<span class="token punctuation">.</span>Min<span class="token punctuation">)</span><span class="token operator">+</span><span class="token string">&quot; and &quot;</span><span class="token operator">+</span>strconv<span class="token punctuation">.</span><span class="token function">Itoa</span><span class="token punctuation">(</span>b<span class="token punctuation">.</span>Max<span class="token punctuation">)</span><span class="token operator">+</span><span class="token string">&quot; characters long&quot;</span><span class="token punctuation">,</span> http<span class="token punctuation">.</span>StatusUnprocessableEntity<span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
	<span class="token keyword">return</span> <span class="token boolean">nil</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="in" tabindex="-1"><a class="header-anchor" href="#in" aria-hidden="true">#</a> In</h3><p><strong>Description:</strong><br> Checks if the input value is one of a predefined list of allowed options.</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token keyword">package</span> rule

<span class="token keyword">import</span> <span class="token punctuation">(</span>
	<span class="token string">&quot;net/http&quot;</span>
<span class="token punctuation">)</span>

<span class="token keyword">type</span> In <span class="token keyword">struct</span> <span class="token punctuation">{</span>
	Options <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">string</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>i In<span class="token punctuation">)</span> <span class="token function">Validate</span><span class="token punctuation">(</span>value <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
	<span class="token keyword">for</span> <span class="token boolean">_</span><span class="token punctuation">,</span> option <span class="token operator">:=</span> <span class="token keyword">range</span> i<span class="token punctuation">.</span>Options <span class="token punctuation">{</span>
		<span class="token keyword">if</span> value <span class="token operator">==</span> option <span class="token punctuation">{</span>
			<span class="token keyword">return</span> <span class="token boolean">nil</span>
		<span class="token punctuation">}</span>
	<span class="token punctuation">}</span>
	<span class="token keyword">return</span> handler<span class="token punctuation">.</span><span class="token function">NewUserError</span><span class="token punctuation">(</span><span class="token string">&quot;The value must be one of the allowed options&quot;</span><span class="token punctuation">,</span> http<span class="token punctuation">.</span>StatusUnprocessableEntity<span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="notin" tabindex="-1"><a class="header-anchor" href="#notin" aria-hidden="true">#</a> NotIn</h3><p><strong>Description:</strong><br> Ensures that the input value is not present in a given list of disallowed options.</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token keyword">package</span> rule

<span class="token keyword">import</span> <span class="token punctuation">(</span>
	<span class="token string">&quot;net/http&quot;</span>
<span class="token punctuation">)</span>

<span class="token keyword">type</span> NotIn <span class="token keyword">struct</span> <span class="token punctuation">{</span>
	Options <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token builtin">string</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>n NotIn<span class="token punctuation">)</span> <span class="token function">Validate</span><span class="token punctuation">(</span>value <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
	<span class="token keyword">for</span> <span class="token boolean">_</span><span class="token punctuation">,</span> option <span class="token operator">:=</span> <span class="token keyword">range</span> n<span class="token punctuation">.</span>Options <span class="token punctuation">{</span>
		<span class="token keyword">if</span> value <span class="token operator">==</span> option <span class="token punctuation">{</span>
			<span class="token keyword">return</span> handler<span class="token punctuation">.</span><span class="token function">NewUserError</span><span class="token punctuation">(</span><span class="token string">&quot;The value is not allowed&quot;</span><span class="token punctuation">,</span> http<span class="token punctuation">.</span>StatusUnprocessableEntity<span class="token punctuation">)</span>
		<span class="token punctuation">}</span>
	<span class="token punctuation">}</span>
	<span class="token keyword">return</span> <span class="token boolean">nil</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="regex" tabindex="-1"><a class="header-anchor" href="#regex" aria-hidden="true">#</a> Regex</h3><p><strong>Description:</strong><br> Validates that the input matches a specified regular expression pattern.</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token keyword">package</span> rule

<span class="token keyword">import</span> <span class="token punctuation">(</span>
	<span class="token string">&quot;net/http&quot;</span>
	<span class="token string">&quot;regexp&quot;</span>
<span class="token punctuation">)</span>

<span class="token keyword">type</span> Regex <span class="token keyword">struct</span> <span class="token punctuation">{</span>
	Pattern <span class="token builtin">string</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>r Regex<span class="token punctuation">)</span> <span class="token function">Validate</span><span class="token punctuation">(</span>value <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
	re <span class="token operator">:=</span> regexp<span class="token punctuation">.</span><span class="token function">MustCompile</span><span class="token punctuation">(</span>r<span class="token punctuation">.</span>Pattern<span class="token punctuation">)</span>
	<span class="token keyword">if</span> <span class="token operator">!</span>re<span class="token punctuation">.</span><span class="token function">MatchString</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token keyword">return</span> handler<span class="token punctuation">.</span><span class="token function">NewUserError</span><span class="token punctuation">(</span><span class="token string">&quot;The value does not match the required pattern&quot;</span><span class="token punctuation">,</span> http<span class="token punctuation">.</span>StatusUnprocessableEntity<span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
	<span class="token keyword">return</span> <span class="token boolean">nil</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="date" tabindex="-1"><a class="header-anchor" href="#date" aria-hidden="true">#</a> Date</h3><p><strong>Description:</strong><br> Checks if the input value is a valid date based on the provided format.</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token keyword">package</span> rule

<span class="token keyword">import</span> <span class="token punctuation">(</span>
	<span class="token string">&quot;net/http&quot;</span>
	<span class="token string">&quot;time&quot;</span>
<span class="token punctuation">)</span>

<span class="token keyword">type</span> Date <span class="token keyword">struct</span> <span class="token punctuation">{</span>
	Format <span class="token builtin">string</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>d Date<span class="token punctuation">)</span> <span class="token function">Validate</span><span class="token punctuation">(</span>value <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
	<span class="token keyword">if</span> <span class="token boolean">_</span><span class="token punctuation">,</span> err <span class="token operator">:=</span> time<span class="token punctuation">.</span><span class="token function">Parse</span><span class="token punctuation">(</span>d<span class="token punctuation">.</span>Format<span class="token punctuation">,</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
		<span class="token keyword">return</span> handler<span class="token punctuation">.</span><span class="token function">NewUserError</span><span class="token punctuation">(</span><span class="token string">&quot;The value must be a valid date&quot;</span><span class="token punctuation">,</span> http<span class="token punctuation">.</span>StatusUnprocessableEntity<span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
	<span class="token keyword">return</span> <span class="token boolean">nil</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="afterdate" tabindex="-1"><a class="header-anchor" href="#afterdate" aria-hidden="true">#</a> AfterDate</h3><p><strong>Description:</strong><br> Ensures the input date is later than a specified date.</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token keyword">package</span> rule

<span class="token keyword">import</span> <span class="token punctuation">(</span>
	<span class="token string">&quot;net/http&quot;</span>
	<span class="token string">&quot;time&quot;</span>
<span class="token punctuation">)</span>

<span class="token keyword">type</span> AfterDate <span class="token keyword">struct</span> <span class="token punctuation">{</span>
	Date   time<span class="token punctuation">.</span>Time
	Format <span class="token builtin">string</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>a AfterDate<span class="token punctuation">)</span> <span class="token function">Validate</span><span class="token punctuation">(</span>value <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
	parsed<span class="token punctuation">,</span> err <span class="token operator">:=</span> time<span class="token punctuation">.</span><span class="token function">Parse</span><span class="token punctuation">(</span>a<span class="token punctuation">.</span>Format<span class="token punctuation">,</span> value<span class="token punctuation">)</span>
	<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
		<span class="token keyword">return</span> handler<span class="token punctuation">.</span><span class="token function">NewUserError</span><span class="token punctuation">(</span><span class="token string">&quot;The value must be a valid date&quot;</span><span class="token punctuation">,</span> http<span class="token punctuation">.</span>StatusUnprocessableEntity<span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
	<span class="token keyword">if</span> <span class="token operator">!</span>parsed<span class="token punctuation">.</span><span class="token function">After</span><span class="token punctuation">(</span>a<span class="token punctuation">.</span>Date<span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token keyword">return</span> handler<span class="token punctuation">.</span><span class="token function">NewUserError</span><span class="token punctuation">(</span><span class="token string">&quot;The date must be after &quot;</span><span class="token operator">+</span>a<span class="token punctuation">.</span>Date<span class="token punctuation">.</span><span class="token function">Format</span><span class="token punctuation">(</span>a<span class="token punctuation">.</span>Format<span class="token punctuation">)</span><span class="token punctuation">,</span> http<span class="token punctuation">.</span>StatusUnprocessableEntity<span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
	<span class="token keyword">return</span> <span class="token boolean">nil</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="beforedate" tabindex="-1"><a class="header-anchor" href="#beforedate" aria-hidden="true">#</a> BeforeDate</h3><p><strong>Description:</strong><br> Validates that the input date occurs before a specified date.</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token keyword">package</span> rule

<span class="token keyword">import</span> <span class="token punctuation">(</span>
	<span class="token string">&quot;net/http&quot;</span>
	<span class="token string">&quot;time&quot;</span>
<span class="token punctuation">)</span>

<span class="token keyword">type</span> BeforeDate <span class="token keyword">struct</span> <span class="token punctuation">{</span>
	Date   time<span class="token punctuation">.</span>Time
	Format <span class="token builtin">string</span>
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>b BeforeDate<span class="token punctuation">)</span> <span class="token function">Validate</span><span class="token punctuation">(</span>value <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
	parsed<span class="token punctuation">,</span> err <span class="token operator">:=</span> time<span class="token punctuation">.</span><span class="token function">Parse</span><span class="token punctuation">(</span>b<span class="token punctuation">.</span>Format<span class="token punctuation">,</span> value<span class="token punctuation">)</span>
	<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
		<span class="token keyword">return</span> handler<span class="token punctuation">.</span><span class="token function">NewUserError</span><span class="token punctuation">(</span><span class="token string">&quot;The value must be a valid date&quot;</span><span class="token punctuation">,</span> http<span class="token punctuation">.</span>StatusUnprocessableEntity<span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
	<span class="token keyword">if</span> <span class="token operator">!</span>parsed<span class="token punctuation">.</span><span class="token function">Before</span><span class="token punctuation">(</span>b<span class="token punctuation">.</span>Date<span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token keyword">return</span> handler<span class="token punctuation">.</span><span class="token function">NewUserError</span><span class="token punctuation">(</span><span class="token string">&quot;The date must be before &quot;</span><span class="token operator">+</span>b<span class="token punctuation">.</span>Date<span class="token punctuation">.</span><span class="token function">Format</span><span class="token punctuation">(</span>b<span class="token punctuation">.</span>Format<span class="token punctuation">)</span><span class="token punctuation">,</span> http<span class="token punctuation">.</span>StatusUnprocessableEntity<span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
	<span class="token keyword">return</span> <span class="token boolean">nil</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="integer" tabindex="-1"><a class="header-anchor" href="#integer" aria-hidden="true">#</a> Integer</h3><p><strong>Description:</strong><br> Checks that the input value can be parsed as an integer.</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token keyword">package</span> rule

<span class="token keyword">import</span> <span class="token punctuation">(</span>
	<span class="token string">&quot;net/http&quot;</span>
	<span class="token string">&quot;strconv&quot;</span>
<span class="token punctuation">)</span>

<span class="token keyword">type</span> Integer <span class="token keyword">struct</span><span class="token punctuation">{</span><span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>i Integer<span class="token punctuation">)</span> <span class="token function">Validate</span><span class="token punctuation">(</span>value <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
	<span class="token keyword">if</span> <span class="token boolean">_</span><span class="token punctuation">,</span> err <span class="token operator">:=</span> strconv<span class="token punctuation">.</span><span class="token function">Atoi</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span>
		<span class="token keyword">return</span> handler<span class="token punctuation">.</span><span class="token function">NewUserError</span><span class="token punctuation">(</span><span class="token string">&quot;The value must be an integer&quot;</span><span class="token punctuation">,</span> http<span class="token punctuation">.</span>StatusUnprocessableEntity<span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
	<span class="token keyword">return</span> <span class="token boolean">nil</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="boolean" tabindex="-1"><a class="header-anchor" href="#boolean" aria-hidden="true">#</a> Boolean</h3><p><strong>Description:</strong><br> Validates that the input is either <code>&quot;true&quot;</code> or <code>&quot;false&quot;</code>, ignoring case.</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token keyword">package</span> rule

<span class="token keyword">import</span> <span class="token punctuation">(</span>
	<span class="token string">&quot;net/http&quot;</span>
	<span class="token string">&quot;strings&quot;</span>
<span class="token punctuation">)</span>

<span class="token keyword">type</span> Boolean <span class="token keyword">struct</span><span class="token punctuation">{</span><span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>b Boolean<span class="token punctuation">)</span> <span class="token function">Validate</span><span class="token punctuation">(</span>value <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
	lower <span class="token operator">:=</span> strings<span class="token punctuation">.</span><span class="token function">ToLower</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span>
	<span class="token keyword">if</span> lower <span class="token operator">!=</span> <span class="token string">&quot;true&quot;</span> <span class="token operator">&amp;&amp;</span> lower <span class="token operator">!=</span> <span class="token string">&quot;false&quot;</span> <span class="token punctuation">{</span>
		<span class="token keyword">return</span> handler<span class="token punctuation">.</span><span class="token function">NewUserError</span><span class="token punctuation">(</span><span class="token string">&quot;The value must be a boolean&quot;</span><span class="token punctuation">,</span> http<span class="token punctuation">.</span>StatusUnprocessableEntity<span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
	<span class="token keyword">return</span> <span class="token boolean">nil</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="uuid" tabindex="-1"><a class="header-anchor" href="#uuid" aria-hidden="true">#</a> UUID</h3><p><strong>Description:</strong><br> Checks that the input value matches the UUID format (version 1\u20135).</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token keyword">package</span> rule

<span class="token keyword">import</span> <span class="token punctuation">(</span>
	<span class="token string">&quot;net/http&quot;</span>
	<span class="token string">&quot;regexp&quot;</span>
<span class="token punctuation">)</span>

<span class="token keyword">type</span> UUID <span class="token keyword">struct</span><span class="token punctuation">{</span><span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>u UUID<span class="token punctuation">)</span> <span class="token function">Validate</span><span class="token punctuation">(</span>value <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
	re <span class="token operator">:=</span> regexp<span class="token punctuation">.</span><span class="token function">MustCompile</span><span class="token punctuation">(</span><span class="token string">\`^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$\`</span><span class="token punctuation">)</span>
	<span class="token keyword">if</span> <span class="token operator">!</span>re<span class="token punctuation">.</span><span class="token function">MatchString</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token keyword">return</span> handler<span class="token punctuation">.</span><span class="token function">NewUserError</span><span class="token punctuation">(</span><span class="token string">&quot;The value must be a valid UUID&quot;</span><span class="token punctuation">,</span> http<span class="token punctuation">.</span>StatusUnprocessableEntity<span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
	<span class="token keyword">return</span> <span class="token boolean">nil</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="lowercase" tabindex="-1"><a class="header-anchor" href="#lowercase" aria-hidden="true">#</a> Lowercase</h3><p><strong>Description:</strong><br> Ensures that the input value is entirely in lowercase letters.</p><div class="language-go ext-go line-numbers-mode"><pre class="language-go"><code><span class="token keyword">package</span> rule

<span class="token keyword">import</span> <span class="token punctuation">(</span>
	<span class="token string">&quot;net/http&quot;</span>
	<span class="token string">&quot;strings&quot;</span>
<span class="token punctuation">)</span>

<span class="token keyword">type</span> Lowercase <span class="token keyword">struct</span><span class="token punctuation">{</span><span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token punctuation">(</span>l Lowercase<span class="token punctuation">)</span> <span class="token function">Validate</span><span class="token punctuation">(</span>value <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token builtin">error</span> <span class="token punctuation">{</span>
	<span class="token keyword">if</span> value <span class="token operator">!=</span> strings<span class="token punctuation">.</span><span class="token function">ToLower</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token keyword">return</span> handler<span class="token punctuation">.</span><span class="token function">NewUserError</span><span class="token punctuation">(</span><span class="token string">&quot;The value must be lowercase&quot;</span><span class="token punctuation">,</span> http<span class="token punctuation">.</span>StatusUnprocessableEntity<span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
	<span class="token keyword">return</span> <span class="token boolean">nil</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,93),o=[p];function i(c,l){return s(),a("div",null,o)}const r=n(e,[["render",i],["__file","validation.html.vue"]]);export{r as default};
