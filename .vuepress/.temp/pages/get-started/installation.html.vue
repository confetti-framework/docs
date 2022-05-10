<template><h1 id="installation" tabindex="-1"><a class="header-anchor" href="#installation" aria-hidden="true">#</a> Installation</h1>
<h2 id="local-development" tabindex="-1"><a class="header-anchor" href="#local-development" aria-hidden="true">#</a> Local Development</h2>
<p>One of the advantages of Confetti is that it is 'Developer friendly'. That starts with the installation of the framework. There are 3 easy ways to get Go and Confetti working:</p>
<h3 id="standard" tabindex="-1"><a class="header-anchor" href="#standard" aria-hidden="true">#</a> Standard</h3>
<p>Or you can download and install only Go and Confetti on your computer.</p>
<ol>
<li>Download Confetti template code from <a href="https://github.com/confetti-framework/confetti" target="_blank" rel="noopener noreferrer">GitHub<ExternalLinkIcon/></a></li>
<li>Go to <a href="https://golang.org/doc/install" target="_blank" rel="noopener noreferrer">golang.org<ExternalLinkIcon/></a> and follow the instructions.</li>
<li>In your terminal, go to the place where you placed the Confetti code and run <code v-pre>go run main.go</code> in your terminal.</li>
<li>The homepage is now available at <a href="http://localhost:8080/" target="_blank" rel="noopener noreferrer">http://localhost:8080/<ExternalLinkIcon/></a> and API endpoint /ping is available at <a href="http://localhost:8080/api/ping" target="_blank" rel="noopener noreferrer">http://localhost:8080/api/ping<ExternalLinkIcon/></a>.</li>
</ol>
<p><em>With every adjustment you have to cancel the command and run it again.</em></p>
<h3 id="ide-goland" tabindex="-1"><a class="header-anchor" href="#ide-goland" aria-hidden="true">#</a> IDE Goland</h3>
<p>You can also use the Go integration in your favorite editor. Here is a step-by-step plan for Goland:</p>
<ol>
<li>Download Confetti template code from <a href="https://github.com/confetti-framework/confetti" target="_blank" rel="noopener noreferrer">GitHub<ExternalLinkIcon/></a></li>
<li>Complete the steps <a href="https://www.jetbrains.com/help/go/quick-start-guide-goland.html#create-a-new-project" target="_blank" rel="noopener noreferrer">on Goland's website<ExternalLinkIcon/></a>, but use the code downloaded in step 1.</li>
<li>The homepage is now available at <a href="http://localhost/" target="_blank" rel="noopener noreferrer">http://localhost/<ExternalLinkIcon/></a> and API endpoint /ping is available at <a href="http://localhost/api/ping" target="_blank" rel="noopener noreferrer">http://localhost/api/ping<ExternalLinkIcon/></a>.</li>
</ol>
<p><em>You can set a shortcut to rebuild after every modification.</em></p>
<h3 id="docker" tabindex="-1"><a class="header-anchor" href="#docker" aria-hidden="true">#</a> Docker</h3>
<p>The easiest way to set up Confetti is with Docker. It automatically detects changes, and you get a MySQL database and a Redis instance (without additional configuration).</p>
<ol>
<li>Download and start <a href="https://docs.docker.com/get-docker/" target="_blank" rel="noopener noreferrer">Docker<ExternalLinkIcon/></a>.</li>
<li>Download Confetti code from <a href="https://github.com/confetti-framework/confetti" target="_blank" rel="noopener noreferrer">GitHub<ExternalLinkIcon/></a>.</li>
<li>Open the folder with the code in your terminal and make sure Docker is running.</li>
<li>Create your .env file by copying .env.example: <code v-pre>cp .env.example .env</code></li>
<li>Then run <code v-pre>docker-compose up --build</code> in your terminal to start confetti. The first time it takes a while for everything to be downloaded.</li>
<li>After that, the homepage is available at <a href="http://localhost/" target="_blank" rel="noopener noreferrer">http://localhost/<ExternalLinkIcon/></a> and API endpoint /ping is available at <a href="http://localhost/api/ping" target="_blank" rel="noopener noreferrer">http://localhost/api/ping<ExternalLinkIcon/></a>.</li>
</ol>
<h3 id="update-modules" tabindex="-1"><a class="header-anchor" href="#update-modules" aria-hidden="true">#</a> Update Modules</h3>
<p>If you are using a new version of Confetti or other modules, you can run <code v-pre>go get -u all</code> to download the correct modules.</p>
</template>
