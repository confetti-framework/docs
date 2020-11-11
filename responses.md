# HTTP Responses

- [Creating Responses](#creating-responses)
    - [Attaching Headers To Responses](#attaching-headers-to-responses)
    - [Attaching Cookies To Responses](#attaching-cookies-to-responses)
    - [Cookies & Encryption](#cookies-and-encryption)
- [Redirects](#redirects)
    - [Redirecting To Named Routes](#redirecting-named-routes)
    - [Redirecting To Controller Actions](#redirecting-controller-actions)
    - [Redirecting To External Domains](#redirecting-external-domains)
    - [Redirecting With Flashed Session Data](#redirecting-with-flashed-session-data)
- [Other Response Types](#other-response-types)
    - [View Responses](#view-responses)
    - [JSON Responses](#json-responses)
    - [File Downloads](#file-downloads)
    - [File Responses](#file-responses)
- [Response Macros](#response-macros)

## Creating Responses

#### Strings & Slices

All routes and controllers should return a response to be sent back to the user's browser. Lanvard provides several
different ways to return responses. The most basic response is returning a string from a route or controller with
function `outcome.Html`. The framework will automatically convert the string into a full HTTP response:

	Get("/", func(_ inter.Request) inter.Response {
		return outcome.Html("Hello World")
	}),

In addition to returning strings from your routes and controllers, you may also return slices with
function `outcome.Json`. The framework will automatically convert the slice into a JSON response:

	Get("/", func(_ inter.Request) inter.Response {
		return outcome.Json([]int{1,2,3})
	}),

> {tip} Did you know you can also return `[support.Collection](/docs/{{version}}/collections)` and `[support.Map](/docs/{{version}}/collections)` from your routes or controllers? They will automatically be converted to JSON. Give it a shot!

#### Response Objects

Functions `outcome.Html`, `outcome.Jsone` and `outcome.Content` return an object with interface `inter.Response`. That
allows you to customize the response's HTTP status code and headers:

	Get("home", func(_ inter.Request) inter.Response {
		return outcome.Html("Hello World").
			Status(200).
			Headers(http.Header{"Content-Type": {"text/plain"}})
	}),

`outcome.Html` and `outcome.Json` will add a Content-Type header. Use `outcome.Content` to add `Content-Type` header
yourself.

#### Attaching Headers To Responses

Keep in mind that most response methods are chainable, allowing for the fluent construction of response instances. For
example, you may use the `Header` method to add a series of headers to the response before sending it back to the user:

    return outcome.Content("%PDF-1.5").
		Header("Content-Type", "application/pdf").
		Header("Content-Type", "charset=UTF-8").
		Header("X-Header-One", "Header Value")

Or, you may use the `Headers` method to specify an slice of headers to be added to the response:

    return outcome.Content("%PDF-1.5").
		Headers(http.Header{
            "Content-Type": {"application/pdf", "charset=UTF-8"},
            "X-Header-One": {"Header Value"},
        })

#### Attaching Cookies To Responses

The `Cookie` method on response instances allows you to easily attach cookies to the response. For example, you may use
the `Cookie` method to generate a cookie and fluently attach it to the response instance like so:

    return outcome.Content("%PDF-1.5").
		Header("Content-Type", "application/pdf").
		Cookie(http.Cookie{Name: "flow_id", Value: "aGdsf89hA3jr2"})

## Redirects

Redirect responses are instances of the `outcome.redirectResponse` struct, and contain the proper headers needed to
redirect the user to another URL. There are several ways to generate a `outcome.redirectResponse` instance. The simplest
method is to use the `outcome.RedirectPermanent` or the `outcome.RedirectTemporary` function:

    Get("dashboard", func(_ inter.Request) inter.Response {
        return outcome.RedirectPermanent("home/dashboard")
    }),

    Get("login", func(_ inter.Request) inter.Response {
        return outcome.RedirectTemporary("under_construction")
    }),   

Or you can use `outcome.Redirect` to determine the HTTP status yourself.

    outcome.Redirect("home/dashboard", net.StatusPermanentRedirect)

### Redirecting To External Domains

Sometimes you may need to redirect to a domain outside of your application. Even then you can use the above methods:

    return outcome.RedirectTemporary("https://laravel.com")

### Redirecting To Named Routes

When you call the `outcome.RedirectToRoute` function with the route name, the user will be redirected to that route.

    return outcome.RedirectToRoute(request.App(), "login")

If your route has parameters, you may pass them as an extra argument to the method:

    // For a route with the following URI: profile/{id}

    return outcome.RedirectToRoute(request.App(), "profile", outcome.Parameters{"id": 12})

### Redirecting To Controller Actions

You may also generate redirects the request to [~~controller actions~~](/docs/{{version}}/controllers). To do so, simply
call the controller:

    return controller.Homepage(request)

## Other Response Types

The `outcome` package may be used to generate other types of response instances. The `outcome` package provides several
helpful function for generating responses.

### JSON Responses

The `outcome.Json` method will automatically set the `Content-Type` header to `application/json`, as well as convert the
given object to JSON using `json.Marshal`:

	return outcome.Json(map[string]string{
		"name": "abigail",
		"state": "CA",
	})

### View Responses

If you need control over the response's status and headers but also need to return a [view](/docs/{{version}}/views) as
the response's content, you can use the `outcome.Html` method with a created view:

    return outcome.Html(views.Homepage("James")).Status(200)

### File Downloads

The `download` method may be used to generate a response that forces the user's browser to download the file at the
given path. The `download` method accepts a file name as the second argument to the method, which will determine the
file name that is seen by the user downloading the file. Finally, you may pass an array of HTTP headers as the third
argument to the method:

    return response()->download($pathToFile);

    return response()->download($pathToFile, $name, $headers);

    return response()->download($pathToFile)->deleteFileAfterSend();

> {note} Symfony HttpFoundation, which manages file downloads, requires the file being downloaded to have an ASCII file name.

#### Streamed Downloads

Sometimes you may wish to turn the string response of a given operation into a downloadable response without having to
write the contents of the operation to disk. You may use the `streamDownload` method in this scenario. This method
accepts a callback, file name, and an optional array of headers as its arguments:

    return response()->streamDownload(function () {
        echo GitHub::api('repo')
                    ->contents()
                    ->readme('laravel', 'laravel')['contents'];
    }, 'laravel-readme.md');

### File Responses

The `file` method may be used to display a file, such as an image or PDF, directly in the user's browser instead of
initiating a download. This method accepts the path to the file as its first argument and an array of headers as its
second argument:

    return response()->file($pathToFile);

    return response()->file($pathToFile, $headers);

## Response Macros

If you would like to define a custom response that you can re-use in a variety of your routes and controllers, you may
use the `macro` method on the `Response` facade. For example, from
a [service provider's](/docs/{{version}}/providers) `boot` method:

    <?php

    namespace App\Providers;

    use Illuminate\Support\Facades\Response;
    use Illuminate\Support\ServiceProvider;

    class ResponseMacroServiceProvider extends ServiceProvider
    {
        /**
         * Register the application's response macros.
         *
         * @return void
         */
        public function boot()
        {
            Response::macro('caps', function ($value) {
                return Response::make(strtoupper($value));
            });
        }
    }

The `macro` function accepts a name as its first argument, and a Closure as its second. The macro's Closure will be
executed when calling the macro name from a `ResponseFactory` implementation or the `response` helper:

    return response()->caps('foo');