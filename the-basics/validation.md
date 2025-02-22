# Validation

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

## Examples

### Required
**Description:**  
Validates that the input value is not empty or composed solely of whitespace.

```go
package rule

import (
	"net/http"
	"strings"
)

type Required struct{}

func (r Required) Validate(value string) error {
	if strings.TrimSpace(value) == "" {
		return handler.NewUserError("This field is required", http.StatusUnprocessableEntity)
	}
	return nil
}
```

---

### Email
**Description:**  
Checks whether the input value is in a valid email address format.

```go
package rule

import (
	"net/http"
	"regexp"
)

type Email struct{}

func (e Email) Validate(value string) error {
	re := regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)
	if !re.MatchString(value) {
		return handler.NewUserError("The value must be a valid email address", http.StatusUnprocessableEntity)
	}
	return nil
}
```

---

### URL
**Description:**  
Ensures the input value is a valid URL by parsing it.

```go
package rule

import (
	"net/http"
	"net/url"
)

type URL struct{}

func (u URL) Validate(value string) error {
	if _, err := url.ParseRequestURI(value); err != nil {
		return handler.NewUserError("The value must be a valid URL", http.StatusUnprocessableEntity)
	}
	return nil
}
```

---

### Alpha
**Description:**  
Validates that the input contains only alphabetic characters (A–Z and a–z).

```go
package rule

import (
	"net/http"
	"regexp"
)

type Alpha struct{}

func (a Alpha) Validate(value string) error {
	re := regexp.MustCompile(`^[A-Za-z]+$`)
	if !re.MatchString(value) {
		return handler.NewUserError("The value must contain only alphabetic characters", http.StatusUnprocessableEntity)
	}
	return nil
}
```

---

### AlphaNumeric
**Description:**  
Checks that the input consists solely of alphabetic and numeric characters.

```go
package rule

import (
	"net/http"
	"regexp"
)

type AlphaNumeric struct{}

func (an AlphaNumeric) Validate(value string) error {
	re := regexp.MustCompile(`^[A-Za-z0-9]+$`)
	if !re.MatchString(value) {
		return handler.NewUserError("The value must be alphanumeric", http.StatusUnprocessableEntity)
	}
	return nil
}
```

---

### Numeric
**Description:**  
Verifies that the input can be parsed as a numeric value (supports integers and floats).

```go
package rule

import (
	"net/http"
	"strconv"
)

type Numeric struct{}

func (n Numeric) Validate(value string) error {
	if _, err := strconv.ParseFloat(value, 64); err != nil {
		return handler.NewUserError("The value must be numeric", http.StatusUnprocessableEntity)
	}
	return nil
}
```

---

### MinLength
**Description:**  
Ensures that the input value has at least a specified minimum number of characters.

```go
package rule

import (
	"net/http"
	"strconv"
	"unicode/utf8"
)

type MinLength struct {
	Min int
}

func (m MinLength) Validate(value string) error {
	if utf8.RuneCountInString(value) < m.Min {
		return handler.NewUserError("The value must be at least "+strconv.Itoa(m.Min)+" characters long", http.StatusUnprocessableEntity)
	}
	return nil
}
```

---

### MaxLength
**Description:**  
Checks that the input value does not exceed a specified maximum number of characters.

```go
package rule

import (
	"net/http"
	"strconv"
	"unicode/utf8"
)

type MaxLength struct {
	Max int
}

func (m MaxLength) Validate(value string) error {
	if utf8.RuneCountInString(value) > m.Max {
		return handler.NewUserError("The value must be at most "+strconv.Itoa(m.Max)+" characters long", http.StatusUnprocessableEntity)
	}
	return nil
}
```

---

### BetweenLength
**Description:**  
Validates that the input’s length falls between a defined minimum and maximum range.

```go
package rule

import (
	"net/http"
	"strconv"
	"unicode/utf8"
)

type BetweenLength struct {
	Min int
	Max int
}

func (b BetweenLength) Validate(value string) error {
	length := utf8.RuneCountInString(value)
	if length < b.Min || length > b.Max {
		return handler.NewUserError("The value must be between "+strconv.Itoa(b.Min)+" and "+strconv.Itoa(b.Max)+" characters long", http.StatusUnprocessableEntity)
	}
	return nil
}
```

---

### In
**Description:**  
Checks if the input value is one of a predefined list of allowed options.

