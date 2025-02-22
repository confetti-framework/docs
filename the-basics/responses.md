# Responses

This document explains how to create and manage HTTP responses using idiomatic Go code. In these examples, you'll see how to set headers, write response bodies, attach cookies, and handle redirects—all using the standard library.

In idiomatic Go, it is perfectly acceptable to place logic in extra functions—as long as those functions are clear and straightforward. For example, we use a helper function (helper.ToJson) that is simple and can be easily adapted to your needs.

For JSON responses, we now use a helper function:

```go
return handler.ToJson(response, result, http.StatusCreated)
```

Feel free to customize the `handler.ToJson` function in `media/internal/pkg/handler/response.go` or create other response types as needed.

## Creating Basic Responses

### Simple String Response

For a simple HTML or plain text response, set the appropriate `Content-Type` header and write the response body:

```go
func Index(response http.ResponseWriter, request *http.Request) error {
    // Set the Content-Type header
    response.Header().Set("Content-Type", "text/html")
    // Write the HTML string as the response body
    _, err := response.Write([]byte("Hello World"))
    return err
}
```

### JSON Response

To return JSON data, use the helper function. For example, returning a slice as JSON:

```go
func GetNumbers(response http.ResponseWriter, request *http.Request) error {
    result := []int{1, 2, 3}
    return handler.ToJson(response, result, http.StatusCreated)
}
```

## Customizing the Response

### Setting Status Codes and Headers

You can set custom HTTP status codes and add multiple headers before writing the response body:

```go
func Home(response http.ResponseWriter, request *http.Request) error {
    // Set custom headers
    response.Header().Set("Content-Type", "text/plain")
    response.Header().Set("X-Custom-Header", "Header Value")
    // Write the HTTP status code (must be set before writing the body)
    response.WriteHeader(http.StatusOK)
    // Write the response body
    _, err := response.Write([]byte("Hello World"))
    return err
}
```

### Attaching Multiple Headers

Simply call `Header().Set` for each header you need to add:

```go
func CoolStuff(response http.ResponseWriter, request *http.Request) error {
    response.Header().Set("Content-Type", "text/markdown; charset=UTF-8")
    response.Header().Set("X-Header-One", "Header Value")
    _, err := response.Write([]byte("# Cool Stuff"))
    return err
}
```

### Attaching Cookies

Use the standard `http.SetCookie` function to attach cookies to the response:

```go
func SetCookieExample(response http.ResponseWriter, request *http.Request) error {
    cookie := http.Cookie{
        Name:  "request_id",
        Value: "aGdsf89hA3jr2",
        // Optionally add Path, Domain, etc.
    }
    http.SetCookie(response, &cookie)
    response.Header().Set("Content-Type", "text/html")
    _, err := response.Write([]byte("Cookie has been set"))
    return err
}
```

## Redirects

### Temporary and Permanent Redirects

Redirects in Go are handled using `http.Redirect`, which sets the appropriate headers and status code:

```go
func Dashboard(response http.ResponseWriter, request *http.Request) error {
    // Permanent redirect to "/home/dashboard"
    http.Redirect(response, request, "/home/dashboard", http.StatusPermanentRedirect)
    return nil
}

func Login(response http.ResponseWriter, request *http.Request) error {
    // Temporary redirect to "/under_construction"
    http.Redirect(response, request, "/under_construction", http.StatusFound)
    return nil
}
```

### Redirecting to External Domains

To redirect to an external URL, simply specify the full URL:

```go
func RedirectExternal(response http.ResponseWriter, request *http.Request) error {
    http.Redirect(response, request, "https://github.com/confetti-framework", http.StatusFound)
    return nil
}
```

## Other Response Types

### JSON Response with a Map

Here's an example of returning JSON data using a map:

```go
func JSONResponse(response http.ResponseWriter, request *http.Request) error {
    data := map[string]string{
        "name":  "abigail",
        "state": "CA",
    }
    return handler.ToJson(response, data, http.StatusCreated)
}
```

> **Note:** Feel free to customize the `handler.ToJson` function in `media/internal/pkg/handler/response.go` or create other response types as needed.

### JSON Resource

You can also define a struct to represent your data and return it as JSON:

```go
// UserResource represents the JSON structure for a user.
type UserResource struct {
    Name  string `json:"name"`
    State string `json:"state"`
}

func StructJSONResponse(response http.ResponseWriter, request *http.Request) error {
    user := UserResource{
        Name:  "abigail",
        State: "CA",
    }
    return handler.ToJson(response, user, http.StatusCreated)
}
```

### Rendering a View (Template)

To render an HTML view using Go templates, parse and execute the template, writing the output directly to the response:

```go
import (
    "html/template"
    "net/http"
)

func HomePage(response http.ResponseWriter, request *http.Request) error {
    response.Header().Set("Content-Type", "text/html")
    tmpl, err := template.New("homepage").Parse("<h1>Hello, {{.}}</h1>")
    if err != nil {
        http.Error(response, "Template error", http.StatusInternalServerError)
        return err
    }
    return tmpl.Execute(response, "James")
}
```

### File Downloads

For file downloads, set the `Content-Disposition` header to force a download and use `http.ServeFile`:

```go
func Download(response http.ResponseWriter, request *http.Request) error {
    filePath := "path/to/file.pdf"
    // Set the header to force download with a custom filename
    response.Header().Set("Content-Disposition", "attachment; filename=\"label.pdf\"")
    response.Header().Set("Content-Type", "application/pdf")
    http.ServeFile(response, request, filePath)
    return nil
}
```

### Streamed Downloads

To generate a download from in-memory content without writing a file to disk:

```go
func StreamedDownload(response http.ResponseWriter, request *http.Request) error {
    content := "%PDF-1.5"
    response.Header().Set("Content-Disposition", "attachment; filename=\"labels.pdf\"")
    response.Header().Set("Content-Type", "application/pdf")
    _, err := response.Write([]byte(content))
    return err
}
```

### Show File in Browser

To display a file (e.g., a PDF) directly in the browser without forcing a download, set the `Content-Disposition` to inline:

```go
func ShowInBrowser(response http.ResponseWriter, request *http.Request) error {
    content := "%PDF-1.5"
    response.Header().Set("Content-Disposition", "inline")
    response.Header().Set("Content-Type", "application/pdf")
    _, err := response.Write([]byte(content))
    return err
}
```
