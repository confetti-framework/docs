# Meet Confetti

Confetti is a web framework written in Go (Golang).
The web framework consists of the most important components to create your application.
The goal of Confetti is to give you all the tools you need to write fast, secure and scalable code.

Whether you are new to Go or web frameworks or have years of experience, Confetti is a perfect framework that fits into any web development project.

## Why Confetti?

Writing good Go code is often different than you are used to.
You are used to habits from Ruby on Rails or Laravel, for example.
Providing a standard for all the necessary features can really help you.

> Confetti combines the elegance of a framework and the simplicity of Go.

## Feel at home

If you feel at home, we have achieved a goal. Here is an example to make you feel at home. If you don't understand the following, don't feel overwhelmed. The documentation will guide you.

``` go
package status

func Index(response http.ResponseWriter, request *http.Request) error {
	// Create a map to store the CPU information
	data := map[string]any{}

	// Get the number of CPUs and store in the map
	data["status"] = "active"

	return handler.ToJson(response, data, http.StatusOK)
}
```

With built-in routing and middlewares:
```go
var ApiRoutes = []handler.Route{
	handler.New("GET /status", status.Index).AppendMiddleware(auth.Middleware("status/index")),
}
```
