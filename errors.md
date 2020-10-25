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

Error handling is very different in Go than in other languages. With Go the following applies: The more time you spend
on errors, the faster bugs can be found. It therefore deserves its own chapter.

## Panic And Return Errors

In other languages you throw an error (or exception). If the caller wants to do something based on that error, then you
have to catch the error. This is very different with Go. The idea is that the caller is made responsible for what to do
with the error. The error is passed on until you can do something with it. If you want to stop the process and just fire
the error, you can use `panic`.

### Return Errors

The most common way is to return the error from the function:

    import "github.com/lanvard/errors"

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

#### Ignore Errors

If you want to use the default user when the error occurs, you could ignore the error by an underscore:

    user, _ := GetUser()

#### Wrap

By applying multiple layers, you can add more information to the error. You can use the `Wrap` method to suffix a
message.

    user, err := GetUser()
    err.Wrap("validation error")
    // validation error: no user found

#### Cause

To receive the original error (after `Wrap`), you can use` Cause`:

    err := errors.New("no user found").Wrap("validation error")
    err.Cause().Error()
    // no user found

#### Apply Stack Trace

If you have a standard error, it does not contain a stack trace. Use function `WithStack` or` Wrap` To put the trace on
it:

    con, err := db.Connection()
    errors.Wrap(err, "asdf")
    errors.WithStack(err)

#### Log Level

The default log level is `Emergency`. To determine the log level you can use the `Level` method:

    errros.New("username not found").Level(level.INFO)

#### Custom

Do you want to add extra data to an error/exception? In other languages you would extend a class with an extra field. Go
has a SOLID solution for this: Each error can be wrapped in multiple structs. To add data to an error you just have to
create a struct yourself (which then also contains the original error). See `"github.com/lanvard/support/errors` to get
some inspiration.

### Panic

In case of a server error where the request cannot proceed, you could choose to use `panic`:

    func GetUser() (model.User) {
        con, err := db.Connection()
        if (err != nil) {
            panic(err)
        }
        
        //
    }

Lanvard automatically ensures that the correct http response is generated.

> {tip} Using panic can save you a lot of time. However, if you want to build a robust application, use `panic` only for critical or unexpected errors.

### Message Convention

As you can see above, you can supplement the error with more information. Therefore, it is a convention to use a
lowercase letter at the beginning of an error. Also, a dot at the end of the sentence can cause that the sentence can't
be made longer. The errors are eventually automatically capitalized at the beginning of the sense.

### Http Status

## Is

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