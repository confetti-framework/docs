# Meet Confetti

Confetti is a lightweight web framework written in Go (Golang) that provides all the essential components to build your web application. Its purpose is to equip you with the tools necessary to write fast, secure, and scalable code.

Whether you’re new to Go and web frameworks or a seasoned developer, Confetti is designed to seamlessly integrate into any web development project.

## Why Confetti?

Writing idiomatic Go code often requires a different approach compared to frameworks like Ruby on Rails or Laravel. Confetti offers a standardized set of features that streamline development, making it easier to maintain high-quality code.

> Confetti combines the elegance of a framework with the simplicity and power of Go.

## Feel at Home

Our goal is for you to feel right at home with Confetti. To help you get started, here’s a quick example. Don’t worry if it looks unfamiliar at first—the comprehensive documentation will guide you every step of the way.

```go
package status

func Index(response http.ResponseWriter, request *http.Request) error {
	// Create a map to store status information
	data := map[string]any{}

	// Set the status to "active"
	data["status"] = "active"

	return handler.ToJson(response, data, http.StatusOK)
}
```

With built-in routing and middleware support:
```go
var ApiRoutes = []handler.Route{
	handler.New("GET /status", status.Index).AppendMiddleware(auth.Middleware("status/index")),
}
```

<div style="display: flex; align-items: center; margin-top: 60px; font-family: sans-serif;">
  <img src="https://avatars.githubusercontent.com/u/25671390?v=4" alt="Alex Wulfheart" style="width: 60px; height: 60px; border-radius: 50%; margin-right: 15px;">
  <div>
    <p style="font-size: 16px; font-weight: bold; margin: 0;">"Using Confetti feels like coming home."</p>
    <p style="font-size: 14px; margin: 0;">— Alex Wulfheart</p>
  </div>
</div>

