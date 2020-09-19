# HTTP Requests

- [Accessing The Request](#accessing-the-request)
    - [net http.Request](#default-net-httprequest)
    - [Request Path & Method](#request-path-and-method)
- [Input Trimming & Normalization](#input-trimming-and-normalization)
- [Retrieving Input Values](#retrieving-input-values)
    - [Old Input](#old-input)
    - [Cookies](#cookies)
- [Files](#files)
    - [Retrieving Uploaded Files](#retrieving-uploaded-files)
    - [Storing Uploaded Files](#storing-uploaded-files)
- [Configuring Trusted Proxies](#configuring-trusted-proxies)

<a name="accessing-the-request"></a>
## Accessing The Request

In the parameter from a controller you get a `inter.Request` instance. From the request you can view all information that has been sent to you. Think for example of ~~cookies~~, headers, body and query parameters.

    package controller
    
    import (
    	"github.com/lanvard/contract/inter"
    	"github.com/lanvard/routing/outcome"
    )
    
    var User = struct {
    	Store inter.Controller
    }{
    	Store: func(request inter.Request) inter.Response {
    		name := request.Value("name").String()
    
    		return outcome.Html("Username:" + name)
    	},
    }
    
More information about receiving a parameter, see: [Route Parameters](/docs/{{version}}/route-parameters)

#### Accessing The Request Via Route Closures

You can also receive the `request` interface on a route Closure. Lanvard inject the incoming request into the Closure when it is executed:

	Get("/", func(request inter.Request) inter.Response {
		//
	})

### net http.Request
If you need to use net http.request for a library, or you want information that is only available in the original Golang request. Then you can retrieve it by the `Source` method:

    request.Source().URL.Scheme

<a name="request-path-and-method"></a>
### Request Path & Method

The `inter.Request` instance provides a variety of methods for examining the HTTP request for your application. We will discuss a few of the most important methods below.

#### Retrieving The Request Path

The `Path` method returns the request's path information. So, if the incoming request is targeted at `http://domain.com/foo/bar`, the `Path` method will return `foo/bar`:

    path := request.Path()

#### Retrieving The Request URL

To retrieve the full URL for the incoming request you may use the `Url` or `FullUrl` methods. The `Url` method will return the URL without the query string, while the `FullUrl` method includes the query string:

    // Without Query String...
    url := request.Url()

    // With Query String...
    url := request.FullUrl()

#### Retrieving The Request Method

The `Method` method will return the HTTP verb for the request. You may use the `IsMethod` helper method to verify that the HTTP verb matches a given string:

    method := request.Method()

    if request_helper.IsMethod(request, method.Post) {
        //
    }

<a name="input-trimming-and-normalization"></a>
## Input Trimming & Normalization

This hasn't been built yet, but feel free to help: https://github.com/lanvard/lanvard/issues/65

<a name="retrieving-input-values"></a>
## Retrieving Input Value

#### Retrieving An Input Value

Using a few simple methods, you may access all of the user input from your `http.request` instance without worrying about which HTTP verb was used for the request. Regardless of the HTTP verb, the `Input` method may be used to retrieve user input:

    name := request.Body("name").String()

You may pass a default value as the second argument to the `BodyOr` method. This value will be returned if the requested input value is not present on the request:

    name := request.BodyOr("name", "Sally").String()

When working with forms that contain array inputs, use "dot" notation to access the arrays:

    name := request.Body("name.1").String()
    name, err := request.Body("name.1").StringE()
    
    names := request.Body("name.*").Collection()

You may call the `Body` method with an empty string in order to retrieve all of the input values as support.Map:

    requestValues = request.Body("").Map()

#### Retrieving JSON Input Values

When sending JSON requests to your application, you may access the JSON data via the `Body` method as long as the `Content-Type` header of the request is properly set to `application/json`. You may even use "dot" syntax to dig into JSON arrays:

    name := request.Body("data.address.street").String()
    
#### Retrieving Raw Content Data

To receive the data as it was sent, use the `Content` method. In that case you will always receive a string

    rawContent := request.Content()

#### Retrieving Input From The Query String

While the `Value` method retrieves values from entire request payload (including the query string), the `Parameter` method will only retrieve values from the query string:

    name := request.Parameter("name")

If the requested query string value data is not present, the second argument to this method will be returned:

    name := request.ParameterOr("name", "Sally").String()

You may call the `Parameter` method with an empty string in order to retrieve all of the query string values as support.Map:

    parameters := request.Parameter("").Map()

#### Retrieving Boolean Input Values

When dealing with HTML elements like checkboxes, your application may receive "truthy" values that are actually strings. For example, "true" or "on". For convenience, you may use the `Bool` method to retrieve these values as booleans. The `Bool` method returns `true` for 1, "1", true, "true", "on", and "yes". All other values will return `false`:

    archived := request.Body("archived").Bool()
    archived, err := request.Body("archived").BoolE()

#### Retrieving A Portion Of The Input Data

If you need to retrieve a subset of the input data, you may use the `Only` and `Except` methods. Both of these methods accept dynamic list of arguments:

    request.Body("data.user").Map().Only("username", "password")
    request.Body("data.user").Map().Except("username", "password")

> {tip} The `only` method returns all of the key / value pairs that you request; however, it will not return key / value pairs that are not present on the request.

#### Determining If An Input Value Is Present

You should use the `Has` method to determine if a value is present on the request. The `Has` method returns `true` if the value is present on the request:

    body := request.Body("").Map()
    if body.Has("name") {
        //
    }

When given multiple strings, the `Has` method will determine if all of the specified values are present:

    body := request.Body("").Map()
    if body.Has("name", "email") {
        //
    }

The `HasAny` method returns `true` if any of the specified values are present:

    body := request.Body("").Map()
    if body.HasAny("name", "email") {
        //
    }

To determine if a given key is absent from the request, you may use the `Missing` method:

    body := request.Body("").Map()
    if body.Missing("name") {
        //
    }

If you would like to determine if a value is present on the request and is not empty, you may use the `Filled` method:

    body := request.Body("").Map()
    if body.Filled("name") {
        //
    }

> {tip} If you have a slice with multiple keys, you can use the spread operator: `.Has(keys...)`

<a name="old-input"></a>
### Old Input

~~Lanvard allows you to keep input from one request during the next request. This feature is particularly useful for re-populating forms after detecting validation errors. However, if you are using Lanvard's included [validation features](/docs/{{version}}/validation), it is unlikely you will need to manually use these methods, as some of Lanvard's built-in validation facilities will call them automatically.~~

#### Flashing Input To The Session

~~The `flash` method on the `Illuminate\Http\Request` class will flash the current input to the [session](/docs/{{version}}/session) so that it is available during the user's next request to the application:~~

    $request->flash();

~~You may also use the `flashOnly` and `flashExcept` methods to flash a subset of the request data to the session. These methods are useful for keeping sensitive information such as passwords out of the session:~~

    $request->flashOnly(['username', 'email']);

    $request->flashExcept('password');

#### Flashing Input Then Redirecting

~~Since you often will want to flash input to the session and then redirect to the previous page, you may easily chain input flashing onto a redirect using the `withInput` method:~~

    return redirect('form')->withInput();

    return redirect('form')->withInput(
        $request->except('password')
    );

#### Retrieving Old Input

~~To retrieve flashed input from the previous request, use the `old` method on the `Request` instance. The `old` method will pull the previously flashed input data from the [session](/docs/{{version}}/session):~~

    $username = $request->old('username');

~~Lanvard also provides a global `old` helper. If you are displaying old input within a [Blade template](/docs/{{version}}/blade), it is more convenient to use the `old` helper. If no old input exists for the given field, `null` will be returned:~~

    <input type="text" name="username" value="{{ old('username') }}">

<a name="cookies"></a>
### Cookies

#### Retrieving Cookies From Requests

All cookies created by the Lanvard framework are encrypted and signed with an authentication code, meaning they will be considered invalid if they have been changed by the client. To retrieve a cookie value from the request, use the `cookie` method on a `Illuminate\Http\Request` instance:

    $value = $request->cookie('name');

Alternatively, you may use the `Cookie` facade to access cookie values:

    use Illuminate\Support\Facades\Cookie;

    $value = Cookie::get('name');

#### Attaching Cookies To Responses

You may attach a cookie to an outgoing `Illuminate\Http\Response` instance using the `cookie` method. You should pass the name, value, and number of minutes the cookie should be considered valid to this method:

    return response('Hello World')->cookie(
        'name', 'value', $minutes
    );

The `cookie` method also accepts a few more arguments which are used less frequently. Generally, these arguments have the same purpose and meaning as the arguments that would be given to PHP's native [setcookie](https://secure.php.net/manual/en/function.setcookie.php) method:

    return response('Hello World')->cookie(
        'name', 'value', $minutes, $path, $domain, $secure, $httpOnly
    );

Alternatively, you can use the `Cookie` facade to "queue" cookies for attachment to the outgoing response from your application. The `queue` method accepts a `Cookie` instance or the arguments needed to create a `Cookie` instance. These cookies will be attached to the outgoing response before it is sent to the browser:

    Cookie::queue(Cookie::make('name', 'value', $minutes));

    Cookie::queue('name', 'value', $minutes);

#### Generating Cookie Instances

If you would like to generate a `Symfony\Component\HttpFoundation\Cookie` instance that can be given to a response instance at a later time, you may use the global `cookie` helper. This cookie will not be sent back to the client unless it is attached to a response instance:

    $cookie = cookie('name', 'value', $minutes);

    return response('Hello World')->cookie($cookie);

<a name="files"></a>
## Files

<a name="retrieving-uploaded-files"></a>
### Retrieving Uploaded Files

You may access uploaded files from a `Illuminate\Http\Request` instance using the `file` method or using dynamic properties. The `file` method returns an instance of the `Illuminate\Http\UploadedFile` class, which extends the PHP `SplFileInfo` class and provides a variety of methods for interacting with the file:

    $file = $request->file('photo');

    $file = $request->photo;

You may determine if a file is present on the request using the `hasFile` method:

    if ($request->hasFile('photo')) {
        //
    }

#### Validating Successful Uploads

In addition to checking if the file is present, you may verify that there were no problems uploading the file via the `isValid` method:

    if ($request->file('photo')->isValid()) {
        //
    }

#### File Paths & Extensions

The `UploadedFile` class also contains methods for accessing the file's fully-qualified path and its extension. The `extension` method will attempt to guess the file's extension based on its contents. This extension may be different from the extension that was supplied by the client:

    $path = $request->photo->path();

    $extension = $request->photo->extension();

#### Other File Methods

There are a variety of other methods available on `UploadedFile` instances. Check out the [API documentation for the class](https://api.symfony.com/3.0/Symfony/Component/HttpFoundation/File/UploadedFile.html) for more information regarding these methods.

<a name="storing-uploaded-files"></a>
### Storing Uploaded Files

To store an uploaded file, you will typically use one of your configured [filesystems](/docs/{{version}}/filesystem). The `UploadedFile` class has a `store` method which will move an uploaded file to one of your disks, which may be a location on your local filesystem or even a cloud storage location like Amazon S3.

The `store` method accepts the path where the file should be stored relative to the filesystem's configured root directory. This path should not contain a file name, since a unique ID will automatically be generated to serve as the file name.

The `store` method also accepts an optional second argument for the name of the disk that should be used to store the file. The method will return the path of the file relative to the disk's root:

    $path = $request->photo->store('images');

    $path = $request->photo->store('images', 's3');

If you do not want a file name to be automatically generated, you may use the `storeAs` method, which accepts the path, file name, and disk name as its arguments:

    $path = $request->photo->storeAs('images', 'filename.jpg');

    $path = $request->photo->storeAs('images', 'filename.jpg', 's3');

<a name="configuring-trusted-proxies"></a>
## Configuring Trusted Proxies

When running your applications behind a load balancer that terminates TLS / SSL certificates, you may notice your application sometimes does not generate HTTPS links. Typically this is because your application is being forwarded traffic from your load balancer on port 80 and does not know it should generate secure links.

To solve this, you may use the `App\Http\Middleware\TrustProxies` middleware that is included in your Lanvard application, which allows you to quickly customize the load balancers or proxies that should be trusted by your application. Your trusted proxies should be listed as an array on the `$proxies` property of this middleware. In addition to configuring the trusted proxies, you may configure the proxy `$headers` that should be trusted:

    <?php

    namespace App\Http\Middleware;

    use Fideloper\Proxy\TrustProxies as Middleware;
    use Illuminate\Http\Request;

    class TrustProxies extends Middleware
    {
        /**
         * The trusted proxies for this application.
         *
         * @var string|array
         */
        protected $proxies = [
            '192.168.1.1',
            '192.168.1.2',
        ];

        /**
         * The headers that should be used to detect proxies.
         *
         * @var string
         */
        protected $headers = Request::HEADER_X_FORWARDED_ALL;
    }

> {tip} If you are using AWS Elastic Load Balancing, your `$headers` value should be `Request::HEADER_X_FORWARDED_AWS_ELB`. For more information on the constants that may be used in the `$headers` property, check out Symfony's documentation on [trusting proxies](https://symfony.com/doc/current/deployment/proxies.html).

#### Trusting All Proxies

If you are using Amazon AWS or another "cloud" load balancer provider, you may not know the IP addresses of your actual balancers. In this case, you may use `*` to trust all proxies:

    /**
     * The trusted proxies for this application.
     *
     * @var string|array
     */
    protected $proxies = '*';