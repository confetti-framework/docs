# Middleware

- [Introduction](#introduction)
- [Defining Middleware](#defining-middleware)
  - [Before & After Middleware](#before--after-middleware)
- [Registering Middleware](#registering-middleware)
    - [Global Middleware](#global-middleware)
    - [Assigning Middleware To Routes](#assigning-middleware-to-routes)
    - [Middleware Groups](#middleware-groups)
- [Middleware Parameters](#middleware-parameters)
- [Terminable Middleware](#terminable-middleware)

## Introduction

Middleware provide a convenient mechanism for filtering HTTP requests entering your application. Additional middleware
can be written to perform a variety of tasks. A CORS middleware might be responsible for adding the proper headers to
all responses leaving your application. A logging middleware might log all incoming requests to your application.

There are several middleware included in the Lanvard framework. All of these middleware are located in
the `app/http/middleware` directory.

## Defining Middleware

Let's place a new `CheckAge` struct within your `app/http/middleware` directory. In this middleware, we will only allow access to the route if the supplied `age` is greater than 200. Otherwise, we will redirect the users back to the `home` URI:

    package middleware
    
    import (
    	"github.com/lanvard/contract/inter"
    	"github.com/lanvard/routing/outcome"
    )
    
    type CheckAge struct{}
    
    func (c CheckAge) Handle(request inter.Request, next inter.Next) inter.Response {
    	if request.Value("age").Number() <= 200 {
    		return outcome.RedirectTemporary("home")
    	}
    	
    	return next(request)
    }

As you can see, if the given `age` is less than or equal to `200`, the middleware will return an HTTP redirect to the client; otherwise, the request will be passed further into the application. To pass the request deeper into the application (allowing the middleware to "pass"), call the `next` callback with the `request`.

It's best to envision middleware as a series of "layers" HTTP requests must pass through before they hit your application. Each layer can examine the request and even reject it entirely.

> {tip} The request contains the [service container](/docs/{{version}}/container), so you may fetch any dependencies you need with `request.Make(...)`.

### Before & After Middleware

Whether a middleware runs before or after a request depends on the middleware itself. For example, the following middleware would perform some task **before** the request is handled by the application:

    package middleware
    
    import (
    	"github.com/lanvard/contract/inter"
    )
    
    type BeforeMiddleware struct{}
    
    func (c BeforeMiddleware) Handle(request inter.Request, next inter.Next) inter.Response {
    	// Perform action
    
    	return next(request)
    }

However, this middleware would perform its task **after** the request is handled by the application:

    package middleware
    
    import (
    	"github.com/lanvard/contract/inter"
    )
    
    type AfterMiddleware struct{}
    
    func (c AfterMiddleware) Handle(request inter.Request, next inter.Next) inter.Response {
    	response := next(request)
    	
    	// Perform action
    
    	return response
    }

## Registering Middleware

### Global Middleware

If you want a middleware to run during every HTTP request to your application, list the middleware struct in
the `globalMiddlewares` variable in your `providers.RouteServiceProvider` located
in `app/providers/route_service_provider.go`.

### Assigning Middleware To Routes

If you would like to assign middleware to specific routes, you should pass the struct of the middleware:
    
        Get("/admin/profile", func(request inter.Request) inter.Response {
            //
        }).Middleware(
    		middleware.ValidatePostSize{},
    		middleware.CheckAge{},
    	)

When assigning middleware to a group of routes, you may occasionally need to prevent the middleware from being applied to an individual route within the group. You may accomplish this using the `WithoutMiddleware` method:

    	routes := Group(
    		Get("/roles", controller.Roles.Index),
    		Get("/comments", controller.Comments.Index).WithoutMiddleware(middleware.CheckAge{}),
    	).Middleware(
    		middleware.ValidatePostSize{},
    		middleware.CheckAge{},
    	)

The `WithoutMiddleware` method can only remove route middleware and does not apply to [global middleware](#global-middleware). Supply parameters to the struct of WithoutMiddleware has no effect and is therefore superfluous.

### Middleware Groups

Sometimes you may want to group several middleware under a single key to make them easier to assign to routes. We call this Middleware Groups.

Out of the box, Lanvard comes with `Web` and `Api` middleware groups that contain common middlewares you may want to apply to your web UI and API routes. Let's see how the Web middleware group might look like:
    
    package middleware
    
    import "github.com/lanvard/contract/inter"

    var Web = []inter.HttpMiddleware{
    	EncryptCookies{},
    	AddQueuedCookiesToResponse{},
    	StartSession{},
    	ShareErrorsFromSession{},
    	VerifyCsrfToken{},
    	SubstituteBindings{},
    }

Middleware groups can be loaded by using the spread operator in the `Middleware` method. Again, middleware groups make it more convenient to assign many middlewares to a route at once:

    Get("/user", controller.User.List).Middleware(middleware.Web...),

    Group(
    	//
    ).Middleware(middleware.Web...)

> {tip} Out of the box, the `Web` middleware group is automatically applied to your web routes by `routes/web.go`.

## Middleware Parameters

Middleware can also receive additional parameters. For example, if your application needs to verify that the authenticated user has a given "role" before performing a given action, you could create a `CheckRole` middleware that receives a role name as an additional public field.

    package middleware
    
    import (
        "github.com/lanvard/contract/inter"
        "github.com/lanvard/routing/outcome"
        "lanvard/src/adapter"
    )
    
    type CheckRole struct{
        Role string
    }
    
    func (c CheckRole) Handle(request inter.Request, next inter.Next) inter.Response {
        if !adapter.CurrentUser(request).HasRole(c.Role) {
            return outcome.RedirectTemporary("/home")
        }
    
        return next(request)
    }

You can pass the parameters to the public fields of the middleware:
    
    Group(
        //
    ).Middleware(middleware.CheckRole{Role: "editor"})

## Terminable Middleware

This hasn't been built yet, but feel free to help: https://github.com/lanvard/lanvard/issues/63