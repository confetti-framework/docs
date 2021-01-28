# Routing

## Basic Routing

The most basic Confetti routes accept a URI and a `Closure`, providing a very simple and expressive method of defining routes:

``` go
Get("/user", func(request inter.Request) inter.Response {
    return outcome.Html("Hello World")
})
```

If you are using multiple routers, it is recommended to place a reference to a function in the second parameter:

``` go
Get("/user", controllers.User),
```

### The Default Route Files

All Confetti routes are defined in your route files, which are located in the `routes` directory. These files are
automatically loaded by the framework. The `routes/web.go` file defines routes that are for your web interface. These
routes are assigned the `Web` middleware group. The routes in `routes/api.go` are stateless and are assigned the `Api`
middleware group.

The routes defined in `routes/web.go` may be accessed by entering the defined route's URL in your browser. For example,
you may access the following route by navigating to `http://localhost/user` in your browser:

``` go
Get("/user", controllers.User),
```

Routes defined in the `routes/api.go` file are nested within a route group. Within this group, the `/api` URI prefix is automatically applied, so you do not need to manually apply it to every route in the file. You may modify the prefix and other route group options by using multiple methods.

### Available Router Methods

The router allows you to register routes that respond to any HTTP verb:

``` go
Get("/photos", controllers.PhotosIndex),
Post("/photos", controllers.PhotosStore),
Put("/photos/{photo}", controllers.PhotosUpdate),
Patch("/photos/{photo}", controllers.PhotosUpdate),
Delete("/photos/{photo}", controllers.PhotosDestroy),
```

Sometimes you may need to register a route that responds to multiple HTTP verbs. You may do so using the `Match` method:

``` go
Match([]string{method.Get, method.Post}, "/photos/{photo}", controllers.Photos)
```

Or, you may even register a route that responds to all HTTP verbs using the `Any` method:

``` go
Any("/photos/{photo}", controllers.Photos,
```

### Redirect Routes

If you are defining a route that redirects to another URI, you may use `Redirect`. This function provides a convenient shortcut so that you do not have to define a full route or controller for performing a simple redirect:

``` go
Redirect("/here", "/there", 302)
```

You may use the `RedirectTemporary` method to return a `302` status code:

``` go
RedirectTemporary("/here", "/there")
```

Or the `RedirectPermanent` method to return a `301` status code:

``` go
RedirectPermanent("/here", "/there")
```

### View Routes

If your route only needs to return a view, you may use the `View` method. Like the `Redirect` method, this method
provides a simple shortcut so that you do not have to define a full route or controller. The `View` method accepts a URI
as its first argument, and a view name as its second argument:

``` go
View('/profile', views.Profile("James"));
```

## Route Parameters

### Required Parameters

Sometimes you will need to capture segments of the URI within your route. For example, you may need to capture a username from the URL. You may do so by defining route parameters:

``` go
Get("/user/{username}", func(request inter.Request) inter.Response {
    name := request.Parameter("username").String()
    return outcome.Html("User " + name)
}),
```

You may define as many route parameters as required by your route:

``` go
Get("posts/{post_id}/comments/{comment_alias}", func(request inter.Request) inter.Response {
    postId := request.Parameter("post_id").Int()
    commentAlias := request.Parameter("comment_alias").String()
    //
}),
```

If the parameter cannot be found, then it will panic with an error. Do you want more control over the errors? Then use methods with the suffix E to receive the error:

``` go
postId, err := request.ParameterE("post_id")
if err != nil {
    // postId.Int()
}
```

> Route parameters are always encased within `{}` braces and should consist of alphabetic characters, and may not contain a `-` character. Instead of using the `-` character, use an underscore (`_`).

### Optional Parameters

Occasionally you may need to specify a route parameter, but make the presence of that route parameter optional. You may do so by placing a `?` mark after the parameter name. If no value is found, an empty string or a zero is given.

``` go {1}
Get("users/{username?}/comment/{comment_id?}", func(request inter.Request) inter.Response {
    userName := request.Parameter("username").String()
    // userName = ""

    commentId := request.Parameter("comment_id").Int()
    // commentId = 0
}),
```

Use Empty or Present to check if a value is present.

``` go {2,7}
userName := request.Parameter("username")
if userName.Empty() {
    // userName is empty
}

commentId := request.Parameter("comment_id")
if commentId.Filled() {
    // commentId.Int()
}
```

### Regular Expression Constraints

You may constrain the format of your route parameters using regex. The key and regular expression must be separated by a colon:

``` go
Get("/user/{username:[a-z_]+}", controllers.UserShow)
Get("/user/{id:[0-9]+}", controllers.UserShow)
```

Or define a restriction separately:

``` go
Get("/user/{id}", controllers.UserShow).Where("id", "[0-9]+")
```

#### Global Constraints

If you would like a route parameter to always be constrained by a given regular expression, you may use the `WhereMulti` method. You should define these patterns in the `Boot` method of your `RouteServiceProvider` after the collection is filled:

``` go {7-10}
func (p RouteServiceProvider) Boot(container inter.Container) inter.Container {
    collection := routing.NewRouteCollection()

    collection.Merge(routes.Api)
    collection.Merge(routes.Web)

    collection.WhereMulti(map[string]string{
        "id": "[0-9]+",
        "username": "[a-z_]+",
    })

    //
}
```

Once the pattern has been defined, it is automatically applied to all routes using that parameter name:

``` go
// Only executed if {id} is numeric...
Get("/user/{id}", controllers.UserShow),
```

#### Encoded Forward Slashes

The Confetti routing component allows all characters except `/`. You must explicitly allow `/` to be part of your placeholder using a `Where` condition regular expression:

