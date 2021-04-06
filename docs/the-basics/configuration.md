# Configuration
<ToggleDarkMode/>

## Introduction

All the configuration files for the Confetti framework are stored in the `config` directory. Each option is documented, so feel free to look through the files and get familiar with the options available to you.

These configuration files allow you to configure things like your database connection information, your mail server information, as well as various other core configuration values such as your application timezone and encryption key.

## Environment Configuration

It is often helpful to have different configuration values based on the environment where the application is running. For example, you may wish to use a different cache driver locally than you do on your production server.

To make this a cinch, Confetti utilizes the [GoDotEnv](https://github.com/joho/godotenv) library by John Barton. In a fresh Confetti installation, the root directory of your application will contain a `.env` file.

Your `.env` file should not be committed to your application's source control, since each developer / server using your application could require a different environment configuration. Furthermore, this would be a security risk in the event an intruder gains access to your source control repository, since any sensitive credentials would get exposed.

If you are developing with a team, you may wish to continue including a `.env.example` file with your application. By putting placeholder values in the example configuration file, other developers on your team can clearly see which environment variables are needed to run your application.

> With command flag --env-file you can define a path for your env file: `go run . app:serve --env-file ".env.testing"`

### Retrieving Environment Configuration

All the variables listed in this file will be loaded when your application is running for the first time. However, you may use the `env` package to retrieve values from these variables in your configuration files. In fact, if you view the Confetti configuration files, you will notice several of the options already using this package:

``` go
env.String("APP_URL"),
env.StringOr("APP_URL", "http://localhost"),
env.Bool("DEBUG"),
env.BoolOr("DEBUG", true),
```

The second value passed to the `StringOr` function is the "default value". This value will be used if no environment variable exists for the given key.

### Determining The Current Environment

The current application environment is determined via the `APP_ENV` variable from your `.env` file. You may access this value via the `Environment` method on the `Application` struct:

``` go
app.Environment()
```

You may also pass arguments to the `IsEnvironment` method to check if the environment matches a given value. The method will return `true` if the environment matches any of the given values:

``` go
if app.IsEnvironment("local") {
    // The environment is local
}

if app.IsEnvironment("local", "testing") {
    // The environment is either local OR testing...
}
```

> The current application environment detection can be overridden by a server-level `APP_ENV` environment variable. This can be useful when you need to share the same application for different environment configurations, so you can set up a given host to match a given environment in your server's configurations.

## Accessing Configuration Values

Retrieving a configuration is very easy. Because of strict typing you have fully autocomplete:

``` go
config.App.LineSeparator
```

If you are a developer of a package, you can get the configuration from an `inter.App` instance:

``` go
app.Make("config.App.LineSeparator").(string)
```

> To get configuration from `inter.App`, the config must be present in the `config/index.go` file

## Configuration Caching

Configuration is built at the start when you run the application. So you don't have to cache the configuration manually.
