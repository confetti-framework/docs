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

	failures := val.Validate(request.App(), request.Content(),
		val.Verify("name", rule.Required{}, rule.String{}),
		val.Verify("email", rule.Required{}, rule.Email{}),
	)

If a validation error occurs, you will receive a slice with errors.

#### Nested Attributes

If your data contains "nested" parameters, you may specify them in your validation rules using "dot" syntax:

    failures := val.Validate(request.App(), request.Content(),
		val.Verify("title", rule.Required{}, rule.String{}),
		val.Verify("author.name", rule.Required{}),
		val.Verify("author.description", rule.Required{}),
	)

If you want to validate all fields in a slice or in a map, you can use an asterisk:

    failures := val.Validate(request.App(), request.Content(),
		val.Verify("orders", rule.Sum{Sum: 3}),
		val.Verify("orders.*.street", rule.Required{}, rule.String{}),
	)

### Displaying The Validation Errors

So, what if the incoming request parameters do not pass the given validation rules? As mentioned previously, after
validation you will receive the errors in a slice.

#### Return Errors As Response

You can choose to return the errors immediately. In that case, the customer will immediately see the correct HTTP page
or JSON response.

    func UserStore(request inter.Request) inter.Response {
        failures := val.Validate(request.App(), request.Content(),
            val.Verify("title", rule.Required{}, rule.String{}),
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
        app := request.App()
        content := request.Content()
        failures := val.Validate(app, content,
            val.Verify("title", rule.Required{}, rule.String{}),
        )
    
        return outcome.Html(views.UserCreate(
            app,
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

#### Filled

The field under validation must not be empty when it is present.

    rule.Filled{}

#### In

The field under validation must be included in the given list of values.

    rule.In{}.With("admin", "manager")

#### Integer

The field under validation must be an integer.

    rule.Integer{}

#### Integer Able

The field being validated can be cast to an integer.

    rule.IntegerAble{}

#### Map

The field under validation must be a `map`.

    rule.Map{}

#### Max

The field under validation must be less than or equal to a maximum amount of items in a map or slice or maximum number.

    val.Verify("age", rule.Integer{}, rule.Max{Len: 120}),
    val.Verify("items", rule.Slice{}, rule.Max{Len: 5}),

#### Min

The field under validation must be at least amount of items in a map or slice or maximum number.

    val.Verify("age", rule.Integer{}, rule.Min{Len: 0}),
    val.Verify("items", rule.Slice{}, rule.Min{Len: 5}),

#### Present

The field under validation must be present in the input data but can be empty.

    rule.Present{}

#### Required

The field under validation must be present in the input data and not empty.

    rule.Required{}

> A field is considered "empty" if one of the following conditions are true:
> * The value is `nil`.
> * The value is an empty `string`.
> * The value is an empty `slice` or empty `map` object.

#### Size

The field under validation must have a size matching the given value.

    // Validate that a provided integer equals 10...
    val.Verify("age", rule.Integer{}, rule.Size{Len: 12}),

    // Validate that an slice has exactly 5 elements...
    val.Verify("items", rule.Slice{}, rule.Size{Len: 5}),

#### Slice

The field under validation must be a `slice`.

    rule.Slice{}

#### Start With

The field under validation must start with one of the given values.

    rule.Start{}.With("06-")

#### String

The field under validation must be a `string`.

    rule.String{}

## Custom Validation Rules

### Using Rule Objects

Lanvard provides a variety of helpful validation rules; however, you may wish to specify some of your own. The rule only
needs to meet the `inter.Rule` interface with the `Verify` method. If the value does not meet the rule, you must return
an error:

    package custom_rule

    import (
      "github.com/lanvard/support"
      "github.com/lanvard/validation/rule"
      "strings"
    )
    
    type Uppercase struct{}
    
    func (u Uppercase) Verify(value support.Value) error {
        val, err := value.StringE()
        if err != nil {
            return rule.MustBeAStringError
        }

        if strings.ToUpper(val) == val {
            return rule.ValidationError.Wrap("the :attribute must be uppercase")
        }

        return nil
    }

Once the rule has been defined, you may attach it to a validator by passing an instance of the rule object with your
other validation rules:

    failures := val.Validate(app, content,
        val.Verify("title", rule.Required{}, custom_rule.Uppercase{}),
    )

#### Before