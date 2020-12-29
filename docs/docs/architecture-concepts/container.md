# Service Container

## Introduction

The Confetti service container is a powerful tool for managing struct dependencies and performing dependency injection. Dependency injection is a fancy phrase that essentially means this: struct dependencies are "injected" into the struct via the constructor or, in some cases, "setter" methods.

Let's look at a simple example:

``` go
package model

import (
    "github.com/confetti-framework/contract/inter"
    "github.com/confetti-framework/foundation"
    "confetti/app/repository"
)

type User struct {
    app        inter.App
    repository repository.User
}

func NewUser(app inter.App) User {

    // Receive the repository from the application container
    userRepository := app.Make(repository.User{})(repository.User)

    return User{app: app, repository: userRepository}
}

func (u User) IsAdmin() bool {
    return u.repository.HasRole(u, "admin")
}
```

In this example, the `User` struct needs to retrieve users from a data source. So, we will **inject** a service is able to retrieve users. In this context, our `User` struct most likely uses `UserRepository` to retrieve user information from the database. However, since the repository is injected, we are able to easily swap it out with another implementation. We are also able to easily "mock", or create a dummy implementation of the `repository.User` when testing our application.

A deep understanding of the Confetti service container is essential to building a powerful, large application, as well as for contributing to the Confetti core itself.

## Binding

### Binding Basics

Almost all of your service container bindings will be registered within [service providers](providers), so most of these examples will demonstrate using the container in that context.

> There is no need to bind structs into the container if they do not depend on any interfaces. The container does not need to be instructed on how to build these objects, since it can automatically resolve these objects using reflection.

#### Simple Bindings

We can register a binding using the `Bind` method, passing the struct or interface that we wish to register along with a `Closure` that returns an instance of the struct:

``` go
app.Bind((*contract.ErrorHandling)(nil), function () {
    return logging.Error{app, app.Make(http.Client{}).(http.Client)}
}
```

Note that we can then use the container to resolve sub-dependencies of the object we are building.

#### Binding A Singleton

The `Singleton` method binds a struct or interface into the container that should only be resolved one time. Once a singleton binding is resolved, the same object instance will be returned on subsequent calls into the container:

``` go
app.Singleton(
    model.User{},
    func() interface{} {
        return model.User{}
    },
)
```

#### Binding Instances

You may also bind an existing object instance into the container using the `Instance` method. The given instance will always be returned on subsequent calls into the container:

``` go
user := model.NewUser()
app.Instance("admin.User", user)
```

### Binding Interfaces To Implementations

A very powerful feature of the service container is its ability to bind an interface to a given implementation. For example, let's assume we have an `contract.EventPusher` interface and a `redis.EventPusher` implementation. Once we have coded our `redis.EventPusher` implementation of this interface, we can register it with the service container like so:

``` go
app.Bind(
    (*contract.EventPusher)(nil),
    redis.EventPusher{},
)
```

This statement tells the container that it should inject the `redis.EventPusher` when a struct needs an implementation of `contract.EventPusher`. Now we can type-hint the `contract.EventPusher` interface in a constructor, or any other location where dependencies are injected by the service container:

``` go
eventPusher := app.Make((*contract.EventPusher)(nil))(contract.EventPusher)
```

### Binding Without Abstract

If you want to bind a struct, but do not want to use an abstract, you can also omit the abstract:

``` go
app.BindStruct(http.Client{})

client := app.Make(http.Client{}).(http.Client)
```

### Extending Bindings

The `Extend` method allows the modification of resolved services. For example, when a service is resolved, you may run additional code to decorate or configure the service. The `Extend` method accepts a Closure, which should return the modified service, as its only argument. The Closure receives the service being resolved and the container instance:

``` go
(*app.Container()).Extend(redis.connection{}, func(service interface{}) interface{} {
    service := service.(redis.Connection)
    service.SetName("cache")

    return service
})
```

## Resolving

You may use the `Make` method to resolve a struct instance out of the container. The `Make` method accepts the name of the struct or interface you wish to resolve:

``` go
kernel := app.Make("http.kernel").(http.Kernel)
```
