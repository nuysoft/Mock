var Mock4Tpl = require('../../src/mock4tpl'),
    Handlebars = require('handlebars')
    Util = require('../../src/util'),
    util = require('util'),
    Print = require('node-print');
var Mock4XTpl = require('../../src/mock4xtpl'),
    KISSY = require('kissy'),
    XTemplate;
var rEmail = /[\w.]+@\w+\.\w+/,
    rDate = /\d{4}-\d{2}-\d{2}/,
    rTime = /\d{2}:\d{2}:\d{2}/,
    rDatetime = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/,
    rURL = /https?:\/\/\w+\.\w+/,
    rFloat = /(\d+)\.?(\d+)?/,
    rBoolean = /^true|false$/,
    rUpper = /^[A-Z]+$/,
    rLower = /^[a-z]+$/,
    rCapitalize = /^[A-Z][a-z]+$/,
    rTitle = /^([A-Z][a-z]+)( [A-z][a-z]+)+/;

function heredoc(f) {
    return f.toString()
        .replace(/^[^\/]+\/\*!?/, '')
        .replace(/\*\/[^\/]+$/, '')
        .trim();
}

exports.setUp = function(callback) {
    KISSY.use('xtemplate', function(S, T) {
        XTemplate = T
        callback()
    })
}

exports.test_loader = function(test) {
    test.ok(XTemplate)
    test.done()
}


/*
    expressions
    http://handlebarsjs.com/expressions.html
*/

// expressions

exports.test_expression_simple_identifier = function(test) {
    test.expect(1)

    var tpl, ast, data;

    tpl = '<h1>{{title}}</h1>'
    ast = Handlebars.parse(tpl)
    data = Mock4Tpl.mock(ast)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4));
    // console.log(JSON.stringify(data, null, 4))

    test.equal(data.title, 'title')
    test.done()
}

exports.test_expression_simple_identifier_4xtpl = function(test) {
    test.expect(1)

    var tpl, ast, data;

    tpl = '<h1>{{title}}</h1>'
    // Mock4XTpl.debug = true
    ast = Mock4XTpl.parse(tpl)
    // console.log(JSON.stringify(ast, null, 4));
    data = Mock4XTpl.mock(ast)
    // Mock4XTpl.debug = false
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4));
    // console.log(JSON.stringify(data, null, 4))

    test.equal(data.title, 'title')
    test.done()
}

exports.test_expression_simple_identifier_with_holder = function(test) {
    test.expect(1)

    var tpl, data;

    tpl = '<h1>{{title}}</h1>'
    data = Mock4Tpl.mock(tpl, {
        title: '@EMAIL'
    })
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4));
    // console.log(JSON.stringify(data, null, 4))

    test.ok(rEmail.test(data.title))
    test.done()
}

exports.test_expression_simple_identifier_with_holder_4xtpl = function(test) {
    test.expect(1)

    var tpl, data;

    tpl = '<h1>{{title}}</h1>'
    data = Mock4XTpl.mock(tpl, {
        title: '@EMAIL'
    })
    // console.log(JSON.stringify(data, null, 4))

    test.ok(rEmail.test(data.title))
    test.done()
}

exports.test_expression_dot_path = function(test) {
    test.expect(2)

    var tpl, data;

    tpl = '<h1>{{article.title}}</h1>'
    data = Mock4Tpl.mock(tpl)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4));
    // console.log(JSON.stringify(data, null, 4))

    test.ok(data.article)
    test.equal(data.article.title, 'title')
    test.done()
}

exports.test_expression_dot_path_4xtpl = function(test) {
    test.expect(2)

    var tpl, data;

    tpl = '<h1>{{article.title}}</h1>'
    data = Mock4XTpl.mock(tpl)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4));
    // console.log(JSON.stringify(data, null, 4))

    test.ok(data.article)
    test.equal(data.article.title, 'title')
    test.done()
}

exports.test_expression_multi_dot_path = function(test) {
    test.expect(1)

    var tpl, data;

    tpl = '<h1>{{a.b.c.d.e.f.g}}</h1>'
    data = Mock4Tpl.mock(tpl, {})
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4));
    // console.log(JSON.stringify(data, null, 4))

    test.ok(data.a.b.c.d.e.f.g)
    test.done()
}

exports.test_expression_multi_dot_path_4xtpl = function(test) {
    test.expect(1)

    var tpl, data;

    tpl = '<h1>{{a.b.c.d.e.f.g}}</h1>'
    data = Mock4XTpl.mock(tpl, {})
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4));
    // console.log(JSON.stringify(data, null, 4))

    test.ok(data.a.b.c.d.e.f.g)
    test.done()
}

exports.test_expression_dot_path_with_holder = function(test) {
    test.expect(2)

    var tpl, data;

    tpl = '<h1>{{article.title}}</h1>'
    data = Mock4Tpl.mock(tpl, {
        title: '@EMAIL'
    })
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4));
    // console.log(JSON.stringify(data, null, 4))

    test.ok(data.article)
    test.ok(rEmail.test(data.article.title))
    test.done()
}

exports.test_expression_dot_path_with_holder_4xtpl = function(test) {
    test.expect(2)

    var tpl, data;

    tpl = '<h1>{{article.title}}</h1>'
    data = Mock4XTpl.mock(tpl, {
        title: '@EMAIL'
    })
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4));
    // console.log(JSON.stringify(data, null, 4))

    test.ok(data.article)
    test.ok(rEmail.test(data.article.title))
    test.done()
}

exports.test_expression_dot_path_with_error_holder = function(test) {
    test.expect(2)

    var tpl, data;

    tpl = '<h1>{{article.title}}</h1>'
    data = Mock4Tpl.mock(tpl, {
        article: '@EMAIL'
    })
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4));
    // console.log(JSON.stringify(data, null, 4))

    test.equal(typeof data.article, 'object')
    test.equal(data.article.title, 'title')
    test.done()
}

exports.test_expression_dot_path_with_error_holder_4xtpl = function(test) {
    test.expect(2)

    var tpl, data;

    tpl = '<h1>{{article.title}}</h1>'
    data = Mock4XTpl.mock(tpl, {
        article: '@EMAIL'
    })
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4));
    // console.log(JSON.stringify(data, null, 4))

    test.equal(typeof data.article, 'object')
    test.equal(data.article.title, 'title')
    test.done()
}

exports.test_expression_dot_path_with_nested_holder = function(test) {
    test.expect(3)

    var tpl, data;

    tpl = '<h1>{{article.title}}</h1>'
    data = Mock4Tpl.mock(tpl, {
        article: {
            title: '@EMAIL',
            content: '@SENTENCE'
        }
    })
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(typeof data.article, 'object')
    test.ok(rEmail.test(data.article.title))
    test.ok(data.article.content.split(' ').length)
    test.done()
}

exports.test_expression_dot_path_with_nested_holder_4xtpl = function(test) {
    test.expect(3)

    var tpl, data;

    tpl = '<h1>{{article.title}}</h1>'
    data = Mock4XTpl.mock(tpl, {
        article: {
            title: '@EMAIL',
            content: '@SENTENCE'
        }
    })
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(typeof data.article, 'object')
    test.ok(rEmail.test(data.article.title))
    test.ok(data.article.content.split(' ').length)
    test.done()
}

exports.test_expression_dot_path_with_nested_and_parent_holder = function(test) {
    test.expect(3)

    var tpl, data;

    tpl = '<h1>{{article.title}}</h1>'
    data = Mock4Tpl.mock(tpl, {
        title: '@EMAIL',
        article: {
            content: '@SENTENCE'
        }
    })
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(typeof data.article, 'object')
    test.ok(rEmail.test(data.article.title))
    test.ok(data.article.content.split(' ').length)
    test.done()
}

exports.test_expression_dot_path_with_nested_and_parent_holder_4xtpl = function(test) {
    test.expect(3)

    var tpl, data;

    tpl = '<h1>{{article.title}}</h1>'
    data = Mock4XTpl.mock(tpl, {
        title: '@EMAIL',
        article: {
            content: '@SENTENCE'
        }
    })
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(typeof data.article, 'object')
    test.ok(rEmail.test(data.article.title))
    test.ok(data.article.content.split(' ').length)
    test.done()
}

exports.test_expression_dot_path_with_priority_holder = function(test) {
    test.expect(4)

    var tpl, data;

    tpl = '<h1>{{article.title}}</h1>'
    data = Mock4Tpl.mock(tpl, {
        title: '@EMAIL',
        article: {
            content: '@SENTENCE',
            title: '@DATE'
        }
    })
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(typeof data.article, 'object')
    test.ok(!rEmail.test(data.article.title))
    test.ok(rDate.test(data.article.title))
    test.ok(data.article.content.split(' ').length)
    test.done()
}

exports.test_expression_dot_path_with_priority_holder_4xtpl = function(test) {
    test.expect(4)

    var tpl, data;

    tpl = '<h1>{{article.title}}</h1>'
    // Mock4XTpl._.debug = true
    data = Mock4XTpl.mock(tpl, {
        title: '@EMAIL',
        article: {
            title: '@DATE',
            content: '@SENTENCE'
        }
    })
    // Mock4XTpl._.debug = false
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(typeof data.article, 'object')
    test.ok(!rEmail.test(data.article.title))
    test.ok(rDate.test(data.article.title))
    test.ok(data.article.content.split(' ').length)
    test.done()
}

exports.test_expression_slash_path = function(test) {
    test.expect(2)

    var tpl, data;

    // deprecated / syntax slash
    // test_expression_slash_path
    tpl = '<h1>{{article/title}}</h1>'
    data = Mock4Tpl.mock(tpl)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4));
    // console.log(JSON.stringify(data, null, 4))

    test.ok(data.article)
    test.equal(data.article.title, 'title')
    test.done()
}

/*
    在 Handlebar 中，斜杠可以用作属性访问符；
    在 XTempalte 中，斜杠是除法运算符。
    建议：在项目不要使用斜杠作为属性访问符。
*/
exports.test_expression_slash_path_4xtpl = function(test) {
    test.expect(2)

    var tpl, data;

    // deprecated / syntax slash
    tpl = '<h1>{{article/title}}</h1>'
    data = Mock4XTpl.mock(tpl)
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4));
    // console.log(JSON.stringify(data, null, 4))

    test.equal(data.article, 'article', data.article)
    test.equal(data.title, 'title', data.title)
    test.done()
}

exports.test_expression_multi_slash_path = function(test) {
    test.expect(1)

    var tpl, data;

    // deprecated / syntax slash
    // test_expression_slash_path
    tpl = '<h1>{{a/b/c/d/e/f/g}}</h1>'
    data = Mock4Tpl.mock(tpl)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.ok(data.a.b.c.d.e.f.g)
    test.done()
}

