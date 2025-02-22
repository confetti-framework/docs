# Middleware in Confetti

## Introduction

Middleware are components that sit between the incoming HTTP request and your controller logic. They allow you to execute code before and/or after a request is handled. This is particularly useful for tasks such as authentication, logging, request modification, and response transformation. In Confetti, middleware helps keep your controller code clean by handling cross-cutting concerns in a centralized manner.

## Creating a Middleware

A middleware in Confetti is typically implemented as a type that provides a `Handle` method. This method wraps your controller function, allowing you to execute custom logic before and/or after the controller is called.

### Basic Middleware Example

Below is an example of a simple logging middleware that logs the request method and URL before passing control to the next handler:

```go
package middleware

import (
	"log"
	"net/http"
	"src/internal/pkg/handler"
)

// LoggingMiddleware is a simple middleware that logs requests.
type LoggingMiddleware struct{}

// Handle wraps a controller with logging functionality.
func (l LoggingMiddleware) Handle(next handler.Controller) handler.Controller {
	return func(w http.ResponseWriter, req *http.Request) error {
		// Before: Log the incoming request
		log.Printf("Incoming request: %s %s", req.Method, req.URL.Path)
		
		// Call the next handler in the chain
		err := next(w, req)
		
		// After: Optionally log the outcome (if needed)
		if err != nil {
			log.Printf("Error processing request: %v", err)
		}
		
		return err
	}
}
```

## Registering Middleware

Once you’ve created your middleware, you need to register it with your routes. In Confetti, routes are defined with the helper `handler.New` function. You can append middleware to a route using a method like `AppendMiddleware`.

### Registering a Middleware for a Route

Below is an example of how to register the `LoggingMiddleware` with a specific route:

```go
package routes

import (
	"src/internal/pkg/handler"
	"src/internal/controllers"
	"src/internal/middleware"
)

var ApiRoutes = []handler.Route{
	handler.New("GET /api/example", controllers.ExampleController).
		AppendMiddleware(middleware.LoggingMiddleware{}),
}
```

In this example, every time the `/api/example` endpoint is hit, the `LoggingMiddleware` will execute before the `ExampleController` is called.

## Handy Middleware Examples

### 1. Authentication Middleware

This middleware checks whether the request contains the proper authentication token or permission before allowing it to proceed.

```go
package middleware

import (
	"net/http"
	"src/internal/pkg/handler"
)

// AuthMiddleware checks for the required permission.
type AuthMiddleware struct {
	Permission string
}

// Handle wraps a controller with authentication logic.
func (a AuthMiddleware) Handle(next handler.Controller) handler.Controller {
	return func(w http.ResponseWriter, req *http.Request) error {
		// Perform authentication check (this is just a placeholder).
		if req.Header.Get("Authorization") == "" {
			return handler.NewUserError("Unauthorized: missing token", http.StatusUnauthorized)
		}
		// Optionally check for specific permissions.
		// if !hasPermission(req, a.Permission) { ... }

		// Proceed to the next handler if authenticated.
		return next(w, req)
	}
}
```

### 2. Request Validation Middleware

This middleware validates the incoming request data before it reaches the controller.

```go
package middleware

import (
	"encoding/json"
	"net/http"
	"src/internal/pkg/handler"
)

// ValidateMiddleware ensures that the request body conforms to expected structure.
type ValidateMiddleware struct{}

// Handle parses and validates the request body.
func (v ValidateMiddleware) Handle(next handler.Controller) handler.Controller {
	return func(w http.ResponseWriter, req *http.Request) error {
		var data map[string]any
		decoder := json.NewDecoder(req.Body)
		if err := decoder.Decode(&data); err != nil {
			return handler.NewUserError("Invalid request payload", http.StatusBadRequest)
		}

		// You could attach validated data to the request context here.
		// For simplicity, we proceed to the next handler.
		return next(w, req)
	}
}
```

## Conclusion

Middleware in Confetti offers a powerful and flexible way to handle common tasks such as logging, authentication, and validation without cluttering your controller logic. By creating reusable middleware components and registering them with your routes, you can ensure a clean separation of concerns, maintainable code, and a consistent behavior across your application.
