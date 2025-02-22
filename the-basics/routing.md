# Routing in Confetti CMS

This documentation explains how to handle HTTP requests in Confetti CMS using standard Go techniques and the built-in routing system with `handler.New()`. This provides full control over routes and middleware without external libraries.

## Defining Routes

Routes are defined using `handler.New("METHOD PATH", handlerFunc)`. Middleware can be added via `.AppendMiddleware()`.

### Example:

```go
var ApiRoutes = []handler.Route{
	handler.New("GET /ping", ping.Index),
	handler.New("GET /status", status.Index).AppendMiddleware(middleware.AuthMiddleware{Permission: "Show status"}),
}
```

The `GET /ping` route is added without middleware, while the `GET /status` route requires authentication with the appropriate permission.

## Controller Structure

Controllers must use the following function signature:

```go
func Index(response http.ResponseWriter, request *http.Request) error {
    // Processing logic here
    return nil
}
```

### Parameters:
- **response**: The `http.ResponseWriter` used to write the response.
- **request**: The `*http.Request` containing the incoming request.
- **error**: Returns an error if a problem occurs.

## Enhanced Routing Patterns

The Go 1.22+ routing system allows for more expressive patterns:

### Method-Specific Routes

Routes can be defined with HTTP methods for stricter matching. For example, `POST /items/create` ensures only `POST` requests are allowed for that route.

### Wildcard Parameters

- `{param}` captures a single path segment and can be retrieved using `request.PathValue("param")`.
- `{param...}` matches multiple segments at the end of a path.

Example:

```go
func ShowFile(response http.ResponseWriter, request *http.Request) error {
    filePath := request.PathValue("path")
    fmt.Fprintf(response, "File path: %s", filePath)
    return nil
}
```

For the route `GET /files/{path...}`, `path` captures all remaining segments.

### Exact Matches

To ensure an exact match with a trailing slash, use `{$}`:

```go
handler.New("GET /users/{$}", user.List)
```

## Working with Route Parameters

Confetti CMS uses the built-in Go 1.22+ `request.PathValue()` function to retrieve route parameters.

### Example:

```go
func ShowUser(response http.ResponseWriter, request *http.Request) error {
    userID := request.PathValue("id")
    fmt.Fprintf(response, "User ID: %s", userID)
    return nil
}
```

For a route like `GET /users/{id}`, the `{id}` value is retrieved using `request.PathValue("id")`.

## Query Parameters

Query parameters can be extracted directly from the `*http.Request`:

```go
func Search(response http.ResponseWriter, request *http.Request) error {
    query := request.URL.Query().Get("q")
    fmt.Fprintf(response, "Search results for: %s", query)
    return nil
}
```

## Redirects

To implement a redirect in an idiomatic Go way:

```go
func RedirectToHome(response http.ResponseWriter, request *http.Request) error {
    http.Redirect(response, request, "/home", http.StatusFound)
    return nil
}
```

## Regular Expression Constraints

Regular expressions can be used in routes to validate parameters. Example:

```go
var ApiRoutes = []handler.Route{
    handler.New("GET /product/{id:[0-9]+}", product.Show),
}
```

Here, `{id}` is restricted to numeric values (`[0-9]+`).

## Form Data

To process form submissions, first parse the form data:

```go
func ProcessForm(response http.ResponseWriter, request *http.Request) error {
    request.ParseForm()
    name := request.Form.Get("name")
    fmt.Fprintf(response, "Received name: %s", name)
    return nil
}
```

## Raw Request Body

To read the raw request body:

```go
import "io"

func ReadBody(response http.ResponseWriter, request *http.Request) error {
    bodyBytes, err := io.ReadAll(request.Body)
    if err != nil {
        http.Error(response, "Error reading body", http.StatusInternalServerError)
        return err
    }
    bodyString := string(bodyBytes)
    fmt.Fprintf(response, "Request body: %s", bodyString)
    return nil
}
```

## Handling Cookies

Retrieve cookies using:

```go
func GetSessionCookie(response http.ResponseWriter, request *http.Request) error {
    cookie, err := request.Cookie("session_id")
    if err != nil {
        http.Error(response, "Session cookie missing", http.StatusUnauthorized)
        return err
    }
    fmt.Fprintf(response, "Session ID: %s", cookie.Value)
    return nil
}
```

## Handling File Uploads

For file uploads, use `request.FormFile()`:

```go
func UploadFile(response http.ResponseWriter, request *http.Request) error {
    file, header, err := request.FormFile("photo")
    if err != nil {
        http.Error(response, "Error retrieving file", http.StatusBadRequest)
        return err
    }
    defer file.Close()
    fmt.Fprintf(response, "Uploaded file: %s", header.Filename)
    return nil
}
```
