# Routing

- [Basic Routing](#basic-routing)
    - [Redirect Routes](#redirect-routes)
    - [View Routes](#view-routes)
- [Route Parameters](#route-parameters)
    - [Required Parameters](#required-parameters)
    - [Optional Parameters](#parameters-optional-parameters)
    - [Regular Expression Constraints](#parameters-regular-expression-constraints)
- [Named Routes](#named-routes)
- [Route Groups](#route-groups)
    - [Middleware](#route-group-middleware)
    - [Namespaces](#route-group-namespaces)
    - [Subdomain Routing](#route-group-subdomain-routing)
    - [Route Prefixes](#route-group-prefixes)
    - [Route Name Prefixes](#route-group-name-prefixes)
- [Route Model Binding](#route-model-binding)
    - [Implicit Binding](#implicit-binding)
    - [Explicit Binding](#explicit-binding)
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

    Get("/user", controllers.User.Index),

Routes defined in the `routes/api.go` file are nested within a route group. Within this group, the `/api` URI prefix is automatically applied, so you do not need to manually apply it to every route in the file. You may modify the prefix and other route group options by using multiple methods.

#### Available Router Methods

The router allows you to register routes that respond to any HTTP verb:

    Get("/photos", controllers.Photos.Index),
    Post("/photos", controllers.Photos.Store),
    Put("/photos/{photo}", controllers.Photos.Update),
    Patch("/photos/{photo}", controllers.Photos.Update),
    Delete("/photos/{photo}", controllers.Photos.Destroy),

Sometimes you may need to register a route that responds to multiple HTTP verbs. You may do so using the `Match` method. Or, you may even register a route that responds to all HTTP verbs using the `Any` method:

    Match([]string{method.Get, method.Post}, "/photos/{photo}", controllers.Photos.Destroy),

    Any("/photos/{photo}", controllers.Photos),

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

You may use the `TemporaryRedirect` method to return a `302` status code:

    TemporaryRedirect("/here", "/there")

Or the `PermanentRedirect` method to return a `301` status code:

    PermanentRedirect("/here", "/there")

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
		name := request.UrlValue("username").String()
		return outcome.Html("User " + name)
	}),

You may define as many route parameters as required by your route:

	Get("posts/{post_id}/comments/{comment_alias}", func(request inter.Request) inter.Response {
		postId := request.UrlValue("post_id").Number()
		commentAlias := request.UrlValue("comment_alias").String()
		//
	}),

If the parameter cannot be found, a Lanvard exception is thrown. Do you want more control over the errors? Then use methods with the suffix E to receive an error:

    postId, err := request.UrlValue("post_id").NumberE()
    commentAlias, err := request.UrlValue("comment_alias").StringE()

Route parameters are always encased within `{}` braces and should consist of alphabetic characters, and may not contain a `-` character. Instead of using the `-` character, use an underscore (`_`).

<a name="parameters-optional-parameters"></a>
### Optional Parameters

Occasionally you may need to specify a route parameter, but make the presence of that route parameter optional. You may do so by placing a `?` mark after the parameter name. If no value is found, an empty string or a zero is given.

	Get("users/{username?}/comment/{comment_id?}", func(request inter.Request) inter.Response {
		userName := request.UrlValue("username").string()
        // userName = ""

		commentId := request.UrlValue("comment_id").Number()
		// commentId = 0
	}),
	
Use Empty or Present to check if a value is present.

        userName := request.UrlValue("username")
        if userName.Empty() {
            // userName is empty
        }

        commentId := request.UrlValue("comment_id")
        if commentId.Present() {
            commentId.Number()
        }

<a name="parameters-regular-expression-constraints"></a>
### Regular Expression Constraints

You may constrain the format of your route parameters using regex. The key and regular expression must be separated by a colon:

    Get("/user/{username:[A-Za-z]+}", controllers.User.Show),
    Get("/user/{id:[0-9]+}", controllers.User.Show),

Or define a restriction separately:

    Get("/user/{id}", controllers.User.Show).Where("id", "[0-9]+")

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
    Get("/user/{id}", controllers.User.Show),

<a name="parameters-encoded-forward-slashes"></a>
#### Encoded Forward Slashes

The Lanvard routing component allows all characters except `/`. You must explicitly allow `/` to be part of your placeholder using a `Where` condition regular expression:

    Get("/search/{search}", controllers.User.Index).Where("search", ".*")

> {note} Encoded forward slashes are only supported within the last route segment.

<a name="named-routes"></a>
## Named Routes

Named routes allow the convenient generation of URLs or redirects for specific routes. You may specify a name for a route by chaining the `Name` method onto the route definition:

    Get("/user/roles", controllers.User.Role.Index).Name("user.roles")
    Get("/user/comments", controllers.User.Comment.Index).Name("user.comments")
    
Or you can name a group:

    Group(
        Get("/roles", controllers.User.Role.Index).Name("roles"),
        Get("/comments", controllers.User.Comment.Index).Name("comments"),
    ).Prefix("/users").Name("user.")

The names of the above routes are `UserRoles` and `UserComments`.

#### Generating URLs To Named Routes

Once you have assigned a name to a given route, you may use the route's name when redirects via the `RedirectToRoute` function:

    // Generating Redirects...
    Get("/comments", func(request inter.Request) inter.Response {
        return outcome.RedirectToRoute(request.App(), "user.roles")
    })

Or you use the route's name when generating URLs via the
   `UrlByName` function:

    // Generating URLs...
    url := routing.UrlByName(app, "user.roles")

If the named route defines parameters, you may pass the parameters as the third argument to the `UrlByName` function. The given parameters will automatically be inserted into the URL in their correct positions:
    
    Get("/user/{id}", controllers.User.Show).Name("user")
    
    url := routing.UrlByName(app, "user", routing.Parameters{"id": 12})
    
    // /user/12
    

If you also want to build a query string, use the 4th parameter, those key / value pairs will automatically be added to the generated URL's query string:
    
    Get("/user/{id}", controllers.User.Show).Name("user")
    
    routing.UrlByName(
    		app,
    		"user",
    		routing.Parameters{"id": 12},
    		routing.Parameters{"order_by": "name", "size": 50},
    	)

    // /user/12?order_by=name&size=50

~~> {tip} Sometimes, you may wish to specify request-wide default values for URL parameters, such as the current locale. To accomplish this, you may use the [`URL::defaults` method](/docs/{{version}}/urls#default-values).~~

#### Inspecting The Current Route

If you would like to determine if the current request was routed to a given named route, you may use the `Named` method on a Route instance. For example, you may check the current route name from a route middleware:

    func (v ValidatePostSize) Handle(request inter.Request, next inter.MiddlewareDestination) inter.Response {
        if request.Route().Named("profile") {
            //
        }
        
        return next(request)
    }

<a name="route-groups"></a>
## Route Groups

Route groups allow you to share route attributes, such as middleware or prefixes, across many routes without needing to define those attributes on each individual route. Shared attributes are specified in an array format as the first parameter to the `Group` method.

Nested groups attempt to intelligently "merge" attributes with their parent group. `Where` conditions are merged while Middleware, names and prefixes are appended.

<a name="route-group-middleware"></a>
### Middleware

To assign middleware to all routes within a group, you may use the `Middleware` method after defining the group. Middleware are executed in the order they are listed in the array:

    Group(
        Get("/roles", controllers.User.Role.Index),
        Get("/comments", controllers.User.Comment.Index),
    ).Middleware(First{}, Second{})

<a name="route-group-subdomain-routing"></a>
### Subdomain Routing

Route groups may also be used to handle subdomain routing. Subdomains may be assigned route parameters just like route URIs, allowing you to capture a portion of the subdomain for usage in your route or controller. The subdomain may be specified by calling the `Domain` method before defining the group:

    Group(
		Get("/user/{id}", func(request inter.Request) inter.Response {
			account := request.UrlValue("account")
			userId := request.UrlValue("id")
			//
		}),
	).Domain("{account}.myapp.com")

> {note} In order to ensure your subdomain routes are reachable, you should register subdomain routes before registering root domain routes. This will prevent root domain routes from overwriting subdomain routes which have the same URI path.

<a name="route-group-prefixes"></a>
### Route Prefixes

The `Prefix` method may be used to prefix each route in the group with a given URI. For example, you may want to prefix all route URIs within the group with `admin`:

    Group(
		Get("/users", controllers.User.Show),
	).Prefix("/admin")

    // Matches The "/admin/users" URL

<a name="route-group-name-prefixes"></a>
### Route Name Prefixes

The `Name` method may be used to prefix each route name in the group with a given string. For example, you may want to prefix all the grouped route's names with `admin`. The given string is prefixed to the route name exactly as it is specified, so we will be sure to provide the trailing `.` character in the prefix:

    Group(
		Get("/users", controllers.User.Show).Name("users"),
	).Name("admin.")

<a name="route-model-binding"></a>
## Route Model Binding

When injecting a model ID to a route or controller action, you will often query to retrieve the model that corresponds to that ID. Lanvard route model binding provides a convenient way to automatically inject the model instances directly into your routes. For example, instead of injecting a user's ID, you can inject the entire `User` model instance that matches the given ID.

<a name="implicit-binding"></a>
### Implicit Binding

Lanvard automatically resolves Eloquent models defined in routes or controller actions whose type-hinted variable names match a route segment name. For example:

    Route::get('api/users/{user}', function (App\User $user) {
        return $user->email;
    });

Since the `$user` variable is type-hinted as the `App\User` Eloquent model and the variable name matches the `{user}` URI segment, Lanvard will automatically inject the model instance that has an ID matching the corresponding value from the request URI. If a matching model instance is not found in the database, a 404 HTTP response will automatically be generated.

#### Customizing The Key

Sometimes you may wish to resolve Eloquent models using a column other than `id`. To do so, you may specify the column in the route parameter definition:

    Route::get('api/posts/{post:slug}', function (App\Post $post) {
        return $post;
    });

#### Custom Keys & Scoping

Sometimes, when implicitly binding multiple Eloquent models in a single route definition, you may wish to scope the second Eloquent model such that it must be a child of the first Eloquent model. For example, consider this situation that retrieves a blog post by slug for a specific user:

    use App\Post;
    use App\User;

    Route::get('api/users/{user}/posts/{post:slug}', function (User $user, Post $post) {
        return $post;
    });

When using a custom keyed implicit binding as a nested route parameter, Lanvard will automatically scope the query to retrieve the nested model by its parent using conventions to guess the relationship name on the parent. In this case, it will be assumed that the `User` model has a relationship named `posts` (the plural of the route parameter name) which can be used to retrieve the `Post` model.

#### Customizing The Default Key Name

If you would like model binding to use a default database column other than `id` when retrieving a given model class, you may override the `getRouteKeyName` method on the Eloquent model:

    /**
     * Get the route key for the model.
     *
     * @return string
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }

<a name="explicit-binding"></a>
### Explicit Binding

To register an explicit binding, use the router's `model` method to specify the class for a given parameter. You should define your explicit model bindings in the `boot` method of the `RouteServiceProvider` class:

    public function boot()
    {
        parent::boot();

        Route::model('user', App\User::class);
    }

Next, define a route that contains a `{user}` parameter:

    Route::get('profile/{user}', function (App\User $user) {
        //
    });

Since we have bound all `{user}` parameters to the `App\User` model, a `User` instance will be injected into the route. So, for example, a request to `profile/1` will inject the `User` instance from the database which has an ID of `1`.

If a matching model instance is not found in the database, a 404 HTTP response will be automatically generated.

#### Customizing The Resolution Logic

If you wish to use your own resolution logic, you may use the `Route::bind` method. The `Closure` you pass to the `bind` method will receive the value of the URI segment and should return the instance of the class that should be injected into the route:

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();

        Route::bind('user', function ($value) {
            return App\User::where('name', $value)->firstOrFail();
        });
    }

Alternatively, you may override the `resolveRouteBinding` method on your Eloquent model. This method will receive the value of the URI segment and should return the instance of the class that should be injected into the route:

    /**
     * Retrieve the model for a bound value.
     *
     * @param  mixed  $value
     * @param  string|null  $field
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function resolveRouteBinding($value, $field = null)
    {
        return $this->where('name', $value)->firstOrFail();
    }

<a name="fallback-routes"></a>
## Fallback Routes

Using the `Route::fallback` method, you may define a route that will be executed when no other route matches the incoming request. Typically, unhandled requests will automatically render a "404" page via your application's exception handler. However, since you may define the `fallback` route within your `routes/web.php` file, all middleware in the `web` middleware group will apply to the route. You are free to add additional middleware to this route as needed:

    Route::fallback(function () {
        //
    });

> {note} The fallback route should always be the last route registered by your application.

<a name="rate-limiting"></a>
## Rate Limiting

Lanvard includes a [middleware](/docs/{{version}}/middleware) to rate limit access to routes within your application. To get started, assign the `throttle` middleware to a route or a group of routes. The `throttle` middleware accepts two parameters that determine the maximum number of requests that can be made in a given number of minutes. For example, let's specify that an authenticated user may access the following group of routes 60 times per minute:

    Route::middleware('auth:api', 'throttle:60,1')->group(function () {
        Route::get('/user', function () {
            //
        });
    });

#### Dynamic Rate Limiting

You may specify a dynamic request maximum based on an attribute of the authenticated `User` model. For example, if your `User` model contains a `rate_limit` attribute, you may pass the name of the attribute to the `throttle` middleware so that it is used to calculate the maximum request count:

    Route::middleware('auth:api', 'throttle:rate_limit,1')->group(function () {
        Route::get('/user', function () {
            //
        });
    });

#### Distinct Guest & Authenticated User Rate Limits

You may specify different rate limits for guest and authenticated users. For example, you may specify a maximum of `10` requests per minute for guests `60` for authenticated users:

    Route::middleware('throttle:10|60,1')->group(function () {
        //
    });

You may also combine this functionality with dynamic rate limits. For example, if your `User` model contains a `rate_limit` attribute, you may pass the name of the attribute to the `throttle` middleware so that it is used to calculate the maximum request count for authenticated users:

    Route::middleware('auth:api', 'throttle:10|rate_limit,1')->group(function () {
        Route::get('/user', function () {
            //
        });
    });

#### Rate Limit Segments

Typically, you will probably specify one rate limit for your entire API. However, your application may require different rate limits for different segments of your API. If this is the case, you will need to pass a segment name as the third argument to the `throttle` middleware:

    Route::middleware('auth:api')->group(function () {
        Route::middleware('throttle:60,1,default')->group(function () {
            Route::get('/servers', function () {
                //
            });
        });

        Route::middleware('throttle:60,1,deletes')->group(function () {
            Route::delete('/servers/{id}', function () {
                //
            });
        });
    });

<a name="form-method-spoofing"></a>
## Form Method Spoofing

HTML forms do not support `PUT`, `PATCH` or `DELETE` actions. So, when defining `PUT`, `PATCH` or `DELETE` routes that are called from an HTML form, you will need to add a hidden `_method` field to the form. The value sent with the `_method` field will be used as the HTTP request method:

    <form action="/foo/bar" method="POST">
        <input type="hidden" name="_method" value="PUT">
        <input type="hidden" name="_token" value="{{ csrf_token() }}">
    </form>

You may use the `@method` Blade directive to generate the `_method` input:

    <form action="/foo/bar" method="POST">
        @method('PUT')
        @csrf
    </form>

<a name="accessing-the-current-route"></a>
## Accessing The Current Route

You may use the `current`, `currentRouteName`, and `currentRouteAction` methods on the `Route` facade to access information about the route handling the incoming request:

    $route = Route::current();

    $name = Route::currentRouteName();

    $action = Route::currentRouteAction();

Refer to the API documentation for both the [underlying class of the Route facade](https://laravel.com/api/{{version}}/Illuminate/Routing/Router.html) and [Route instance](https://laravel.com/api/{{version}}/Illuminate/Routing/Route.html) to review all accessible methods.

<a name="cors"></a>
## Cross-Origin Resource Sharing (CORS)

Lanvard can automatically respond to CORS OPTIONS requests with values that you configure. All CORS settings may be configured in your `cors` configuration file and OPTIONS requests will automatically be handled by the `HandleCors` middleware that is included by default in your global middleware stack.

> {tip} For more information on CORS and CORS headers, please consult the [MDN web documentation on CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#The_HTTP_response_headers).