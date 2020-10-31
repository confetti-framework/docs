# Error Handling

- [Introduction](#introduction)
- [Configuration](#configuration)
- [The Exception Handler](#the-error-handler)
  - [Reporting Errors](#reporting-errors)
  - [Rendering Errors](#rendering-errors)
  - [Reportable & Renderable Errors](#renderable-errors)
- [HTTP Errors](#http-errors)
  - [Custom HTTP Error Pages](#custom-http-error-pages)

<a name="introduction"></a>

## Introduction

Error handling is very different in Go than in other languages. With Go the following applies: The more time you spend
on errors, the faster bugs can be found. It therefore deserves its own chapter.

## Panic And Return Errors

In other languages you throw an error (or error). If the caller wants to do something based on that error, then you have
to catch the error. This is very different with Go. The idea is that the caller is made responsible for what to do with
the error. The error is passed on until you can do something with it. If you want to stop the process and just fire the
error, you can use `panic`.

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

#### Unwrap

To receive the original error (after `Wrap`), you can use `Unwrap`:

    err := errors.New("no user found").Wrap("validation error")
    err.Unwrap().Error()
    // no user found

#### Apply Stack Trace

If you have a standard error, it does not contain a stack trace. Use function `WithStack` or` Wrap` To put the trace on
it:

    con, err := db.Connection()
    errors.Wrap(err, "asdf")
    errors.WithStack(err)

#### Log Level

The default log level is `Emergency`. To determine the log level you can use the `Level` method:

    errros.New("username not found").Level(log_level.INFO)

#### HTTP Status

The default HTTP status is `500 Internal Server Error`. To determine the response status you can use the `Status`
method:

    err := errros.New("username not found").Status(http.StatusNotFound)
    return outcome.Html(err)

#### Custom

Do you want to add extra data to an error/error? In other languages you would extend a class. Go has a SOLID solution
for this: Each error can be wrapped in multiple structs. To add data to an error you just have to create a struct
yourself (which then also contains the original error). If you want to add an error code to your error, you can make te
following:

    func WithCode(err error, code string) *withCode {
        if err == nil {
            return nil
        }
        return &withCode{
            err,
            code,
        }
    }
    
    type withCode struct {
      cause error
      code string
    }
    
    func (w *withCode) Error() string {
      return w.cause.Error()
    }
    
    func (w *withCode) Unwrap() error {
        return w.cause
    }
    
    func (w *withCode) Code() string {
        return w.code
    }

Then the error can build up like this:

    WithCode(errros.New("username not found"), "external_error")

Nou you can add a response decorator to ResponseServiceProvider to convert an error to the response.

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

## Helpers

### Is

An error can be made up of several layers with structs. If you want to know if a certain struct is present, you can use
the `Is` helper. In the running example, `validateUser()` returns a `validationError` error:

    var noUserFound = New("no user found")
    var validationError = Wrap(noUserFound, "validation error")

    err := validateUser()
    if errors.Is(err, noUserFound) {
        // validationError contains noUserFound error
    }

### As

If you want to retrieve a specific struct, you can use the `As` helper. Before calling `As`, you have to define what
needs to be searched and filled (which may be a struct or an interface).

    func FindCode(err error) (string, bool) {
        var code string
        var codeHolder *withCode
    
        if !As(err, &codeHolder) {
            return "unkown code", false
        }
    
        return codeHolder.code, true
    }

If you call As, a bool is returned on which you can check whether it was successful.





__________

When you start a new Lanvard project, error and error handling is already configured for you. The `App\Errors\Handler`
class is where all errors triggered by your application are logged and then rendered back to the user. We'll dive deeper
into this class throughout this documentation.

<a name="configuration"></a>

## Configuration

The `Debug` option in your `config/app.go` configuration file determines how much information about an error is actually
displayed to the user. By default, this option is set to respect the value of the `APP_DEBUG` environment variable,
which is stored in your `.env` file.

For local development, you should set the `APP_DEBUG` environment variable to `true`. In your production environment,
this value should always be `false`. If the value is set to `true` in production, you risk exposing sensitive
configuration values to your application's end users.

<a name="the-error-handler"></a>

## The Exception Handler

<a name="reporting-errors"></a>

### Reporting Errors

All errors are handled by the `App\Errors\Handler` class. This class contains a `register` method where you may register
custom error reporter and renderer callbacks. We'll examine each of these concepts in detail. Exception reporting is
used to log errors or send them to an external service like [Flare](https://flareapp.io)
, [Bugsnag](https://bugsnag.com) or [Sentry](https://github.com/getsentry/sentry-laravel). By default, errors will be
logged based on your [logging](/docs/{{version}}/logging) configuration. However, you are free to log errors however you
wish.

For example, if you need to report different types of errors in different ways, you may use the `reportable` method to
register a Closure that should be executed when an error of a given type needs to be reported. Lanvard will deduce what
type of error the Closure reports by examining the type-hint of the Closure:

    use App\Errors\CustomException;

    /**
     * Register the error handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (CustomException $e) {
            //
        });
    }

When you register a custom error reporting callback using the `reportable` method, Lanvard will still log the error
using the default logging configuration for the application. If you wish to stop the propagation of the error to the
default logging stack, you may use the `stop` method when defining your reporting callback:

    $this->reportable(function (CustomException $e) {
        //
    })->stop();

> {tip} To customize the error reporting for a given error, you may also consider using [reportable errors](/docs/{{version}}/errors#renderable-errors)

#### Global Log Context

If available, Lanvard automatically adds the current user's ID to every error's log message as contextual data. You may
define your own global contextual data by overriding the `context` method of your application's `App\Errors\Handler`
class. This information will be included in every error's log message written by your application:

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

Sometimes you may need to report an error but continue handling the current request. The `report` helper function allows
you to quickly report an error using your error handler without rendering an error page:

    public function isValid($value)
    {
        try {
            // Validate the value...
        } catch (Throwable $e) {
            report($e);

            return false;
        }
    }

#### Ignoring Errors By Type

The `$dontReport` property of the error handler contains a slice of errors types that will not be logged. For example,
errors resulting from 404 errors, as well as several other types of errors, are not written to your log files. You may
add other error types to this array as needed:

    /**
     * A list of the error types that should not be logged.
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

<a name="rendering-errors"></a>

### Rendering Errors

By default, the Lanvard error handler will convert errors into an HTTP response for you. However, you are free to
register a custom rendering Closure for errors of a given type. You may accomplish this via the `renderable`
method of your error handler. Lanvard will deduce what type of error the Closure renders by examining the type-hint of
the Closure:

    use App\Errors\CustomException;

    /**
     * Register the error handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->renderable(function (CustomException $e, $request) {
            return response()->view('errors.custom', [], 500);
        });
    }

<a name="renderable-errors"></a>

### Reportable & Renderable Errors

Instead of type-checking errors in the error handler's `report` and `render` methods, you may define `report`
and `render` methods directly on your custom error. When these methods exist, they will be called automatically by the
framework:

    <?php

    namespace App\Errors;

    use Exception;

    class RenderException extends Exception
    {
        /**
         * Report the error.
         *
         * @return void
         */
        public function report()
        {
            //
        }

        /**
         * Render the error into an HTTP response.
         *
         * @param  \Illuminate\Http\Request  $request
         * @return \Illuminate\Http\Response
         */
        public function render($request)
        {
            return response(...);
        }
    }

If your error contains custom reporting logic that only occurs when certain conditions are met, you may need to instruct
Lanvard to report the error using the default error handling configuration. To accomplish this, you may return `false`
from the error's `report` method:

    /**
     * Report the error.
     *
     * @return bool|void
     */
    public function report()
    {
        // Determine if the error needs custom reporting...

        return false;
    }

> {tip} You may type-hint any required dependencies of the `report` method and they will automatically be injected into the method by Lanvard's [service container](/docs/{{version}}/container).

<a name="http-errors"></a>

## HTTP Errors

Some errors describe HTTP error codes from the server. For example, this may be a "page not found" error (404), an "
unauthorized error" (401) or even a developer generated 500 error. In order to generate such a response from anywhere in
your application, you may use the `abort` helper:

    abort(404);

<a name="custom-http-error-pages"></a>

### Custom HTTP Error Pages

Lanvard makes it easy to display custom error pages. In `ResponseServiceProvider` you can define your own template. The
following variables can be used when creating a custom template:

    {{- /*gotype: github.com/lanvard/foundation/encoder.ErrorView*/ -}}
    <html lang="{{.Locale}}">
    <h1>{{.AppName}}</h1>
    <h2>{{.Status}} | {{.Message}}</h2>
    <p>{{.StackTrace}}</p>

If you want to have full control over how you convert errors to html, replace the `encoder.ErrorToHtml`
in `ResponseServiceProvider` with your own encoder.