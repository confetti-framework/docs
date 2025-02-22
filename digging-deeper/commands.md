# Commands

## Introduction

Confetti comes with a handy command-line interface and provides a SOLID solution. Because of that, you can create commands quickly and keep them organized.

## Usage

To view a list of all available commands, you may run the script without further commands:

```sh
go run main.go
```

Or if the application is built, you can use the executable binary:

```sh
main
```

## Writing Commands

### Your First Command

To create a command in Confetti CMS, you need to implement the `Command` interface:

```go
type Command interface {
    Name() string
    Description() string
    Handle() error
}
```

Each command must define a name, description, and a handler function to execute its logic.

### Command Structure

Commands should be structured inside the `command` package and registered in `cmd/api/main.go`.

## Defining Input Expectations

### Flags

Commands can accept flags to modify their behavior.

#### Options With Values

Flags with values allow users to specify parameters, such as:

```sh
go run main.go user:create --name "John Doe"
```

To retrieve the value of a flag in the command handler:

```go
name := request.Input("name")
```

#### Option Shortcuts

Shorter flag names can be used for convenience:

```sh
go run main.go user:create -n "John Doe"
```

#### Flag Arrays

When defining a flag that expects multiple input values, use a string slice:

```sh
go run main.go mail:send --ids 1,2,3
```

To retrieve and split the values:

```go
ids := strings.Split(request.Input("ids"), ",")
```

### Checking If a Flag Is Provided

To validate if a flag is given and ensure required flags are present, use:

```go
if request.Has("name") {
    name := request.Input("name")
    fmt.Println("Name provided:", name)
} else {
    fmt.Println("Error: --name flag is required")
}
```

## Command I/O

### Retrieving Input

While your command is executing, you will likely need to access values from the flags.

```go
value := request.Input("flag_name")
```

### Prompting For Input

You can prompt the user for input interactively:

```go
fmt.Print("Enter your name: ")
var name string
fmt.Scanln(&name)
```

### Writing Output

To send output to the console:

```go
fmt.Println("Hello, World!")
```

To display an error message:

```go
fmt.Fprintln(os.Stderr, "An error occurred")
```

## Registering Commands

Commands must be registered in `cmd/api/main.go`:

```go
var commands = []Command{
    command.ApiList{},
    command.AppServe{},
    command.AppStatus{},
}
```

## Example: Checking Application Status and Uptime

```go
package command

import (
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
    uptime := time.Since(s.startTime)
    fmt.Printf("Application is running. Uptime: %s\n", uptime)
    return nil
}
```

By following this structure, you can easily create and manage CLI commands in Confetti CMS.

