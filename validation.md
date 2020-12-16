# Validation

- [Introduction](#introduction)
- [Validation Quickstart](#validation-quickstart)
    - [Defining The Routes](#quick-defining-the-routes)
    - [Creating The Controller](#quick-creating-the-controller)
    - [Writing The Validation Logic](#quick-writing-the-validation-logic)
    - [Displaying The Validation Errors](#quick-displaying-the-validation-errors)
    - [A Note On Optional Fields](#a-note-on-optional-fields)
- [Form Request Validation](#form-request-validation)
    - [Creating Form Requests](#creating-form-requests)
    - [Authorizing Form Requests](#authorizing-form-requests)
    - [Customizing The Error Messages](#customizing-the-error-messages)
    - [Customizing The Validation Attributes](#customizing-the-validation-attributes)
    - [Prepare Input For Validation](#prepare-input-for-validation)
- [Manually Creating Validators](#manually-creating-validators)
    - [Automatic Redirection](#automatic-redirection)
    - [Named Error Bags](#named-error-bags)
    - [After Validation Hook](#after-validation-hook)
- [Working With Error Messages](#working-with-error-messages)
    - [Custom Error Messages](#custom-error-messages)
- [Available Validation Rules](#available-validation-rules)
- [Conditionally Adding Rules](#conditionally-adding-rules)
- [Validating Arrays](#validating-arrays)
- [Custom Validation Rules](#custom-validation-rules)
    - [Using Rule Objects](#using-rule-objects)
    - [Using Closures](#using-closures)
    - [Using Extensions](#using-extensions)
    - [Implicit Extensions](#implicit-extensions)

## Introduction

Good validation prevents bugs and will make your application more secure. Lanvard provides several different approaches
to validate your application's incoming data.

### Writing The Validation Logic

With Lanvard it is very easy to validate incoming data. With the first parameter you enter the data you want to
validate. Furthermore, you enter fields with rules.

	failures := val.Validate(
        request.Content(),
		val.Verify("name", rule.Required{}, rule.MaxCharacters{Max: 255}),
		val.Verify("email", rule.Required{}, rule.Email{}),
	)

If a validation error occurs, you will receive a slice with errors.

#### Nested Attributes

If your data contains "nested" parameters, you may specify them in your validation rules using "dot" syntax:

    failures := val.Validate(request.Content(),
		val.Verify("title", rule.Required{}, rule.MaxCharacters{Max: 255}),
		val.Verify("author.name", rule.Required{}),
		val.Verify("author.description", rule.Required{}),
	)

If you want to validate all fields in a slice or in a map, you can use an asterisk:

    failures := val.Validate(request.Content(),
		val.Verify("orders", rule.Sum{Sum: 3}),
		val.Verify("orders.*.street", rule.Required{}, rule.MaxCharacters{Max: 255}),
	)

### Displaying The Validation Errors

So, what if the incoming request parameters do not pass the given validation rules? As mentioned previously, after
validation you will receive the errors in a slice.

#### Return Errors As Response

You can choose to return the errors immediately. In that case, the customer will immediately see the correct HTTP page
or JSON response.

    func UserStore(request inter.Request) inter.Response {
        failures := val.Validate(request.Content(),
            val.Verify("title", rule.Required{}, rule.MaxCharacters{Max: 255}),
        )
        if len(failures) > 0 {
            return outcome.Html(failures)
        }

        //
    }

> {tip} You can edit the error view yourself in response_service_provider.go. For more information about adjusting error responses, I refer you to the [error documentation](errors.md#custom-http-error-pages).

#### Use Errors In Views

Or you pass the errors to a view. That way you can, for example, place the errors next to the fields in a form:

    func UserStore(request inter.Request) inter.Response {
        content := request.Content()
        failures := val.Validate(
            content,
            val.Verify("title", rule.Required{}, rule.MaxCharacters{Max: 255}),
        )
    
        return outcome.Html(views.UserCreate(
            request.App(),
            failures,
            content.Get("title").String(),
        ))
    }

Once in the template you can do whatever you want with the errors:

    {{- /*gotype: lanvard/resources/views.UserCreateView*/ -}}
    
    <h1>Create Post</h1>
    
    {{ if .Failures }}
        <div class="alert alert-danger">
            <ul>
            {{ range $key, $value := .Failures }}
                <li>{{ $value }}</li>
            {{ end }}
            </ul>
        </div>
    {{ end }}
    
    
    <!-- Create Post Form --> 

#### Fetch Error By Field

You may also use the `Error` function to quickly check if validation error messages exist for a given field:

    {{- /*gotype: lanvard/resources/views.UserCreateView*/ -}}

    <label for="name">User Name</label>

    <input id="name" type="text" class="{{ if Error .Failures "name" }} is-invalid {{ end }}">

    {{ if Error .Failures "name" }}
        <div class="alert">{{ Error .Failures "name" }}</div>
    {{ end }}

## Available Validation Rules

Below is a list of all available validation rules and their function:

<style>
    .collection-method-list > p {
        column-count: 3; -moz-column-count: 3; -webkit-column-count: 3;
        column-gap: 2em; -moz-column-gap: 2em; -webkit-column-gap: 2em;
    }

    .collection-method-list a {
        display: block;
    }
</style>

<div class="collection-method-list" markdown="1">

[Accepted](#accepted)
[After (Date)](#after)
[After Or Equal (Date)](#after-or-equal)
[Alpha](#alpha)
[Alpha Dash](#alpha-dash)
[Alpha Numeric](#alpha-num)
[Array](#array)
[Bail](#bail)
[Before (Date)](#before)
[Before Or Equal (Date)](#before-or-equal)
[Between](#between)
[Boolean](#boolean)
[Confirmed](#confirmed)
[Date](#date)
[Date Equals](#date-equals)
[Date Format](#date-format)
[Different](#different)
[Digits](#digits)
[Digits Between](#digits-between)
[Dimensions (Image Files)](#dimensions)
[Distinct](#distinct)
[Email](#email)
[Ends With](#ends-with)
[Exclude If](#exclude-if)
[Exclude Unless](#exclude-unless)
[Exists (Database)](#exists)
[File](#file)
[Filled](#filled)
[Greater Than](#gt)
[Greater Than Or Equal](#gte)
[Image (File)](#image)
[In](#in)
[In Array](#in-array)
[Integer](#integer)
[IP Address](#ip)
[JSON](#json)
[Less Than](#lt)
[Less Than Or Equal](#lte)
[Max](#max)
[MIME Types](#mimetypes)
[MIME Type By File Extension](#mimes)
[Min](#min)
[Multiple Of](#multiple-of)
[Not In](#not-in)
[Not Regex](#not-regex)
[Nullable](#nullable)
[Numeric](#numeric)
[Password](#password)
[Present](#present)
[Regular Expression](#regex)
[Required](#required)
[Required If](#required-if)
[Required Unless](#required-unless)
[Required With](#required-with)
[Required With All](#required-with-all)
[Required Without](#required-without)
[Required Without All](#required-without-all)
[Same](#same)
[Size](#size)
[Sometimes](#conditionally-adding-rules)
[Starts With](#starts-with)
[String](#string)
[Timezone](#timezone)
[Unique (Database)](#unique)
[URL](#url)
[UUID](#uuid)

</div>

#### Accepted

The field under validation must be _yes_, _on_, _1_, or _true_. This is useful for validating "Terms of Service"
acceptance.

    rule.Accepted{}

#### After

The field under validation must be a value after a given date:

    val.Verify("start_date", rule.Required{}, rule.After{Date: carbon.Now().AddDay()}),

Beside `Date`, you can enter a normal datetime format (default `yyyy-mm-dd HH:MM:SS` / `2006-01-02 15:04:05`) and a
timezone (default `Local`):

    rule.After{
		Date:     carbon.Now().AddDay(),
		Format:   "yyyy-mm-dd HH:MM:SS Z",
		TimeZone: "UTC",
	}

#### After Or Equal

The field under validation must be a value after or equal to the given date. For more options, see the [After](#after)
rule.

    rule.AfterOrEqual{Date: carbon.Now().AddDay()}

#### Before

The field under validation must be a value after a given date. For more options, see the [After](#after) rule.

    rule.Before{Date: carbon.Now().AddDay()}

#### Before Or Equal

The field under validation must be a value preceding or equal to the given date. For more options, see
the [After](#after) rule.

    rule.BeforeOrEqual{Date: carbon.Now().AddDay()}

#### Boolean

The field under validation must be able to be cast as a boolean. Accepted input are `true`, `false`, `1`, `0`, `"1"`,
and `"0"`.

    rule.Boolean{}

#### Date

The field under validation must be a valid date according to the format (default format is `yyyy-mm-dd HH:MM:SS`
/ `2006-01-02 15:04:05`).

    rule.Date{Format: carbon.HourMinuteFormat}

#### Date Equals

The field under validation must be equal to the given date. For more options, see the [After](#after) rule.

    rule.DateEqual{Date: carbon.Now(), Format: carbon.DateFormat}

#### Ends With

The field under validation must end with one of the given values.

    rule.Ends{}.With(".com", ".nl")

#### filled

The field under validation must not be empty when it is present.

    rule.Filled{}

#### in:_foo_,_bar_,...

The field under validation must be included in the given list of values. Since this rule often requires you to `implode`
an array, the `Rule::in` method may be used to fluently construct the rule:

    use Illuminate\Validation\Rule;

    Validator::make($data, [
        'zones' => [
            'required',
            Rule::in(['first-zone', 'second-zone']),
        ],
    ]);

#### integer

The field under validation must be an integer.

> {note} This validation rule does not verify that the input is of the "integer" variable type, only that the input is a string or numeric value that contains an integer.

#### ip

The field under validation must be an IP address.

#### ipv4

The field under validation must be an IPv4 address.

#### ipv6

The field under validation must be an IPv6 address.

#### json

The field under validation must be a valid JSON string.

#### max:_value_

The field under validation must be less than or equal to a maximum _value_. Strings, numerics, arrays, and files are
evaluated in the same fashion as the [`size`](#rule-size) rule.

#### mimetypes:_text/plain_,...

The file under validation must match one of the given MIME types:

    'video' => 'mimetypes:video/avi,video/mpeg,video/quicktime'

To determine the MIME type of the uploaded file, the file's contents will be read and the framework will attempt to
guess the MIME type, which may be different from the client provided MIME type.

#### mimes:_foo_,_bar_,...

The file under validation must have a MIME type corresponding to one of the listed extensions.

#### Basic Usage Of MIME Rule

    'photo' => 'mimes:jpeg,bmp,png'

Even though you only need to specify the extensions, this rule actually validates against the MIME type of the file by
reading the file's contents and guessing its MIME type.

A full listing of MIME types and their corresponding extensions may be found at the following
location: [https://svn.apache.org/repos/asf/httpd/httpd/trunk/docs/conf/mime.types](https://svn.apache.org/repos/asf/httpd/httpd/trunk/docs/conf/mime.types)

#### min:_value_

The field under validation must have a minimum _value_. Strings, numerics, arrays, and files are evaluated in the same
fashion as the [`size`](#rule-size) rule.

#### not_in:_foo_,_bar_,...

The field under validation must not be included in the given list of values. The `Rule::notIn` method may be used to
fluently construct the rule:

    use Illuminate\Validation\Rule;

    Validator::make($data, [
        'toppings' => [
            'required',
            Rule::notIn(['sprinkles', 'cherries']),
        ],
    ]);

#### not_regex:_pattern_

The field under validation must not match the given regular expression.

Internally, this rule uses the PHP `preg_match` function. The pattern specified should obey the same formatting required
by `preg_match` and thus also include valid delimiters. For example: `'email' => 'not_regex:/^.+$/i'`.

**Note:** When using the `regex` / `not_regex` patterns, it may be necessary to specify rules in an array instead of
using pipe delimiters, especially if the regular expression contains a pipe character.

#### nullable

The field under validation may be `null`. This is particularly useful when validating primitive such as strings and
integers that can contain `null` values.

#### numeric

The field under validation must be numeric.

#### password

The field under validation must match the authenticated user's password. You may specify an authentication guard using
the rule's first parameter:

    'password' => 'password:api'

#### present

The field under validation must be present in the input data but can be empty.

#### regex:_pattern_

The field under validation must match the given regular expression.

Internally, this rule uses the PHP `preg_match` function. The pattern specified should obey the same formatting required
by `preg_match` and thus also include valid delimiters. For example: `'email' => 'regex:/^.+@.+$/i'`.

**Note:** When using the `regex` / `not_regex` patterns, it may be necessary to specify rules in an array instead of
using pipe delimiters, especially if the regular expression contains a pipe character.

#### required

The field under validation must be present in the input data and not empty. A field is considered "empty" if one of the
following conditions are true:

<div class="content-list" markdown="1">

- The value is `null`.
- The value is an empty string.
- The value is an empty array or empty `Countable` object.
- The value is an uploaded file with no path.

</div>

#### size:_value_

The field under validation must have a size matching the given _value_. For string data, _value_ corresponds to the
number of characters. For numeric data, _value_ corresponds to a given integer value (the attribute must also have
the `numeric` or `integer` rule). For an array, _size_ corresponds to the `count` of the array. For files, _size_
corresponds to the file size in kilobytes. Let's look at some examples:

    // Validate that a string is exactly 12 characters long...
    'title' => 'size:12';

    // Validate that a provided integer equals 10...
    'seats' => 'integer|size:10';

    // Validate that an array has exactly 5 elements...
    'tags' => 'array|size:5';

    // Validate that an uploaded file is exactly 512 kilobytes...
    'image' => 'file|size:512';

#### Slice

The field under validation must be a `slice`.

#### starts_with:_foo_,_bar_,...

The field under validation must start with one of the given values.

#### string

The field under validation must be a string. If you would like to allow the field to also be `null`, you should assign
the `nullable` rule to the field.

#### timezone

The field under validation must be a valid timezone identifier according to the `timezone_identifiers_list` PHP
function.

#### url

The field under validation must be a valid URL.

#### uuid

The field under validation must be a valid RFC 4122 (version 1, 3, 4, or 5) universally unique identifier (UUID).

## Validating Arrays

Validating array based form input fields doesn't have to be a pain. You may use "dot notation" to validate attributes
within an array. For example, if the incoming HTTP request contains a `photos[profile]` field, you may validate it like
so:

    $validator = Validator::make($request->all(), [
        'photos.profile' => 'required|image',
    ]);

You may also validate each element of an array. For example, to validate that each e-mail in a given array input field
is unique, you may do the following:

    $validator = Validator::make($request->all(), [
        'person.*.email' => 'email|unique:users',
        'person.*.first_name' => 'required_with:person.*.last_name',
    ]);

Likewise, you may use the `*` character when specifying your validation messages in your language files, making it a
breeze to use a single validation message for array based fields:

    'custom' => [
        'person.*.email' => [
            'unique' => 'Each person must have a unique e-mail address',
        ]
    ],

## Custom Validation Rules

### Using Rule Objects

Lanvard provides a variety of helpful validation rules; however, you may wish to specify some of your own. One method of
registering custom validation rules is using rule objects. To generate a new rule object, you may use the `make:rule`
Artisan command. Let's use this command to generate a rule that verifies a string is uppercase. Lanvard will place the
new rule in the `app/Rules` directory:

    php artisan make:rule Uppercase

Once the rule has been created, we are ready to define its behavior. A rule object contains two methods: `passes`
and `message`. The `passes` method receives the attribute value and name, and should return `true` or `false` depending
on whether the attribute value is valid or not. The `message` method should return the validation error message that
should be used when validation fails:

    <?php

    namespace App\Rules;

    use Illuminate\Contracts\Validation\Rule;

    class Uppercase implements Rule
    {
        /**
         * Determine if the validation rule passes.
         *
         * @param  string  $attribute
         * @param  mixed  $value
         * @return bool
         */
        public function passes($attribute, $value)
        {
            return strtoupper($value) === $value;
        }

        /**
         * Get the validation error message.
         *
         * @return string
         */
        public function message()
        {
            return 'The :attribute must be uppercase.';
        }
    }

You may call the `trans` helper from your `message` method if you would like to return an error message from your
translation files:

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return trans('validation.uppercase');
    }

Once the rule has been defined, you may attach it to a validator by passing an instance of the rule object with your
other validation rules:

    use App\Rules\Uppercase;

    $request->validate([
        'name' => ['required', 'string', new Uppercase],
    ]);

#### Defining The Error Message

You will also need to define an error message for your custom rule. You can do so either using an inline custom message
array or by adding an entry in the validation language file. This message should be placed in the first level of the
array, not within the `custom` array, which is only for attribute-specific error messages:

    "foo" => "Your input was invalid!",

    "accepted" => "The :attribute must be accepted.",

    // The rest of the validation error messages...

When creating a custom validation rule, you may sometimes need to define custom placeholder replacements for error
messages. You may do so by creating a custom Validator as described above then making a call to the `replacer` method on
the `Validator` facade. You may do this within the `boot` method of a [service provider](/docs/{{version}}/providers):

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Validator::extend(...);

        Validator::replacer('foo', function ($message, $attribute, $rule, $parameters) {
            return str_replace(...);
        });
    }
