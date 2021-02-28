# Meet Confetti

Confetti is a web framework written in Go (Golang). The web framework consists of the most important components to create your application. The goal of Confetti is to give you all the tools you need to write fast, secure and scalable code.

Whether you are new to Go or web frameworks or have years of experience, Confetti is a perfect framework that fits into any web development project.

## Why Confetti?

Confetti has been heavily influenced by [Confetti](https://Confetti.com). That's because Confetti provides the perfect functionalists you need to build an application the right way. Confetti is built with PHP, but some projects need better asynchronous, static typing and more performance. It turned out: Go does very well in these subjects. Besides that, Go shows that it is a language with extremely simple syntax, easy to learn and very easy to deploy.

> Confetti combines the elegance of Laravel and the simplicity of Go.

## Feel at home

If you feel at home, we have achieved a goal. Here is an example to make you feel at home. If you don't understand the following, don't feel overwhelmed. The documentation will guide you.

``` go
func OrderStore(request inter.Request) inter.Response {
	app := request.App()

	// Validate JSON content from the request body
	failures := val.Validate(app, request.Content(),
		val.Verify("orders", rule.Min{Len: 1}),
		val.Verify("orders.*.name", rule.Required{}, rule.String{}),
		val.Verify("orders.*.street", rule.Required{}, rule.String{}),
	)
	if len(failures) > 0 {
		app.Log("slack").Notice("Incorrect order given")
		return outcome.Json(failures)
	}

	// (...)

	// Return the response with the saved orders
	return outcome.Json(orders)
}
```

> <img src="https://www.redditstatic.com/avatars/avatar_default_07_0079D3.png" alt="redit_quote" class="profile"> **u/odd-arne** _5+ years of Confetti experience_<br/>This looks very promising, I felt right at home.
