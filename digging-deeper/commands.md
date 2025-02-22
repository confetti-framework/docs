## Introduction

Confetti comes with a handy command-line interface that provides a SOLID solution for building commands quickly and keeping them organized.

## Usage

To view a list of all available commands, run the script without further commands:

```sh
go run main.go
```

Or, if the application is built, use the executable binary:

```sh
main
```

## Writing Commands

### Your First Command

In Confetti Framework, each command implements the `Command` interface:

```go
type Command interface {
    Name() string
    Description() string
    Handle() error
}
```

Each command must define a name, description, and a handler function to execute its logic. Commands should be placed inside the `command` package and registered in `cmd/api/main.go`.

## Defining Input Expectations with the Standard Go Approach

### Flags

Commands can accept flags to modify their behavior. The idiomatic Go way is to use the built-in `flag` package.

#### Options With Values

For example, to create a command that accepts a name flag:

```go
package command

import (
    "flag"
    "fmt"
    "os"
)

type UserCreate struct{}

func (u UserCreate) Name() string {
    return "user:create"
}

func (u UserCreate) Description() string {
    return "Create a new user with the specified name"
}

func (u UserCreate) Handle() error {
    // Define a flag for the user's name.
    name := flag.String("name", "", "Name of the user")
    // Alternatively, you can also support a shorthand flag.
    n := flag.String("n", "", "Name of the user (shorthand)")
    
    // Parse command-line flags.
    flag.Parse()

    // Prefer the long flag if provided, otherwise use the short flag.
    userName := *name
    if userName == "" {
        userName = *n
    }

    if userName == "" {
        fmt.Fprintln(os.Stderr, "Error: --name or -n flag is required")
        os.Exit(1)
    }

    fmt.Println("Name provided:", userName)
    return nil
}
```

You can run the command as follows:

```sh
go run main.go user:create --name "John Doe"
```

#### Flag Arrays

When a flag expects multiple input values, accept a comma-separated string and split it:

```go
package command

import (
    "flag"
    "fmt"
    "os"
    "strings"
)

type MailSend struct{}

func (m MailSend) Name() string {
    return "mail:send"
}

func (m MailSend) Description() string {
    return "Send mail to a list of user IDs"
}

func (m MailSend) Handle() error {
    // Define a flag that accepts a comma-separated list of IDs.
    idsStr := flag.String("ids", "", "Comma-separated list of user IDs (e.g., 1,2,3)")
    flag.Parse()

    if *idsStr == "" {
        fmt.Fprintln(os.Stderr, "Error: --ids flag is required")
        os.Exit(1)
    }

    // Split the string into a slice.
    ids := strings.Split(*idsStr, ",")
    fmt.Println("IDs provided:", ids)
    return nil
}
```

### Checking If a Flag Is Provided

In the Go approach, you check whether a flag was provided by validating its value (e.g., checking for an empty string):

```go
package command

import (
    "flag"
    "fmt"
    "os"
)

type CheckFlag struct{}

func (c CheckFlag) Name() string {
    return "flag:check"
}

func (c CheckFlag) Description() string {
    return "Check if the name flag is provided"
}

func (c CheckFlag) Handle() error {
    name := flag.String("name", "", "Name of the user")
    flag.Parse()

    if *name != "" {
        fmt.Println("Name provided:", *name)
    } else {
        fmt.Fprintln(os.Stderr, "Error: --name flag is required")
        os.Exit(1)
    }
    return nil
}
```

## Command I/O

### Retrieving Input

Using the standard library, simply retrieve the flag values as shown above.

### Prompting For Input

For interactive input (when flags are not enough), use Go’s standard input methods:

```go
package command

import (
    "bufio"
    "fmt"
    "os"
)

type Interactive struct{}

func (i Interactive) Name() string {
    return "interactive:prompt"
}

func (i Interactive) Description() string {
    return "Prompt the user for input interactively"
}

func (i Interactive) Handle() error {
    reader := bufio.NewReader(os.Stdin)
    fmt.Print("Enter your name: ")
    name, _ := reader.ReadString('\n')
    fmt.Println("Hello,", name)
    return nil
}
```

### Writing Output

Output to the console using:

```go
fmt.Println("Hello, World!")
```

For error messages, write to standard error:

```go
fmt.Fprintln(os.Stderr, "An error occurred")
```

## Registering Commands

When building a CLI with multiple commands, register each command in `cmd/api/main.go`:

```go
package main

import (
    "yourproject/command"
)

var commands = []command.Command{
    command.UserCreate{},
    command.MailSend{},
    command.CheckFlag{},
    command.Interactive{},
    command.AppStatus{},
}

func main() {
    // Your logic to select and execute the command based on input.
}
```

## Example: Checking Application Status and Uptime

Below is an example of a command that checks the application status and uptime, with flag parsing performed directly in the `Handle()` method:

```go
package command

import (
    "flag"
    "fmt"
    "os"
    "time"
)

type AppStatus struct {
    startTime time.Time
}

func (s AppStatus) Name() string {
    return "app:status"
}

func (s AppStatus) Description() string {
    return "Check the current status of the application and uptime"
}

func (s AppStatus) Handle() error {
    // Define a flag for demonstration purposes.
    dummyFlag := flag.String("dummy", "", "A dummy flag for example purposes")
    
    // Parse the command-line flags.
    flag.Parse()
    
    // Validate that the dummy flag is provided.
    if *dummyFlag == "" {
        fmt.Fprintln(os.Stderr, "Error: --dummy flag is required")
        os.Exit(1)
    }
    
    // Calculate and print the application uptime.
    uptime := time.Since(s.startTime)
    fmt.Printf("Application is running. Uptime: %s\n", uptime)
    
    return nil
}
```

In this example, flag parsing and validation are done within the `Handle()` method. If the `--dummy` flag is not provided, an error is printed to standard error and the application exits. Otherwise, the command calculates and displays the application uptime.
