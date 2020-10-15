# Logging

- [Introduction](#introduction)
- [Configuration](#configuration)
  - [Building Log Stacks](#building-log-stacks)
- [Writing Log Messages](#writing-log-messages)
  - [Writing To Specific Channels](#writing-to-specific-channels)
- [Advanced Syslog Channel Customization](#advanced-syslog-channel-customization)
  - [Customizing Syslog For Channels](#customizing-syslog-for-channels)
  - [Creating Syslog Handler Channels](#creating-syslog-handler-channels)
  - [Creating Channels Via Factories](#creating-channels-via-factories)

<a name="introduction"></a>

## Introduction

To help you learn more about what's happening within your application, Lanvard provides robust logging services that
allow you to log messages to files, the system error log, and even to Slack to notify your entire team.

Under the hood, Lanvard utilizes the [Syslog](https://github.com/lanvard/syslog) library, which provides support for a
variety of powerful log handlers. Lanvard makes it a cinch to configure these handlers, allowing you to mix and match
them to customize your application's log handling.

<a name="configuration"></a>

## Configuration

All of the configuration for your application's logging system is housed in the `config/logging.go` configuration file.
This file allows you to configure your application's log channels, so be sure to review each of the available channels
and their options. We'll review a few common options below.

By default, Lanvard will use the `stack` channel when logging messages. The `stack` channel is used to aggregate
multiple log channels into a single channel. For more information on building stacks, check out
the [documentation below](#building-log-stacks).

#### Configuring The Channel Name

The name provided is for reference only, so you can log specifically to that channel. If you have a large system, it
might be smart to split the channels. For example, you could create a channel named `external` for external connections,
and a channel named `worker` for background jobs.

    "external": loggers.Syslog{
        Path:     Path.Storage + "/logs/{yyyy-mm-dd}_external.log",
        MinLevel: syslog.DEBUG,
        AppName:  App.Name,
        MaxFiles: 14,
    },

#### Preconceived Channels

Name | Description
------------- | -------------
`stack` | A wrapper to facilitate creating "multi-channel" channels
`single` | A single file or path based logger channel
`daily` | A new log file every day, old ones are automatically deleted
`slack` | A channel that pushes messages to Slack
`stderr` | Logs are written to stderr

> {tip} It is very easy to create a channel yourself. Use an existing logger or create your own. The loggers only need to implement interface `inter.Logger`.

#### Configuring Most Common Loggers

Most channels are based on `loggers.Syslog`. This logger can write files, but can also be used by any ʻio.Writer`.

Name | Description | Default
------------- | ------------- | -------------
`Path` | The path to the log file |
`permission` | The log file's permissions | `0644`
`MinLevel` | The minimum "level" a message must be in order to be logged | EMERG
`MaxFiles` | Automatically clean up old logs when overwriting x number of logs | 0 (off)
`Facility` | Specify the type of program that is logging the message | 8 (USER)
`Writer` | Define your own writer here | nil

#### Configuring The Slack Channel

The `slack` channel requires a `WebhookUrl` configuration option. This URL should match a URL for
an [incoming webhook](https://slack.com/apps/A0F7XDUAZ-incoming-webhooks) that you have configured for your Slack team.
By default, Slack will only receive logs at the `critical` level and above; however, you can adjust this in
your `logging` configuration file.

<a name="building-log-stacks"></a>

### Building Log Stacks

As previously mentioned, the `stack` driver allows you to combine multiple channels into a single log channel. To
illustrate how to use log stacks, let's take a look at an example configuration that you might see in a production
application:

	Channels: map[string]inter.Logger{
		"stack": loggers.Stack{
			Channels: []string{"daily", "slack"},
		},

		"daily": loggers.Syslog{
			Path:     Path.Storage + "/logs/{yyyy-mm-dd}_default.log",
			MinLevel: syslog.DEBUG,
			MaxFiles: 14,
		},

		"slack": loggers.Slack{
			WebhookUrl: env.StringOr("LOG_SLACK_WEBHOOK_URL", ""),
			MinLevel:   syslog.CRIT,
		},
	},

Let's dissect this configuration. First, notice our `stack` channel aggregates two other channels via its `Channels`
option: `daily` and `slack`. So, when logging messages, both of these channels will have the opportunity to log the
message.

#### Log Levels

Take note of the `MinLevel` configuration option present on the `daily` and `slack` channel configurations in the
example above. This option determines the minimum "level" a message must be in order to be logged by the channel.
loggers.Syslog, which powers Lanvard's logging services, offers all of the log levels defined in
the [RFC 5424 specification](https://tools.ietf.org/html/rfc5424): **emergency**, **alert**, **critical**, **error**, **
warning**, **notice**, **info**, and **debug**.

So, imagine we log a message using the `debug` method:

    app.Log().Debug("An informational message.")

Given our configuration, the `daily` channel will write the message to the system log; however, since the error message
is not `critical` or above, it will not be sent to Slack. However, if we log an `emergency` message, it will be sent to
both the system log and Slack since the `emergency` level is above our minimum level threshold for both channels:

    app.Log().Emergency("The system is down!")

<a name="writing-log-messages"></a>

## Writing Log Messages

You may write information to the logs using the `Log` [~~facade~~](/docs/{{version}}/facades). As previously mentioned,
the logger provides the eight logging levels defined in
the [RFC 5424 specification](https://tools.ietf.org/html/rfc5424): **emergency**, **alert**, **critical**, **error**, **
warning**, **notice**, **info** and **debug**:

    app.Log().Emergency(message)
    app.Log().Alert(message);
    app.Log().Critical(message);
    app.Log().Error(message);
    app.Log().Warning(message);
    app.Log().Notice(message);
    app.Log().Info(message);
    app.Log().Debug(message);
    app.Log().Log(syslog.ALERT, message)

So, you may call any of these methods to log a message for the corresponding level. By default, the message will be
written to the default log channel as configured by your `config/logging.go` configuration file:

    package controller

    import (
        "github.com/lanvard/contract/inter"
        "github.com/lanvard/routing/outcome"
    )
    
    func ShowProfile(request inter.Request) inter.Response {
        id := request.Parameter("user_id")
        request.App().Log().Info("Showing user profile for user: " + id.String())
    
        user := User.FindOrFail(id.Number())
        return outcome.View("user.profile", outcome.Options{"user:", user})
    }

#### Contextual Information

An array of contextual data may also be passed to the log `...With()` methods. This contextual data will be formatted to
JSON and displayed with the log message:

    logData := map[string]string{"id": id.String()}
    request.App().Log().InfoWith("User failed to login.", logData)

If you want to log data as prescribed by the standards, use StructuredData:

    logData := syslog.StructuredData{syslog.SDElement{"id": id.String()}
    request.App().Log().InfoWith("User failed to login.", logData)

<a name="writing-to-specific-channels"></a>

### Writing To Specific Channels

Sometimes you may wish to log a message to a channel other than your application's default channel. You may use
the `channel` method on the `Log` facade to retrieve and log to any channel defined in your configuration file:

    Log::channel('slack')->info('Something happened!');

If you would like to create an on-demand logging stack consisting of multiple channels, you may use the `stack` method:

    Log::stack(['single', 'slack'])->info('Something happened!');

<a name="advanced-syslog-channel-customization"></a>

## Advanced Syslog Channel Customization

<a name="customizing-syslog-for-channels"></a>

### Customizing Syslog For Channels

Sometimes you may need complete control over how Syslog is configured for an existing channel. For example, you may want
to configure a custom Syslog `FormatterInterface` implementation for a given channel's handlers.

To get started, define a `tap` array on the channel's configuration. The `tap` array should contain a list of classes
that should have an opportunity to customize (or "tap" into) the Syslog instance after it is created:

    'single' => [
        'driver' => 'single',
        'tap' => [App\Logging\CustomizeFormatter::class],
        'path' => storage_path('logs/laravel.log'),
        'level' => 'debug',
    ],

Once you have configured the `tap` option on your channel, you're ready to define the class that will customize your
Syslog instance. This class only needs a single method: `__invoke`, which receives an `Illuminate\Log\Logger` instance.
The `Illuminate\Log\Logger` instance proxies all method calls to the underlying Syslog instance:

    <?php

    namespace App\Logging;

    use Syslog\Formatter\LineFormatter;

    class CustomizeFormatter
    {
        /**
         * Customize the given logger instance.
         *
         * @param  \Illuminate\Log\Logger  $logger
         * @return void
         */
        public function __invoke($logger)
        {
            foreach ($logger->getHandlers() as $handler) {
                $handler->setFormatter(new LineFormatter(
                    '[%datetime%] %channel%.%level_name%: %message% %context% %extra%'
                ));
            }
        }
    }

> {tip} All of your "tap" classes are resolved by the [service container](/docs/{{version}}/container), so any constructor dependencies they require will automatically be injected.

<a name="creating-syslog-handler-channels"></a>

### Creating Syslog Handler Channels

Syslog has a variety of [available handlers](https://github.com/Seldaek/syslog/tree/master/src/Syslog/Handler). In some
cases, the type of logger you wish to create is merely a Syslog driver with an instance of a specific handler. These
channels can be created using the `syslog` driver.

When using the `syslog` driver, the `handler` configuration option is used to specify which handler will be
instantiated. Optionally, any constructor parameters the handler needs may be specified using the `with` configuration
option:

    'logentries' => [
        'driver'  => 'syslog',
        'handler' => Syslog\Handler\SyslogUdpHandler::class,
        'with' => [
            'host' => 'my.logentries.internal.datahubhost.company.com',
            'port' => '10000',
        ],
    ],

#### Syslog Formatters

When using the `syslog` driver, the Syslog `LineFormatter` will be used as the default formatter. However, you may
customize the type of formatter passed to the handler using the `formatter` and `formatter_with` configuration options:

    'browser' => [
        'driver' => 'syslog',
        'handler' => Syslog\Handler\BrowserConsoleHandler::class,
        'formatter' => Syslog\Formatter\HtmlFormatter::class,
        'formatter_with' => [
            'dateFormat' => 'Y-m-d',
        ],
    ],

If you are using a Syslog handler that is capable of providing its own formatter, you may set the value of
the `formatter` configuration option to `default`:

    'newrelic' => [
        'driver' => 'syslog',
        'handler' => Syslog\Handler\NewRelicHandler::class,
        'formatter' => 'default',
    ],

<a name="creating-channels-via-factories"></a>

### Creating Channels Via Factories

If you would like to define an entirely custom channel in which you have full control over Syslog's instantiation and
configuration, you may specify a `custom` driver type in your `config/logging.go` configuration file. Your configuration
should include a `via` option to point to the factory class which will be invoked to create the Syslog instance:

    'channels' => [
        'custom' => [
            'driver' => 'custom',
            'via' => App\Logging\CreateCustomLogger::class,
        ],
    ],

Once you have configured the `custom` channel, you're ready to define the class that will create your Syslog instance.
This class only needs a single method: `__invoke`, which should return the Syslog instance:

    <?php

    namespace App\Logging;

    use Syslog\Logger;

    class CreateCustomLogger
    {
        /**
         * Create a custom Syslog instance.
         *
         * @param  array  $config
         * @return \Syslog\Logger
         */
        public function __invoke(array $config)
        {
            return new Logger(...);
        }
    }
