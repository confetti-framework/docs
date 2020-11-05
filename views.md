# Views

- [Creating Views](#creating-views)
- [Passing Data To Views](#passing-data-to-views)
  - [Sharing Data With All Views](#sharing-data-with-all-views)
- [View Composers](#view-composers)
- [Optimizing Views](#optimizing-views)

<a name="creating-views"></a>

## Creating Views

> {tip} Looking for more information on how to write Go templates? Check out the [Text template documentation](https://golang.org/pkg/text/template/#hdr-Text_and_spaces) and subsequent [HTML template documentation](https://golang.org/pkg/html/template/) to get started.

Views and templates are there to separate your controller / application logic from your presentation logic. A templates
consists of HTML, while a view contains data that you can use in a Template or a JSON response. Views and templates are
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

You can also use a view for JSON responses. Then the struct do not need to contain a `Template` method.
Use `json:"title"` to specify the field that will be included in the json response:

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

Views may also be nested within subdirectories of the `resources/views` directory. "Dot" notation may be used to
reference nested views. For example, if your view is stored at `resources/views/admin/profile.blade.php`, you may
reference it like so:

    return view('admin.profile', $data);

> {note} View directory names should not contain the `.` character.

#### Combine Multiple Views

// @todo

## Cache Views

The components are prepared in `providers.ViewServiceProvider`. As a result, all views are automatically cached during
the boot of your application.