exports.test_expression_multi_slash_path_4xtpl = function(test) {
    test.expect(7)

    var tpl, data;

    // deprecated / syntax slash
    tpl = '<h1>{{a/b/c/d/e/f/g}}</h1>'
    // Mock4XTpl._.debug = true
    data = Mock4XTpl.mock(tpl)
    // Mock4XTpl._.debug = false
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(data.a, 'a', data.a)
    test.equal(data.b, 'b', data.b)
    test.equal(data.c, 'c', data.c)
    test.equal(data.d, 'd', data.d)
    test.equal(data.e, 'e', data.e)
    test.equal(data.f, 'f', data.f)
    test.equal(data.g, 'g', data.g)

    test.done()
}

exports.test_expression_triple_stash = function(test) {
    test.expect(1)

    var tpl, data;

    tpl = '<h1>{{{a.b.c.d.e.f.g}}}</h1>'
    data = Mock4Tpl.mock(tpl)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.ok(data.a.b.c.d.e.f.g)
    test.done()
}

exports.test_expression_triple_stash_4xtpl = function(test) {
    test.expect(1)

    var tpl, data;

    tpl = '<h1>{{{a.b.c.d.e.f.g}}}</h1>'
    data = Mock4XTpl.mock(tpl)
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.ok(data.a.b.c.d.e.f.g)
    test.done()
}

exports.test_expression_multi = function(test) {
    test.expect(2)

    var tpl, data;

    tpl = '<h1>{{obj}}: {{obj.prop}}, {{prop}}</h1>'
    data = Mock4Tpl.mock(tpl)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4));
    // console.log(JSON.stringify(data, null, 4))

    test.equal(typeof data.obj, 'object')
    test.equal(data.obj.prop, 'prop')
    test.done()
}

exports.test_expression_multi_4xtpl = function(test) {
    test.expect(2)

    var tpl, data;

    tpl = '<h1>{{obj}}: {{obj.prop}}, {{prop}}</h1>'
    // Mock4XTpl._.debug = true
    data = Mock4XTpl.mock(tpl)
    // Mock4XTpl._.debug = false
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4));
    // console.log(JSON.stringify(data, null, 4))

    test.equal(typeof data.obj, 'object')
    test.equal(data.obj.prop, 'prop')
    test.done()
}

exports.test_expression_multi_with_holder = function(test) {
    test.expect(3)

    var tpl, data;

    tpl = '<h1>{{obj}}: {{obj.prop}}, {{prop}}</h1>'
    data = Mock4Tpl.mock(tpl, {
        obj: {
            prop: '@DATE'
        },
        prop: '@TIME'
    })
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4));
    // console.log(JSON.stringify(data, null, 4))

    test.equal(typeof data.obj, 'object')
    test.ok(rDate.test(data.obj.prop))
    test.ok(rTime.test(data.prop))
    test.done()
}

exports.test_expression_multi_with_holder_4xtpl = function(test) {
    test.expect(3)

    var tpl, data;

    tpl = '<h1>{{obj}}: {{obj.prop}}, {{prop}}</h1>'
    data = Mock4XTpl.mock(tpl, {
        obj: {
            prop: '@DATE'
        },
        prop: '@TIME'
    })
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4));
    // console.log(JSON.stringify(data, null, 4))

    test.equal(typeof data.obj, 'object')
    test.ok(rDate.test(data.obj.prop))
    test.ok(rTime.test(data.prop))
    test.done()
}

exports.test_helper_simple = function(test) {
    test.expect(2)

    var tpl, data;

    tpl = '{{{link story}}}'
    data = Mock4Tpl.mock(tpl)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(typeof data.story, 'string')
    test.equal(data.story, 'story')
    test.done()
}

exports.test_helper_simple_4xtpl = function(test) {
    test.expect(2)

    var tpl, data;

    tpl = '{{{link story}}}'
    data = Mock4XTpl.mock(tpl)
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(typeof data.story, 'string')
    test.equal(data.story, 'story')
    test.done()
}

exports.test_helper_simple_parameter = function(test) {
    test.expect(3)

    var tpl, data;

    tpl = '{{{link "See more..." story.url}}}'
    data = Mock4Tpl.mock(tpl)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(typeof data.story, 'object')
    test.equal(typeof data.story.url, 'string')
    test.equal(data.story.url, 'url')
    test.done()
}

exports.test_helper_simple_parameter_4xtpl = function(test) {
    test.expect(3)

    var tpl, data;

    tpl = '{{{link "See more..." story.url}}}'
    data = Mock4XTpl.mock(tpl)
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(typeof data.story, 'object')
    test.equal(typeof data.story.url, 'string')
    test.equal(data.story.url, 'url')
    test.done()
}

exports.test_helper_simple_parameter_with_holder = function(test) {
    test.expect(4)

    var tpl, data;

    tpl = '{{{link "See more..." story.url}}}'
    data = Mock4Tpl.mock(tpl, {
        story: {
            float: '@FLOAT',
            url: '@URL'
        },
        url: 'mailto:@EMAIL'
    })
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(typeof data.story, 'object')
    test.equal(typeof data.story.url, 'string')
    test.ok(rURL.test(data.story.url))
    test.ok(rFloat.test(data.story.float))
    test.done()
}

exports.test_helper_simple_parameter_with_holder_4xtpl = function(test) {
    test.expect(4)

    var tpl, data;

    tpl = '{{{link "See more..." story.url}}}'
    data = Mock4XTpl.mock(tpl, {
        story: {
            float: '@FLOAT',
            url: '@URL'
        },
        url: 'mailto:@EMAIL'
    })
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(typeof data.story, 'object')
    test.equal(typeof data.story.url, 'string')
    test.ok(rURL.test(data.story.url))
    test.ok(rFloat.test(data.story.float))
    test.done()
}

exports.test_helper_dynamic_parameter = function(test) {
    test.expect(5)

    var tpl, data;

    tpl = '{{{link story.text story.url story.author.first}}}'
    data = Mock4Tpl.mock(tpl)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(typeof data.story, 'object')
    test.equal(typeof data.story.url, 'string')
    test.equal(data.story.url, 'url')
    test.equal(typeof data.story.author, 'object')
    test.equal(data.story.author.first, 'first')
    test.done()
}

exports.test_helper_dynamic_parameter_4xtpl = function(test) {
    test.expect(5)

    var tpl, data;

    tpl = '{{{link story.text story.url story.author.first}}}'
    data = Mock4XTpl.mock(tpl)
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(typeof data.story, 'object')
    test.equal(typeof data.story.url, 'string')
    test.equal(data.story.url, 'url')
    test.equal(typeof data.story.author, 'object')
    test.equal(data.story.author.first, 'first')
    test.done()
}

exports.test_helper_dynamic_parameter_with_holder = function(test) {
    test.expect(5)

    var tpl, data;

    tpl = '{{{link story.text story.url story.author.first}}}'
    data = Mock4Tpl.mock(tpl, {
        text: '@SENTENCE',
        url: '@URL',
        first: '@FIRST',
        story: {
            price: '$@FLOAT'
        }
    })
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(typeof data.story, 'object')
    test.equal(typeof data.story.author, 'object')
    test.ok(data.story.text.split(' ').length)
    test.ok(rURL.test(data.story.url))
    test.ok(rFloat.test(data.story.price))
    test.done()
}

exports.test_helper_dynamic_parameter_with_holder_4xtpl = function(test) {
    test.expect(5)

    var tpl, data;

    tpl = '{{{link story.text story.url story.author.first}}}'
    data = Mock4XTpl.mock(tpl, {
        text: '@SENTENCE',
        url: '@URL',
        first: '@FIRST',
        story: {
            price: '$@FLOAT(1,100,1,99)'
        }
    })
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(typeof data.story, 'object')
    test.equal(typeof data.story.author, 'object')
    test.ok(data.story.text.split(' ').length)
    test.ok(rURL.test(data.story.url))
    test.ok(rFloat.test(data.story.price))
    test.done()
}

exports.test_helper_hash_parameter = function(test) {
    test.expect(3)

    var tpl, data;

    tpl = '{{{link "See more..." story=story href=story.url class="story"}}}'
    data = Mock4Tpl.mock(tpl)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(typeof data.story, 'object')
    test.equal(typeof data.story.url, 'string')
    test.equal(data.story.url, 'url')
    test.done()
}

exports.test_helper_hash_parameter_4xtpl = function(test) {
    test.expect(3)

    var tpl, data;

    tpl = '{{{link "See more..." story=story href=story.url class="story"}}}'
    // Mock4XTpl._.debug = true
    data = Mock4XTpl.mock(tpl)
    // Mock4XTpl._.debug = false
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(typeof data.story, 'object')
    test.equal(typeof data.story.url, 'string')
    test.equal(data.story.url, 'url')
    test.done()
}

exports.test_helper_hash_parameter_with_holder = function(test) {
    test.expect(3)

    var tpl, data;

    tpl = '{{{link "See more..." story=story href=story.url class="story"}}}'
    data = Mock4Tpl.mock(tpl, {
        url: '@URL'
    })
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(typeof data.story, 'object')
    test.equal(typeof data.story.url, 'string')
    test.ok(rURL.test(data.story.url))
    test.done()
}

exports.test_helper_hash_parameter_with_holder_4xtpl = function(test) {
    test.expect(3)

    var tpl, data;

    tpl = '{{{link "See more..." story=story href=story.url class="story"}}}'
    data = Mock4XTpl.mock(tpl, {
        url: '@URL'
    })
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(typeof data.story, 'object')
    test.equal(typeof data.story.url, 'string')
    test.ok(rURL.test(data.story.url))
    test.done()
}

/*
    block
    http://handlebarsjs.com/block_helpers.html
*/

exports.test_block_simple = function(test) {
    test.expect(3)

    var tpl, data;

    tpl = heredoc(function() {
        /*
<div class="entry">
  <h1>{{title}}</h1>
  <div class="body">
    {{#noop}}{{body}}{{/noop}}
  </div>
</div>
*/
    })
    data = Mock4Tpl.mock(tpl)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(data.title, 'title')
    test.equal(typeof data.noop, 'object')
    test.equal(data.noop.body, 'body')
    test.done()
}

exports.test_block_simple_4xtpl = function(test) {
    test.expect(3)

    var tpl, data;

    tpl = heredoc(function() {
        /*
<div class="entry">
  <h1>{{title}}</h1>
  <div class="body">
    {{#noop}}{{body}}{{/noop}}
  </div>
</div>
*/
    })
    // Mock4XTpl._.debug = true
    data = Mock4XTpl.mock(tpl)
    // Mock4XTpl._.debug = false
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(data.title, 'title')
    test.equal(typeof data.noop, 'object')
    test.equal(data.noop.body, 'body')
    test.done()
}


