# Views
<ToggleDarkMode/>

## Creating Views

> Looking for more information on how to write Go templates? Check out the [Text template documentation](https://golang.org/pkg/text/template/#hdr-Text_and_spaces) and subsequent [HTML template documentation](https://golang.org/pkg/html/template/) to get started.

Views and templates are there to separate your controller/application logic from your presentation logic. A template consists of HTML, while a view contains data that you can use in the template. Views and templates are stored in the `resources/views` directory.

### HTML Response

A simple view for an HTML response might look something like this:

``` go
package views

import (
    "github.com/confetti-framework/contract/inter"
    "confetti/config"
)

type homepage struct {
    Name    string
    template string
}

func Homepage(name string) *homepage {
    return &homepage{
        Name:     name,
        template: config.Path.Views + "/homepage.gohtml",
    }
}

func (e homepage) Template() string {
    return e.template
}
```

Since the view is stored at `resources/views/homepage.go` and method `Template` points to `homepage.gohtml`, you have to
create `resources/views/homepage.gohtml`:

``` html
<html>
    <body>
        <h1>Hello, {{ .Name }}</h1>
    </body>
</html>
```

In a controller you can then return the view as a response.

``` go
func Welcome(request inter.Request) inter.Response {
    return outcome.Html(views.Homepage("James"))
}
```

### JSON Response

You can also use a view for JSON responses. Then the struct do not need to contain a `Template` method. Use the `json` tag to specify the field that will be included in the json response. Use `json:"title"` to lowercase the key:

``` go
package views

type book struct {
    Title string `json:"title"`
}

func Book(title string) *book {
    return &book{
        Title: title,
    }
}
```

You can then use the view as a json response:

``` go
func ShowBook(request inter.Request) inter.Response {
    return outcome.Json(views.Book("James"))
}
```

> Although we now call this a View, no one is preventing you from putting these in a folder 'responses'.

## Combine Multiple Views

Each website consists of several small templates. For example, you need a menu and footer on every page of your website.
Confetti makes it easy to reuse predefined templates.

### Define Templates

You can define a template by using the tag `define` with a reference name. A template that you want to reuse later can
look like this:

``` html
{{ define "footer" }}
    <footer>Mackays Hotel<br/>No. 1 Bistro<br/>Elgin Street<br/>Lancashire</footer>
{{end}}
```

### Use Defined Templates

You can use the `template` tag to import predefined templates:

``` html {4}
<html>
    <body>
        <h1>World's shortest street</h1>
        {{template "footer"}}
    </body>
</html>
```

### Template Builder

By default, all templates are loaded from `resources/views` 5 directories deep. If you want to expand it or just want to
use very specific templates, you can customize `template_builder` in `providers.ViewServiceProvider`. Here you can
adjust the built-in Golang `*Template`. For more information on all possible methods, take a look
at [the manual](https://golang.org/pkg/text/template/#Template.AddParseTree).

## Helper Functions

You can define functions in providers.ViewServiceProvider. You can use those functions in any template:

``` go {3-6}
templateBuilder.Funcs(template.FuncMap{
    return templateBuilder.Funcs(template.FuncMap{
        "Replace": func(input, from, to string) string {
            return strings.Replace(input, from, to, -1)
        },
        "Trim": strings.Trim,
    })
})
```

You can then use that function in the template. Use the function followed by the parameters:

``` html
<h1>{{ Trim .Title " " }}</h1>
<p>{{ Replace .Description " " "_" }}</p>
```

## Content By View

You may want to use the view for a different purpose. You can get the content of a view by using the `view_helper`
package:

``` go
builder := app.Make("template_builder").(inter.TemplateBuilder)
result := view_helper.ContentByView(view, builder)
```
