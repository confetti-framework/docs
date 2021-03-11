# Service Providers
<ToggleDarkMode/>

## Introduction

Service providers are the central place of all Confetti application bootstrapping. Your own application, as well as all of Confetti's core services are bootstrapped via service providers.

Service providers are loaded once (so before requests takes place). And can therefore lead to a performance profit.

But, what do we mean by "bootstrapped"? In general, we mean **registering** things, including registering service container bindings, event listeners, and even routes. Service providers are the central place to configure your application.

If you open the `app/providers/provider.go` file included with Confetti, you will see a `Providers` struct. These are all the service providers that will be loaded for your application.

In this overview you will learn how to write your own service providers and register them with your Confetti application.

## Writing Service Providers

All service providers implements the `inter.RegisterServiceProvider` or `inter.BootServiceProvider` interface. The service providers contain a `Register` and/or a `Boot` method. Within the `Register` method, you should **only bind things into the [service container](container)**. You should never attempt to register any event listeners, routes, or any other piece of functionality within the `Register` method. You can have a service provider with a register and a boot method. Then you have to add this service to the RegisterProviders slice, and the BootProviders slice.

### The Register Method

As mentioned previously, within the `Register` method, you should only bind things into the [service container](container). You should never attempt to register any event listeners, routes, or any other piece of functionality within the `Register` method. Otherwise, you may accidentally use a service that is provided by a service provider which has not loaded yet.

Let's take a look at a basic service provider. Within any of your service provider methods, you always have access to the `inter.Container` property which provides access to the service container:

``` go
package providers

import (
    "github.com/confetti-framework/foundation"
    "github.com/riak/riak"
)

type RiakServiceProvider struct{}

// Register any application services.
func (r RiakServiceProvider) Register(container inter.Container) inter.Container {

    container.Singleton(database.Connection{}, func() {
        return riak.NewConnection()
    })

    return container
}
```

This service provider only defines a `Register` method, and uses that method to define an implementation of `riak` in the service container. If you don't understand how the service container works, check out [its documentation](container).

### The Boot Method

The `Boot` method is called after all other service providers have been registered, meaning you have access to all other
services that have been registered by the framework:

``` go
type DataDog struct{}

func (d DataDog) Boot(container inter.Container) inter.Container {
    _, err := statsd.New("127.0.0.1:8125")
    if err != nil {
        panic(err)
    }

    return container
}
```

#### Boot Method Dependency Injection

You may use Container for your dependencies in your service provider's `Boot` method. The [service container](container) will automatically inject any dependencies you need:

``` go
func (r ComposerServiceProvider) Boot(container inter.Container) inter.Container {
    eventPusher := container.Make("EventPusher").(contract.EventPusher)
    //

    return container
}
````

## Registering Providers

All service providers are registered in the `app/providers/provider.go` file. This file contains a `Providers` struct where you can list the struct names of your service providers. By default, a set of Confetti core service providers are listed in this struct. These providers bootstrap the core Confetti components, such as the mailer, queue, cache, and others.

To register your provider, add it to the slices:

``` go
RegisterProviders: []decorator.RegisterServiceProvider{
    providers.AppServiceProvider{},
    providers.ComposerServiceProvider{},

    //
},
BootProviders: []decorator.BootServiceProvider{
    providers.AppServiceProvider{},
    providers.RouteServiceProvider{},
    providers.ComposerServiceProvider{},

    //
},
```

If you have a service provider with a register and a boot method, you have to add this service to the RegisterProviders slice, and the BootProviders slice.