/*
    Handlebars.registerHelper('noop', function(options) {
        console.log(options)
        var re = options.fn(this);
        console.log(re) // 返回属性 body
        return re
    });

    var source = '<div class="entry"><h1>{{title}}</h1><div class="body">{{#noop}}{{body}}{{/noop}}</div></div>'
    var template = Handlebars.compile(source);
    var context = {
        title: "My New Post",
        body: "This is my first post!"
    }
    var html = template(context);
*/
exports.test_block_simple_with_hodler = function(test) {
    test.expect(4)

    var tpl, data;

    tpl = heredoc(function() {
        /*
<div class="entry">
  <h1>{{title}}</h1>
  <div class="body">
    {{#noop}}{{body}}{{/noop}}
  </div>
</div>
*/
    })
    data = Mock4Tpl.mock(tpl, {
        'title': '@STRING(UPPER,10)',
        'noop|1': true,
        body: '@SENTENCE'
    })
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(typeof data.title, 'string')
    test.ok(rUpper.test(data.title))
    test.equal(typeof data.noop, 'boolean')
    test.ok(data.body.split(' ').length)
    test.done()
}

exports.test_block_simple_with_hodler_4xtpl = function(test) {
    test.expect(4)

    var tpl, data;

    tpl = heredoc(function() {
        /*
<div class="entry">
  <h1>{{title}}</h1>
  <div class="body">
    {{#noop}}{{body}}{{/noop}}
  </div>
</div>
*/
    })
    data = Mock4XTpl.mock(tpl, {
        'title': '@STRING(UPPER,10)',
        'noop|1': true,
        body: '@SENTENCE'
    })
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(typeof data.title, 'string')
    test.ok(rUpper.test(data.title))
    test.equal(typeof data.noop, 'boolean')
    test.ok(data.body.split(' ').length)
    test.done()
}

exports.test_block_with = function(test) {
    var tpl, data;

    tpl = heredoc(function() {
        /*
<div class="entry">
  <h1>{{title}}</h1>
  {{#with story}}
    <div class="intro">{{{intro}}}</div>
    <div class="body">{{{body}}}</div>
  {{/with}}
</div>
    */
    })
    data = Mock4Tpl.mock(tpl)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(data.title, 'title')
    test.equal(typeof data.story, 'object')
    test.equal(data.story.intro, 'intro')
    test.equal(data.story.body, 'body')
    test.done()
}

exports.test_block_with_4xtpl = function(test) {
    var tpl, data;

    tpl = heredoc(function() {
        /*
<div class="entry">
  <h1>{{title}}</h1>
  {{#with story}}
    <div class="intro">{{{intro}}}</div>
    <div class="body">{{{body}}}</div>
  {{/with}}
</div>
    */
    })
    data = Mock4XTpl.mock(tpl)
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(data.title, 'title')
    test.equal(typeof data.story, 'object')
    test.equal(data.story.intro, 'intro')
    test.equal(data.story.body, 'body')
    test.done()
}

exports.test_block_with_with_holder = function(test) {
    test.expect(4)

    var tpl, data;

    tpl = heredoc(function() {
        /*
<div class="entry">
  <h1>{{title}}</h1>
  {{#with story}}
    <div class="intro">{{{intro}}}</div>
    <div class="body">{{{body}}}</div>
  {{/with}}
</div>
    */
    })
    data = Mock4Tpl.mock(tpl, {
        _title: '@WORD',
        title: '@capitalize(@_title)',
        intro: '@SENTENCE',
        body: '@PARAGRAPH'
    })
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.ok(rCapitalize.test(data.title))
    test.equal(typeof data.story, 'object')
    test.ok(data.story.intro.split(' ').length)
    test.ok(data.story.body.split('.').length)
    test.done()
}

exports.test_block_with_with_holder_4xtpl = function(test) {
    test.expect(4)

    var tpl, data;

    tpl = heredoc(function() {
        /*
<div class="entry">
  <h1>{{title}}</h1>
  {{#with story}}
    <div class="intro">{{{intro}}}</div>
    <div class="body">{{{body}}}</div>
  {{/with}}
</div>
    */
    })
    data = Mock4XTpl.mock(tpl, {
        _title: '@WORD',
        title: '@capitalize(@_title)',
        intro: '@SENTENCE',
        body: '@PARAGRAPH'
    })
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.ok(rCapitalize.test(data.title))
    test.equal(typeof data.story, 'object')
    test.ok(data.story.intro.split(' ').length)
    test.ok(data.story.body.split('.').length)
    test.done()
}

exports.test_block_each = function(test) {
    var tpl, data;

    tpl = heredoc(function() {
        /*
<div class="entry">
  <h1>{{title}}</h1>
  {{#with story}}
    <div class="intro">{{{intro}}}</div>
    <div class="body">{{{body}}}</div>
  {{/with}}
</div>
<div class="comments">
  {{#each comments}}
    <div class="comment">
      <h2>{{subject}}</h2>
      {{{body}}}
    </div>
  {{/each}}
</div>
    */
    })
    data = Mock4Tpl.mock(tpl)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(data.title, 'title')
    test.equal(typeof data.story, 'object')
    test.equal(data.story.intro, 'intro')
    test.equal(data.story.body, 'body')

    test.ok(util.isArray(data.comments))
    data.comments.forEach(function(item) {
        test.equal(item.subject, 'subject')
        test.equal(item.body, 'body')
    })

    test.done()
}

exports.test_block_each_4xtpl = function(test) {
    var tpl, data;

    tpl = heredoc(function() {
        /*
<div class="entry">
  <h1>{{title}}</h1>
  {{#with story}}
    <div class="intro">{{{intro}}}</div>
    <div class="body">{{{body}}}</div>
  {{/with}}
</div>
<div class="comments">
  {{#each comments}}
    <div class="comment">
      <h2>{{subject}}</h2>
      {{{body}}}
    </div>
  {{/each}}
</div>
    */
    })
    // Mock4XTpl._.debug = true
    data = Mock4XTpl.mock(tpl)
    // Mock4XTpl._.debug = false
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(data.title, 'title')
    test.equal(typeof data.story, 'object')
    test.equal(data.story.intro, 'intro')
    test.equal(data.story.body, 'body')

    test.ok(util.isArray(data.comments))
    data.comments.forEach(function(item) {
        test.equal(item.subject, 'subject')
        test.equal(item.body, 'body')
    })

    test.done()
}

// TODO 嵌套占位符，需要支持为不同路径设置不同的占位符
exports.test_block_each_with_holder = function(test) {
    test.expect(11)

    var tpl, data;

    tpl = heredoc(function() {
        /*
<div class="entry">
  <h1>{{title}}</h1>
  {{#with story}}
    <div class="intro">{{{intro}}}</div>
    <div class="body">{{{body}}}</div>
  {{/with}}
</div>
<div class="comments">
  {{#each comments}}
    <div class="comment">
      <h2>{{subject}}</h2>
      {{{body}}}
    </div>
  {{/each}}
</div>
    */
    })
    data = Mock4Tpl.mock(tpl, {
        'comments|3': [],
        title: '@TITLE',
        intro: '@SENTENCE',
        body: '@SENTENCE',
        subject: '@WORD'
    })
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.ok(rTitle.test(data.title))
    test.equal(typeof data.story, 'object')
    test.ok(data.story.intro.split(' ').length)
    test.ok(data.story.body.split(' ').length)

    test.ok(util.isArray(data.comments))
    for (var i = 0; i < data.comments.length; i++) {
        test.ok(rLower.test(data.comments[i].subject))
        test.ok(data.comments[i].body.split(' ').length)
    }

    test.done()
}

exports.test_block_each_with_holder_4xtpl = function(test) {
    test.expect(13)

    var tpl, data;

    tpl = heredoc(function() {
        /*
<div class="entry">
  <h1>{{title}}</h1>
  {{#with story}}
    <div class="intro">{{{intro}}}</div>
    <div class="body">{{{body}}}</div>
  {{/with}}
</div>
<div class="comments">
  {{#each comments}}
    <div class="comment">
      <h2>{{subject}}</h2>
      {{{body}}}
    </div>
  {{/each}}
</div>
    */
    })
    // Mock4XTpl._.debug = true
    data = Mock4XTpl.mock(tpl, {
        title: '@TITLE',

        story: {
            body: '@SENTENCE'
        },
        intro: '@SENTENCE',

        'comments|3': [{
                'id|+1': 1,
                body: '@EMAIL'
            }
        ],
        body: '@NAME', // 不起作用
        subject: '@WORD'
    })
    // Mock4XTpl._.debug = false
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.ok(rTitle.test(data.title))
    test.equal(typeof data.story, 'object')
    test.ok(data.story.intro.split(' ').length)
    test.ok(data.story.body.split(' ').length)

    test.ok(util.isArray(data.comments))
    data.comments.forEach(function(item, index, prev) {
        prev = data.comments[index - 1]
        if (index > 0) test.equal(item.id - prev.id, 1)
        test.ok(rLower.test(item.subject))
        test.ok(item.body.split(' ').length)
    })

    test.done()
}

exports.test_block_list = function(test) {
    var tpl, data;

    tpl = heredoc(function() {
        /*
{{#list nav}}
  <a href="{{url}}">{{title}}</a>
{{/list}}
    */
    })
    data = Mock4Tpl.mock(tpl)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.ok(util.isArray(data.nav))
    for (var i = 0; i < data.nav.length; i++) {
        test.equal(data.nav[i].url, 'url')
        test.equal(data.nav[i].title, 'title')
    }

    test.done()
}

exports.test_block_list_4xtpl = function(test) {
    var tpl, data;

    tpl = heredoc(function() {
        /*
{{#list nav}}
  <a href="{{url}}">{{title}}</a>
{{/list}}
    */
    })
    data = Mock4XTpl.mock(tpl)
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(data.nav.url, 'url')
    test.equal(data.nav.title, 'title')

    test.done()
}

exports.test_block_list_with_holder = function(test) {
    test.expect(8)

    var tpl, data;

    tpl = heredoc(function() {
        /*
{{#list nav}}
  <a href="{{url}}">{{title}}</a>
{{/list}}
    */
    })
    data = Mock4Tpl.mock(tpl, {
        'nav|3': [],
        url: '@URL',
        title: '@TITLE'
    })
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.ok(util.isArray(data.nav))
    test.equal(data.nav.length, 3)
    for (var i = 0; i < data.nav.length; i++) {
        test.ok(rURL.test(data.nav[i].url))
        test.ok(rTitle.test(data.nav[i].title))
    }

    test.done()
}

