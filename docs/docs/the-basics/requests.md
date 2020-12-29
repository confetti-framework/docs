# Requests

## Accessing The Request

In the parameter from a controller you get a `inter.Request` instance. From the request you can view all information
that has been sent to you. Think for example of cookies, headers, body and query parameters.

``` go
package controller

import (
    "github.com/confetti-framework/contract/inter"
    "github.com/confetti-framework/routing/outcome"
)

var User = struct {
    Store inter.Controller
}{
    Store: func(request inter.Request) inter.Response {
        name := request.Value("name").String()

        return outcome.Html("Username:" + name)
    },
}
```

More information about receiving a parameter, see: [Route Parameters](route-parameters)

### Accessing The Request Via Route Closures

You can also receive the `request` interface on a route Closure. Confetti inject the incoming request into the Closure
when it is executed:

``` go
Get("/", func(request inter.Request) inter.Response {
    //
})
```

### Original Request

If you need to use `net.Request` for a library, or you want information that is only available in the original Golang
request. Then you can retrieve it by the `Source` method:

``` go
request.Source().URL.Scheme
```

### Request Path & Method

The `inter.Request` instance provides a variety of methods for examining the HTTP request for your application. We will
discuss a few of the most important methods below.

#### Retrieving The Request Path

The `Path` method returns the request's path information. So, if the incoming request is targeted
at `http://domain.com/foo/bar`, the `Path` method will return `foo/bar`:

``` go
path := request.Path()
```

#### Retrieving The Request URL

To retrieve the full URL for the incoming request you may use the `Url` or `FullUrl` methods. The `Url` method will
return the URL without the query string, while the `FullUrl` method includes the query string:

##### Without Query String:
``` go
url := request.Url()
```

##### With Query String:
``` go
url := request.FullUrl()
```

#### Retrieving The Request Method

The `Method` method will return the HTTP verb for the request. You may use the `IsMethod` helper method to verify that
the HTTP verb matches a given string:

``` go
method := request.Method()

if request_helper.IsMethod(request, method.Post) {
    //
}
```

## Retrieving Input Value

#### Retrieving An Input Value

Using a few simple methods, you may access all of the user input from your `http.request` instance without worrying
about which HTTP verb was used for the request. Regardless of the HTTP verb, the `Content` method may be used to
retrieve user input:

``` go
name := request.Content("name").String()
```

You may pass a default value as the second argument to the `ContentOr` method. This value will be returned if the
requested input value is not present on the request:

``` go
name := request.ContentOr("name", "Sally").String()
```

When working with forms that contain array inputs, use "dot" notation to access the arrays:

``` go
name := request.Content("names.1").String()
name, err := request.Content("names.1").StringE()

names := request.Content("names.*").Collection()
```

You may call the `Content` method with an empty string in order to retrieve all of the input values as support.Map:

``` go
requestValues = request.Content("").Map()
```

#### Retrieving JSON Input Values

When sending JSON requests to your application, you may access the JSON data via the `Body` method as long as
the `Content-Type` header of the request is properly set to `application/json`. You may even use "dot" syntax to dig
into JSON arrays:

``` go
name := request.Body("data.address.street").String()
```

#### Retrieving Raw Content Data

To receive the data as it was sent, use the `Content` method. In that case you will always receive a string

``` go
rawContent := request.GetBody()
```

#### Retrieving Input From The Query String

While the `Value` method retrieves values from entire request payload (including the query string), the `Parameter`
method will only retrieve values from the query string:

``` go
name := request.Parameter("name")
```

If the requested query string value data is not present, the second argument to this method will be returned:

``` go
name := request.ParameterOr("name", "Sally").String()
```

You may call the `Parameter` method with an empty string in order to retrieve all of the query string values as
support.Map:

``` go
parameters := request.Parameter("").Map()
```

#### Retrieving Boolean Input Values

When dealing with HTML elements like checkboxes, your application may receive "truthy" values that are actually strings.
For example, "true" or "on". For convenience, you may use the `Bool` method to retrieve these values as booleans.
The `Bool` method returns `true` for 1, "1", true, "true", "on", and "yes". All other values will return `false`:

``` go
archived := request.Body("archived").Bool()
archived, err := request.Body("archived").BoolE()
```

#### Retrieving A Portion Of The Input Data

If you need to retrieve a subset of the input data, you may use the `Only` and `Except` methods. Both of these methods
accept dynamic list of arguments:

``` go
request.Body("data.user").Map().Only("username", "password")
request.Body("data.user").Map().Except("username", "password")
```

> The `only` method returns all of the key / value pairs that you request; however, it will not return key / value pairs that are not present on the request.

#### Determining If An Input Value Is Present

You should use the `Has` method to determine if a value is present on the request. The `Has` method returns `true` if
the value is present on the request:

``` go
body := request.Body("data.user").Map()
if body.Has("name") {
    //
}
```

When given multiple strings, the `Has` method will determine if all of the specified values are present:

``` go
body := request.Body("data.user").Map()
if body.Has("name", "email") {
    //
}
```

The `HasAny` method returns `true` if any of the specified values are present:

``` go
body := request.Body("data.user").Map()
if body.HasAny("name", "email") {
    //
}
```

To determine if a given key is absent from the request, you may use the `Missing` method:

``` go
body := request.Body("data.user").Map()
if body.Missing("name") {
    //
}
```

If you would like to determine if a value is present on the request and is not empty, you may use the `Filled` method:

``` go
body := request.Body("data.user").Map()
if body.Filled("name") {
    //
}
```

> If you have a slice with multiple keys, you can use the spread operator: `.Has(keys...)`

### Cookies

#### Retrieving Cookies From Requests

To retrieve a cookie value from the request, use the `Cookie` method on a `inter.Request` instance:

``` go
latestPage := request.Cookie("latest_page")
latestPage, err := request.CookieE("latest_page")
```

If you are looking for how to set a cookie, you can read [Attaching Cookies To Responses](responses.html#attaching-cookies-to-responses)

> If you want to receive all original cookies, you can get the cookies from source by `request.Source().Cookies()`

## Files

### Retrieving Uploaded Files

You may access uploaded files from a `inter.Request` instance using the `File` method. The `File` method returns an
instance of the `support.File`, which holds the Go `multipart.File` interface and provides a variety of methods for
interacting with the file:

``` go
file := request.File("photo")
file, err := request.FileE("photo")
```

Or you can use the `Files` method to retrieve multiple files:

``` go
files := request.Files("photos")
files, err := request.FilesE("photos")
```

You may determine if a file is present on the request:

``` go
if file, err := request.FileE("photo"); err == nil {
    //
}
```

#### File Paths & Extensions

The `support.File` struct also contains methods for accessing the file's fully-qualified path and its extension.
The `Extension` method will attempt to guess the file's extension based on its contents. This extension may be different
from the extension that was supplied by the client:

``` go
name := request.File("photo").Name()
// photo.jpg

extension := request.File("photo").Extension()
// .jpg
```
