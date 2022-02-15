# Commands
<ToggleDarkMode/>

## Introduction

Confetti comes with a handy command line interface and provides a SOLID solution. Because of that you can create commands quickly and keep them organized. Confetti Commands exists at the root of your application and is part of your the main.go script.

## Installation

Confetti Commands is included by default in the [framework](https://github.com/confetti-framework/confetti), but you can also use Confetti Commands separately if you only run need to run commands and don't process http requests.

1. Download Confetti Commands template code from [GitHub](https://github.com/confetti-framework/commands)
1. To install Go, go to [golang.org](https://golang.org/doc/install) and follow the instructions.

## Usage

To view a list of all available commands, you may run the script without further commands:

    go run main.go

Or if the application is built, you can use the executable binary:

    main

Every command also includes a "help" screen which displays and describes the command's available arguments and options. To view a help screen, suffix your command with the `--help` flag:

    go run main.go your:command --help

With command flag --env-file you can define a path for your env file:

    go run main.go your:command --env-file ".env.testing"

## Baker (REPL)

Baker is a powerful REPL for the Confetti framework, forked from the motemen/gore package. Baker allows you to interact with your entire Confetti application on the command line.

### Usage

To enter the Baker environment, run the `baker` subcommando:

    go run main.go baker

## Writing Commands

In addition to the commands provided by default, you may build your own custom commands. Commands are typically stored in the `app/console/commands` directory; however, you are free to choose your own storage location as long as you don't have circular import.

### Your First Command

As an example you can use the `example:command` command. The `ExampleCommand` struct is located in `app/console/commands/example_command.go`. Feel free to copy and modify it to your wishes.

### Command Structure

In every command you should define appropriate values in the `Name` and `Description` methods of the struct. These properties will be used when displaying your command on the `index` screen. The `Name` method also allows you to define your commando's name without flags. Your commando's [input expectations](#defining-input-expectations) are automatically generated when you define the fields. The `Handle` method will be called when your command is executed. You may place your command logic in this method.

Let's take a look at an example command:

``` go
package commands

import (
	"src/app/support"
	"github.com/confetti-framework/contract/inter"
	"io"
)

type SendEmails struct {
	Email string `flag:"email"`
}

func (s SendEmails) Name() string {
	return "mail:send"
}

func (s SendEmails) Description() string {
	return "Send a marketing email to a user."
}

func (s SendEmails) Handle(c inter.Cli) inter.ExitCode {
	mailer := support.DripEmailer{}
	mailer.Send(s.Email)

	c.Info("Email send to: %s", s.Email)

	return inter.Success
}
```

## Defining Input Expectations

When writing console commands, it is common to gather input from the user through the flags. Confetti makes it very convenient to define the input you expect from the user using the fields on your commands. The fields on your commands allows you to define the type, normal flag name, short flag name and description for the command in a single, expressive syntax.

### Flags

Flags are prefixed by two hyphens (`--`) when they are provided via the command line. There are two types of flags: those that receive a value and those that don't. Flags that don't receive a value serve as a boolean "switch". Let's take a look at an example of this type of flag:

``` go
type SendEmails struct {
	Queue bool `flag:"queue"`
}
```

In this example, the `--queue` switch may be specified when calling the command. If the `--queue` switch is passed, the value of the field will be `true`. Otherwise, the value will be `false`:

```
go run main.go mail:send --queue
```

#### Options With Values

Next, let's take a look at an flag that expects a value. If the user must specify a value for a flag, then you simply define a different type. By default you can choose from `string`, `int`, `float`, `[]string`, `[]int` and `duration`, but you can also implement [Custom Getters](#custom-types-getters) to cast the flags to the fields.

``` go
type SendEmails struct {
	Queue string `flag:"queue"`
}
```

In this example, the user may pass a value for the flag like so. If the argument of a flag is not specified when invoking the command, you will get an `flag needs an argument` error. If the flag itself is not specified when invoking the command, the default value of the field of the struct will not be changed.

#### Option Shortcuts

Short lags are prefixed by one hyphen (`-`) when they are provided via the command line. To assign a shortcut when defining an flag, you may specify it with the tag `short`:

``` go
type SendEmails struct {
	Queue string `short:"Q" flag:"queue"`
}
```

#### Flag Arrays

When defining an flag that expects multiple input values, then use a string slice or array slice:

``` go
type SendEmails struct {
	Names []string `short:"N" flag:"names"`
	Ids []int `short:"I" flag:"ids"`
}
```
```
go run main.go mail:send --ids 1,2,3
```

### Input Descriptions

You can assign descriptions to flags by defining the `description` tag:

``` go
type SendEmails struct {
	Subject string `flag:"subject" description:"The subject of the mail"`
}
```

### Required Fields

Provide the required tag to ensure that the value is different from the default value of the field.

``` go
type SendEmails struct {
	Subject string `flag:"subject" required:"true"`
}
```
In the above example, you can be sure that `Subject` is not an empty string.

### Custom Types (Getters)

In addition to the above types, you can create custom types to cast the flags to a value. Create a struct that follows the `flag.Getter` interface. The `Get` method returns the value with a type which must be the same type as defined in a field of a command.

``` go
package getters

import (
	"fmt"
	"strings"
)

type StringList []string

func (s *StringList) String() string {
	return fmt.Sprintf("%v", *s)
}

func (s *StringList) Set(value string) error {
	*s = strings.Split(value, ",")
	return nil
}

// Get returns the value of type which must be
// the same type as defined in a field of a command.
func (s *StringList) Get() interface{} {
	return []string(*s)
}
```

You have to register these getters in `app/console/kernel.go`.

## Command I/O

### Retrieving Input

While your command is executing, you will likely need to access the values from the flags. You can simply use the fields of the struct:

``` go
type SendEmails struct {
	Subject string `flag:"subject" required:"true"`
}

func (s SendEmails) Handle(c inter.Cli) inter.ExitCode {
  c.Info(output, "The subject: "+s.Subject)
}
```

### Prompting For Input

In addition to displaying output, you may also ask the user to provide input during the execution of your command. The `Ask` method will prompt the user with the given question, accept their input, and then return the user's input back to your command:

``` go
func (s SendEmails) Handle(c inter.Cli) inter.ExitCode {
	name := c.Ask("What is your name?")
	//
	return inter.Success
}
```

The `Secret` method is similar to `Ask`, but the user's input will not be visible to them as they type in the console. This method is useful when asking for sensitive information such as passwords:

``` go
password := c.Secret("What is the password?")
```

#### Asking For Confirmation

If you need to ask the user for a simple "yes or no" confirmation, you may use the `Confirm` method. If the user enters `y` or `yes` in response to the prompt, the method will return `true`.

``` go
if c.Confirm("Do you wish to continue?", false) {
  //
}
```

If necessary, you may specify that the confirmation prompt should return `true` by default by passing `true` as the second argument to the `Confirm` method:


``` go
if c.Confirm("Do you wish to continue?", true) {
  //
}
```

#### Multiple Choice Questions

If you need to give the user a predefined set of choices when asking a question, you may use the `choice` method. You may set the array index of the default value to be returned if no option is chosen by passing the index as the third argument to the method:

``` go
name := c.Choice("Select Day", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday")
```

### Writing Output

To send output to the console, you may use the `Line`, `Info`, `Comment` and `Error` methods. Each of these methods will use appropriate ANSI colors for their purpose. For example, let's display some general information to the user. Typically, the `Info` method will display in the console as green colored text:

``` go {3}
func (s SendEmails) Handle(c inter.Cli) inter.ExitCode {
	//
	c.Info("The command was successful!")
	return inter.Success
}
```

To display an error message, use the `Error` method. Error message text is typically displayed in red (and to stderr):

``` go {3}
func (s SendEmails) Handle(c inter.Cli) inter.ExitCode {
	//
	c.Error("Something went wrong!")
	return inter.Failure
}
```

You may use the `Line` method to display plain, uncolored text:

``` go {3}
func (s SendEmails) Handle(c inter.Cli) inter.ExitCode {
	//
	c.Line("Display this on the screen")
	return inter.Success
}
```

#### Tables

The `Table` method makes it easy to correctly format multiple rows and columns of data. All you need to do is provide the column names and the data for the table and method `Render` will automatically calculate the appropriate width and height of the table for you:

``` go
t := c.Table()
t.AppendHeader([]interface{}{"Name", "Email"})
t.AppendRow([]interface{}{"Piet", "piet@niet.nl"})
t.Render()
```

> Confetti uses the [go-pretty](https://github.com/jedib0t/go-pretty) package. Many more options are available to generate tables. Take a look at the [readme](https://github.com/jedib0t/go-pretty/tree/master/table).

#### Progress Bars

For long running tasks, it can be helpful to show a progress bar that informs users how complete the task is. First, define the total number of steps the process will iterate through (with an optional description). Then, use `Add(1)` after processing each item:

``` go
bar := c.ProgressBar(4, "Sending emails")
for _, user := range users {
  //
  _ = bar.Add(1)
}
```

> For more advanced options, check out the [schollz/progressbar](https://github.com/schollz/progressbar) package.

## Registering Commands

All of your console commands are registered within your application's `app/console/kernel.go` file, which create your application's "console kernel". You have to manually register commands by adding the command's struct to the `Commands` field of the `console.Kernel` struct. When Confetti boots, all the commands listed in this field will be registered:

``` go {5,6}
func NewKernel(app inter.App) console.Kernel {
	return console.Kernel{
		App: app,
		Commands: []inter.Command{
			commands.AppServe{},
			commands.SendEmails{},
		},
		FlagProviders: []func() []flag.Getter{flagGetters},
	}
}
```

## Programmatically Executing Commands

Sometimes you may wish to execute an command outside of the CLI. For example, you may wish to execute an command from a route or controller. Simply call the command with the required fields. Call the `Handle` method with a cli facade. The exit code will be returned:

``` go
exitCode := commands.MailSend{User: user}.Handle(facade.NewCli(app))
```

Want to capture all output from the command? Then give a writer as the second parameter.

``` go {2,3}
var writer bytes.Buffer
cli := facade.NewCli(app, &writer)
exitCode := commands.MailSend{}.Handle(cli)

output := writer.String()
```

If you want to separate the normal output from the errors, use the third parameter with an extra writer:

``` go {4,5}
var writer bytes.Buffer
var writerErr bytes.Buffer

cli := facade.NewCli(app, &writer, &writerErr)
exitCode := commands.MailSend{}.Handle(cli)

output := writer.String()
outputErr := writerErr.String()
```
