# Service Providers

- [Introduction](#introduction)
- [Writing Service Providers](#writing-service-providers)
    - [The Register Method](#the-register-method)
    - [The Boot Method](#the-boot-method)
- [Registering Providers](#registering-providers)
- [Deferred Providers](#deferred-providers)

<a name="introduction"></a>
## Introduction

Service providers are the central place of all Lanvard application bootstrapping. Your own application, as well as all of Lanvard's core services are bootstrapped via service providers.

Service providers are loaded once (so before requests takes place). And can therefore lead to a performance profit.

But, what do we mean by "bootstrapped"? In general, we mean **registering** things, including registering service container bindings, event listeners, and even routes. Service providers are the central place to configure your application.

If you open the `config/providers/provider.go` file included with Lanvard, you will see a `providers` struct. These are all of the service provider classes that will be loaded for your application.

In this overview you will learn how to write your own service providers and register them with your Lanvard application.

> Tests: [foundation/test/container_test.go](https://github.com/lanvard/foundation/blob/master/test/container_test.go)

<a name="writing-service-providers"></a>
## Writing Service Providers

All service providers implements the `RegisterServiceProvider` or `BootServiceProvider` interface. The service providers contain a `Register` and/or a `Boot` method. Within the `Register` method, you should **only bind things into the [service container](/docs/{{version}}/container)**. You should never attempt to register any event listeners, routes, or any other piece of functionality within the `Register` method. You can have a service provider with a register and a boot method. Than you have to add this service to the RegisterProviders slice and the BootProviders slice.

<a name="the-register-method"></a>
### The Register Method

As mentioned previously, within the `Register` method, you should only bind things into the [service container](/docs/{{version}}/container). You should never attempt to register any event listeners, routes, or any other piece of functionality within the `Register` method. Otherwise, you may accidentally use a service that is provided by a service provider which has not loaded yet.

Let's take a look at a basic service provider. Within any of your service provider methods, you always have access to the `app` property which provides access to the service container:
    
    package providers
    
    import (
        "github.com/lanvard/foundation"
        "github.com/riak/riak"
    )
    
    type RiakServiceProvider struct{}
    
    // Register any application services.
    func (r RiakServiceProvider) Register(app *foundation.Application) *foundation.Application {

        app.Container.Singleton(database.connection, func() {
            return riak.NewConnection()
        })

        return app
    }

This service provider only defines a `Register` method, and uses that method to define an implementation of `riak` in the service container. If you don't understand how the service container works, check out [its documentation](/docs/{{version}}/container).

<a name="the-boot-method"></a>
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
    func (r ComposerServiceProvider) Boot(app *foundation.Application) *foundation.Application {

        view.Composer("all_users", func() {
            return user_repository.AllUsers()
        })

        return app
    }

#### Boot Method Dependency Injection

You may use foundation.Application for your dependencies in your service provider's `boot` method. The [service container](/docs/{{version}}/container) will automatically inject any dependencies you need:

    func (r ComposerServiceProvider) Boot(app *foundation.Application) *foundation.Application {

        eventPusher := app.Make("EventPusher")(contract.EventPusher)
        
        //

        return app
    }

<a name="registering-providers"></a>
## Registering Providers

All service providers are registered in the `config/providers/providers.go` configuration file. This file contains a `Providers` struct where you can list the struct names of your service providers. By default, a set of Lanvard core service providers are listed in this struct. These providers bootstrap the core Lanvard components, such as the mailer, queue, cache, and others.

To register your provider, add it to the slices:

	RegisterProviders: []decorator.RegisterServiceProvider{
		providers.ComposerServiceProvider{},
		
		//
	},
    BootProviders: []decorator.BootServiceProvider{
        providers.ComposerServiceProvider{},
        
        //
    },
    
If you have a service provider with a register and a boot method. Than you have to add this service to the RegisterProviders slice and the BootProviders slice.