``` go
Get("/search/{search}", controllers.UserIndex).Where("search", ".*")
```

> Encoded forward slashes are only supported within the last route segment.

### Route Model Binding

For simple transformation of a parameter to a model, you can bind a model to a parameter. You can use the RouteModelBinding middleware for this:

``` go {2-5}
func (r RouteModelBinding) Handle(request inter.Request, next inter.Next) inter.Response {
	request.App().Singleton("user", func() model.User {
		userId := request.Parameter("user_id").Int()
		return model.FindUser(userId)
	})

    return next(request)
}
```

Later you can retrieve the user from the container:

``` go   
user := request.Make("user").(model.User)
```

> The callback ensures that the user is only received from the database when you need it (one time in each request). This can be nice if you first want to validate the request before accessing the database.

## Named Routes

Named routes allow the convenient generation of URLs or redirects for specific routes. You may specify a name for a route by chaining the `Name` method onto the route definition:

``` go
Get("/user/roles", controllers.UserRoleIndex).Name("user.roles")
Get("/user/comments", controllers.UserCommentIndex).Name("user.comments")
```

Or you can name a group:

``` go
Group(
    Get("/roles", controllers.UserRoleIndex).Name("roles"),
    Get("/comments", controllers.UserCommentIndex).Name("comments"),
).Prefix("/user").Name("user.")
```

The names of the above routes are `user.roles` and `user.comments`.

### Generating URLs To Named Routes

Once you have assigned a name to a given route, you may use the route's name when redirects via the `RedirectToRoute` function:

``` go
// Generating Redirects...
Get("/comments", func(request inter.Request) inter.Response {
    return outcome.RedirectToRoute(request.App(), "user.roles")
})
```

Or you use the route's name when generating URLs via the
   `UrlByName` function:

``` go
// Generating URLs...
url := routing.UrlByName(app, "user.roles")
```

If the named route defines parameters, you may pass the parameters as the third argument to the `UrlByName` function. The given parameters will automatically be inserted into the URL in their correct positions:

``` go {3}
Get("/user/{id}", controllers.UserShow).Name("user")

url := outcome.UrlByName(request.App(), "user", outcome.Parameters{"id": 12})

/user/12
```


If you also want to build a query string, use the 4th parameter, those key / value pairs will automatically be added to the generated URL's query string:

``` go {7}
Get("/user/{id}", controllers.UserShow).Name("user")

routing.UrlByName(
    app,
    "user",
    routing.Parameters{"id": 12},
    routing.Parameters{"order_by": "name", "size": 50},
)

/user/12?order_by=name&size=50
```

### Inspecting The Current Route

If you would like to determine if the current route name contains a given string. You may use the `Named` method on a Route instance. For example, you may check the current route name from a route middleware:

``` go {2-4}
func (v ValidatePostSize) Handle(request inter.Request, next inter.Next) inter.Response {
    if request.Route().Named("profile") {
        //
    }

    return next(request)
}
```

## Route Groups

Route groups allow you to share route attributes, such as middleware or prefixes, across many routes without needing to define those attributes on each individual route. Shared attributes are specified after the `Group` method.

Nested groups attempt to intelligently "merge" attributes with their parent group.

### Middleware

To assign middleware to all routes within a group, you may use the `Middleware` method after defining the group. Middlewares are executed in the order they are listed:

``` go
Group(
    Get("/roles", controllers.RoleIndex),
    Get("/comments", controllers.CommentIndex),
).Middleware(First{}, Second{})
```

### Subdomain Routing

Route groups may also be used to handle subdomain routing. The subdomain may be specified by calling the `Domain` method after defining the group:

``` go {7}
Group(
    Get("/users", controllers.UserIndex,
).Domain("api.myapp.com")
```

Subdomains may be assigned route parameters just like route URIs, allowing you to capture a portion of the subdomain for usage in your controller:

``` go {7}
Group(
    Get("/user/{id}", func(request inter.Request) inter.Response {
        account := request.Parameter("account").String()
        userId := request.Parameter("id").Int()
        //
    }),
).Domain("{account}.myapp.com")
```

> In order to ensure your subdomain routes are reachable, you should register subdomain routes before registering root domain routes. This will prevent root domain routes from overwriting subdomain routes which have the same URI path.

### Route Prefixes

The `Prefix` method may be used to prefix each route in the group with a given URI. For example, you may want to prefix all route URIs within the group with `admin`:

``` go {3}
Group(
    Get("/users", controllers.UserShow),
).Prefix("/admin")

// Matches "/admin/users"
```

### Route Name Prefixes

The `Name` method may be used to prefix each route name in the group with a given string. For example, you may want to prefix all the grouped route's names with `admin`. The given string is prefixed to the route name exactly as it is specified, so we will be sure to provide the trailing `.` character in the prefix:

``` go {3}
Group(
    Get("/users", controllers.UserShow).Name("users"),
).Name("admin.")

// Matches "admin.users"
```

## Fallback Routes

Typically, unhandled requests will automatically render a "404" page via your application's exception handler. Using
the `Fallback` function, you may define a route that will be executed when no other route matches the incoming request.

``` go {3-5}
Group(
    Get("/users", controllers.UserShow).Name("users"),
    Fallback(func(request inter.Request) inter.Response {
        return outcome.Html("404 Page not found").Status(404)
    }),
)
```

> The fallback route should always be the last route registered in a group.

## Accessing The Current Route

You can get the current router from the container:

``` go
app.Make("route").(inter.Route)
```

 Or get the route from the request:

``` go
request.Route()
```

You may use the `Name`, `Method` and `Domain` methods on the `Route` to access information about the route handling the incoming request:

``` go
name := request.Route().Name()
method := request.Route().Method()
domain := request.Route().Domain()
```
