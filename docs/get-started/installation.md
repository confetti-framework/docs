# Installation

## Local Development

One of the advantages of Confetti is that it is 'Developer friendly'. That starts with the installation of the framework. There are 3 easy ways to get Go and Confetti working:

### Docker

The easiest way to set up Confetti is with Docker. It automatically detects changes, and you get a MySQL database and a Redis instance (without additional configuration).

1. Download and start [Docker](https://docs.docker.com/get-docker/).
1. Download Confetti code from [GitHub](https://github.com/confetti-framework/confetti).
1. Open the folder with the code in your terminal and make sure Docker is running.
1. Then run `docker-compose up` in your terminal to start confetti. The first time it takes a while for everything to be downloaded.
1. After that, the homepage is available at [http://localhost/](http://localhost/) and API endpoint /ping is available at [http://localhost/api/ping](http://localhost/api/ping).

### Standard

Or you can download and install only Go and Confetti on your computer.

1. Download Confetti template code from [GitHub](https://github.com/confetti-framework/confetti)
1. Go to [golang.org](https://golang.org/doc/install) and follow the instructions.
1. In your terminal, go to the place where you placed the Confetti code and run `go run .` in your terminal.
1. The homepage is now available at [http://localhost/](http://localhost/) and API endpoint /ping is available at [http://localhost/api/ping](http://localhost/api/ping).

_With every adjustment you have to cancel the command and run it again._

### IDE Goland

You can also use the Go integration in your favorite editor. Here is a step-by-step plan for Goland:

1. Download Confetti template code from [GitHub](https://github.com/confetti-framework/confetti)
1. Complete the steps [on Goland's website](https://www.jetbrains.com/help/go/quick-start-guide-goland.html#create-a-new-project), but use the code downloaded in step 1.
1. The homepage is now available at [http://localhost/](http://localhost/) and API endpoint /ping is available at [http://localhost/api/ping](http://localhost/api/ping).

_You can set a shortcut to rebuild after every modification._
