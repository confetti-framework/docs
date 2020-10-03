# Configuration

- [Introduction](#introduction)
- [Environment Configuration](#environment-configuration)
    - [Retrieving Environment Configuration](#retrieving-environment-configuration)
    - [Determining The Current Environment](#determining-the-current-environment)
    - [Hiding Environment Variables From Debug Pages](#hiding-environment-variables-from-debug)
- [Accessing Configuration Values](#accessing-configuration-values)
- [Configuration Caching](#configuration-caching)
- [~~Maintenance Mode~~](#maintenance-mode)

<a name="introduction"></a>
## Introduction

All the configuration files for the Lanvard framework are stored in the `config` directory. Each option is documented, so feel free to look through the files and get familiar with the options available to you.

<a name="environment-configuration"></a>
## Environment Configuration

It is often helpful to have different configuration values based on the environment where the application is running. For example, you may wish to use a different cache driver locally than you do on your production server.

To make this a cinch, Lanvard utilizes the [GoDotEnv](https://github.com/joho/godotenv) library by John Barton. In a fresh Lanvard installation, the root directory of your application will contain a `.env` file.

Your `.env` file should not be committed to your application's source control, since each developer / server using your
application could require a different environment configuration. Furthermore, this would be a security risk in the event
an intruder gains access to your source control repository, since any sensitive credentials would get exposed.

If you are developing with a team, you may wish to continue including a `.env.example` file with your application. By
putting placeholder values in the example configuration file, other developers on your team can clearly see which
environment variables are needed to run your application. You may also create a `.env.testing` file. This file will
override the `.env` file when running tests ~~or executing Artisan commands with the `--env=testing` option.~~

> {tip} Any variable in your `.env` file can be set by external environment variables such as server-level or system-level environment variables.

<a name="retrieving-environment-configuration"></a>
### Retrieving Environment Configuration

All the variables listed in this file will be loaded when your application is running for the first time. However, you may use the `environment` package to retrieve values from these variables in your configuration files. In fact, if you review the Lanvard configuration files, you will notice several of the options already using this package:

    env.String("APP_URL"),
    env.StringOr("APP_URL", "http://localhost"),
    env.Bool("DEBUG"),
    env.BoolOr("DEBUG", true),

The second value passed to the `StringOr` function is the "default value". This value will be used if no environment
variable exists for the given key.

<a name="determining-the-current-environment"></a>
### Determining The Current Environment

The current application environment is determined via the `APP_ENV` variable from your `.env` file. You may access this value via the `Environment` method on the `Application` struct:

    app.Environment()

You may also pass arguments to the `IsEnvironment` method to check if the environment matches a given value. The method will return `true` if the environment matches any of the given values:

    if app.IsEnvironment("local") {
        // The environment is local
    }

    if app.IsEnvironment("local", "staging") {
        // The environment is either local OR testing...
    }

> {tip} The current application environment detection can be overridden by a server-level `APP_ENV` environment variable. This can be useful when you need to share the same application for different environment configurations, so you can set up a given host to match a given environment in your server's configurations.

<a name="accessing-configuration-values"></a>
## Accessing Configuration Values

Retrieving a configuration is very easy. Because of strict typing you have fully autocomplete:

    config.App.LineSeparator

If you are a developer of a package, you can get the configuration from an `inter.App` instance:

    app.Make("config.App.LineSeparator").(string)

> {note} To get configuration from `inter.App`, the config must be present in the `config/index.go` file

<a name="configuration-caching"></a>

## Configuration Caching

Configuration is built at the start when you run the application. So you don't have to cache the configuration manually.