```go
package rule

import (
	"net/http"
)

type In struct {
	Options []string
}

func (i In) Validate(value string) error {
	for _, option := range i.Options {
		if value == option {
			return nil
		}
	}
	return handler.NewUserError("The value must be one of the allowed options", http.StatusUnprocessableEntity)
}
```

---

### NotIn
**Description:**  
Ensures that the input value is not present in a given list of disallowed options.

```go
package rule

import (
	"net/http"
)

type NotIn struct {
	Options []string
}

func (n NotIn) Validate(value string) error {
	for _, option := range n.Options {
		if value == option {
			return handler.NewUserError("The value is not allowed", http.StatusUnprocessableEntity)
		}
	}
	return nil
}
```

---

### Regex
**Description:**  
Validates that the input matches a specified regular expression pattern.

```go
package rule

import (
	"net/http"
	"regexp"
)

type Regex struct {
	Pattern string
}

func (r Regex) Validate(value string) error {
	re := regexp.MustCompile(r.Pattern)
	if !re.MatchString(value) {
		return handler.NewUserError("The value does not match the required pattern", http.StatusUnprocessableEntity)
	}
	return nil
}
```

---

### Date
**Description:**  
Checks if the input value is a valid date based on the provided format.

```go
package rule

import (
	"net/http"
	"time"
)

type Date struct {
	Format string
}

func (d Date) Validate(value string) error {
	if _, err := time.Parse(d.Format, value); err != nil {
		return handler.NewUserError("The value must be a valid date", http.StatusUnprocessableEntity)
	}
	return nil
}
```

---

### AfterDate
**Description:**  
Ensures the input date is later than a specified date.

```go
package rule

import (
	"net/http"
	"time"
)

type AfterDate struct {
	Date   time.Time
	Format string
}

func (a AfterDate) Validate(value string) error {
	parsed, err := time.Parse(a.Format, value)
	if err != nil {
		return handler.NewUserError("The value must be a valid date", http.StatusUnprocessableEntity)
	}
	if !parsed.After(a.Date) {
		return handler.NewUserError("The date must be after "+a.Date.Format(a.Format), http.StatusUnprocessableEntity)
	}
	return nil
}
```

---

### BeforeDate
**Description:**  
Validates that the input date occurs before a specified date.

```go
package rule

import (
	"net/http"
	"time"
)

type BeforeDate struct {
	Date   time.Time
	Format string
}

func (b BeforeDate) Validate(value string) error {
	parsed, err := time.Parse(b.Format, value)
	if err != nil {
		return handler.NewUserError("The value must be a valid date", http.StatusUnprocessableEntity)
	}
	if !parsed.Before(b.Date) {
		return handler.NewUserError("The date must be before "+b.Date.Format(b.Format), http.StatusUnprocessableEntity)
	}
	return nil
}
```

---

### Integer
**Description:**  
Checks that the input value can be parsed as an integer.

```go
package rule

import (
	"net/http"
	"strconv"
)

type Integer struct{}

func (i Integer) Validate(value string) error {
	if _, err := strconv.Atoi(value); err != nil {
		return handler.NewUserError("The value must be an integer", http.StatusUnprocessableEntity)
	}
	return nil
}
```

---

### Boolean
**Description:**  
Validates that the input is either `"true"` or `"false"`, ignoring case.

```go
package rule

import (
	"net/http"
	"strings"
)

type Boolean struct{}

func (b Boolean) Validate(value string) error {
	lower := strings.ToLower(value)
	if lower != "true" && lower != "false" {
		return handler.NewUserError("The value must be a boolean", http.StatusUnprocessableEntity)
	}
	return nil
}
```

---

### UUID
**Description:**  
Checks that the input value matches the UUID format (version 1–5).

```go
package rule

import (
	"net/http"
	"regexp"
)

type UUID struct{}

func (u UUID) Validate(value string) error {
	re := regexp.MustCompile(`^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$`)
	if !re.MatchString(value) {
		return handler.NewUserError("The value must be a valid UUID", http.StatusUnprocessableEntity)
	}
	return nil
}
```

---

### Lowercase
**Description:**  
Ensures that the input value is entirely in lowercase letters.

```go
package rule

import (
	"net/http"
	"strings"
)

type Lowercase struct{}

func (l Lowercase) Validate(value string) error {
	if value != strings.ToLower(value) {
		return handler.NewUserError("The value must be lowercase", http.StatusUnprocessableEntity)
	}
	return nil
}
```
