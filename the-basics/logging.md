# Logging and Error Reporting in Confetti

## Introduction

In Go, logging is typically handled using the built-in `log` package, which lets you record informational messages, warnings, and errors. Confetti leverages this approach to provide a consistent, centralized mechanism for error reporting. All errors returned by your controllers are processed by a central error handler, and the default logging behavior can be customized by modifying the file `internal/pkg/handler/error.go`.

## Logging in Go

Go’s standard `log` package is simple and effective. For example:

```go
import "log"

func main() {
    log.Println("This is an informational message.")
    log.Printf("Formatted message: %s", "example")
}
```

This approach prints messages to standard output by default, but you can easily reconfigure it to log to files or external systems if necessary.

## Logging in Confetti

In Confetti, your controllers only need to return errors when something goes wrong. The framework’s centralized error handler logs these errors and sends appropriate responses to the client. This separation of concerns means your controller code stays focused on business logic.

### How It Works

1. **Controller Returns an Error:**  
   Your controller returns an error (wrapped as a system or user error) when an issue occurs:

   ```go
   package controllers

   import (
       "errors"
       "net/http"
       "src/internal/pkg/handler"
   )

   // ExampleController demonstrates error handling in a controller.
   func ExampleController(response http.ResponseWriter, req *http.Request) error {
       // Validate request method.
       if req.Method != http.MethodPost {
           return handler.NewUserError("Invalid request method; POST required", http.StatusMethodNotAllowed)
       }

       // Attempt processing.
       if err := doSomething(); err != nil {
           return handler.NewSystemError(err, "example_error")
       }

       // On success, return a JSON response.
       return handler.ToJson(response, map[string]string{"status": "success"}, http.StatusOK)
   }

   func doSomething() error {
       return errors.New("something went wrong")
   }
   ```

2. **Centralized Error Handling:**  
   All errors returned by controllers are processed in one place. This centralization lets you customize how errors are logged, reported, and even how external tools (like Sentry or Rollbar) are integrated.

## Customizing Error Reporting

To change the default logging and error reporting behavior, modify the file `internal/pkg/handler/error.go`. Here, you can:

- **Adjust Log Formats:** Include timestamps, error references, or contextual data.
- **Set Log Levels:** Even if using the basic log package, consider wrapping it with custom logic to differentiate between INFO, WARN, and ERROR levels.
- **Integrate External Services:** Forward errors to external monitoring systems for improved observability in production.

### Example Customization

Below is an example of how you might enhance the logging output in `error.go`:

```go
package handler

import (
    "log"
    "time"
)

// NewSystemError wraps an error with a reference and logs it.
func NewSystemError(err error, reference string) error {
    // Log the error with a timestamp and reference.
    log.Printf("[%s] System Error [%s]: %v", time.Now().Format(time.RFC3339), reference, err)
    // Return the original error or wrap it further if needed.
    return err
}
```

## Additional Tips and Best Practices

- **Structured Logging:**  
  Consider using structured logging libraries like [logrus](https://github.com/sirupsen/logrus) or [zap](https://github.com/uber-go/zap) for more detailed logs with key-value pairs. This makes it easier to filter and analyze logs.

- **Log Levels:**  
  Even if using the standard `log` package, establish conventions for log levels (DEBUG, INFO, WARN, ERROR). You can control verbosity via configuration settings or environment variables.

- **Contextual Logging:**  
  When possible, include contextual information in your logs (such as request IDs, user IDs, or endpoint paths). This aids in troubleshooting and correlating logs with user activities.

- **Environment-Based Logging:**  
  In development, you might want verbose logging for debugging purposes. In production, consider reducing log verbosity to prevent performance degradation and information overload. Use environment variables to toggle log levels.

- **Centralized Error Reporting:**  
  By handling errors centrally, you avoid duplicating error handling logic across multiple controllers. This improves maintainability and consistency across your application.

- **Error Sanitization:**  
  Always sanitize errors before logging or sending them in responses. Use system errors for internal logging while returning user errors with generic messages to the client. This prevents accidental exposure of sensitive information.

- **Performance Considerations:**  
  Logging can become a performance bottleneck if not managed properly. Consider asynchronous logging or batching log writes if you’re dealing with high throughput in production systems.

## Conclusion

By following Go’s idiomatic approach to error handling and leveraging Confetti’s centralized logging and error reporting, you can build robust and maintainable applications. Customize the behavior in `internal/pkg/handler/error.go` to meet your specific needs, and apply these best practices to ensure that your logging is both useful and efficient.
