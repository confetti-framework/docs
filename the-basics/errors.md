# Error Handling in Go and Confetti

## Go’s Approach to Error Handling

In Go, error handling is explicit and straightforward—there are no exceptions or try/catch blocks like in some other languages. Instead, functions that might fail return an `error` as an additional return value. The caller then checks this value using simple `if` statements. This approach has several benefits:

- **Clarity and Simplicity:**  
  Every function call that might fail forces the developer to consider the error case explicitly.
  
- **No Hidden Control Flow:**  
  Errors are not thrown and caught elsewhere in the code, making the program's flow easier to understand and debug.
  
- **Better Composability:**  
  Functions can be composed more naturally since error handling is part of the function’s return values.

### Example of Standard Go Error Handling

Here’s a short example that demonstrates the typical pattern in Go:

```go
package main

import (
	"errors"
	"fmt"
)

// doSomething performs an action that might fail.
func doSomething() error {
	// Simulate an error condition.
	if true { // Imagine this condition checks for an error
		return errors.New("something went wrong")
	}
	return nil
}

func otherFunction() {
	if err := doSomething(); err != nil {
		// Handle the error immediately.
		fmt.Println("Error:", err)
		return
	}
	// Continue with the normal flow if no error occurred.
	fmt.Println("Success!")
}
```

In this example, the `doSomething` function returns an error if a problem occurs. In the `otherFunction` function, we immediately check if an error was returned using an `if` statement. This pattern is prevalent throughout Go code and encourages writing robust, clear, and maintainable programs.

## Error Handling in Confetti Controllers

Confetti follows the same idiomatic error handling practices as described above. In Confetti controllers, your handler functions return an error, allowing centralized error management by the framework. This keeps your controllers focused on handling requests while delegating error processing to a central location.

### System Errors vs. User Errors

To streamline error handling further, Confetti differentiates between:

- **System Errors:**  
  These represent internal issues that should not expose sensitive information. Use:
  ```go
  handler.NewSystemError(err, "reference")
  ```
  This wraps the underlying error with a reference string to help trace the issue without revealing details to the end-user.

- **User Errors:**  
  These are errors caused by user input or actions, which should provide clear feedback. Use:
  ```go
  handler.NewUserError("Descriptive error message", http.StatusBadRequest)
  ```
  This returns a structured error response that can be safely presented to the user.

### Controller Example in Confetti

Below is an example of a controller in Confetti that demonstrates error handling:

```go
package controllers

import (
	"errors"
	"net/http"
	"src/internal/pkg/handler"
)

// ProcessData handles an API request and demonstrates error handling.
func ProcessData(response http.ResponseWriter, req *http.Request) error {
	// Check for a valid HTTP method.
	if req.Method != http.MethodPost {
		return handler.NewUserError("Invalid request method; POST required", http.StatusMethodNotAllowed)
	}

	// Attempt to process data.
	err := doProcessing()
	if err != nil {
		// Return a system error to avoid exposing internal details.
		return handler.NewSystemError(err, "processing_error")
	}

	// Return a successful JSON response if everything is okay.
	return handler.ToJson(response, map[string]string{"status": "success"}, http.StatusOK)
}

func doProcessing() error {
	// Simulate a processing error.
	return errors.New("processing failed due to an unexpected issue")
}
```

### Centralized Error Handling in Confetti

Confetti centralizes error handling so that any error returned by your controllers is processed consistently in one place. This means you do not need to write repetitive error handling code in each controller, and you can configure logging, error reporting, or custom error responses centrally.

> In your controllers, simply return the error, and Confetti’s error handler will manage it according to your configuration.

By following these guidelines, you ensure that your application not only adheres to Go’s best practices for error handling but also benefits from a consistent and maintainable error management strategy within the Confetti framework.
