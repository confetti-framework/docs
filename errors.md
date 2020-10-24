# Error Handling

- [Introduction](#introduction)
- [Configuration](#configuration)
- [The Exception Handler](#the-exception-handler)
    - [Reporting Exceptions](#reporting-exceptions)
    - [Rendering Exceptions](#rendering-exceptions)
    - [Reportable & Renderable Exceptions](#renderable-exceptions)
- [HTTP Exceptions](#http-exceptions)
  - [Custom HTTP Error Pages](#custom-http-error-pages)

<a name="introduction"></a>

## Introduction

Error handling is very different in Golang than in other languages. With Golang the following applies: The more time you
spend on errors, the faster bugs can be found. It therefore deserves its own chapter.

## The Concept

In other languages you throw an error (or exception). If the caller wants to do something based on that error, then you
have to catch the error. This is very different with Golang. The idea is that the caller is made responsible for what to
do with the error. That's because code causing the error usually doesn't know what to do with that error.

### The Possibilities

There are 2 ways to deal with errors. You can panic or return the error from the method.

#### Return Errors

The most common method is to return the error from the method:

    var NoUserFound = errors.New("no user found")

    func GetUser() (model.User, error) {
        //
    
        if (user == nil) {
            return users.NewUnregistredUser(), NoUserFound
        }
        
        return user, nil
    }

The following example shows how the caller can handle the error.

    user, err := GetUser()
    if err == NoUserFound {
        //
    }

If you want to use the default user when the error occurs, you could ignore the error by an underscore:

    user, _ := GetUser()

By applying multiple layers, you can add more information to the error. You can use the `Wrap`method to suffix a
message.

    err.Wrap("validation error")
    // validation error: no user found

To receive the original error (after `Wrap`), you can use` Cause`:

    err.Cause().Error()
    // no user found

#### Panic

Heb je sitaties waarbij het heel onwaarschijnlijk is dat de caller er iets mee kan. Dan zou je ervoor kunnen kiezen
om `panic` te gebruiken:

    func GetUser() (model.User) {
        con, err := db.Connection()
        if (err != nil) {
            panic(err)
        }
        
        //
    }

Lanvard zorgt automatisch dat de juiste http response wordt gegenereerd.

> {tip} Het gebruik van panic zal jou veel tijd schelen. Echter, als je een rubuste applicatie wil bouwen, gebruik `panic` dan alleen voor 'critical' en onverwachte errors.

### The Possibilities

Zoals je hierboven kan zien, kan de error nog bewerkt worden met meer informatie. Daarom is het een convention om geen
hoofdletter te gebruiken aan het begin van een error. Ook een punt aan het einde van de zin kan ervoor zorgen dat de zin
langer gemaakt kan worden. De errors worden uiteindelijk automatisch voorzien van een hoofdletter aan het begin van de
zin.

## Packages

Er zijn verschillende packages om een error struct te genereren. Golang komt zelf met 2 packages. Daarnaast biedt
Lanvard een package voor extra opties. Voel je vrij om er zelf een te maken die past bij jouw domein. Alle errors moeten
aan de `error` interface voldoen.

### Classic errors

De classic error wordt importeren met `"errors"`. Deze package bevat niet veel debug informatie. Gebruik het vooral als
je geen debug informatie nodig hebt.

### Pkg errors

Dit is een andere standaard package van Golang die je kan importeren met `"github.com/pkg/errors"`. Deze package bevat
stack traces en de mogelijkheid om meerdere errors samen te voegen.

### Lanvard errors

Lanvard errors kan je importeren met `"github.com/lanvard/support/errors"`. Een Lanvard error is een wrapper om een Pkg
error heen en biedt extra functionaliteiten om te loggen en om juiste response terug te geven.

### Custom

Het is in Golang heel gebruikelijk om zelf verschillende errors te maken om het perfect te laten passen in jouw
omgeving. Bekijk alle methods uit `"github.com/lanvard/support/errors"` om te zien welke methods je al kan invullen.

--- @todo add all methods from pkg errors

### Format

### Stack Trace

### Log Level

### Http Status

## Wrap/Cause

## Cause

## Is

## As

## As

## Log Errors

When you start a new Laravel project, error and exception handling is already configured for you.
The `App\Exceptions\Handler` class is where all exceptions triggered by your application are logged and then rendered
back to the user. We'll dive deeper into this class throughout this documentation.

<a name="configuration"></a>

## Configuration

The `debug` option in your `config/app.php` configuration file determines how much information about an error is
actually displayed to the user. By default, this option is set to respect the value of the `APP_DEBUG` environment
variable, which is stored in your `.env` file.

For local development, you should set the `APP_DEBUG` environment variable to `true`. In your production environment,
this value should always be `false`. If the value is set to `true` in production, you risk exposing sensitive
configuration values to your application's end users.

<a name="the-exception-handler"></a>

## The Exception Handler

<a name="reporting-exceptions"></a>

### Reporting Exceptions

All exceptions are handled by the `App\Exceptions\Handler` class. This class contains a `register` method where you may
register custom exception reporter and renderer callbacks. We'll examine each of these concepts in detail. Exception
reporting is used to log exceptions or send them to an external service like [Flare](https://flareapp.io)
, [Bugsnag](https://bugsnag.com) or [Sentry](https://github.com/getsentry/sentry-laravel). By default, exceptions will
be logged based on your [logging](/docs/{{version}}/logging) configuration. However, you are free to log exceptions
however you wish.

For example, if you need to report different types of exceptions in different ways, you may use the `reportable` method
to register a Closure that should be executed when an exception of a given type needs to be reported. Laravel will
deduce what type of exception the Closure reports by examining the type-hint of the Closure:

    use App\Exceptions\CustomException;

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (CustomException $e) {
            //
        });
    }

When you register a custom exception reporting callback using the `reportable` method, Laravel will still log the
exception using the default logging configuration for the application. If you wish to stop the propagation of the
exception to the default logging stack, you may use the `stop` method when defining your reporting callback:

    $this->reportable(function (CustomException $e) {
        //
    })->stop();

> {tip} To customize the exception reporting for a given exception, you may also consider using [reportable exceptions](/docs/{{version}}/errors#renderable-exceptions)

#### Global Log Context

If available, Laravel automatically adds the current user's ID to every exception's log message as contextual data. You
may define your own global contextual data by overriding the `context` method of your
application's `App\Exceptions\Handler` class. This information will be included in every exception's log message written
by your application:

    /**
     * Get the default context variables for logging.
     *
     * @return array
     */
    protected function context()
    {
        return array_merge(parent::context(), [
            'foo' => 'bar',
        ]);
    }

#### The `report` Helper

Sometimes you may need to report an exception but continue handling the current request. The `report` helper function
allows you to quickly report an exception using your exception handler without rendering an error page:

    public function isValid($value)
    {
        try {
            // Validate the value...
        } catch (Throwable $e) {
            report($e);

            return false;
        }
    }

#### Ignoring Exceptions By Type

The `$dontReport` property of the exception handler contains an array of exception types that will not be logged. For
example, exceptions resulting from 404 errors, as well as several other types of errors, are not written to your log
files. You may add other exception types to this array as needed:

    /**
     * A list of the exception types that should not be reported.
     *
     * @var array
     */
    protected $dontReport = [
        \Illuminate\Auth\AuthenticationException::class,
        \Illuminate\Auth\Access\AuthorizationException::class,
        \Symfony\Component\HttpKernel\Exception\HttpException::class,
        \Illuminate\Database\Eloquent\ModelNotFoundException::class,
        \Illuminate\Validation\ValidationException::class,
    ];

<a name="rendering-exceptions"></a>

### Rendering Exceptions

By default, the Laravel exception handler will convert exceptions into an HTTP response for you. However, you are free
to register a custom rendering Closure for exceptions of a given type. You may accomplish this via the `renderable`
method of your exception handler. Laravel will deduce what type of exception the Closure renders by examining the
type-hint of the Closure:

    use App\Exceptions\CustomException;

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->renderable(function (CustomException $e, $request) {
            return response()->view('errors.custom', [], 500);
        });
    }

<a name="renderable-exceptions"></a>

### Reportable & Renderable Exceptions

Instead of type-checking exceptions in the exception handler's `report` and `render` methods, you may define `report`
and `render` methods directly on your custom exception. When these methods exist, they will be called automatically by
the framework:

    <?php

    namespace App\Exceptions;

    use Exception;

    class RenderException extends Exception
    {
        /**
         * Report the exception.
         *
         * @return void
         */
        public function report()
        {
            //
        }

        /**
         * Render the exception into an HTTP response.
         *
         * @param  \Illuminate\Http\Request  $request
         * @return \Illuminate\Http\Response
         */
        public function render($request)
        {
            return response(...);
        }
    }

If your exception contains custom reporting logic that only occurs when certain conditions are met, you may need to
instruct Laravel to report the exception using the default exception handling configuration. To accomplish this, you may
return `false` from the exception's `report` method:

    /**
     * Report the exception.
     *
     * @return bool|void
     */
    public function report()
    {
        // Determine if the exception needs custom reporting...

        return false;
    }

> {tip} You may type-hint any required dependencies of the `report` method and they will automatically be injected into the method by Laravel's [service container](/docs/{{version}}/container).

<a name="http-exceptions"></a>

## HTTP Exceptions

Some exceptions describe HTTP error codes from the server. For example, this may be a "page not found" error (404), an "
unauthorized error" (401) or even a developer generated 500 error. In order to generate such a response from anywhere in
your application, you may use the `abort` helper:

    abort(404);

<a name="custom-http-error-pages"></a>

### Custom HTTP Error Pages

Laravel makes it easy to display custom error pages for various HTTP status codes. For example, if you wish to customize
the error page for 404 HTTP status codes, create a `resources/views/errors/404.blade.php`. This file will be served on
all 404 errors generated by your application. The views within this directory should be named to match the HTTP status
code they correspond to. The `HttpException` instance raised by the `abort` function will be passed to the view as
an `$exception` variable:

    <h2>{{ $exception->getMessage() }}</h2>

You may publish Laravel's error page templates using the `vendor:publish` Artisan command. Once the templates have been
published, you may customize them to your liking:

    php artisan vendor:publish --tag=laravel-errors