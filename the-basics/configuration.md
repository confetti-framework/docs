Below is the corrected documentation for using configuration files in your Confetti project:

# Configuration

## Introduction

All the configuration files for the Confetti framework are stored in the `config` directory. Each option is documented, so feel free to look through the files and get familiar with the options available to you.

These configuration files allow you to configure things like your database connection, mail server, application timezone, encryption key, and other core settings.

## Environment Configuration

It is common to have different configuration values based on the environment where the application is running. For example, you might use a different cache driver locally than you do in production.

To simplify this process, you can use the [GoDotEnv](https://github.com/joho/godotenv) library. In a fresh Confetti installation, you will find a `.env.example` file in the root directory. Copy this file to `.env` and adjust the values as needed for your environment.

## Configuration Definition

Instead of using a loosely defined configuration, it is recommended to define configuration values in a type-safe manner. For example, to configure the application server settings, use the following approach:

``` go
package config

import "time"

// AppServe holds the configuration settings for the application server.
var AppServe = struct {
	Ssl     bool
	Host    string
	Port    int
	Timeout time.Duration
}{
	Ssl:     EnvBoolOr("APP_SSL", false),
	Host:    EnvStringOr("APP_HOST", "localhost"),
	Port:    EnvIntOr("APP_PORT", 8080),
	Timeout: time.Duration(EnvIntOr("APP_TIMEOUT", 30)) * time.Second,
}
```

This method ensures that configuration values are strictly typed and that default values are provided when environment variables are missing.

### Retrieving Environment Configuration

Use the helper functions to retrieve the values, ensuring type safety and allowing for default values:

```go
EnvString("APP_URL")
EnvStringOr("APP_URL", "http://localhost")
EnvBool("DEBUG")
EnvBoolOr("DEBUG", true)
EnvIntOr("APP_PORT", 8080)

The second parameter in functions like EnvStringOr or EnvBoolOr is the default value to use if the environment variable is not set.

## Accessing Configuration Values

Retrieving a configuration value is straightforward and benefits from IDE autocompletion thanks to strict typing:

```go
config.AppServe.Host
```

## Configuration Caching

Configuration is built at startup when you run your application, so manual caching of configuration values is not necessary.