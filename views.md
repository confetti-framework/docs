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
    {% raw %}

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

<a name="determining-if-a-view-exists"></a>

#### Determining If A View Exists

If you need to determine if a view exists, you may use the `View` facade. The `exists` method will return `true` if the
view exists:

    use Illuminate\Support\Facades\View;

    if (View::exists('emails.customer')) {
        //
    }

<a name="creating-the-first-available-view"></a>

#### Creating The First Available View

Using the `first` method, you may create the first view that exists in a given array of views. This is useful if your
application or package allows views to be customized or overwritten:

    return view()->first(['custom.admin', 'admin'], $data);

You may also call this method via the `View` [facade](/docs/{{version}}/facades):

    use Illuminate\Support\Facades\View;

    return View::first(['custom.admin', 'admin'], $data);

<a name="passing-data-to-views"></a>

## Passing Data To Views

As you saw in the previous examples, you may pass an array of data to views:

    return view('greetings', ['name' => 'Victoria']);

When passing information in this manner, the data should be an array with key / value pairs. Inside your view, you can
then access each value using its corresponding key, such as `<?php echo $key; ?>`. As an alternative to passing a
complete array of data to the `view` helper function, you may use the `with` method to add individual pieces of data to
the view:

    return view('greeting')->with('name', 'Victoria');

<a name="sharing-data-with-all-views"></a>

#### Sharing Data With All Views

Occasionally, you may need to share a piece of data with all views that are rendered by your application. You may do so
using the view facade's `share` method. Typically, you should place calls to `share` within a service provider's `boot`
method. You are free to add them to the `AppServiceProvider` or generate a separate service provider to house them:

    <?php

    namespace App\Providers;

    use Illuminate\Support\Facades\View;

    class AppServiceProvider extends ServiceProvider
    {
        /**
         * Register any application services.
         *
         * @return void
         */
        public function register()
        {
            //
        }

        /**
         * Bootstrap any application services.
         *
         * @return void
         */
        public function boot()
        {
            View::share('key', 'value');
        }
    }

<a name="view-composers"></a>

## View Composers

View composers are callbacks or class methods that are called when a view is rendered. If you have data that you want to
be bound to a view each time that view is rendered, a view composer can help you organize that logic into a single
location.

For this example, let's register the view composers within a [service provider](/docs/{{version}}/providers). We'll use
the `View` facade to access the underlying `Illuminate\Contracts\View\Factory` contract implementation. Remember,
Lanvard does not include a default directory for view composers. You are free to organize them however you wish. For
example, you could create an `app/Http/View/Composers` directory:

    <?php

    namespace App\Providers;

    use Illuminate\Support\Facades\View;
    use Illuminate\Support\ServiceProvider;

    class ViewServiceProvider extends ServiceProvider
    {
        /**
         * Register any application services.
         *
         * @return void
         */
        public function register()
        {
            //
        }

        /**
         * Bootstrap any application services.
         *
         * @return void
         */
        public function boot()
        {
            // Using class based composers...
            View::composer(
                'profile', 'App\Http\View\Composers\ProfileComposer'
            );

            // Using Closure based composers...
            View::composer('dashboard', function ($view) {
                //
            });
        }
    }

> {note} Remember, if you create a new service provider to contain your view composer registrations, you will need to add the service provider to the `providers` array in the `config/app.php` configuration file.

Now that we have registered the composer, the `ProfileComposer@compose` method will be executed each time the `profile`
view is being rendered. So, let's define the composer class:

    <?php

    namespace App\Http\View\Composers;

    use App\Repositories\UserRepository;
    use Illuminate\View\View;

    class ProfileComposer
    {
        /**
         * The user repository implementation.
         *
         * @var UserRepository
         */
        protected $users;

        /**
         * Create a new profile composer.
         *
         * @param  UserRepository  $users
         * @return void
         */
        public function __construct(UserRepository $users)
        {
            // Dependencies automatically resolved by service container...
            $this->users = $users;
        }

        /**
         * Bind data to the view.
         *
         * @param  View  $view
         * @return void
         */
        public function compose(View $view)
        {
            $view->with('count', $this->users->count());
        }
    }

Just before the view is rendered, the composer's `compose` method is called with the `Illuminate\View\View` instance.
You may use the `with` method to bind data to the view.

> {tip} All view composers are resolved via the [service container](/docs/{{version}}/container), so you may type-hint any dependencies you need within a composer's constructor.

<a name="attaching-a-composer-to-multiple-views"></a>

#### Attaching A Composer To Multiple Views

You may attach a view composer to multiple views at once by passing an array of views as the first argument to
the `composer` method:

    View::composer(
        ['profile', 'dashboard'],
        'App\Http\View\Composers\MyViewComposer'
    );

The `composer` method also accepts the `*` character as a wildcard, allowing you to attach a composer to all views:

    View::composer('*', function ($view) {
        //
    });

<a name="view-creators"></a>

#### View Creators

View **creators** are very similar to view composers; however, they are executed immediately after the view is
instantiated instead of waiting until the view is about to render. To register a view creator, use the `creator` method:

    View::creator('profile', 'App\Http\View\Creators\ProfileCreator');

<a name="optimizing-views"></a>

## Optimizing Views

By default, views are compiled on demand. When a request is executed that renders a view, Lanvard will determine if a
compiled version of the view exists. If the file exists, Lanvard will then determine if the uncompiled view has been
modified more recently than the compiled view. If the compiled view either does not exist, or the uncompiled view has
been modified, Lanvard will recompile the view.

Compiling views during the request negatively impacts performance, so Lanvard provides the `view:cache` Artisan command
to precompile all of the views utilized by your application. For increased performance, you may wish to run this command
as part of your deployment process:

    php artisan view:cache

You may use the `view:clear` command to clear the view cache:

    php artisan view:clear