exports.test_block_list_with_holder_4xtpl = function(test) {
    test.expect(8)

    var tpl, data;

    tpl = heredoc(function() {
        /*
{{#list nav}}
  <a href="{{url}}">{{title}}</a>
{{/list}}
    */
    })
    data = Mock4XTpl.mock(tpl, {
        'nav|3': [],
        url: '@URL',
        title: '@TITLE'
    })
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.ok(util.isArray(data.nav))
    test.equal(data.nav.length, 3)
    data.nav.forEach(function(item) {
        test.ok(rURL.test(item.url))
        test.ok(rTitle.test(item.title))
    })

    test.done()
}

exports.test_block_conditional_if = function(test) {
    var tpl, data;

    tpl = heredoc(function() {
        /*
{{#if a.b.c}}
  <img src="star.gif" alt="Active">
{{/if}}
        */
    })
    data = Mock4Tpl.mock(tpl)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.ok(data.a.b)
    test.equal(typeof data.a.b.c, 'boolean', data.a.b.c)
    test.done()
}

exports.test_block_conditional_if_4xtpl = function(test) {
    var tpl, data;

    tpl = heredoc(function() {
        /*
{{#if a.b.c}}
  <img src="star.gif" alt="Active">
{{/if}}
        */
    })
    data = Mock4XTpl.mock(tpl)
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.ok(data.a.b)
    test.equal(typeof data.a.b.c, 'boolean', data.a.b.c)
    test.done()
}

exports.test_block_conditional_if_with_holder = function(test) {
    test.expect(3)

    var tpl, data;

    tpl = heredoc(function() {
        /*
{{#if a.b.c}}
  <img src="star.gif" alt="Active">
{{/if}}
        */
    })
    data = Mock4Tpl.mock(tpl, {
        c: '@BOOL'
    })
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.ok(data.a)
    test.ok(data.a.b)
    test.equal(typeof data.a.b.c, 'boolean')
    test.done()
}

exports.test_block_conditional_if_with_holder_4xtpl = function(test) {
    test.expect(3)

    var tpl, data;

    tpl = heredoc(function() {
        /*
{{#if a.b.c}}
  <img src="star.gif" alt="Active">
{{/if}}
        */
    })
    data = Mock4XTpl.mock(tpl, {
        c: '@BOOL'
    })
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.ok(data.a)
    test.ok(data.a.b)
    test.equal(typeof data.a.b.c, 'boolean')
    test.done()
}

exports.test_block_conditional_if_else = function(test) {
    var tpl, data, html;

    tpl = heredoc(function() {
        /*
{{#if a.b.c}}
  <img src="star.gif" alt="Active">
{{else}}
  <img src="cry.gif" alt="Inactive">
{{/if}}
        */
    })
    for (var i = 0; i < 10; i++) {
        data = Mock4Tpl.mock(tpl)
        html = Handlebars.compile(tpl)(data)
        // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
        // console.log(JSON.stringify(data, null, 4))
        // console.log(html)

        test.ok(data.a.b)
        test.equal(typeof data.a.b.c, 'boolean', data.a.b.c)
    }
    test.done()
}

exports.test_block_conditional_if_else_4xtpl = function(test) {
    var tpl, data, html;

    tpl = heredoc(function() {
        /*
{{#if a.b.c}}
  <img src="star.gif" alt="Active">
{{else}}
  <img src="cry.gif" alt="Inactive">
{{/if}}
        */
    })
    // Mock4XTpl._.debug = true
    data = Mock4XTpl.mock(tpl)
    // Mock4XTpl._.debug = false
    html = Handlebars.compile(tpl)(data)
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html)

    test.ok(data.a.b)
    test.equal(typeof data.a.b.c, 'boolean', data.a.b.c)
    test.done()
}

exports.test_block_conditional_if_else_with_holder = function(test) {
    test.expect(2)

    var tpl, data, html;

    tpl = heredoc(function() {
        /*
{{#if a.b.c}}
  <img src="star.gif" alt="Active">
{{else}}
  <img src="cry.gif" alt="Inactive">
{{/if}}
        */
    })
    data = Mock4Tpl.mock(tpl, {
        c: '@BOOL'
    })
    html = Handlebars.compile(tpl)(data)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html)

    test.ok(data.a.b)
    test.equal(typeof data.a.b.c, 'boolean')
    test.done()
}

exports.test_block_conditional_if_else_with_holder_4xtpl = function(test) {
    test.expect(2)

    var tpl, data, html;

    tpl = heredoc(function() {
        /*
{{#if a.b.c}}
  <img src="star.gif" alt="Active">
{{else}}
  <img src="cry.gif" alt="Inactive">
{{/if}}
        */
    })
    data = Mock4XTpl.mock(tpl, {
        c: '@BOOL'
    })
    html = Handlebars.compile(tpl)(data)
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html)

    test.ok(data.a.b)
    test.equal(typeof data.a.b.c, 'boolean')
    test.done()
}

exports.test_hash_arguments_list = function(test) {
    var tpl, data, html;

    // TODO 添加 SproutCore.js
    Handlebars.registerHelper('list', function(context, options) {
        var attrs = Object.keys(options.hash).map(function(key) {
            return key + '="' + options.hash[key] + '"';
        }).join(" ");

        return "<ul " + attrs + ">" + context.map(function(item) {
            return "<li>" + options.fn(item) + "</li>";
        }).join("\n") + "</ul>";
    });

    tpl = heredoc(function() {
        /*
{{#list nav id="nav-bar" class="top"}}
  <a href="{{url}}">{{title}}</a>
{{/list}}
        */
    })
    data = Mock4Tpl.mock(tpl)
    html = Handlebars.compile(tpl)(data)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html)

    test.ok(util.isArray(data.nav))
    for (var i = 0; i < data.nav.length; i++) {
        test.equal(data.nav[i].url, 'url')
        test.equal(data.nav[i].title, 'title')
    }
    test.done()
}

exports.test_hash_arguments_list_4xtpl = function(test) {
    var tpl, data;

    tpl = heredoc(function() {
        /*
{{#list nav id="nav-bar" class="top"}}
  <a href="{{url}}">{{title}}</a>
{{/list}}
        */
    })
    data = Mock4XTpl.mock(tpl)
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.ok(data.nav)
    test.equal(data.nav.url, 'url')
    test.equal(data.nav.title, 'title')
    test.done()
}


exports.test_hash_arguments_list_with_holder = function(test) {
    test.expect(8)

    var tpl, data, html;

    // TODO 添加 SproutCore.js
    Handlebars.registerHelper('list', function(context, options) {
        var attrs = Object.keys(options.hash).map(function(key) {
            return key + '="' + options.hash[key] + '"';
        }).join(" ");

        return "<ul " + attrs + ">" + context.map(function(item) {
            return "<li>" + options.fn(item) + "</li>";
        }).join("\n") + "</ul>";
    });

    tpl = heredoc(function() {
        /*
{{#list nav id="nav-bar" class="top"}}
  <a href="{{url}}">{{title}}</a>
{{/list}}
        */
    })
    data = Mock4Tpl.mock(tpl, {
        'nav|3': [],
        url: '@URL',
        title: '@TITLE'
    })
    html = Handlebars.compile(tpl)(data)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html)

    test.ok(util.isArray(data.nav))
    test.equal(data.nav.length, 3)
    for (var i = 0; i < data.nav.length; i++) {
        test.ok(rURL.test(data.nav[i].url))
        test.ok(rTitle.test(data.nav[i].title))
    }
    test.done()
}

exports.test_hash_arguments_list_with_holder_4xtpl = function(test) {
    test.expect(8)

    var tpl, data;

    tpl = heredoc(function() {
        /*
{{#list nav id="nav-bar" class="top"}}
  <a href="{{url}}">{{title}}</a>
{{/list}}
        */
    })
    data = Mock4XTpl.mock(tpl, {
        'nav|3': [],
        url: '@URL',
        title: '@TITLE'
    })
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.ok(util.isArray(data.nav))
    test.equal(data.nav.length, 3)
    data.nav.forEach(function(item) {
        test.ok(rURL.test(item.url))
        test.ok(rTitle.test(item.title))
    })
    test.done()
}

exports.test_block_add_extra_info = function(test) {
    var tpl, data, html;

    Handlebars.registerHelper('list', function(context, options) {
        var out = "<ul>",
            data;

        for (var i = 0; i < context.length; i++) {
            if (options.data) {
                data = Handlebars.createFrame(options.data || {});
                data.index = i;
            }

            out += "<li>" + options.fn(context[i], {
                data: data
            }) + "</li>";
        }

        out += "</ul>";
        return out;
    });

    tpl = heredoc(function() {
        /*
{{#list array}}
  {{@index}}. {{title}}
{{/list}}
        */
    })
    data = Mock4Tpl.mock(tpl)
    html = Handlebars.compile(tpl)(data)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html)

    test.ok(util.isArray(data.array))
    for (var i = 0; i < data.array.length; i++) {
        test.equal(data.array[i].title, 'title')
    }
    test.done()
}

exports.test_block_add_extra_info_4xtpl = function(test) {
    var tpl, data;

    tpl = heredoc(function() {
        /*
{{#list array}}
  {{xindex}}. {{title}}
{{/list}}
        */
    })
    data = Mock4XTpl.mock(tpl)
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.ok(data.array)
    // test.ok(!('xindex' in data.array))
    test.equal(data.array.title, 'title')
    test.done()
}

exports.test_block_add_extra_info_with_holder = function(test) {
    test.expect(5)

    var tpl, data, html;

    Handlebars.registerHelper('list', function(context, options) {
        var out = "<ul>",
            data;

        for (var i = 0; i < context.length; i++) {
            if (options.data) {
                data = Handlebars.createFrame(options.data || {});
                data.index = i;
            }

            out += "<li>" + options.fn(context[i], {
                data: data
            }) + "</li>";
        }

        out += "</ul>";
        return out;
    });

    tpl = heredoc(function() {
        /*
{{#list array}}
  {{@index}}. {{title}}
{{/list}}
        */
    })
    data = Mock4Tpl.mock(tpl, {
        'array|3': [],
        title: '@TITLE'
    })
    html = Handlebars.compile(tpl)(data)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html)

    test.ok(util.isArray(data.array))
    test.equal(data.array.length, 3)
    for (var i = 0; i < data.array.length; i++) {
        test.ok(rTitle.test(data.array[i].title))
    }
    test.done()
}

exports.test_block_add_extra_info_with_holder_4xtpl = function(test) {
    test.expect(5)

    var tpl, data;

    tpl = heredoc(function() {
        /*
{{#list array}}
  {{xindex}}. {{title}}
{{/list}}
        */
    })
    data = Mock4XTpl.mock(tpl, {
        'array|3': [],
        title: '@TITLE'
    })
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.ok(util.isArray(data.array))
    test.equal(data.array.length, 3)
    data.array.forEach(function(item) {
        test.ok(rTitle.test(item.title))
    })
    test.done()
}

/*
    home
    http://handlebarsjs.com/
*/

