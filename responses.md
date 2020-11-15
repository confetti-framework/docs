# HTTP Responses

- [Creating Responses](#creating-responses)
  - [Strings & Slices](#strings--slices)
  - [Response Objects](#response-objects)
  - [Attaching Headers To Responses](#attaching-headers-to-responses)
  - [Attaching Cookies To Responses](#attaching-cookies-to-responses)
- [Redirects](#redirects)
  - [Redirecting To External Domains](#redirecting-to-external-domains)
  - [Redirecting To Named Routes](#redirecting-to-named-routes)
  - [Redirecting To Controller Actions](#redirecting-to-controller-actions)
- [Other Response Types](#other-response-types)
  - [JSON Responses](#json-responses)
  - [View Responses](#view-responses)
  - [File Downloads](#file-downloads)
  - [Streamed Downloads](#streamed-downloads)
  - [Show In Browser](#show-in-browser)

## Creating Responses

### Strings & Slices

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

### Response Objects

Functions `outcome.Html`, `outcome.Jsone` and `outcome.Content` return an object with interface `inter.Response`. That
allows you to customize the response's HTTP status code and headers:

	Get("home", func(_ inter.Request) inter.Response {
		return outcome.Html("Hello World").
			Status(200).
			Headers(http.Header{"Content-Type": {"text/plain"}})
	}),

`outcome.Html` and `outcome.Json` will add a Content-Type header. Use `outcome.Content` to add `Content-Type` header
yourself.

### Attaching Headers To Responses

Keep in mind that most response methods are chainable, allowing for the fluent construction of response instances. For
example, you may use the `Header` method to add a series of headers to the response before sending it back to the user:

    return outcome.Content("# Cool Stuff").
		Header("Content-Type", "text/markdown", "charset=UTF-8").
		Header("X-Header-One", "Header Value")

Or, you may use the `Headers` method to specify a slice of headers to be added to the response:

    return outcome.Content("# Cool Stuff").
		Headers(http.Header{
            "Content-Type": {"application/markdown", "charset=UTF-8"},
            "X-Header-One": {"Header Value"},
        })

### Attaching Cookies To Responses

The `Cookie` method on response instances allows you to easily attach cookies to the response. For example, you may use
the `Cookie` method to generate a cookie and fluently attach it to the response instance like so:

    return outcome.Html("Hello World").
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

Function `Download` may be used to generate a response that forces the user's browser to download the file at the given
path. The response of the `Download` method accepts the method `Filename`, which will determine the file name that is
seen by the user downloading the file. `Content-Type` with MIME type is automatically filled in based on the file
extension.

    return outcome.Download(filePath)

    return outcome.Download(filePath).Filename("label.pdf")

The file may not be found. Instead of a panic, `DownloadE` allows you to choose to handle your errors with more love.

    response, err := outcome.DownloadE(filePath)
    if err != nil {
        return err.Level(log_level.NOTICE)
    }

> {note} The file being downloaded need to have an ASCII file name.

### Streamed Downloads

Sometimes you may wish to turn the string response of a given operation into a downloadable response without having to
write the contents of the operation to disk. You may use the `Content` function in this scenario:

    return outcome.Content("%PDF-1.5").
		Header("Content-Type", "application/pdf").
        FileName("readme.md")

### Show In Browser

Function `ShowInBrowser` may be used to display a file, such as an image or PDF, directly in the user's browser instead
of initiating a download:

    return outcome.Content("%PDF-1.5").
        Header("Content-Type", "application/pdf").
        ShowInBrowser()