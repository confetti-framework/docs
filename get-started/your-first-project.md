
# Your First Project

Where do you start to create an API endpoint? In this guide, we’ll show you how to build your first API endpoint using Confetti. You’ll see how simple it is to create and register an endpoint that returns JSON data.

## Create An API Endpoint

### Controller

Create a function to handle API requests—these functions are called controllers in Confetti. Create a file named `contact_api.go` in your `internal/controllers` directory with the following content:

```go
package controllers

import (
	"net/http"
	"path/to/your/project/internal/pkg/handler" // Adjust the import path as needed.
)

// ContactContactShow handles API requests to retrieve contact information.
func ContactShow(response http.ResponseWriter, request *http.Request) error {
	data := map[string]string{
		"name": "Singh",
		"city": "New Delhi",
	}
	return handler.ToJson(response, data, http.StatusOK)
}
```

*Note:* The `handler.ToJson` function converts your data to JSON and sets the correct response headers automatically. For more details on response handling, refer to the [Response Documentation](../the-basics/responses).

### Route

To expose your API endpoint, register your controller in the API routes file—typically `routes/api.go`. Add the following route registration:

```go
handler.New("GET /contact", controllers.ContactShow),
```

After rebuilding your application, your API endpoint will be available at [http://localhost/contact](http://localhost/contact).

> Tip: For validating incoming data, check out the [Validation Documentation](../the-basics/validation).
