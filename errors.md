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

Do you want to add extra data to an error? In other languages you would extend a class. Go has a SOLID solution for
this: Each error can be wrapped in multiple structs. To add data to an error you just have to create a wrapper
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
      return w.cause.Error() + " with code " + w.code
    }
    
    func (w *withCode) Unwrap() error {
        return w.cause
    }
    
    func (w *withCode) Code() string {
        return w.code
    }

Then the error can build up like this:

    WithCode(errros.New("username not found"), "external_error")

In the above, we have placed 'code' behind the message. But if you want to adjust the response, you can determine this
in `ResponseServiceProvider`.

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

<a name="configuration"></a>

## Configuration

## Defining Errors

For the sake of simplicity, you have seen examples where we place the errors above the functions. It would be better to
have an overview of all errors that can occur in the system. You can define your errors in `app/report/errors.go`:

    var UserNotFound = errors.New("user not found").Status(net.StatusBadRequest
    var Unauthorized = UserError.Status(net.StatusUnauthorized)

### Global Log Context

If you want to add information to all errors, you can append that in `app/report/errors.go`. In the following example
you can see that we apply `Status` and log `Level` globally:

    var UserError = errors.New("").Status(net.StatusBadRequest).Level(log_level.INFO)
    var Unauthorized = UserError.Status(net.StatusUnauthorized)
    var SessionInvalid = Unauthorized.Wrap("session is not valid")
    var SessionExpired = Unauthorized.Wrap("session expired")

### Information Provision

The `Debug` option in your `config/app.go` configuration file determines how much information about an error is actually
displayed to the user. By default, this option is set to respect the value of the `APP_DEBUG` environment variable,
which is stored in your `.env` file.

For local development, you should set the `APP_DEBUG` environment variable to `true`. In your production environment,
this value should always be `false`. If the value is set to `true` in production, you risk exposing sensitive
configuration values to your application's end users.

### Ignoring Errors By Type

The `NoLogging` field in `config/errors.go` contains a slice of errors that will not be logged. For example, errors
resulting from 404 errors, as well as several other types of errors, are not written to your log files. You may add
other error types to this array as needed:

	NoLogging: []error{
		report.ValidationError,
		report.NotFoundError,
	},

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