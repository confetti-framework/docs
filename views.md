# Views

- [Creating Views](#creating-views)
- [Passing Data To Views](#passing-data-to-views)
  - [Sharing Data With All Views](#sharing-data-with-all-views)
- [View Composers](#view-composers)
- [Optimizing Views](#optimizing-views)

<a name="creating-views"></a>

## Creating Views

> {tip} Looking for more information on how to write Go templates? Check out the [Text template documentation](https://golang.org/pkg/text/template/#hdr-Text_and_spaces) and subsequent [HTML template documentation](https://golang.org/pkg/html/template/) to get started.

Views and templates are there to separate your controller / application logic from your presentation logic. A template
consists of HTML, while a view contains data that you can use in a HTML or a JSON response. Views and templates are
stored in the `resources/views` directory.

### HTML response

A simple view for a HTML response might look something like this:

    package views
    
    import (
        "github.com/lanvard/contract/inter"
        "lanvard/config"
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

Since the view is stored at `resources/views/homepage.go` and method `Template` points to `homepage.gohtml`, you have to
create `resources/views/homepage.gohtml`:

    {% raw %}
    <html>
        <body>
            <h1>Hello, {{ .Name }}</h1>
        </body>
    </html>
    {% endraw %}

In a controller you can then return the view as a response.

    func Welcome(request inter.Request) inter.Response {
        return outcome.Html(views.Homepage("James"))
    }

### JSON response

You can also use a view for JSON responses. Then the struct do not need to contain a `Template` method. Use the `json`
tag to specify the field that will be included in the json response. Use `json:"title"` to lowercase the key:

    package views

    type book struct {
        Title string `json:"title"`
    }
    
    func Book(title string) *book {
        return &book{
            Title: title,
        }
    }

You can then use the view as a json response:

    func ShowBook(request inter.Request) inter.Response {
        return outcome.Json(views.Book("James"))
    }

## Combine Multiple Views

Each website consists of several small templates. For example, you need a menu and footer on every page of your website.
Lanvard makes it easy to reuse predefined templates.

### Define Templates

You can define a template by using the tag `define` with a reference name. A template that you want to reuse later can
look like this:

    {% raw %}
    {{ define "footer" }}
        <footer>Mackays Hotel<br/>No. 1 Bistro<br/>Elgin Street<br/>Lancashire</footer>
    {{end}}
    {% endraw %}

### Use Defined Templates

You can use the `template` tag to import predefined templates:

    {% raw %}
    <html>
        <body>
            <h1>World's shortest street</h1>
            {{template "footer"}}
        </body>
    </html>
    {% endraw %}

### Template Builder

By default, all templates are loaded from `resources/views` 5 directories deep. If you want to expand it or just want to
use very specific templates, you can customize `template_builder` in `providers.ViewServiceProvider`. Here you can
adjust the built-in Golang `*Template`. For more information on all possible methods, take a look
at [the manual](https://golang.org/pkg/text/template/#Template.AddParseTree).

## Content By View

You may want to use the view for a different purpose. You can get the content of a view by using the `view_helper`
package:

    builder := app.Make("template_builder").(inter.TemplateBuilder)
    result := view_helper.ContentByView(view, builder)