exports.test_path_simple = function(test) {
    test.expect(1)

    var tpl, data, html;

    tpl = '<p>{{name}}</p>'
    data = Mock4Tpl.mock(tpl)
    html = Handlebars.compile(tpl)(data)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html)

    test.equal(data.name, 'name')
    test.done()
}

exports.test_path_simple_4xtpl = function(test) {
    test.expect(1)

    var tpl, data;

    tpl = '<p>{{name}}</p>'
    data = Mock4XTpl.mock(tpl)
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(data.name, 'name')
    test.done()
}

exports.test_path_nested = function(test) {
    test.expect(4)

    var tpl, data, html;

    tpl = heredoc(function() {
        /*
<div class="entry">
  <h1>{{title}}</h1>
  <h2>By {{author.name}}</h2>

  <div class="body">
    {{body}}
  </div>
</div>
        */
    })
    data = Mock4Tpl.mock(tpl)
    html = Handlebars.compile(tpl)(data)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html)

    test.equal(data.title, 'title')
    test.equal(typeof data.author, 'object')
    test.equal(data.author.name, 'name')
    test.equal(data.body, 'body')
    test.done()
}

exports.test_path_nested_4xtpl = function(test) {
    test.expect(4)

    var tpl, data;

    tpl = heredoc(function() {
        /*
<div class="entry">
  <h1>{{title}}</h1>
  <h2>By {{author.name}}</h2>

  <div class="body">
    {{body}}
  </div>
</div>
        */
    })
    data = Mock4XTpl.mock(tpl)
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(data.title, 'title')
    test.equal(typeof data.author, 'object')
    test.equal(data.author.name, 'name')
    test.equal(data.body, 'body')
    test.done()
}

// √".." 的处理和其他情况一样，需要一直持有对上一层对象的引用（../permalink "depth": 1,），通过跟踪 AST 路径实现
exports.test_path_back = function(test) {
    var tpl, data, html;

    tpl = heredoc(function() {
        /*
<h1>Comments</h1>
<div id="comments">
  {{#each comments}}
  <h2><a href="/posts/{{../permalink}}#{{id}}">{{title}}</a></h2>
  <div>{{body}}</div>
  {{/each}}
</div>
         */
    })
    // Mock4Tpl.debug = true
    data = Mock4Tpl.mock(tpl)
    html = Handlebars.compile(tpl)(data)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html)
    // Mock4Tpl.debug = false

    test.ok(util.isArray(data.comments))
    for (var i = 0; i < data.comments.length; i++) {
        test.ok(!data.comments[i].permalink) // TODO
        test.equal(data.comments[i].id, 'id')
        test.equal(data.comments[i].title, 'title')
    }
    test.done()
}

exports.test_path_back_4xtpl = function(test) {
    var tpl, data;

    tpl = heredoc(function() {
        /*
<h1>Comments</h1>
<div id="comments">
  {{#each comments}}
  <h2><a href="/posts/{{../permalink}}#{{id}}">{{title}}</a></h2>
  <div>{{body}}</div>
  {{/each}}
</div>
         */
    })
    // Mock4Tpl.debug = true
    data = Mock4XTpl.mock(tpl)
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))
    // Mock4Tpl.debug = false

    test.ok(util.isArray(data.comments))
    data.comments.forEach(function(item) {
        test.ok(!item.permalink)
        test.equal(item.id, 'id')
        test.equal(item.title, 'title')
    })
    test.done()
}

exports.test_path_back_with_holder = function(test) {
    var tpl, data, html;

    tpl = heredoc(function() {
        /*
<h1>Comments</h1>
<div id="comments">
  {{#each comments}}
  <h2><a href="/posts/{{../permalink}}#{{id}}">{{title}}</a></h2>
  <div>{{body}}</div>
  {{/each}}
</div>
         */
    })
    data = Mock4Tpl.mock(tpl, {
        'comments|3': [],
        'id|+1': 100,
        title: '@TITLE'
    })
    html = Handlebars.compile(tpl)(data)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html)

    test.ok(util.isArray(data.comments))
    test.equal(data.comments.length, 3)
    for (var i = 0; i < data.comments.length; i++) {
        test.equal(typeof data.comments[i].id, 'number')
        test.ok(rTitle.test(data.comments[i].title))
    }
    test.done()
}

exports.test_path_back_with_holder_4xtpl = function(test) {
    var tpl, data;

    tpl = heredoc(function() {
        /*
<h1>Comments</h1>
<div id="comments">
  {{#each comments}}
  <h2><a href="/posts/{{../permalink}}#{{id}}">{{title}}</a></h2>
  <div>{{body}}</div>
  {{/each}}
</div>
         */
    })
    data = Mock4XTpl.mock(tpl, {
        'comments|3': [],
        'id|+1': 100,
        title: '@TITLE'
    })
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.ok(util.isArray(data.comments))
    test.equal(data.comments.length, 3)
    data.comments.forEach(function(item) {
        test.equal(typeof item.id, 'number')
        test.ok(rTitle.test(item.title))
    })
    test.done()
}

exports.test_path_conflict = function(test) {
    var tpl, data, html;

    tpl = '<p>{{./name}} or {{this/name}} or {{this.name}}</p>'
    data = Mock4Tpl.mock(tpl)
    html = Handlebars.compile(tpl)(data)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html)

    test.equal(data.name, 'name')
    test.done()
}

/*
    XTemplate 不支持 `{{./name}}`，会把 `{{this/name}}` 解析为除法运算
    TODO 是否应该过滤掉 this，先过滤掉 {{this.name}} 中的第一个 this，以后再根据使用情况调整。
*/
exports.test_path_conflict_4xtpl = function(test) {
    var tpl, data;

    tpl = '<p>{{name}} or {{this/name}} or {{this.name}}</p>'
    data = Mock4XTpl.mock(tpl)
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(data.name, 'name')
    test.done()
}

exports.test_comment = function(test) {
    var tpl, data, html;

    tpl = heredoc(function() {
        /*
<div class="entry">
  {{! only output this author names if an author exists }}
  {{#if author}}
    <h1>{{firstName}} {{lastName}}</h1>
  {{/if}}
</div>
        */
    })
    data = Mock4Tpl.mock(tpl)
    html = Handlebars.compile(tpl)(data)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html)

    test.equal(html.indexOf('only output this author names if an author exists'), -1)
    test.done()
}

/*
    TODO 渲染注释时会抛出异常：
        Fatal error: KISSY is not defined
*/
exports.test_comment_4xtpl = function(test) {
    var tpl, data;

    tpl = heredoc(function() {
        /*
<div class="entry">
  {{! only output this author names if an author exists }}
  {{#if author}}
    <h1>{{firstName}} {{lastName}}</h1>
  {{/if}}
</div>
        */
    })
    // Mock4XTpl._.debug = true
    // ast = XTemplate.compiler.parse(tpl)
    data = Mock4XTpl.mock(tpl)
    // Mock4XTpl._.debug = false
    // html = new XTemplate(tpl).render({})
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html)

    // test.equal(html.indexOf('only output this author names if an author exists'), -1) // TODO
    test.equal(typeof data.author, 'boolean', data.author)
    test.equal(data.firstName, 'firstName')
    test.equal(data.lastName, 'lastName')
    test.done()
}

exports.test_helper_context = function(test) {
    var tpl, data, html;

    Handlebars.registerHelper('fullName', function(person) {
        return person.firstName + " " + person.lastName;
    });

    tpl = heredoc(function() {
        /*
<div class="post">
  <h1>By {{fullName author}}</h1>
  <div class="body">{{author.middle}}</div>
  <div class="body">{{body}}</div>

  <h1>Comments</h1>

  {{#each comments}}
  <h2>By {{fullName author}}</h2>
  <div class="body">{{body}}</div>
  {{/each}}
</div>
        */
    })
    data = Mock4Tpl.mock(tpl)
    html = Handlebars.compile(tpl)(data)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html)

    test.equal(typeof data.author, 'object')
    test.equal(data.author.middle, 'middle')
    test.equal(data.body, 'body')
    test.ok(util.isArray(data.comments))
    for (var i = 0; i < data.comments.length; i++) {
        test.equal(data.comments[i].author, 'author')
        test.equal(data.comments[i].body, 'body')
    }
    test.done()
}

exports.test_helper_context_4xtpl = function(test) {
    var tpl, data;

    tpl = heredoc(function() {
        /*
<div class="post">
  <h1>By {{fullName author}}</h1>
  <div class="body">{{author.middle}}</div>
  <div class="body">{{body}}</div>

  <h1>Comments</h1>

  {{#each comments}}
  <h2>By {{fullName author}}</h2>
  <div class="body">{{body}}</div>
  {{/each}}
</div>
        */
    })
    data = Mock4XTpl.mock(tpl)
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(typeof data.author, 'object')
    test.equal(data.author.middle, 'middle')
    test.equal(data.body, 'body')
    test.ok(util.isArray(data.comments))
    data.comments.forEach(function(item) {
        test.equal(item.author, 'author')
        test.equal(item.body, 'body')
    })
    test.done()
}

exports.test_helper_context_with_holder = function(test) {
    var tpl, data, html;

    Handlebars.registerHelper('fullName', function(person) {
        return person.firstName + " " + person.lastName;
    });

    tpl = heredoc(function() {
        /*
<div class="post">
  <h1>By {{fullName author}}</h1>
  <div class="body">{{author.middle}}</div>
  <div class="body">{{body}}</div>

  <h1>Comments</h1>

  {{#each comments}}
  <h2>By {{fullName author}}</h2>
  <div class="body">{{body}}</div>
  {{/each}}
</div>
        */
    })
    data = Mock4Tpl.mock(tpl, {
        author: {
            firstName: '@FIRST',
            lastName: '@LAST',
            middle: '@LAST'
        },
        body: '@SENTENCE',
        'comments|3': []
    })
    html = Handlebars.compile(tpl)(data)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html)

    test.equal(typeof data.author, 'object')
    test.ok('firstName' in data.author)
    test.ok('lastName' in data.author)
    test.ok('middle' in data.author)

    test.ok(util.isArray(data.comments))
    test.equal(data.comments.length, 3)
    for (var i = 0; i < data.comments.length; i++) {
        test.ok('firstName' in data.comments[i].author)
        test.ok('lastName' in data.comments[i].author)
        test.ok('middle' in data.comments[i].author)
        test.ok('body' in data.comments[i])
    }
    test.done()
}

