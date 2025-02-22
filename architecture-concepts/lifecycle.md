# Request Lifecycle  

## Introduction  

When using any tool in the "real world," you feel more confident if you understand how that tool works. Application development is no different. When you understand how your development tools function, you feel more comfortable and confident using them.  

The goal of this document is to provide you with a high-level overview of how the Confetti framework works. By gaining a better understanding of the framework's inner workings, everything feels less "magical," and you will be more confident when building your applications.  

If you don't immediately grasp all the concepts and terminology, don't worry! The key is to get a general sense of the request lifecycle. As you explore other sections of the documentation, your understanding will deepen naturally.  

## Lifecycle Overview  

When you start the Confetti API server, the request lifecycle begins in `cmd/api/main.go`. This file checks the given command. For example, when you run:  

```sh
go run cmd/api/main.go api:serve
```

The framework executes `cmd/api/command/api_serve_command.go`, which initializes an HTTP server.  

From there, incoming requests follow a structured flow before returning a response. Below is a step-by-step breakdown of the process:  

### 1. Receiving the Request  
When a client (e.g., a web browser or API client) sends a request, it reaches the HTTP server that was started in `api_serve_command.go`. This server listens for incoming requests and forwards them to the appropriate route handler.  

### 2. Routing the Request  
Confetti determines which route should handle the request based on the defined routes. These routes are registered using the `handler.New("METHOD PATH", handlerFunc)` function.  

For example, if a request is sent to `GET /status`, it will be mapped to the appropriate handler function inside `internal/status/status_index_controller.go`.  

### 3. Middleware Processing  
Before the request reaches its final destination (the controller), it passes through middleware functions. Middleware acts as a processing layer that can modify or inspect the request and response.  

Common middleware functions include:  

- **Authentication Middleware**: Verifies if the request is coming from an authorized user.  
- **Logging Middleware**: Logs details about the request for debugging or monitoring.  
- **CORS Middleware**: Adds necessary headers to allow cross-origin requests.  

Each middleware function processes the request before passing it to the next middleware in the chain.  

### 4. Controller Execution  
After passing through the middleware, the request reaches its designated **controller**. A controller is responsible for handling the request logic, processing any required data, and preparing a response.  

For example, the `status_index_controller.go` file handles requests related to system status. If the request is for `/status`, the controller gathers relevant data (such as system uptime or server health) and prepares a response.  

### 5. Response Processing  
Once the controller has generated a response, the request goes back through the middleware in **reverse order**. This allows middleware functions to modify or inspect the outgoing response before it is sent back to the client.  

For example, a middleware function might:  

- Format the response into JSON or another format.  
- Add security headers.  
- Log the response time.  

### 6. Sending the Response  
After processing is complete, the final response is sent back to the client. The client then receives the response and displays the data accordingly (e.g., rendering JSON in an API client or updating a web page).  
