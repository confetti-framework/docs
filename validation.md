## Writing The Validation Logic

    func Store(request inter.Request) inter.Response {
        validatedData := request.Content().Validate(
            "title": []inter.rule{rule.Required{}, custom_rule.Unique{Table: "posts"}, rule.Max{Max: 255}},
            "body": []inter.rule{rule.Required{}},
        )

        validatedData := request.Content().Validate(
            val.Field("title", rule.Required{}, custom_rule.Unique{Table: "posts"}, rule.Max{Max: 255}),
            val.Field("body", rule.Required{}),
        )

        validatedData := request.Content().Validate(
            val.Field("title", rule.Required(), custom_rule.Unique("posts"), rule.Max(255)),
            val.Field("body", rule.Required()),
        )

        //
    }