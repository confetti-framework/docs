# Commands

## Introduction

Confetti comes with a handy command line interface and provides a number of helpful commands that can assist you while you build your application. Confetti Commands exists at the root of your application and is part of your normal main.go script. To view a list of all available commands, you may run the script without further commands:

    go run main.go

Or if the application is built, you can use the executable binary:

    main

Every command also includes a "help" screen which displays and describes the command's available arguments and options. To view a help screen, suffix your command with the `--help` flag:

    go run main.go your:command --help

### Baker (REPL)

Baker is a powerful REPL for the Confetti framework, forked from the motemen/gore package.

#### Usage

Baker allows you to interact with your entire Confetti application on the command line. To enter the Baker environment, run the `baker` subcommando:

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
	"confetti-framework/app/support"
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

func (s SendEmails) Handle(app inter.App, writer io.Writer) inter.ExitCode {
	mailer := app.Make(support.DripEmailer{}).(support.DripEmailer)
	mailer.Send(s.Email)

	return inter.Success
}
```

> For greater code reuse, it is good practice to keep your console commands light and let them defer to application services to accomplish their tasks. In the example above, note that we inject a service class to do the "heavy lifting" of sending the e-mails.

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

Next, let's take a look at an flag that expects a value. If the user must specify a value for a flag, then you simply define a different type. By default you can choose from `string`, `int`, `float`, `[]string`, `[]int` and `duration`, but you can also implement [Custom Getters](#custom-getters) to cast the flags to the fields.

``` go
type SendEmails struct {
	Queue string `flag:"queue"`
}
```

In this example, the user may pass a value for the flag like so. If the argument of a flag is not specified when invoking the command, you will get an `flag needs an argument` error. If the flag itself is not specified when invoking the command, the default value of the field of the struct will not be changed.

#### Option Shortcuts

To assign a shortcut when defining an flag, you may specify it with the tag `short`:

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

## Command I/O

### Retrieving Input

While your command is executing, you will likely need to access the values from the flags. You can simply use the fields of the struct:

``` go
type SendEmails struct {
	Subject string `flag:"subject" required:"true"`
}