exports.test_helper_context_with_holder_4xtpl = function(test) {
    var tpl, data;

    tpl = heredoc(function() {
        /*
<div class="post">
  <h1>By {{fullName author}}</h1>
  <div class="body">{{author.middle}}</div>
  <div class="body">{{body}}</div>

  <h1>Comments</h1>

  {{#each comments}}
  <h2>By {{fullName author}}</h2>
  <div class="body">{{body}}</div>
  {{/each}}
</div>
        */
    })
    data = Mock4XTpl.mock(tpl, {
        author: {
            firstName: '@FIRST',
            lastName: '@LAST',
            middle: '@LAST'
        },
        body: '@SENTENCE',
        'comments|3': [{
                author: { // 在作用域 comments 下再次指定 author 的数据格式
                    firstName: '@FIRST',
                    lastName: '@LAST'
                }
            }
        ]
    })
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(typeof data.author, 'object')
    test.ok('firstName' in data.author)
    test.ok('lastName' in data.author)
    test.ok('middle' in data.author)

    test.ok(util.isArray(data.comments))
    test.equal(data.comments.length, 3)
    data.comments.forEach(function(item) {
        test.ok('firstName' in item.author)
        test.ok('lastName' in item.author)
        test.equal('middle' in item.author, false)
        test.ok('body' in item)
    })
    test.done()
}

exports.test_helper_this_without_register = function(test) {
    var tpl, data, html;

    tpl = heredoc(function() {
        /*
<ul>
  {{#each items}}
  <li>{{agree_button}}</li>
  {{/each}}
</ul>
        */
    })
    data = Mock4Tpl.mock(tpl)
    html = Handlebars.compile(tpl)(data)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html)

    test.ok(util.isArray(data.items))
    for (var i = 0; i < data.items.length; i++) {
        test.ok('agree_button' in data.items[i])
    }
    test.done()
}

exports.test_helper_this_without_register_4xtpl = function(test) {
    var tpl, data;

    tpl = heredoc(function() {
        /*
<ul>
  {{#each items}}
  <li>{{agree_button}}</li>
  {{/each}}
</ul>
        */
    })
    data = Mock4XTpl.mock(tpl)
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.ok(util.isArray(data.items))
    data.items.forEach(function(item) {
        test.ok('agree_button' in item)
    })
    test.done()
}

exports.test_helper_this_with_register = function(test) {
    var tpl, data, html;

    Handlebars.registerHelper('agree_button', function() {
        return new Handlebars.SafeString(
            "<button>I agree. I " + this.emotion + " " + this.name + "</button>");
    });

    tpl = heredoc(function() {
        /*
<ul>
  {{#each items}}
  <li>{{agree_button}}</li>
  {{/each}}
</ul>
        */
    })
    data = Mock4Tpl.mock(tpl, {}, Handlebars.helpers)
    html = Handlebars.compile(tpl)(data)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html)

    test.ok(util.isArray(data.items))
    for (var i = 0; i < data.items.length; i++) {
        test.deepEqual(data.items[i], {})
    }
    test.done()
}

/*
    TODO
    在 Node 中，XTemplate 渲染时会抛出异常：
        Fatal error: KISSY is not defined
*/
exports.test_helper_this_with_register_4xtpl = function(test) {
    var tpl, data;

    XTemplate.addCommand('agree_button', function() {
        return 'agree_button ' + Math.random();
    });

    tpl = heredoc(function() {
        /*
<ul>
  {{#each items}}
  <li>{{agree_button}}</li>
  {{/each}}
</ul>
        */
    })
    data = Mock4XTpl.mock(tpl)
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.ok(util.isArray(data.items))
    data.items.forEach(function(item) {
        test.deepEqual(item, {})
    })
    test.done()
}

exports.test_helper_this_with_register_and_holder = function(test) { // 命名变长时，驼峰式不易读
    test.expect(14)

    var tpl, data, html;

    Handlebars.registerHelper('agree_button', function() {
        return new Handlebars.SafeString(
            "<button>I agree. I " + this.emotion + " " + this.name + "</button>");
    });

    tpl = heredoc(function() {
        /*
<ul>
  {{#each items}}
  <li>{{agree_button}}</li>
  {{/each}}
</ul>
        */
    })
    data = Mock4Tpl.mock(tpl, {
        'items|3': [{
                'id|+1': 1,
                'name|1': ['Handlebars', 'Mustache', 'Ember'],
                'emotion|1': ['love', 'enjoy', 'want to learn']
            }
        ]
    }, Handlebars.helpers)
    html = Handlebars.compile(tpl)(data)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html)

    test.ok(util.isArray(data.items))
    test.equal(data.items.length, 3)
    for (var i = 0; i < data.items.length; i++) {
        test.ok(!('agree_button' in data.items[0]))
        test.ok('id' in data.items[i])
        test.ok('name' in data.items[i])
        test.ok('emotion' in data.items[i])
    }
    test.done()
}

exports.test_helper_this_with_register_and_holder_4xtpl = function(test) {
    test.expect(14)

    var tpl, data;

    XTemplate.addCommand('agree_button', function() {
        return 'agree_button ' + Math.random();
    });

    tpl = heredoc(function() {
        /*
<ul>
  {{#each items}}
  <li>{{agree_button}}</li>
  {{/each}}
</ul>
        */
    })
    data = Mock4XTpl.mock(tpl, {
        'items|3': [{
                'id|+1': 1,
                'name|1': ['Handlebars', 'Mustache', 'Ember'],
                'emotion|1': ['love', 'enjoy', 'want to learn']
            }
        ]
    }, Handlebars.helpers)
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.ok(util.isArray(data.items))
    test.equal(data.items.length, 3)
    data.items.forEach(function(item) {
        test.ok(!('agree_button' in item))
        test.ok('id' in item)
        test.ok('name' in item)
        test.ok('emotion' in item)
    })
    test.done()
}

exports.test_helper_with = function(test) {
    test.expect(4)

    var tpl, data, html;

    tpl = heredoc(function() {
        /*
<div class="entry">
  <h1>{{title}}</h1>

  {{#with author}}
  <h2>By {{firstName}} {{lastName}}</h2>
  {{/with}}
</div>
        */
    })
    data = Mock4Tpl.mock(tpl, {}, Handlebars.helpers)
    html = Handlebars.compile(tpl)(data)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html)

    test.equal(data.title, 'title')
    test.equal(typeof data.author, 'object')
    test.equal(data.author.firstName, 'firstName')
    test.equal(data.author.lastName, 'lastName')
    test.done()
}

exports.test_helper_with_4xtpl = function(test) {
    test.expect(4)

    var tpl, data;

    tpl = heredoc(function() {
        /*
<div class="entry">
  <h1>{{title}}</h1>

  {{#with author}}
  <h2>By {{firstName}} {{lastName}}</h2>
  {{/with}}
</div>
        */
    })
    data = Mock4XTpl.mock(tpl)
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(data.title, 'title')
    test.equal(typeof data.author, 'object')
    test.equal(data.author.firstName, 'firstName')
    test.equal(data.author.lastName, 'lastName')
    test.done()
}

exports.test_helper_each = function(test) {
    var tpl, data, html;

    tpl = heredoc(function() {
        /*
<ul class="people_list">
  {{#each people}}
  <li>{{this}}</li>
  {{/each}}
</ul>
        */
    })
    data = Mock4Tpl.mock(tpl, { // 需要指定数据生成规则，否则默认为 [{},{},{}...]
        'people|1-10': ['@NAME']
    })
    html = Handlebars.compile(tpl)(data)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html)

    test.ok(util.isArray(data.people))
    test.ok(data.people.length >= 1 && data.people.length <= 10)
    for (var i = 0; i < data.people.length; i++) {
        test.ok(rTitle.test(data.people[i]))
    }
    test.done()
}

exports.test_helper_each_4xtpl = function(test) {
    var tpl, data;

    tpl = heredoc(function() {
        /*
<ul class="people_list">
  {{#each people}}
  <li>{{this}}</li>
  {{/each}}
</ul>
        */
    })
    data = Mock4XTpl.mock(tpl, { // 需要指定数据生成规则，否则默认为 [{},{},{}...]
        'people|1-10': ['@NAME']
    })
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.ok(util.isArray(data.people))
    test.ok(data.people.length >= 1 && data.people.length <= 10)
    data.people.forEach(function(item) {
        test.ok(rTitle.test(item))
    })
    test.done()
}

// TODO 需要支持生成空数组！！！
exports.test_helper_each_else = function(test) {
    var tpl, data, html;

    tpl = heredoc(function() {
        /*
{{#each paragraphs}}
  <p>{{this}}</p>
{{else}}
  <p class="empty">No content</p>
{{/each}}
        */
    })
    data = Mock4Tpl.mock(tpl, { // 需要指定数据生成规则，否则默认为 [{},{},{}...]
        'paragraphs|1-10': ['@SENTENCE']
    })
    html = Handlebars.compile(tpl)(data)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html)

    test.ok(util.isArray(data.paragraphs))
    test.ok(data.paragraphs.length >= 1 && data.paragraphs.length <= 10)
    for (var i = 0; i < data.paragraphs.length; i++) {
        test.ok(data.paragraphs[i].split(' ').length)
    }
    test.done()
}

/*
    TODO 需要支持生成空数组！但是很难权衡！
    Mock 可以支持生成空数组，但是在 Mock4XTpl 中，
    空数组可能是由于配置了 `'arr|0-1': [{}]` 生成的，也可能是由于 `arr: []` 生成，
    前者的配置指示了数组中元素的个数，后者仅仅是声明了属性 arr 是一个数组。
*/
exports.test_helper_each_else_4xtpl = function(test) {
    var tpl, data;

    tpl = heredoc(function() {
        /*
{{#each paragraphs}}
  <p>{{this}}</p>
{{else}}
  <p class="empty">No content</p>
{{/each}}
        */
    })
    data = Mock4XTpl.mock(tpl, { // 需要指定数据生成规则，否则默认为 [{},{},{}...]
        'paragraphs|1-10': ['@SENTENCE']
    })
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.ok(util.isArray(data.paragraphs))
    test.ok(data.paragraphs.length >= 1 && data.paragraphs.length <= 10)
    data.paragraphs.forEach(function(item) {
        test.ok(item.split(' ').length)
    })
    test.done()
}

exports.test_helper_each_index = function(test) {
    var tpl, data, html;

    tpl = heredoc(function() {
        /*
{{#each array}}
  {{@index}}: {{this}}
{{/each}}
        */
    })
    data = Mock4Tpl.mock(tpl, { // 需要指定数据生成规则，否则默认为 [{},{},{}...]
        'array|1-10': ['@SENTENCE']
    })
    html = Handlebars.compile(tpl)(data)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html)

    test.ok(util.isArray(data.array))
    test.ok(data.array.length >= 1 && data.array.length <= 10)
    for (var i = 0; i < data.array.length; i++) {
        test.ok(data.array[i].split(' ').length)
    }
    test.done()
}

