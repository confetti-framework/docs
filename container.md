# Service Container

- [Introduction](#introduction)
- [Binding](#binding)
    - [Binding Basics](#binding-basics)
    - [Binding Interfaces To Implementations](#binding-interfaces-to-implementations)
    - [Contextual Binding](#contextual-binding)
    - [Tagging](#tagging)
    - [Extending Bindings](#extending-bindings)
- [Resolving](#resolving)
    - [The Make Method](#the-make-method)
    - [Automatic Injection](#automatic-injection)
- [Container Events](#container-events)

<a name="introduction"></a>
## Introduction

The Lanvard service container is a powerful tool for managing struct dependencies and performing dependency injection. Dependency injection is a fancy phrase that essentially means this: struct dependencies are "injected" into the struct via the constructor or, in some cases, "setter" methods.

Let's look at a simple example:

```go
package model

import (
    "github.com/lanvard/foundation"
    "lanvard/app/repository"
)

type User struct {
	app        foundation.Application
	repository repository.User
}

func NewUser(app foundation.Application) Router {

	// Receive the repository from the application container
	userRepository := app.Make(repository.User{})(repository.User)

	return User{app: app, repository: userRepository}
}

func (u User) IsAdmin() bool {
	return u.repository.HasRole(u, "admin")
}

```

In this example, the `User` struct needs to retrieve users from a data source. So, we will **inject** a service that is able to retrieve users. In this context, our `UserRepository` most likely uses [~~Eloquent~~](/docs/{{version}}/eloquent) to retrieve user information from the database. However, since the repository is injected, we are able to easily swap it out with another implementation. We are also able to easily "mock", or create a dummy implementation of the `repository.User` when testing our application.

A deep understanding of the Lanvard service container is essential to building a powerful, large application, as well as for contributing to the Lanvard core itself.

<a name="binding"></a>
## Binding

<a name="binding-basics"></a>
### Binding Basics

Almost all of your service container bindings will be registered within [service providers](/docs/{{version}}/providers), so most of these examples will demonstrate using the container in that context.

> {tip} There is no need to bind structs into the container if they do not depend on any interfaces. The container does not need to be instructed on how to build these objects, since it can automatically resolve these objects using reflection.

#### Simple Bindings

Within a service provider, you always have access to the container via the `app.Container` property. We can register a binding using the `Bind` method, passing the struct or interface that we wish to register along with a `Closure` that returns an instance of the struct:

    app.Container.Bind((*contract.ErrorHandling)(nil), function (app) {
        return logging.Error{app, container.Make(http.Client{}).(http.Client)}
    }

Note that we receive the container itself as an argument to the resolver. We can then use the container to resolve sub-dependencies of the object we are building.

#### Binding A Singleton

The `Singleton` method binds a struct or interface into the container that should only be resolved one time. Once a singleton binding is resolved, the same object instance will be returned on subsequent calls into the container:

	app.Container.Singleton(
		testStruct{},
		func() interface{} {
			return testStruct{}
		},
	)

#### Binding Instances

You may also bind an existing object instance into the container using the `Instance` method. The given instance will always be returned on subsequent calls into the container:

	user := model.NewUser()
	app.Container.Instance("admin.User", user)

<a name="binding-interfaces-to-implementations"></a>
### Binding Interfaces To Implementations

A very powerful feature of the service container is its ability to bind an interface to a given implementation. For example, let's assume we have an `contract.EventPusher` interface and a `redis.EventPusher` implementation. Once we have coded our `redis.EventPusher` implementation of this interface, we can register it with the service container like so:

	app.Bind(
		(*contract.EventPusher)(nil),
		redis.EventPusher{},
	)

This statement tells the container that it should inject the `redis.EventPusher` when a struct needs an implementation of `contract.EventPusher`. Now we can type-hint the `contract.EventPusher` interface in a constructor, or any other location where dependencies are injected by the service container:

	eventPusher := app.Make((*contract.EventPusher)(nil))(contract.EventPusher)

<a name="tagging"></a>
### Tagging

Occasionally, you may need to resolve all of a certain "category" of binding. For example, perhaps you are building a report aggregator that receives an array of many different `Report` interface implementations. After registering the `Report` implementations, you can assign them a tag using the `tag` method:

    $this->app->bind('SpeedReport', function () {
        //
    });

    $this->app->bind('MemoryReport', function () {
        //
    });

    $this->app->tag(['SpeedReport', 'MemoryReport'], 'reports');

Once the services have been tagged, you may easily resolve them all via the `tagged` method:

    $this->app->bind('ReportAggregator', function ($app) {
        return new ReportAggregator($app->tagged('reports'));
    });

<a name="extending-bindings"></a>
### Extending Bindings

The `extend` method allows the modification of resolved services. For example, when a service is resolved, you may run additional code to decorate or configure the service. The `extend` method accepts a Closure, which should return the modified service, as its only argument. The Closure receives the service being resolved and the container instance:

    $this->app->extend(Service::struct, function ($service, $app) {
        return new DecoratedService($service);
    });

<a name="resolving"></a>
## Resolving

<a name="the-make-method"></a>
#### The `make` Method

You may use the `make` method to resolve a struct instance out of the container. The `make` method accepts the name of
 the
 struct or interface you wish to resolve:

    $api = $this->app->make('HelpSpot\API');

If you are in a location of your code that does not have access to the `$app` variable, you may use the global `resolve` helper:

    $api = resolve('HelpSpot\API');

If some of your struct' dependencies are not resolvable via the container, you may inject them by passing them as an
 associative array into the `makeWith` method:

    $api = $this->app->makeWith('HelpSpot\API', ['id' => 1]);

<a name="automatic-injection"></a>
#### Automatic Injection

Alternatively, and importantly, you may "type-hint" the dependency in the constructor of a struct that is resolved by
 the
 container, including [controllers](/docs/{{version}}/controllers), [event listeners](/docs/{{version}}/events), [middleware](/docs/{{version}}/middleware), and more. Additionally, you may type-hint dependencies in the `handle` method of [queued jobs](/docs/{{version}}/queues). In practice, this is how most of your objects should be resolved by the container.

For example, you may type-hint a repository defined by your application in a controller's constructor. The repository
 will automatically be resolved and injected into the struct:

    <?php

    namespace App\Http\Controllers;

    use App\Users\Repository as UserRepository;

    struct UserController extends Controller
    {
        /**
         * The user repository instance.
         */
        protected $users;

        /**
         * Create a new controller instance.
         *
         * @param  UserRepository  $users
         * @return void
         */
        public function __construct(UserRepository $users)
        {
            $this->users = $users;
        }

        /**
         * Show the user with the given ID.
         *
         * @param  int  $id
         * @return Response
         */
        public function show($id)
        {
            //
        }
    }

<a name="container-events"></a>
## Container Events

The service container fires an event each time it resolves an object. You may listen to this event using the `resolving` method:

    $this->app->resolving(function ($object, $app) {
        // Called when container resolves object of any type...
    });

    $this->app->resolving(HelpSpot\API::struct, function ($api, $app) {
        // Called when container resolves objects of type "HelpSpot\API"...
    });

As you can see, the object being resolved will be passed to the callback, allowing you to set any additional properties on the object before it is given to its consumer.

<a name="psr-11"></a>
## PSR-11

Lanvard's service container implements the [PSR-11](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-11
-container.md) interface. Therefore, you may type-hint the PSR-11 container interface to obtain an instance of the
 Lanvard
 container:

    use Psr\Container\ContainerInterface;

    Route::get('/', function (ContainerInterface $container) {
        $service = $container->get('Service');

        //
    });

An exception is thrown if the given identifier can't be resolved. The exception will be an instance of `Psr\Container\NotFoundExceptionInterface` if the identifier was never bound. If the identifier was bound but was unable to be resolved, an instance of `Psr\Container\ContainerExceptionInterface` will be thrown.