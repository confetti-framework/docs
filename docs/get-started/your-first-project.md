# Your First Project

Where do you start to create a page or set up an API endpoint? Here is a brief explanation of the steps you can take to create your first application. We will explain how to create a page and how to create an API endpoint. You will soon see that the possibilities are endless.

## Create A Web Page

Confetti has a homepage ready by default. For now, we will create a contact page.

### Controller

First, you want to create a function where the request comes in and a response is returned. We call that type of function a controller. Make a file `contact.go` in `app/http/controllers` with the following content:

``` go
package controllers

import (
	"github.com/confetti-framework/contract/inter"
	"github.com/confetti-framework/routing/outcome"
)

func Contact(request inter.Request) inter.Response {
	return outcome.Html("Hello world")
}
```
This is the place where you can place your logic. Of course you can make other functions and structs to keep everything organized.

Now we return HTML directly. Usually it is better to use a view and template for this. It is advisable to read the [View Documentation](../the-basics/views). If you want to get values from the request, then you can read the [Request Documentation](../the-basics/requests).

### Route

In order for Confetti to know which controller belongs to which url, you must register your controller in `routes/web.go`. There you can also see how the homepage has already been set. Add `Get("/contact", controllers.Contact),` to register your contact controller. View the [Route Documentation](../the-basics/routing) for more information.

Once your code is rebuilt, the contact page is available at [http://localhost/contact](http://localhost/contact).

## Create An API Endpoint

If you don't want to build a page, but want to transfer another data, you would want to use API endpoints. Confetti makes it very easy to create these endpoints.

### Controller

Again, you need a function where you determine what should be done and what should be returned. Make a file `contact.go` in `app/http/controllers` with the following content:

``` go
package controllers

import (
	"github.com/confetti-framework/contract/inter"
	"github.com/confetti-framework/routing/outcome"
)

func Contact(request inter.Request) inter.Response {
	data := map[string]string{
		"name": "Singh",
		"city": "New Delhi",
	}
	return outcome.Json(data)
}

```

`outcome.Json(data)` is responsible for converted the data to json and it automatically gets the correct headers. More information about responses, consult the [Response Documentation](../the-basics/responses). If you want to get values from the request, then you can read the [Request Documentation](../the-basics/requests). It is recommended to validate incoming data. Take a look at the [Validation Documentation](../the-basics/validation).

### Route

Of course Confetti must know at which url this function should be addressed. You can register your controller in `routes/api.go`. There you can also see how the ping endpoint has already been set. Add `Get("/contact", controllers.Contact),` to register your contact controller. View the [Route Documentation](../the-basics/routing) for more information.

Once your code is rebuilt, the contact page is available at [http://localhost/api/contact](http://localhost/api/contact).

> If you want to make your endpoints available through a subdomain (for example `http://api.localhost/contact`), look at the [Subdomain Routing](../the-basics/routing.html#subdomain-routing) section.