exports.test_helper_each_index_4xtpl = function(test) {
    var tpl, data;

    tpl = heredoc(function() {
        /*
{{#each array}}
  {{xindex}}: {{this}}
{{/each}}
        */
    })
    data = Mock4XTpl.mock(tpl, { // 需要指定数据生成规则，否则默认为 [{},{},{}...]
        'array|1-10': ['@SENTENCE']
    })
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.ok(util.isArray(data.array))
    test.ok(data.array.length >= 1 && data.array.length <= 10)
    data.array.forEach(function(item) {
        test.ok(item.split(' ').length)
    })
    test.done()
}

exports.test_helper_each_key = function(test) {
    var tpl, data, html;

    tpl = heredoc(function() {
        /*
{{#each object}}
  {{@key}}: {{this}}
{{/each}}
        */
    })
    data = Mock4Tpl.mock(tpl, { // 需要指定数据生成规则，否则默认为 [{},{},{}...]
        object: {
            name: '@NAME',
            email: '@EMAIL'
        }
    })
    html = Handlebars.compile(tpl)(data)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html)

    test.ok(typeof object, 'object')
    test.ok('name' in data.object)
    test.ok('email' in data.object)
    test.done()
}

/*
    Handlebars 支持占位符 @index、@key，
    而 XTemplate 支持占位符 xindex、xcount
    TODO 建议 XTemplate 增加占位符 xkey，这样 `{{#each object}}` 在遍历对象时就可以输出属性名。
*/
exports.test_helper_each_key_4xtpl = function(test) {
    var tpl, data;

    tpl = heredoc(function() {
        /*
{{#each object}}
  {{xkey}}: {{this}}
{{/each}}
        */
    })
    data = Mock4XTpl.mock(tpl, { // 需要指定数据生成规则，否则默认为 [{},{},{}...]
        object: {
            name: '@NAME',
            email: '@EMAIL'
        }
    })
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.ok(typeof object, 'object')
    test.ok('name' in data.object)
    test.ok('email' in data.object)
    test.done()
}

exports.test_helper_if = function(test) {
    var tpl, data, html;

    tpl = heredoc(function() {
        /*
<div class="entry">
  {{#if author}}
  <h1>{{firstName}} {{lastName}}</h1>
  {{/if}}
</div>
        */
    })
    data = Mock4Tpl.mock(tpl, {
        author: {}
    })
    html = Handlebars.compile(tpl)(data)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html)

    test.equal(typeof data.author, 'object')
    test.equal(data.author.firstName, 'firstName')
    test.equal(data.author.lastName, 'lastName')
    test.done()
}

exports.test_helper_if_4xtpl = function(test) {
    var tpl, data;

    tpl = heredoc(function() {
        /*
<div class="entry">
  {{#if author}}
  <h1>{{firstName}} {{lastName}}</h1>
  {{/if}}
</div>
        */
    })
    data = Mock4XTpl.mock(tpl, {
        author: {} // 设置为一个对象，强制 {{{#if author}} 改变作用域为 author。
    })
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(typeof data.author, 'object')
    test.equal(data.author.firstName, 'firstName')
    test.equal(data.author.lastName, 'lastName')
    test.done()
}



exports.test_helper_if_else = function(test) {
    var tpl, data, html;

    tpl = heredoc(function() {
        /*
<div class="entry">
  {{#if author}}
    <h1>{{firstName}} {{lastName}}</h1>
  {{else}}
    <h1>Unknown Author</h1>
  {{/if}}
</div>
        */
    })
    data = Mock4Tpl.mock(tpl, {})
    html = Handlebars.compile(tpl)(data)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html)

    test.equal(typeof data.author, 'boolean', data.author)
    test.equal(data.firstName, 'firstName')
    test.equal(data.lastName, 'lastName')
    test.done()
}

exports.test_helper_if_else_4xtpl = function(test) {
    var tpl, data;

    tpl = heredoc(function() {
        /*
<div class="entry">
  {{#if author}}
    <h1>{{firstName}} {{lastName}}</h1>
  {{else}}
    <h1>Unknown Author</h1>
  {{/if}}
</div>
        */
    })
    data = Mock4XTpl.mock(tpl, {})
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(typeof data.author, 'boolean')
    test.equal(data.firstName, 'firstName')
    test.equal(data.lastName, 'lastName')
    test.done()
}

exports.test_helper_unless = function(test) {
    var tpl, data, html;

    tpl = heredoc(function() {
        /*
<div class="entry">
  {{#unless license}}
  <h3 class="warning">WARNING: This entry does not have a license!</h3>
  {{/unless}}
</div>
        */
    })
    data = Mock4Tpl.mock(tpl, {})
    html = Handlebars.compile(tpl)(data)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html)

    test.equal(typeof data.license, 'boolean')


    data = Mock4Tpl.mock(tpl, {
        license: '@SENTENCE'
    })
    // console.log(JSON.stringify(data, null, 4))
    test.equal(typeof data.license, 'string')


    data = Mock4Tpl.mock(tpl, {
        'license|1': ['MIT', '']
    })
    // console.log(JSON.stringify(data, null, 4))
    test.ok(data.license === 'MIT' || data.license === '')


    test.done()
}

/*
    XTemplate 不支持 #unless（与 #if 相反）
    TODO 建议支持
*/
exports.test_helper_unless_4xtpl = function(test) {
    var tpl, data;

    tpl = heredoc(function() {
        /*
<div class="entry">
  {{#unless license}}
  <h3 class="warning">WARNING: This entry does not have a license!</h3>
  {{/unless}}
</div>
        */
    })
    // Mock4XTpl._.debug = true
    data = Mock4XTpl.mock(tpl, {})
    // Mock4XTpl._.debug = false
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(typeof data.license, 'boolean', data.license)


    data = Mock4XTpl.mock(tpl, {
        license: '@SENTENCE'
    })
    // console.log(JSON.stringify(data, null, 4))
    test.equal(typeof data.license, 'string')


    data = Mock4XTpl.mock(tpl, {
        'license|1': ['MIT', 'UNLESS']
    })
    // console.log(JSON.stringify(data, null, 4))
    test.ok(data.license === 'MIT' || data.license === 'UNLESS')


    test.done()
}

exports.test_helper_log = function(test) {
    var tpl, data, html;

    tpl = '{{log "Look at me!"}}'
    data = Mock4Tpl.mock(tpl, {})
    html = Handlebars.compile(tpl)(data)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html)

    var prop
    for (prop in data) {}
    test.ok(prop === undefined)
    test.done()
}

exports.test_helper_log_4xtpl = function(test) {
    var tpl, data;

    tpl = '{{log "Look at me!"}}'
    data = Mock4XTpl.mock(tpl, {})
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    var prop
    for (prop in data) {}
    test.ok(prop === undefined)

    tpl = '{{log foo.bar "Look at me!"}}'
    data = Mock4XTpl.mock(tpl, {})
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))
    test.equal(data.foo.bar, 'bar')

    test.done()
}

/*
    other
*/

exports.test_block = function(test) {
    var tpl, data;

    tpl = '{{#exist}}{{title}}{{/exist}}'
    data = Mock4Tpl.mock(tpl)
    html = Handlebars.compile(tpl)(data)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html);

    test.equal(typeof data.exist, 'object')
    test.done()
}

exports.test_block_4xtpl = function(test) {
    var tpl, data;

    tpl = '{{#exist}}{{title}}{{/exist}}'
    data = Mock4XTpl.mock(tpl)
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(typeof data.exist, 'object')
    test.done()
}

exports.test_block_array = function(test) {
    var tpl, data, html;

    tpl = '{{#exist}}{{title}}{{/exist}}'
    data = Mock4Tpl.mock(tpl, {
        'exist|10': [{
                title: '@TITLE'
            }
        ]
    })
    html = Handlebars.compile(tpl)(data)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html);

    test.ok(util.isArray(data.exist))
    test.equal(data.exist.length, 10)
    for (var i = 0; i < data.exist.length; i++) {
        test.ok(rTitle.test(data.exist[i].title))
    }
    test.done()
}

exports.test_block_array_4xtpl = function(test) {
    var tpl, data;

    tpl = '{{#exist}}{{title}}{{/exist}}'
    data = Mock4XTpl.mock(tpl, {
        'exist|10': [{
                title: '@TITLE'
            }
        ]
    })
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.ok(util.isArray(data.exist))
    test.equal(data.exist.length, 10)
    data.exist.forEach(function(item) {
        test.ok(rTitle.test(item.title), item.title)
    })
    test.done()
}

exports.test_block_with_boolean = function(test) {
    var tpl, data, html;

    tpl = '{{#exist}}{{title}}{{/exist}}'
    data = Mock4Tpl.mock(tpl, {
        'exist|1': false,
        title: '@DATETIME'
    })
    html = Handlebars.compile(tpl)(data)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html);

    test.equal(typeof data.exist, 'boolean')
    test.ok(rDatetime.test(data.title))
    test.done()
}

exports.test_block_with_boolean_4xtpl = function(test) {
    var tpl, data;

    tpl = '{{#exist}}{{title}}{{/exist}}'
    data = Mock4XTpl.mock(tpl, {
        'exist|1': false,
        title: '@DATETIME'
    })
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(typeof data.exist, 'boolean')
    test.ok(rDatetime.test(data.title))
    test.done()
}

exports.test_each_chain = function(test) {
    var tpl, data, html;

    tpl = heredoc(function() {
        /*
{{#each articles.[10].[#comments]}}
  <h1>{{subject}}</h1>
  <div>
    {{body}}
  </div>
{{/each}}
        */
    })
    data = Mock4Tpl.mock(tpl, {
        articles: [] // 如果不配置为 []，则 articles 默认是一个对象。
    })
    html = Handlebars.compile(tpl)(data)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html);

    test.ok(data.articles[10]['#comments'])
    test.ok(util.isArray(data.articles[10]['#comments']))
    var comments = data.articles[10]['#comments']
    for (var i = 0; i < comments.length; i++) {
        test.equal(comments[i].subject, 'subject')
        test.equal(comments[i].body, 'body')
    }
    test.done()
}

/*
    XTemplate 不支持在表达式中使用 `[]`、`#`。
*/
exports.test_each_chain_4xtpl = function(test) {
    var tpl, data;

    tpl = heredoc(function() {
        /*
{{#each articles.10.comments}}
  <h1>{{subject}}</h1>
  <div>
    {{body}}
  </div>
{{/each}}
        */
    })
    data = Mock4XTpl.mock(tpl, {
        articles: []
    })
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.ok(util.isArray(data.articles))
    test.ok(util.isArray(data.articles[10].comments))
    data.articles[10].comments.forEach(function(item) {
        test.equal(item.subject, 'subject')
        test.equal(item.body, 'body')
    })
    test.done()
}

