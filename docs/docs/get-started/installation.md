# Installation

## Local Development

One of the advantages of Confetti is 'Developer friendly'. That starts with the installation of the framework. There are 3 different ways to get Go and Confetti working:

### Docker

The easiest way to set up an environment with Confetti is with Docker. It automatically detecting changes, and you get a MySQL database and a Redis instance (without additional configuration).

1. Download and start [Docker](https://docs.docker.com/get-docker/)
1. Download Confetti template code from [GitHub](https://github.com/confetti-framework/confetti). And open the folder with the code in your terminal.
1. Make sure Docker is running. Run `docker-compose up` as a command.

_It may take a while for everything to be installed. However, the next time you do not have to wait._With every adjustment you have to cancel the command and run again.

### Standard

1. Download Confetti template code from [GitHub](https://github.com/confetti-framework/confetti)
1. You can download and install Go on your computer. Download Go from the [website](https://golang.org/doc/install) and follow the instructions.
1. In your terminal, go to the place where you placed the Confetti code and run the following Go command `go run .`

_With every adjustment you have to cancel the command and run again._

### Editor Goland

1. Download Confetti template code from [GitHub](https://github.com/confetti-framework/confetti)
1. Complete the steps [on Goland's website] (https://www.jetbrains.com/help/go/quick-start-guide-goland.html#create-a-new-project). Use the code downloaded in step 1.

_You can set a shortcut to renew your code after every change._
