# Validation Without External Libraries

## Introduction

Good validation prevents bugs and enhances the security of your application. In this guide, we demonstrate how to validate incoming data in a Go application without using external libraries.

## Writing the Validation Logic

In this example, we validate the `CreateUser` request. The `ValidateCreateUser` function will handle the validation logic separately from the controller.

```go
package main

import (
    "encoding/json"
    "errors"
    "net/http"
    "regexp"
    "strings"
    "github.com/confetti-framework/handler"
)

type User struct {
    Name  string `json:"name"`
    Email string `json:"email"`
}

func CreateUser(response http.ResponseWriter, request *http.Request) error {
    var user User
    
    decoder := json.NewDecoder(request.Body)
    if err := decoder.Decode(&user); err != nil {
        return handler.NewSystemError(err, "ag84r3g")
    }
    
    if err := ValidateCreateUser(user); err != nil {
        return err
    }
    
    response.WriteHeader(http.StatusCreated)
    response.Write([]byte("User created successfully"))
    return nil
}

func ValidateCreateUser(user User) error {
    if strings.TrimSpace(user.Name) == "" {
        return handler.NewUserError("Name is required", http.StatusUnprocessableEntity)
    }
    
    if !isValidEmail(user.Email) {
        return handler.NewUserError("Invalid email format", http.StatusUnprocessableEntity)
    }
    
    return nil
}

func isValidEmail(email string) bool {
    emailRegex := `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
    re := regexp.MustCompile(emailRegex)
    return re.MatchString(email)
}
```

## Handling Nested Attributes

For nested structures, we extend validation by checking nested fields.

```go
type Author struct {
    Name        string `json:"name"`
    Description string `json:"description"`
}

type Post struct {
    Title  string `json:"title"`
    Author Author `json:"author"`
}

func ValidatePost(post Post) error {
    if strings.TrimSpace(post.Title) == "" {
        return handler.NewUserError("Title is required", http.StatusUnprocessableEntity)
    }
    
    if strings.TrimSpace(post.Author.Name) == "" {
        return handler.NewUserError("Author name is required", http.StatusUnprocessableEntity)
    }
    
    if strings.TrimSpace(post.Author.Description) == "" {
        return handler.NewUserError("Author description is required", http.StatusUnprocessableEntity)
    }
    
    return nil
}
```

## Validating Lists

To validate lists of objects, we loop through each item.

```go
type Order struct {
    Street string `json:"street"`
}

type RequestData struct {
    Orders []Order `json:"orders"`
}

func ValidateRequestData(data RequestData) error {
    if len(data.Orders) != 3 {
        return handler.NewUserError("Orders must contain exactly 3 items", http.StatusUnprocessableEntity)
    }
    
    for i, order := range data.Orders {
        if strings.TrimSpace(order.Street) == "" {
            return handler.NewUserError("Street in order "+string(i)+" is required", http.StatusUnprocessableEntity)
        }
    }
    return nil
}
```

## Custom Validation Rules

Using structs for validation improves reusability, maintainability, and testability. By encapsulating validation logic within a struct, you can reuse the same rule across multiple fields and controllers. This keeps the code clean and avoids duplication.

```go
type UppercaseRule struct{}

func (u UppercaseRule) Validate(value string) error {
    if value != strings.ToUpper(value) {
        return handler.NewUserError("The value must be uppercase", http.StatusUnprocessableEntity)
    }
    return nil
}
```

Usage:

```go
uppercaseRule := UppercaseRule{}
if err := uppercaseRule.Validate(user.Name); err != nil {
    return err
}
```