func (s SendEmails) Handle(app inter.App, output io.Writer) inter.ExitCode {
	_, _ = fmt.Fprintln(output, "The subject: "+s.Subject)
}
```

### Prompting For Input

In addition to displaying output, you may also ask the user to provide input during the execution of your command. The `ask` method will prompt the user with the given question, accept their input, and then return the user's input back to your command:

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $name = $this->ask('What is your name?');
    }

The `secret` method is similar to `ask`, but the user's input will not be visible to them as they type in the console. This method is useful when asking for sensitive information such as passwords:

    $password = $this->secret('What is the password?');

#### Asking For Confirmation

If you need to ask the user for a simple "yes or no" confirmation, you may use the `confirm` method. By default, this method will return `false`. However, if the user enters `y` or `yes` in response to the prompt, the method will return `true`.

    if ($this->confirm('Do you wish to continue?')) {
        //
    }

If necessary, you may specify that the confirmation prompt should return `true` by default by passing `true` as the second argument to the `confirm` method:

    if ($this->confirm('Do you wish to continue?', true)) {
        //
    }

#### Auto-Completion

The `anticipate` method can be used to provide auto-completion for possible choices. The user can still provide any answer, regardless of the auto-completion hints:

    $name = $this->anticipate('What is your name?', ['Taylor', 'Dayle']);

Alternatively, you may pass a closure as the second argument to the `anticipate` method. The closure will be called each time the user types an input character. The closure should accept a string parameter containing the user's input so far, and return an array of options for auto-completion:

    $name = $this->anticipate('What is your address?', function ($input) {
        // Return auto-completion options...
    });

#### Multiple Choice Questions

If you need to give the user a predefined set of choices when asking a question, you may use the `choice` method. You may set the array index of the default value to be returned if no option is chosen by passing the index as the third argument to the method:

    $name = $this->choice(
        'What is your name?',
        ['Taylor', 'Dayle'],
        $defaultIndex
    );

In addition, the `choice` method accepts optional fourth and fifth arguments for determining the maximum number of attempts to select a valid response and whether multiple selections are permitted:

    $name = $this->choice(
        'What is your name?',
        ['Taylor', 'Dayle'],
        $defaultIndex,
        $maxAttempts = null,
        $allowMultipleSelections = false
    );

### Writing Output

To send output to the console, you may use the `line`, `info`, `comment`, `question` and `error` methods. Each of these methods will use appropriate ANSI colors for their purpose. For example, let's display some general information to the user. Typically, the `info` method will display in the console as green colored text:

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        // ...

        $this->info('The command was successful!');
    }

To display an error message, use the `error` method. Error message text is typically displayed in red:

    $this->error('Something went wrong!');

You may use the `line` method to display plain, uncolored text:

    $this->line('Display this on the screen');

You may use the `newLine` method to display a blank line:

    // Write a single blank line...
    $this->newLine();

    // Write three blank lines...
    $this->newLine(3);

#### Tables

The `table` method makes it easy to correctly format multiple rows / columns of data. All you need to do is provide the column names and the data for the table and Confetti will
automatically calculate the appropriate width and height of the table for you:

    use App\Models\User;

    $this->table(
        ['Name', 'Email'],
        User::all(['name', 'email'])->toArray()
    );

#### Progress Bars

For long running tasks, it can be helpful to show a progress bar that informs users how complete the task is. Using the `withProgressBar` method, Confetti will display a progress bar and advance its progress for each iteration over a given iterable value:

    use App\Models\User;

    $users = $this->withProgressBar(User::all(), function ($user) {
        $this->performTask($user);
    });

Sometimes, you may need more manual control over how a progress bar is advanced. First, define the total number of steps the process will iterate through. Then, advance the progress bar after processing each item:

    $users = App\Models\User::all();

    $bar = $this->output->createProgressBar(count($users));

    $bar->start();

    foreach ($users as $user) {
        $this->performTask($user);

        $bar->advance();
    }

    $bar->finish();

> {tip} For more advanced options, check out the [Symfony Progress Bar component documentation](https://symfony.com/doc/current/components/console/helpers/progressbar.html).

## Registering Commands

All of your console commands are registered within your application's `App\Console\Kernel` class, which is your application's "console kernel". Within the `commands` method of this class, you will see a call to the kernel's `load` method. The `load` method will scan the `app/Console/Commands` directory and automatically register each command it contains with Confetti Commands. You are even free to make additional calls to the `load` method to scan other directories for Confetti Commands commands:

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');
        $this->load(__DIR__.'/../Domain/Orders/Commands');

        // ...
    }

If necessary, you may manually register commands by adding the command's class name to the `$commands` property of your `App\Console\Kernel` class. When Confetti Commands boots, all the commands listed in this property will be resolved by the [service container](/docs/{{version}}/container) and registered with Confetti Commands:

    protected $commands = [
        Commands\SendEmails::class
    ];

## Programmatically Executing Commands

Sometimes you may wish to execute an Confetti Commands command outside of the CLI. For example, you may wish to execute an Confetti Commands command from a route or controller. You may use the `call` method on the `Confetti Commands` facade to accomplish this. The `call` method accepts either the command's signature name or class name as its first argument, and an array of command parameters as the second argument. The exit code will be returned:

    use Illuminate\Support\Facades\Confetti Commands;

    Route::post('/user/{user}/mail', function ($user) {
        $exitCode = Confetti Commands::call('mail:send', [
            'user' => $user, '--queue' => 'default'
        ]);

        //
    });

Alternatively, you may pass the entire Confetti Commands command to the `call` method as a string:

    Confetti Commands::call('mail:send 1 --queue=default');

#### Passing Array Values

If your command defines an option that accepts an array, you may pass an array of values to that option:

    use Illuminate\Support\Facades\Confetti Commands;

    Route::post('/mail', function () {
        $exitCode = Confetti Commands::call('mail:send', [
            '--id' => [5, 13]
        ]);
    });

#### Passing Boolean Values

If you need to specify the value of an option that does not accept string values, such as the `--force` flag on the `migrate:refresh` command, you should pass `true` or `false` as the value of the option:

    $exitCode = Confetti Commands::call('migrate:refresh', [
        '--force' => true,
    ]);

#### Queueing Confetti Commands Commands

Using the `queue` method on the `Confetti Commands` facade, you may even queue Confetti Commands commands so they are processed in the background by your [queue workers](/docs/{{version}}/queues). Before using this method, make sure you have configured your queue and are running a queue listener:

    use Illuminate\Support\Facades\Confetti Commands;

    Route::post('/user/{user}/mail', function ($user) {
        Confetti Commands::queue('mail:send', [
            'user' => $user, '--queue' => 'default'
        ]);

        //
    });

Using the `onConnection` and `onQueue` methods, you may specify the connection or queue the Confetti Commands command should be dispatched to:

    Confetti Commands::queue('mail:send', [
        'user' => 1, '--queue' => 'default'
    ])->onConnection('redis')->onQueue('commands');

### Calling Commands From Other Commands

Sometimes you may wish to call other commands from an existing Confetti Commands command. You may do so using the `call` method. This `call` method accepts the command name and an array of command arguments / options:

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $this->call('mail:send', [
            'user' => 1, '--queue' => 'default'
        ]);

        //
    }

If you would like to call another console command and suppress all of its output, you may use the `callSilently` method. The `callSilently` method has the same signature as the `call` method:

    $this->callSilently('mail:send', [
        'user' => 1, '--queue' => 'default'
    ]);
