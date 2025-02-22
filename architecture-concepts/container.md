Below is the full, updated documentation with the "Comparison with Other Frameworks" section moved to the top and the "Introduction" section renamed to "Basics":

---

# Context

## Comparison with Other Frameworks

In many other web frameworks, such as Ruby on Rails and Laravel, dependency injection is typically handled through a service container. These frameworks use a central registry to resolve dependencies automatically. In contrast, Go’s approach with `context.Context` is more explicit. While it requires passing context manually, it avoids hidden dependencies and global state, making applications easier to understand and test.

## Basics

The Confetti CMS uses Go's `context.Context` to manage dependencies and handle dependency injection in a structured and idiomatic way. Dependency injection is a design pattern where struct dependencies are provided externally rather than created inside the struct itself.

Let's look at a simple example:

```go
ctx := request.Context()
ctx = context.WithValue(ctx, "userRepository", NewUserRepository())
```

In this example, the `User` struct needs to retrieve users from a data source. We **inject** a service that retrieves users via `context.WithValue`, allowing us to easily swap out implementations or mock dependencies for testing.

A deep understanding of how `context` works in Confetti CMS is essential for building scalable applications and contributing to the Confetti core.

## Using Context for Dependency Injection

### Adding Values to Context

You can add dependencies to a `context.Context` instance using `context.WithValue`:

```go
ctx := context.WithValue(request.Context(), "db", NewDatabaseConnection())
```

This allows you to pass dependencies down through the request lifecycle without modifying function signatures.

### Retrieving Values from Context

To access values stored in the context, use `request.Context().Value`:

```go
db := request.Context().Value("db").(*DatabaseConnection)
```

### Passing Context in Controllers

When handling HTTP requests in a controller, extract the context from the request:

```go
func Contact(response http.ResponseWriter, request *http.Request) error {
    ctx := request.Context()
    userRepo := ctx.Value("userRepository").(UserRepository)
    users := userRepo.GetAll()
    return json.NewEncoder(response).Encode(users)
}
```

## Passing Context to Multiple Methods

In most cases, context needs to be passed deeper into the application. This ensures that dependencies remain accessible throughout different layers of the application.

```go
func CreateUser(response http.ResponseWriter, request *http.Request) error {
    ctx := request.Context()
    users, err := processBusinessLogic(ctx)
    if err != nil {
        return err
    }
    return json.NewEncoder(response).Encode(users)
}

func processBusinessLogic(ctx context.Context) ([]User, error) {
    db, ok := ctx.Value("db").(*DatabaseConnection)
    if !ok {
        return nil, errors.New("database connection not found in context")
    }
    users := fetchUsers(ctx, db)
    return users, nil
}

func fetchUsers(ctx context.Context, db *DatabaseConnection) []User {
    return db.GetUsers()
}
```

This pattern ensures that all methods have access to the necessary dependencies without relying on global state.

## Binding Dependencies

### Singleton Dependencies

For dependencies that should persist throughout the application lifecycle (not only the request lifecycle), create a package `singleton` and call `singleton.Boot()` in `cmd/api/main.go` before we handle the commands (and requests):

```go
package singleton

import (
	"context"
	"time"
)

var Ctx context.Context

func init() {
    Ctx = context.Background()
}

func Boot() {
    Ctx = context.WithValue(Ctx, "app_started_at", time.Now())
}
```

#### Accessing the Singleton Value

Anywhere in your code, you can import the `singleton` package and use `singleton.Ctx` to retrieve the global context. For example, in an HTTP handler you might want to show when the application started:

```go
package handler

import (
	"fmt"
	"net/http"
	"time"
	"myapp/singleton"
)

func PrintStartedAt(w http.ResponseWriter, r *http.Request) error {
    // Retrieve the application start time from the global context.
    startTime, ok := singleton.Ctx.Value("app_started_at").(time.Time)
    if !ok {
        return handler.NewSystemError(error.New("Application start time unavailable"), "processing_error")
    }
    
    fmt.Fprintf(w, "Application started at: %v", startTime)

    return nil
}
```

### Using Context in Middleware

Middleware can be used to inject dependencies dynamically into the request context. Below is the simplified middleware example that generates a random request ID using a random string and attaches it to the context.

```go
package middleware

import (
	"context"
	"fmt"
	"math/rand"
	"net/http"

	"src/internal/pkg/handler"
)

// RequestIDMiddleware adds a unique request ID to the context for each request.
type RequestIDMiddleware struct{}

// Handle generates a random request ID and attaches it to the context.
func (m RequestIDMiddleware) Handle(next handler.Controller) handler.Controller {
	return func(response http.ResponseWriter, request *http.Request) error {
		// Generate a random request ID.
		reqID := fmt.Sprintf("req-%d", rand.Intn(1000000))
		// Attach the request ID to the request context.
		ctx := context.WithValue(request.Context(), "requestID", reqID)
		// Proceed with the next handler, passing the modified request.
		return next(response, request.WithContext(ctx))
	}
}
```

## Resolving Dependencies

### Resolving from Context

Retrieve values from the context:

```go
logger := request.Context().Value("logger").(Logger)
logger.Log("Application started")
```

### Handling Missing Values Gracefully

Since `ctx.Value` returns `interface{}`, always check for `nil` before type assertion:

```go
if val := request.Context().Value("nonexistentKey"); val != nil {
    value := val.(string)
    fmt.Println(value)
} else {
    fmt.Println("Key not found in context")
}
```