/*
    Handlebars 不支持转义点号
*/
exports.test_escape_dot = function(test) {
    var tpl, data, html;

    tpl = '{{a\\.b\\.c}}' // Handlebars 不支持转义点号

    try {
        data = Mock4Tpl.mock(tpl)
        html = Handlebars.compile(tpl)(data)
        // console.log(JSON.stringify(Mock4Tpl.parse(tpl), null, 4))
        // console.log(JSON.stringify(data, null, 4))
        // console.log(html)
        // console.log(Handlebars.compile(tpl)(data))
    } catch (e) {
        test.ok(e)
        test.done()
    }
}

/*
    XTemplate 不支持转义点号
*/
exports.test_escape_dot_4xtpl = function(test) {
    var tpl, data, html;

    tpl = '{{a\\.b\\.c}}' // XTemplate 不支持转义点号

    try {
        data = Mock4XTpl.mock(tpl)
        html = new XTemplate(tpl).render(data)
        // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
        // console.log(JSON.stringify(data, null, 4))
        // console.log(html)
        // console.log(Handlebars.compile(tpl)(data))
    } catch (e) {
        test.ok(e)
        test.done()
    }
}

exports.test_complex = function(test) {
    var tpl, data, html;

    tpl = heredoc(function() {
        /*
{{#exist}}
<div class="entry">
  <h1>{{title}}</h1>
  <div class="body">
    {{body}}
  </div>

  {{#foo}}
    {{bar}}
  {{/foo}}

  {{#each articles.[10].[#comments]}}
  <h1>{{subject}}</h1>
  <div>
    {{body}}
  </div>
  {{/each}}

</div>
{{/exist}}
    */
    });
    data = Mock4Tpl.mock(tpl, {
        'exist|4-1': true,
        title: '@TITLE',
        body: '@SENTENCE',

        foo: [],
        'bar|1-100': 1,

        articles: [],
        subject: '@BOOL'
    })
    html = Handlebars.compile(tpl)(data)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html);

    test.equal(typeof data.exist, 'boolean')
    test.ok(data.title.split(' ').length)
    test.ok(data.body.split(' ').length)

    test.ok(util.isArray(data.foo))
    for (var i = 0; i < data.foo.length; i++) {
        test.equal(typeof data.foo[i].bar, 'number')
        test.ok(data.foo[i].bar >= 1 && data.foo[i].bar <= 100)
    }

    test.ok(util.isArray(data.articles))
    test.equal(data.articles.length, 11)
    test.equal(typeof data.articles[10], 'object')

    var comments = data.articles[10]['#comments']
    test.ok(util.isArray(comments))
    // Print.pt(comments)
    for (var j = 0; j < comments.length; j++) {
        test.ok(rBoolean.test(comments[j].subject))
        test.ok(comments[j].body.split(' ').length)
    }

    test.ok(true)
    test.done()
}

exports.test_complex_4xtpl = function(test) {
    var tpl, data;

    tpl = heredoc(function() {
        /*
{{#exist}}
<div class="entry">
  <h1>{{title}}</h1>
  <div class="body">
    {{body}}
  </div>

  {{#foo}}
    {{bar}}
  {{/foo}}

  {{#each articles.10.comments}}
  <h1>{{subject}}</h1>
  <div>
    {{body}}
  </div>
  {{/each}}

</div>
{{/exist}}
    */
    });
    data = Mock4XTpl.mock(tpl, {
        'exist|4-1': true,
        title: '@TITLE',
        body: '@SENTENCE',

        foo: [],
        'bar|1-100': 1,

        articles: [],
        subject: '@BOOL'
    })
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(typeof data.exist, 'boolean')
    test.ok(data.title.split(' ').length)
    test.ok(data.body.split(' ').length)

    test.ok(util.isArray(data.foo))
    for (var i = 0; i < data.foo.length; i++) {
        test.equal(typeof data.foo[i].bar, 'number')
        test.ok(data.foo[i].bar >= 1 && data.foo[i].bar <= 100)
    }

    test.ok(util.isArray(data.articles))
    test.equal(data.articles.length, 11)
    test.equal(typeof data.articles[10], 'object')

    var comments = data.articles[10].comments
    test.ok(util.isArray(comments))
    // Print.pt(comments)
    comments.forEach(function(item) {
        test.ok(rBoolean.test(item.subject))
        test.ok(item.body.split(' ').length)
    })

    test.done()
}

/*
    TODO XTemplate 不支持在表达式中使用汉字，建议支持。
*/
exports.testScene = function(test) {
    var tpl, data, html, options;

    tpl = heredoc(function() {
        /*
<div class="dropdown">
  <span class="dropdown-hd" id="datepicker">
    选择日期
  </span>
</div>

<div bx-tmpl="list" bx-datakey="list">
  <table class="table" bx-name="tables" bx-path="brix/gallery/tables/" id="tables">
    <thead>
      <tr>
        <th width="15"></th>
        <th class="left">访问来源</th>
        <th class="left" width="200px">UV占比</th>
        <th class="left">UV</th>
        <th class="left">PV</th>
        <th class="left">人均页面访问数</th>
        <th class="left">宝贝收藏数</th>
        <th class="left">收藏率</th>
        <th class="left">成交金额</th>
        <th class="left">转化率</th>
        <th class="left">操作</th>
      </tr>
    </thead>
    <tbody>
      {{#each list}}
      <tr class="tr-parent bold">
        <td class="left"><i mx-click="toggle" class="J_expendCollapse icon-expend"></i></td>
        <td class="left">{{id}} {{分组}}</td>
        <td class="left font-tahoma">
          <span class="process-parent" style="width: {{UV占比}}px;"></span>
          {{UV占比}}%
        </td>
        <td class="left font-tahoma">{{UV}}</td>
        <td class="left font-tahoma">{{PV}}</td>
        <td class="left font-tahoma">{{人均页面访问数}}</td>
        <td class="left font-tahoma">{{宝贝收藏数}}</td>
        <td class="left font-tahoma">{{收藏率}}</td>
        <td class="left font-tahoma">{{成交金额}}</td>
        <td class="left font-tahoma">{{转化率}}</td>
        <td class="left">
        </td>
      </tr>
      {{#each children}}
      <tr class="tr-child">
        <td class="left noline"></td>
        <td class="left">{{渠道}}</td>
        <td class="left font-tahoma">
          <span class="process-child" style="width: {{UV占比}}px;"></span>
          {{UV占比}}%
        </td>
        <td class="left font-tahoma">{{UV}}</td>
        <td class="left font-tahoma">{{PV}}</td>
        <td class="left font-tahoma">{{人均页面访问数}}</td>
        <td class="left font-tahoma">{{宝贝收藏数}}</td>
        <td class="left font-tahoma">{{收藏率}}</td>
        <td class="left font-tahoma">{{成交金额}}</td>
        <td class="left font-tahoma">{{转化率}}</td>
        <td class="left">
          <div class="operation">
            <a href="javascript:" mx-click="perspective{ srcIdLevel1:{{srcIdLevel1}},srcIdLevel2:{{srcIdLevel2}},channel:{{渠道}},vs:{{vs}} }" class="mr10">透视分析</a>
          </div>
        </td>
      </tr>
      {{/each}}
      {{/each}}
    </tbody>
  </table>
</div>
        */
    })

    options = {
        'id|+1': 1,
        'list|1-5': [],
        'children|1-5': [],
        '分组|1': '@AREA',
        '渠道|1': '@REGION',
        'percent|1-100': 1,
        'UV占比|1-100': 1,
        'UV|1-100000000': 1,
        'PV|1-100000000': 1,
        '人均页面访问数|1-100000000': 1,
        '宝贝收藏数|1-100000000': 1,
        '收藏率': '@percent%',
        '成交金额|1-100000000.2': 1.0,
        '转化率': '@INTEGER(1,100)%',
        'srcIdLevel1|1-10': 1,
        'srcIdLevel2|1-10': 1,
        'vs': '@渠道'
    }
    data = Mock4Tpl.mock(tpl, options)
    html = Handlebars.compile(tpl)(data)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html);
    // Print.pt(data.list.map(function(item, tmp) {
    //     delete(tmp = Util.extend({}, item)).children
    //     return tmp
    // }))
    // data.list.forEach(function(item) {
    //     console.log(item['分组']);
    //     Print.pt(item.children)
    // })

    test.ok(util.isArray(data.list))
    for (var i = 0; i < data.list.length; i++) {
        test.ok(util.isArray(data.list[i].children))
    }
    try {
        data = Mock4XTpl.mock(tpl, options)
        test.ok(util.isArray(data.list))
        data.list.forEach(function(item) {
            test.ok(util.isArray(item.children))
        })
    } catch (error) {
        // XTemplate 无法解析含有汉字的表达式
        test.ok(error)
    }

    test.done()
}

exports.test_id_inc = function(test) {
    var tpl, data, html;

    // Mock4Tpl.debug = true
    tpl = '{{#each comments}}{{id}}{{/each}}'
    data = Mock4Tpl.mock(tpl, {
        'comments|3': [],
        'id|+1': 100
    })
    html = Handlebars.compile(tpl)(data)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html)
    // Mock4Tpl.debug = false

    test.ok(util.isArray(data.comments))
    for (var i = 1; i < data.comments.length; i++) {
        test.notEqual(data.comments[i].id, data.comments[i - 1].id)
    }
    test.ok(true)
    test.done()
}

exports.test_id_inc_4xtpl = function(test) {
    var tpl, data;

    // Mock4XTpl._.debug = true
    tpl = '{{#each comments}}{{id}}{{/each}}'
    data = Mock4Tpl.mock(tpl, {
        'comments|3': [],
        'id|+1': 100
    })
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4))
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html)
    // Mock4XTpl._.debug = false

    test.ok(util.isArray(data.comments))
    data.comments.forEach(function(item, index) {
        if (index > 0) test.notEqual(item.id, data.comments[index - 1].id)
    })
    test.done()
}

exports.test_path_stack = function(test) {
    test.expect(1)

    var tpl, data;

    // Mock4Tpl.debug = true
    tpl = heredoc(function() {
        /*
{{#each a}}
  {{#each b}}
    {{#each c}}
      {{d}}
    {{/each}}
  {{/each}}
{{/each}}
         */
    })
    data = Mock4Tpl.mock(tpl, {})
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4));
    // console.log(JSON.stringify(data, null, 4))
    // Mock4Tpl.debug = false

    test.ok(true)
    test.done()
}

// 打开 Mock4XTpl._.debug 观察日志
exports.test_path_stack_4xtpl = function(test) {
    test.expect(1)

    var tpl, data;

    // Mock4XTpl._.debug = true
    tpl = heredoc(function() {
        /*
{{#each a}}
  {{#each b}}
    {{#each c}}
      {{d}}
    {{/each}}
  {{/each}}
{{/each}}
         */
    })
    data = Mock4XTpl.mock(tpl, {})
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4));
    // console.log(JSON.stringify(data, null, 4))
    // Mock4XTpl._.debug = false

    test.ok(true)
    test.done()
}