# Service Providers

- [Introduction](#introduction)
- [Writing Service Providers](#writing-service-providers)
    - [The Register Method](#the-register-method)
    - [The Boot Method](#the-boot-method)
- [Registering Providers](#registering-providers)

## Introduction

Service providers are the central place of all Lanvard application bootstrapping. Your own application, as well as all of Lanvard's core services are bootstrapped via service providers.

Service providers are loaded once (so before requests takes place). And can therefore lead to a performance profit.

But, what do we mean by "bootstrapped"? In general, we mean **registering** things, including registering service container bindings, event listeners, and even routes. Service providers are the central place to configure your application.

If you open the `app/providers/provider.go` file included with Lanvard, you will see a `Providers` struct. These are all the service providers that will be loaded for your application.

In this overview you will learn how to write your own service providers and register them with your Lanvard application.

## Writing Service Providers

All service providers implements the `inter.RegisterServiceProvider` or `inter.BootServiceProvider` interface. The service providers contain a `Register` and/or a `Boot` method. Within the `Register` method, you should **only bind things into the [service container](/docs/{{version}}/container)**. You should never attempt to register any event listeners, routes, or any other piece of functionality within the `Register` method. You can have a service provider with a register and a boot method. Then you have to add this service to the RegisterProviders slice, and the BootProviders slice.

### The Register Method

As mentioned previously, within the `Register` method, you should only bind things into the [service container](/docs/{{version}}/container). You should never attempt to register any event listeners, routes, or any other piece of functionality within the `Register` method. Otherwise, you may accidentally use a service that is provided by a service provider which has not loaded yet.

Let's take a look at a basic service provider. Within any of your service provider methods, you always have access to the `inter.Container` property which provides access to the service container:
    
    package providers
    
    import (
        "github.com/lanvard/foundation"
        "github.com/riak/riak"
    )
    
    type RiakServiceProvider struct{}
    
    // Register any application services.
    func (r RiakServiceProvider) Register(container inter.Container) inter.Container {

        app.Container.Singleton(database.Connection{}, func() {
            return riak.NewConnection()
        })

        return app
    }

This service provider only defines a `Register` method, and uses that method to define an implementation of `riak` in the service container. If you don't understand how the service container works, check out [its documentation](/docs/{{version}}/container).

### The Boot Method

So, what if we need to register a [~~view composer~~](/docs/{{version}}/views#view-composers) within our service provider? This should be done within the `Boot` method. **This method is called after all other service providers have been registered**, meaning you have access to all other services that have been registered by the framework:
    
    package providers
    
    import (
        "github.com/lanvard/foundation"
        "github.com/lanvard/view"
        user_repository "lanvard/app/repository/user"
    )
    
    type ComposerServiceProvider struct{}
    
    // Register any application services.
    func (r ComposerServiceProvider) Boot(container inter.Container) inter.Container {

        view.Composer("all_users", func() {
            return user_repository.AllUsers()
        })

        return app
    }

#### Boot Method Dependency Injection

You may use Container for your dependencies in your service provider's `Boot` method. The [service container](/docs/{{version}}/container) will automatically inject any dependencies you need:

    func (r ComposerServiceProvider) Boot(container inter.Container) inter.Container {

        eventPusher := app.Make("EventPusher")(contract.EventPusher)
        
        //

        return app
    }

## Registering Providers

All service providers are registered in the `app/providers/provider.go` file. This file contains a `Providers` struct where you can list the struct names of your service providers. By default, a set of Lanvard core service providers are listed in this struct. These providers bootstrap the core Lanvard components, such as the mailer, queue, cache, and others.

To register your provider, add it to the slices:

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
    
If you have a service provider with a register and a boot method, you have to add this service to the RegisterProviders slice, and the BootProviders slice.
