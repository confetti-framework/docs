# Routing

- [Basic Routing](#basic-routing)
    - [Redirect Routes](#redirect-routes)
    - [View Routes](#view-routes)
- [Route Parameters](#route-values)
    - [Required Parameters](#required-parameters)
    - [Optional Parameters](#parameters-optional-parameters)
    - [Regular Expression Constraints](#parameters-regular-expression-constraints)
    - [Route Model Binding](#route-model-binding)
    - [Route Adapters](#route-adapters)
- [Named Routes](#named-routes)
- [Route Groups](#route-groups)
    - [Middleware](#route-group-middleware)
    - [Namespaces](#route-group-namespaces)
    - [Subdomain Routing](#route-group-subdomain-routing)
    - [Route Prefixes](#route-group-prefixes)
    - [Route Name Prefixes](#route-group-name-prefixes)
- [Fallback Routes](#fallback-routes)
- [Rate Limiting](#rate-limiting)
- [Form Method Spoofing](#form-method-spoofing)
- [Accessing The Current Route](#accessing-the-current-route)
- [Cross-Origin Resource Sharing (CORS)](#cors)

<a name="basic-routing"></a>
## Basic Routing

The most basic Lanvard routes accept a URI and a `Closure`, providing a very simple and expressive method of defining routes:

    Get("/users", func(request inter.Request) inter.Response {
        return outcome.Http("Hello World")
    })

#### The Default Route Files

All Lanvard routes are defined in your route files, which are located in the `routes` directory. These files are automatically loaded by the framework. The `routes/web.php` file defines routes that are for your web interface. These routes are assigned the `web` ~~middleware group~~, which provides features like ~~session state~~ and ~~CSRF protection~~. The routes in `routes/api.go` are stateless and are assigned the `api` ~~middleware group~~.

The routes defined in `routes/web.go` may be accessed by entering the defined route's URL in your browser. For example, you may access the following route by navigating to `http://your-app.test/user` in your browser:

    Get("/user", controller.User.Index),

Routes defined in the `routes/api.go` file are nested within a route group. Within this group, the `/api` URI prefix is automatically applied, so you do not need to manually apply it to every route in the file. You may modify the prefix and other route group options by using multiple methods.

#### Available Router Methods

The router allows you to register routes that respond to any HTTP verb:

    Get("/photos", controller.Photos.Index),
    Post("/photos", controller.Photos.Store),
    Put("/photos/{photo}", controller.Photos.Update),
    Patch("/photos/{photo}", controller.Photos.Update),
    Delete("/photos/{photo}", controller.Photos.Destroy),

Sometimes you may need to register a route that responds to multiple HTTP verbs. You may do so using the `Match` method. Or, you may even register a route that responds to all HTTP verbs using the `Any` method:

    Match([]string{method.Get, method.Post}, "/photos/{photo}", controller.Photos.Destroy),

    Any("/photos/{photo}", controller.Photos),

#### ~~CSRF Protection~~

~~Any HTML forms pointing to `POST`, `PUT`, `PATCH`, or `DELETE` routes that are defined in the `web` routes file should include a CSRF token field. Otherwise, the request will be rejected. You can read more about CSRF protection in the [CSRF documentation](/docs/{{version}}/csrf):~~

    <form method="POST" action="/profile">
        @csrf
        ...
    </form>

<a name="redirect-routes"></a>
### Redirect Routes

If you are defining a route that redirects to another URI, you may use `Redirect`. This function provides a convenient shortcut so that you do not have to define a full route or controller for performing a simple redirect:

    Redirect("/here", "/there", 302)

You may use the `RedirectTemporary` method to return a `302` status code:

    RedirectTemporary("/here", "/there")

Or the `RedirectPermanent` method to return a `301` status code:

    RedirectPermanent("/here", "/there")

<a name="view-routes"></a>
### View Routes

~~If your route only needs to return a view, you may use the `Route::view` method. Like the `redirect` method, this method provides a simple shortcut so that you do not have to define a full route or controller. The `view` method accepts a URI as its first argument and a view name as its second argument. In addition, you may provide an array of data to pass to the view as an optional third argument:~~

    Route::view('/welcome', 'welcome');

    Route::view('/welcome', 'welcome', ['name' => 'Taylor']);

<a name="route-parameters"></a>
## Route Parameters

<a name="required-parameters"></a>
### Required Parameters

Sometimes you will need to capture segments of the URI within your route. For example, you may need to capture a username from the URL. You may do so by defining route parameters:

    Get("/user/{username}", func(request inter.Request) inter.Response {
        name := request.Value("username").String()
        return outcome.Html("User " + name)
    }),

You may define as many route parameters as required by your route:

    Get("posts/{post_id}/comments/{comment_alias}", func(request inter.Request) inter.Response {
        postId := request.Value("post_id").Number()
        commentAlias := request.Value("comment_alias").String()
        //
    }),

If the parameter cannot be found, a Lanvard exception is thrown. Do you want more control over the errors? Then use methods with the suffix E to receive an error:

    postId, err := request.Value("post_id").NumberE()
    commentAlias, err := request.Value("comment_alias").StringE()

Route parameters are always encased within `{}` braces and should consist of alphabetic characters, and may not contain a `-` character. Instead of using the `-` character, use an underscore (`_`).

<a name="parameters-optional-parameters"></a>
### Optional Parameters

Occasionally you may need to specify a route parameter, but make the presence of that route parameter optional. You may do so by placing a `?` mark after the parameter name. If no value is found, an empty string or a zero is given.

    Get("users/{username?}/comment/{comment_id?}", func(request inter.Request) inter.Response {
        userName := request.Value("username").string()
        // userName = ""

        commentId := request.Value("comment_id").Number()
        // commentId = 0
    }),
    
Use Empty or Present to check if a value is present.

        userName := request.Value("username")
        if userName.Empty() {
            // userName is empty
        }

        commentId := request.Value("comment_id")
        if commentId.Present() {
            commentId.Number()
        }

<a name="parameters-regular-expression-constraints"></a>
### Regular Expression Constraints

You may constrain the format of your route parameters using regex. The key and regular expression must be separated by a colon:

    Get("/user/{username:[A-Za-z]+}", controller.User.Show),
    Get("/user/{id:[0-9]+}", controller.User.Show),

Or define a restriction separately:

    Get("/user/{id}", controller.User.Show).Where("id", "[0-9]+")

<a name="parameters-global-constraints"></a>
#### Global Constraints

If you would like a route parameter to always be constrained by a given regular expression, you may use the `WhereMulti` method. You should define these patterns in the `Boot` method of your `RouteServiceProvider` after the collection is filled:

    // Define your router model bindings, pattern filters, etc.
    func (p RouteServiceProvider) Boot() {
        collection := routing.NewRouteCollection()

        collection.Merge(routes.Api)
        collection.Merge(routes.Web)

        collection.WhereMulti(map[string]string{
            "id": "[0-9]+",
            "username": "[a-z_]+",
        })
    }

Once the pattern has been defined, it is automatically applied to all routes using that parameter name:

    // Only executed if {id} is numeric...
    Get("/user/{id}", controller.User.Show),

<a name="parameters-encoded-forward-slashes"></a>
#### Encoded Forward Slashes

The Lanvard routing component allows all characters except `/`. You must explicitly allow `/` to be part of your placeholder using a `Where` condition regular expression:

    Get("/search/{search}", controller.User.Index).Where("search", ".*")

> {note} Encoded forward slashes are only supported within the last route segment.

<a name="route-model-binding"></a>
### Route Model Binding

Since Golang is a strict typed language, it can be difficult to convert a request into a struct. For simple transformation of a parameter to a model, you can bind a model to a parameter. You can use the RouteModelBinding middleware for this:

     func (b RouteModelBinding) Handle(request inter.Request, next inter.Next) inter.Response {
        request.App().Instance("user", func() model.User {
            return model.User.Find(request.Value("user"))
        })
        
        return next(request)
     }
     
Later you can retrieve the user from the container:
     
     user := request.Make("user").(model.User)

> {note} The callback ensures that the user is received from the database when you need it. This can be nice if you first want to validate the request before accessing the database.

<a name="route-adapters"></a>
### Route Adapters

If you want to extract users from a request in different ways, then it can be helpful to use the adapter pattern. The adapter pattern is a pattern that ensures that you convert something in a certain interface.

    package adapters

    ...

    func (adapter User) FindE() (contract.User, error) {
        userId, err := adapter.Request.Value("user").NumberE()
        if err != nil {
            return _, err
        }
    
        return model.NewUserE(userId, "test@lanvard.com")
    }

 Then you can retrieve a model from a parameter, body or session in a nice and elegant way:

    user, err := adapters.User{request}.FindE()
    if err != nil {
        //
    }
    
Most of the time it is nice that the caller is responsible for handling the errors. If the errors often have to be treated in the same way, it can be nice to leave that responsibility with the adapter:

    func (adapter User) Find() contract.User {
        user, err := adapter.FindE()
        if err != nil {
            panic(err)
        }
    
        return user
    }
    
Your caller will stay organized and clean:

    user := adapters.User{request}.Find()    
    
In the standard src code you see this example. Feel free to implement the adapter pattern your way.

<a name="named-routes"></a>
## Named Routes

Named routes allow the convenient generation of URLs or redirects for specific routes. You may specify a name for a route by chaining the `Name` method onto the route definition:

    Get("/user/roles", controller.User.Role.Index).Name("user.roles")
    Get("/user/comments", controller.User.Comment.Index).Name("user.comments")
    
Or you can name a group:

    Group(
        Get("/roles", controller.User.Role.Index).Name("roles"),
        Get("/comments", controller.User.Comment.Index).Name("comments"),
    ).Prefix("/users").Name("user.")

The names of the above routes are `user.roles` and `user.comments`.

#### Generating URLs To Named Routes

Once you have assigned a name to a given route, you may use the route's name when redirects via the `RedirectToRoute` function:

    // Generating Redirects...
    Get("/comments", func(request inter.Request) inter.Response {
        return outcome.RedirectToRoute(request, "user.roles")
    })

Or you use the route's name when generating URLs via the
   `UrlByName` function:

    // Generating URLs...
    url := routing.UrlByName(app, "user.roles")

If the named route defines parameters, you may pass the parameters as the third argument to the `UrlByName` function. The given parameters will automatically be inserted into the URL in their correct positions:
    
    Get("/user/{id}", controller.User.Show).Name("user")
    
    url := routing.UrlByName(app, "user", routing.Parameters{"id": 12})
    
    /user/12
    

If you also want to build a query string, use the 4th parameter, those key / value pairs will automatically be added to the generated URL's query string:
    
    Get("/user/{id}", controller.User.Show).Name("user")
    
    routing.UrlByName(
            app,
            "user",
            routing.Parameters{"id": 12},
            routing.Parameters{"order_by": "name", "size": 50},
        )

    /user/12?order_by=name&size=50

~~> {tip} Sometimes, you may wish to specify request-wide default values for URL parameters, such as the current locale. To accomplish this, you may use the [`URL::defaults` method](/docs/{{version}}/urls#default-values).~~

#### Inspecting The Current Route

If you would like to determine if the current request was routed to a given named route, you may use the `Named` method on a Route instance. For example, you may check the current route name from a route middleware:

    func (v ValidatePostSize) Handle(request inter.Request, next inter.Next) inter.Response {
        if request.Route().Named("profile") {
            //
        }
        
        return next(request)
    }

<a name="route-groups"></a>
## Route Groups

Route groups allow you to share route attributes, such as middleware or prefixes, across many routes without needing to define those attributes on each individual route. Shared attributes are specified after the `Group` method.

Nested groups attempt to intelligently "merge" attributes with their parent group. `Where` conditions are merged while Middleware, names and prefixes are appended.

<a name="route-group-middleware"></a>
### Middleware

To assign middleware to all routes within a group, you may use the `Middleware` method after defining the group. Middlewares are executed in the order they are listed:

    Group(
        Get("/roles", controller.User.Role.Index),
        Get("/comments", controller.User.Comment.Index),
    ).Middleware(First{}, Second{})

<a name="route-group-subdomain-routing"></a>
### Subdomain Routing

Route groups may also be used to handle subdomain routing. Subdomains may be assigned route parameters just like route URIs, allowing you to capture a portion of the subdomain for usage in your route or controller. The subdomain may be specified by calling the `Domain` method after defining the group:

    Group(
        Get("/user/{id}", func(request inter.Request) inter.Response {
            account := request.Value("account")
            userId := request.Value("id")
            //
        }),
    ).Domain("{account}.myapp.com")

> {note} In order to ensure your subdomain routes are reachable, you should register subdomain routes before registering root domain routes. This will prevent root domain routes from overwriting subdomain routes which have the same URI path.

<a name="route-group-prefixes"></a>
### Route Prefixes

The `Prefix` method may be used to prefix each route in the group with a given URI. For example, you may want to prefix all route URIs within the group with `admin`:

    Group(
        Get("/users", controller.User.Show),
    ).Prefix("/admin")

    // Matches The "/admin/users" URL

<a name="route-group-name-prefixes"></a>
### Route Name Prefixes

The `Name` method may be used to prefix each route name in the group with a given string. For example, you may want to prefix all the grouped route's names with `admin`. The given string is prefixed to the route name exactly as it is specified, so we will be sure to provide the trailing `.` character in the prefix:

    Group(
        Get("/users", controller.User.Show).Name("users"),
    ).Name("admin.")
    
    // Matches "admin.users"

<a name="fallback-routes"></a>
## Fallback Routes

Using the `Route::fallback` method, you may define a route that will be executed when no other route matches the incoming request. Typically, unhandled requests will automatically render a "404" page via your application's exception handler. However, since you may define the `fallback` route within your `routes/web.php` file, all middleware in the `web` middleware group will apply to the route. You are free to add additional middleware to this route as needed:

    Group(
		Get("/users", controller.User.Show).Name("users"),
		Fallback(func(request inter.Request) inter.Response {
			return outcome.Html("404 Page not found")
		}),
	)

> {note} The fallback route should always be the last route registered by your application.

<a name="rate-limiting"></a>
## Rate Limiting

This hasn't been built yet, but feel free to help: https://github.com/lanvard/lanvard/issues/51

<a name="form-method-spoofing"></a>
## Form Method Spoofing

This hasn't been built yet, but feel free to help: https://github.com/lanvard/lanvard/issues/52

<a name="accessing-the-current-route"></a>
## Accessing The Current Route

You can remove the current router from the container:

     yourStruct.App().Make("route").(inter.Route)
     
 Or get the route from the request:
 
    request.Route()

You may use the `Name`, `Method` and `Domain` methods on the `Route` facade to access information about the route handling the incoming request:

    name := request.Route().Name()

    domain := request.Route().Domain

<a name="cors"></a>
## Cross-Origin Resource Sharing (CORS)

~~Lanvard can automatically respond to CORS OPTIONS requests with values that you configure. All CORS settings may be configured in your `cors` configuration file and OPTIONS requests will automatically be handled by the `HandleCors` middleware that is included by default in your global middleware stack.~~

~~> {tip} For more information on CORS and CORS headers, please consult the [MDN web documentation on CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#The_HTTP_response_headers).~~