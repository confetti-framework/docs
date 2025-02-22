import{_ as e,o as t,c as r,b as o}from"./app.d05353ee.js";const n={},i=o(`<h1 id="request-lifecycle" tabindex="-1"><a class="header-anchor" href="#request-lifecycle" aria-hidden="true">#</a> Request Lifecycle</h1><h2 id="introduction" tabindex="-1"><a class="header-anchor" href="#introduction" aria-hidden="true">#</a> Introduction</h2><p>When using any tool in the &quot;real world,&quot; you feel more confident if you understand how that tool works. Application development is no different. When you understand how your development tools function, you feel more comfortable and confident using them.</p><p>The goal of this document is to provide you with a high-level overview of how the Confetti framework works. By gaining a better understanding of the framework&#39;s inner workings, everything feels less &quot;magical,&quot; and you will be more confident when building your applications.</p><p>If you don&#39;t immediately grasp all the concepts and terminology, don&#39;t worry! The key is to get a general sense of the request lifecycle. As you explore other sections of the documentation, your understanding will deepen naturally.</p><h2 id="lifecycle-overview" tabindex="-1"><a class="header-anchor" href="#lifecycle-overview" aria-hidden="true">#</a> Lifecycle Overview</h2><p>When you start the Confetti API server, the request lifecycle begins in <code>cmd/api/main.go</code>. This file checks the given command. For example, when you run:</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>go run cmd/api/main.go api:serve
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>The framework executes <code>cmd/api/command/api_serve_command.go</code>, which initializes an HTTP server.</p><p>From there, incoming requests follow a structured flow before returning a response. Below is a step-by-step breakdown of the process:</p><h3 id="_1-receiving-the-request" tabindex="-1"><a class="header-anchor" href="#_1-receiving-the-request" aria-hidden="true">#</a> 1. Receiving the Request</h3><p>When a client (e.g., a web browser or API client) sends a request, it reaches the HTTP server that was started in <code>api_serve_command.go</code>. This server listens for incoming requests and forwards them to the appropriate route handler.</p><h3 id="_2-routing-the-request" tabindex="-1"><a class="header-anchor" href="#_2-routing-the-request" aria-hidden="true">#</a> 2. Routing the Request</h3><p>Confetti determines which route should handle the request based on the defined routes. These routes are registered using the <code>handler.New(&quot;METHOD PATH&quot;, handlerFunc)</code> function.</p><p>For example, if a request is sent to <code>GET /status</code>, it will be mapped to the appropriate handler function inside <code>internal/status/status_index_controller.go</code>.</p><h3 id="_3-middleware-processing" tabindex="-1"><a class="header-anchor" href="#_3-middleware-processing" aria-hidden="true">#</a> 3. Middleware Processing</h3><p>Before the request reaches its final destination (the controller), it passes through middleware functions. Middleware acts as a processing layer that can modify or inspect the request and response.</p><p>Common middleware functions include:</p><ul><li><strong>Authentication Middleware</strong>: Verifies if the request is coming from an authorized user.</li><li><strong>Logging Middleware</strong>: Logs details about the request for debugging or monitoring.</li><li><strong>CORS Middleware</strong>: Adds necessary headers to allow cross-origin requests.</li></ul><p>Each middleware function processes the request before passing it to the next middleware in the chain.</p><h3 id="_4-controller-execution" tabindex="-1"><a class="header-anchor" href="#_4-controller-execution" aria-hidden="true">#</a> 4. Controller Execution</h3><p>After passing through the middleware, the request reaches its designated <strong>controller</strong>. A controller is responsible for handling the request logic, processing any required data, and preparing a response.</p><p>For example, the <code>status_index_controller.go</code> file handles requests related to system status. If the request is for <code>/status</code>, the controller gathers relevant data (such as system uptime or server health) and prepares a response.</p><h3 id="_5-response-processing" tabindex="-1"><a class="header-anchor" href="#_5-response-processing" aria-hidden="true">#</a> 5. Response Processing</h3><p>Once the controller has generated a response, the request goes back through the middleware in <strong>reverse order</strong>. This allows middleware functions to modify or inspect the outgoing response before it is sent back to the client.</p><p>For example, a middleware function might:</p><ul><li>Format the response into JSON or another format.</li><li>Add security headers.</li><li>Log the response time.</li></ul><h3 id="_6-sending-the-response" tabindex="-1"><a class="header-anchor" href="#_6-sending-the-response" aria-hidden="true">#</a> 6. Sending the Response</h3><p>After processing is complete, the final response is sent back to the client. The client then receives the response and displays the data accordingly (e.g., rendering JSON in an API client or updating a web page).</p>`,29),s=[i];function a(d,h){return t(),r("div",null,s)}const l=e(n,[["render",a],["__file","lifecycle.html.vue"]]);export{l as default};
