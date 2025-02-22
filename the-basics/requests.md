# Requests

This documentation explains how to access and handle HTTP requests using normal Go code. Whether you’re working directly with the standard library or creating a custom request struct for specific needs, these examples will guide you.

## Accessing The Request

In a typical Go controller, you receive a `*http.Request` object along with the response writer. This object contains all the information sent by the client—such as cookies, headers, the body, and query parameters.

### Example Controller

```go
package controller

import (
	"fmt"
	"net/http"
)

// UserShow handles a request by reading a query parameter "name"
// and writing a simple HTML response.
func UserShow(response http.ResponseWriter, request *http.Request) error {
	// Retrieve a query parameter from the URL.
	name := request.URL.Query().Get("name")
	
	// Write the response.
	fmt.Fprintf(response, "Username: %s", name)
	return nil
}
```

## Accessing The Request Via Route Closures

Registering a route with a callback instead of a predefined function:

```go
var ApiRoutes = []handler.Route{
	handler.New("POST /users", func(response http.ResponseWriter, request *http.Request) error {
    	// Retrieve a query parameter from the URL.
    	name := request.URL.Query().Get("name")
  	
    	// Write the response.
    	fmt.Fprintf(response, "Username: %s", name)
    	return nil
	}),
}
```

## Using a Custom Request Struct

If you need a separate request struct for a specific request to simplify validation or processing, you can define your own. For example:

```go
package request

// CreateUserRequest defines the expected structure of the incoming JSON payload.
type CreateUserRequest struct {
	Name  string `json:"name"`
	Email string `json:"email"`
}
```

Then, in your controller, decode the request body into this struct:

```go
package controller

import (
	"encoding/json"
	"net/http"
	"your_project/request"
)

// CreateUser handles a JSON payload by decoding it into a custom request struct.
func CreateUser(response http.ResponseWriter, request *http.Request) error {
	var reqData request.CreateUserRequest

	if err := json.NewDecoder(request.Body).Decode(&reqData); err != nil {
		http.Error(response, "Invalid request payload", http.StatusBadRequest)
		return
	}

	// Use reqData.Name and reqData.Email as needed.
	response.Write([]byte("User created successfully"))
}
```

## Request Path & Method

You can access the request path, full URL, and method using the standard `*http.Request` fields and methods.

### Retrieving The Request Path

For example, if the URL is `http://domain.com/foo/bar`, the path can be accessed via:

```go
path := request.URL.Path
```

### Retrieving The Request URL

To get the full URL including the query string:

```go
fullUrl := request.URL.String()
```

### Retrieving The Request Method

The HTTP method is available as:

```go
method := request.Method
```

## Retrieving Input Values

### Query Parameters

Retrieve values from the URL query string:

```go
name := request.URL.Query().Get("name")
```

You can also access all query parameters:

```go
queryParams := request.URL.Query()
```

### Form Data

For form submissions (typically via POST), you can parse the form data:

```go
request.ParseForm() // Always check the error in production code
name := request.Form.Get("name")
```

### JSON Body Data

When handling JSON requests, decode the JSON payload into a struct or map:

```go
var payload struct {
	Name string `json:"name"`
}

if err := json.NewDecoder(request.Body).Decode(&payload); err != nil {
	http.Error(response, "Invalid JSON", http.StatusBadRequest)
	return
}
```

### Raw Request Body

To get the raw request body as a string:

```go
import "io"

bodyBytes, err := io.ReadAll(request.Body)
if err != nil {
	http.Error(response, "Error reading body", http.StatusInternalServerError)
	return
}
bodyString := string(bodyBytes)
```

## Retrieving Cookies

Access cookies using the `request.Cookie` method:

```go
cookie, err := request.Cookie("session_id")
if err != nil {
	// handle error or missing cookie
}
sessionID := cookie.Value
```

## Files

### Handling Uploaded Files

For file uploads, use `request.FormFile`:

```go
file, header, err := request.FormFile("photo")
if err != nil {
	http.Error(response, "Error retrieving file", http.StatusBadRequest)
	return
}
defer file.Close()
// header.Filename contains the original filename.
```

## Conclusion

Using standard Go techniques for handling requests provides you with full control and flexibility. Whether you use the default `*http.Request` for most operations or create a custom request struct for specific needs, you can easily access query parameters, form data, JSON payloads, cookies, and file uploads. This approach keeps your application straightforward and idiomatic.
