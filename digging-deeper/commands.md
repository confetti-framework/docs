## Introduction

Confetti comes with a handy command-line interface that provides a SOLID solution for building commands quickly and keeping them organized.

## Usage

To view a list of all available commands, run the script without further commands:

```sh
go run main.go
```

Or if the application is built, use the executable binary:

```sh
main
```

## Writing Commands

### Your First Command

To create a command in Confetti Framework, implement the `Command` interface:

```go
type Command interface {
    Name() string
    Description() string
    Handle() error
}
```

Each command must define a name, description, and a handler function to execute its logic.

### Command Structure

Place your commands inside the `command` package and register them in `cmd/api/main.go`.

## Defining Input Expectations with the Standard Go Approach

### Flags

Commands can accept flags to modify their behavior. Instead of using an abstract `request.Input`, the Go way is to use the standard `flag` package.

#### Options With Values

For example, to create a command that accepts a name flag:

```go
package main

import (
    "flag"
    "fmt"
    "os"
)

func main() {
    // Define the flag
    name := flag.String("name", "", "Name of the user")
    // Parse the command-line flags
    flag.Parse()

    // Validate that the flag is provided
    if *name == "" {
        fmt.Fprintln(os.Stderr, "Error: --name flag is required")
        os.Exit(1)
    }

    // Use the flag value
    fmt.Println("Name provided:", *name)
}
```

You can run this command as follows:

```sh
go run main.go --name "John Doe"
```

#### Option Shortcuts

To support shorter flag names, you can define additional flags:

```go
package main

import (
    "flag"
    "fmt"
    "os"
)

func main() {
    // Define both the long and short versions for the same purpose
    name := flag.String("name", "", "Name of the user")
    n := flag.String("n", "", "Name of the user (shorthand)")
    flag.Parse()

    // Prefer the long flag if provided, otherwise use the short flag
    userName := *name
    if userName == "" {
        userName = *n
    }

    if userName == "" {
        fmt.Fprintln(os.Stderr, "Error: --name or -n flag is required")
        os.Exit(1)
    }

    fmt.Println("Name provided:", userName)
}
```

#### Flag Arrays

If a flag expects multiple input values, you can accept a comma-separated string and split it:

```go
package main

import (
    "flag"
    "fmt"
    "os"
    "strings"
)

func main() {
    // Define the flag that expects a comma-separated list
    idsStr := flag.String("ids", "", "Comma-separated list of IDs (e.g., 1,2,3)")
    flag.Parse()

    if *idsStr == "" {
        fmt.Fprintln(os.Stderr, "Error: --ids flag is required")
        os.Exit(1)
    }

    // Split the string into a slice
    ids := strings.Split(*idsStr, ",")
    fmt.Println("IDs provided:", ids)
}
```

### Checking If a Flag Is Provided

In the Go way, you check if a flag has been provided by verifying whether its value is not the empty string (or using any other default you set):

```go
package main

import (
    "flag"
    "fmt"
    "os"
)

func main() {
    name := flag.String("name", "", "Name of the user")
    flag.Parse()

    if *name != "" {
        fmt.Println("Name provided:", *name)
    } else {
        fmt.Fprintln(os.Stderr, "Error: --name flag is required")
        os.Exit(1)
    }
}
```

## Command I/O

### Retrieving Input

Instead of a custom input object, simply use the flag package to retrieve values as demonstrated above.

### Prompting For Input

For interactive input (when flags are not enough), use Go’s standard input methods:

```go
package main

import (
    "bufio"
    "fmt"
    "os"
)

func main() {
    reader := bufio.NewReader(os.Stdin)
    fmt.Print("Enter your name: ")
    name, _ := reader.ReadString('\n')
    fmt.Println("Hello,", name)
}
```

### Writing Output

To send output to the console, use:

```go
fmt.Println("Hello, World!")
```

For error messages, write to standard error:

```go
fmt.Fprintln(os.Stderr, "An error occurred")
```

## Registering Commands

When you’re building a CLI with multiple commands, register each command in `cmd/api/main.go`:

```go
var commands = []Command{
    command.ApiList{},
    command.AppServe{},
    command.AppStatus{},
}
```

## Example: Checking Application Status and Uptime

Here’s an example of a command that checks application status and uptime:

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
    // For demonstration, we could define flags specific to this command
    dummyFlag := flag.String("dummy", "", "A dummy flag for example purposes")
    flag.Parse()

    // Check if dummy flag is provided
    if *dummyFlag == "" {
        fmt.Fprintln(os.Stderr, "Error: --dummy flag is required")
        os.Exit(1)
    }

    uptime := time.Since(s.startTime)
    fmt.Printf("Application is running. Uptime: %s\n", uptime)
    return nil
}
```

By following these updated examples, you can easily create and manage CLI commands in Confetti Framework using the idiomatic Go approach.