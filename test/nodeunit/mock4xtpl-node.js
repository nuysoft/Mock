var Mock4XTpl = require('../../src/mock4xtpl'),
    Handlebars = require('handlebars')
    KISSY = require('kissy'),
    S = KISSY,
    Random = require('../../src/random'),
    Util = require('../../src/util'),
    util = require('util'),
    Print = require('node-print');

// KISSY.Config.debug = false

var XTemplate;

/*  
    # XTemplate vs Handlebars
    单纯从语法上看，XTemplate 支持的语法集（或功能集）要多于 Handlebars，例如局部子模板、关系表达式。

    KISSY.use('xtemplate', function (S, XTemplate) {
        window.XTemplate = XTemplate
    })

    KISSY.use('xtemplate', function (S, XTemplate) {
        window.supportVariable = function () {
            var tpl = 'this is {{title}}!';
            var data = {
                title: 'o'
            };
            var render = new XTemplate(tpl).render(data);
            alert(render);
        };
    });

    var node = XTemplate.compiler.parse('{{#data}}{{name}}-{{age}}{{/data}}')
    console.dir(node)

 */

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
    测试用例参考自 KISSY XTemplate 的 demo：
    http://fed.ued.taobao.net/kissy-team/kissyteam/docs/html/demo/component/xtemplate/index.html#xtemplate-demo
*/

exports.test_variable = function(test) {
    var tpl, ast, data;

    tpl = 'this is {{title}} {{a.b.c}}!'
    // Mock4XTpl.debug = true
    ast = XTemplate.compiler.parse(tpl)
    data = Mock4XTpl.mock(ast || tpl)
    // Mock4XTpl.debug = false
    // console.log(JSON.stringify(ast, null, 4));
    // console.log(JSON.stringify(data, null, 4))

    // XTemplate.compiler._parse = XTemplate.compiler.parse
    // XTemplate.compiler.parse = function(){
    //     return ast
    // }
    // console.log(new XTemplate(tpl).render(data))
    // XTemplate.compiler.parse = XTemplate.compiler._parse
    // delete XTemplate.compiler._parse

    test.equal(data.title, 'title')
    test.done()
}

/*
    ## 关于 @
    在 XTempalte 中，@ 可以用作内置 helper 的起始符号；
    在 Handlebars 中则是私有数据的起始符号。
    建议以 Handlebars 为准，统一使用 `#`。
    TODO
*/
exports.test_if = function(test) {
    var tpl, ast, data;

    tpl = heredoc(function() {
        /*
{{#if title}}
  has title
{{/if}}
{{@if title2}}
  has title2
{{else}}
  not has title2
{{/if}}
        */
    })
    // Mock4XTpl._.debug = true
    ast = XTemplate.compiler.parse(tpl)
    data = Mock4XTpl.mock(tpl)
    // Mock4XTpl._.debug = false
    // console.log(JSON.stringify(ast, null, 4));
    // console.log(JSON.stringify(data, null, 4))

    // Handlebars 无法解析 `{{@if title2}}`
    // test.equal(new XTemplate(tpl).render(data), Handlebars.compile(tpl)(data))

    test.ok(typeof data.title, 'boolean')
    test.ok(typeof data.title2, 'boolean')
    test.done()
}

/*
    ## 关于 xindex & xcount
    在 XTempalte 中，xindex 指示了下标，xcount 指示了个数。
    TODO
*/
exports.test_each = function(test) {
    var tpl, data;

    tpl = heredoc(function() {
        /*
{{#each data}}
  {{name}}-{{xindex}}/{{xcount}}|
{{/each}}
        */
    })
    // Mock4XTpl._.debug = true
    ast = Mock4XTpl.parse(tpl)
    data = Mock4XTpl.mock(tpl)
    // Mock4XTpl._.debug = false
    // console.log(JSON.stringify(ast, null, 4));
    // console.log(JSON.stringify(data, null, 4))

    test.ok(util.isArray(data.data))
    data.data.forEach(function(item) {
        test.equal(item.name, 'name')
        test.equal('xindex' in item, false)
        test.equal('xcount' in item, false)
    })
    test.done()
}

exports.test_each_path = function(test) {
    var tpl, data;

    tpl = heredoc(function() {
        /*
{{#each data}}
  {{this}}-{{../total}}|
{{/each}}
        */
    })
    data = Mock4XTpl.mock(tpl)
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4));
    // console.log(JSON.stringify(data, null, 4))

    test.ok(util.isArray(data.data))
    test.ok('total' in data)
    test.equal(new XTemplate(tpl).render(data), Handlebars.compile(tpl)(data))
    test.done()
}

exports.test_with = function(test) {
    var tpl, data;

    tpl = heredoc(function() {
        /*
{{#with data}}
  {{name}}-{{age}}
{{/with}}
        */
    })
    data = Mock4XTpl.mock(tpl)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4));
    // console.log(JSON.stringify(data, null, 4))

    test.equal(new XTemplate(tpl).render(data), Handlebars.compile(tpl)(data))
    test.done()
}

exports.test_with_path = function(test) {
    var tpl, data;

    tpl = heredoc(function() {
        /*
{{#with data}}
  {{#with p}}
    {{name}}-{{age}}-{{../l2}}-{{../../l1}}
  {{/with}}
{{/with}}
        */
    })
    data = Mock4XTpl.mock(tpl)
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4));
    // console.log(JSON.stringify(data, null, 4))

    test.equal(new XTemplate(tpl).render(data), Handlebars.compile(tpl)(data))

    test.equal(data.data.p.name, 'name')
    test.equal(data.data.p.age, 'age')

    test.equal('l2' in data.data.p, false)
    test.equal('l1' in data.data.p, false)

    test.equal(data.data.l2, 'l2')

    test.equal('l1' in data.data, false)

    test.equal(data.l1, 'l1')

    test.done()
}

/*
    TODO 关于注释节点
    注释节点不会出现在渲染结果中，但至少应该保留在语法树中。
    Mock 工具为了避免侵入现有的代码和模式，在 HTML 模板的注释中保存数据配置，例如：
        {{title}}{{! @TITLE }}
        {{email}}{{! @EMAIL }}
    
    http://nuysoft.com/project/mock4tpl.html
*/
exports.test_comment = function(test) {
    var tpl, ast, data;

    tpl = heredoc(function() {
        /*
my {{!
comment
\n}}
{{title}}
        */
    })
    ast = XTemplate.compiler.parse(tpl)
    data = Mock4XTpl.mock(tpl)
    // console.log(JSON.stringify(ast, null, 4))
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4));
    // console.log(JSON.stringify(data, null, 4))

    test.equal(new XTemplate(tpl).render(data), Handlebars.compile(tpl)(data))
    test.equal(data.title, 'title')
    test.done()
}

/*
    ## 关于转义括号
    Handlebars 和 XTemplate 会保留转义后的括号。
    > KISSY 1.31 尚不支持，1.40dev 已经支持。
*/
exports.test_escape = function(test) {
    var tpl, data, html;

    tpl = heredoc(function() {
        /*
my {{!
comment
}} \\{{title}}{{title}}
        */
    })
    data = Mock4XTpl.mock(tpl)
    html = new XTemplate(tpl).render(data)
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4)) // ast 中不应该出现两个 tplExpression
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html) // my  \oooo
    // console.log(Handlebars.compile(tpl)(data)) // my  \\{{title}}oo

    // test.equal(new XTemplate(tpl).render(data), Handlebars.compile(tpl)(data))
    test.equal(data.title, 'title')
    test.done()

}

exports.test_escape_html = function(test) {
    var tpl, data, html;

    tpl = heredoc(function() {
        /*
my {{title}} is {{{title}}}
        */
    })
    data = Mock4XTpl.mock(tpl, {
        title: '<a>'
    })
    html = new XTemplate(tpl).render(data)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4));
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html)

    test.equal(new XTemplate(tpl).render(data), Handlebars.compile(tpl)(data))
    test.equal(data.title, '<a>')
    test.done()

}

/*
    ## 关于 helper
    Handlebars 执行下面的方法添加 helper：
        Handlebars.registerHelper('global', function(context, options) {
            return 'global-' + context;
        });
    XTemplate 则执行下面的方法添加 helper：
        XTemplate.addCommand('global', function(scopes, option) {
            return 'global-' + option.params[0];
        });
    注意：
    1. XTemplate 把 hepler 称为“全局行内命令”和“全局块状命令”。
    2. 在方法和参数的命名习惯上，Handlebars 是 `Handlebars.registerHelper(context, options)`，XTemplate 是 `XTemplate.addCommand(scopes, option)`。
    3. 尽管这两个方法的行为一致，方法名和参数名的含义也类似，但是参数的值却迥异，还是以前面的示例为例：
        Handlebars.registerHelper(context, options) 的参数值是：
        XTemplate.addCommand(scopes, option)
*/
exports.test_global_command = function(test) {
    var tpl, data, html;

    XTemplate.addCommand('global', function(scopes, option) {
        // console.log('XTemplate scopes', JSON.stringify(scopes, null, 4));
        /*
            [
                {
                    "title": "title"
                }
            ]
        */
        // console.log('XTemplate option', JSON.stringify(option, null, 4));
        /*
            方法 JSON.stringify() 在序列化时会自动忽略 function 属性
            {
                "silent": true,
                "name": "",
                "utils": {},
                "cache": true,
                "subTpls": {},
                "commands": {},
                "params": [
                    "title"
                ]
            }
            事实上，完整的内容应该是：
            {
                "silent": true,
                "name": "",
                "utils": { getProperty: [Function] },
                "cache": true,
                "subTpls": {},
                "commands": { 
                    each: [Function],
                    with: [Function],
                    if: [Function],
                    set: [Function],
                    include: [Function],
                    global: [Function] 
                },
                "params": [ 'title' ] 
            }
        */
        return 'global-' + option.params[0];
    });

    Handlebars.registerHelper('global', function(context /*, options*/ ) {
        // console.log('Handlebars context', JSON.stringify(context, null, 4));
        // "title"
        // console.log('Handlebars options', JSON.stringify(options, null, 4));
        /*
            {
                "hash": {},
                "data": {}
            }
        */
        return 'global-' + context;
    });

    tpl = heredoc(function() {
        /*
my {{global title}}
        */
    })
    data = Mock4XTpl.mock(tpl, {})
    html = new XTemplate(tpl).render(data)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4));
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html)

    test.equal(new XTemplate(tpl).render(data), Handlebars.compile(tpl)(data))
    test.equal(data.title, 'title')
    test.done()

}

/*
    ## 关于 block 的上下文
    对于自定义 helper 的上下文，
    Handlebars 会尝试从 helper 中读取属性，
    XTempalte 则只会从 helper 所在的上下文中读取。
    注意：

*/
exports.test_global_block_command = function(test) {
    var tpl, data, html;

    Handlebars.registerHelper('global2', function(context /*, options*/ ) {
        return 'global2-' + context.fn(this)
    });

    XTemplate.addCommand('global2', function(scopes, option) {
        return 'global2-' + option.fn(scopes)
    })

    tpl = 'my {{#global2}}{{title}}{{/global2}}'
    data = Mock4XTpl.mock(tpl, {})
    html = new XTemplate(tpl).render(data)
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4));
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html)
    // console.log(Handlebars.compile(tpl)(data));
    /*
        {
            "title": "title"
        }
    */

    // test.equal(new XTemplate(tpl).render(data), Handlebars.compile(tpl)(data))
    test.equal(data.title, 'title')


    // 
    data = Mock4XTpl.mock(tpl, {
        global2: []
    })
    test.equal(data.title, 'title')

    data = Mock4XTpl.mock(tpl, {
        global2: {}
    })
    test.equal(data.title, 'title')

    test.done()
    return
}

exports.test_global_block_command_default = function(test) {
    var tpl, data;

    XTemplate.removeCommand('global2')

    tpl = 'my {{#global2}}{{title}}{{/global2}}'
    data = Mock4XTpl.mock(tpl)
    // html = new XTemplate(tpl).render(data) // KISSY 1.3.1 抛出异常：Fatal error: undefined is not a function: 'global2' at line 1
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4));
    // console.log(JSON.stringify(data, null, 4))
    /*
        {
            "global2": {
                "title": "title"
            }
        }
    */

    // test.equal(new XTemplate(tpl).render(data), Handlebars.compile(tpl)(data))
    test.equal(data.global2.title, 'title')

    test.done()
    return
}

exports.test_global_block_command_array = function(test) {
    var tpl, data;

    XTemplate.removeCommand('global2')

    tpl = 'my {{#global2}}{{title}}{{/global2}}'
    data = Mock4XTpl.mock(tpl, {
        global2: []
    })
    // html = new XTemplate(tpl).render(data) // KISSY 1.3.1 抛出异常：Fatal error: undefined is not a function: 'global2' at line 1
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4));
    // console.log(JSON.stringify(data, null, 4))
    /*
        {
            "global2": [
                {
                    "title": "title"
                },
                {
                    "title": "title"
                },
                {
                    "title": "title"
                },
                {
                    "title": "title"
                }
            ]
        }
    */
    test.ok(util.isArray(data.global2))
    data.global2.forEach(function(item) {
        test.equal(item.title, 'title')
    })

    test.done()
    return
}

exports.test_global_block_command_object = function(test) {
    var tpl, data;

    XTemplate.removeCommand('global2')

    tpl = 'my {{#global2}}{{title}}{{/global2}}'
    data = Mock4XTpl.mock(tpl, {
        global2: {}
    })
    // html = new XTemplate(tpl).render(data) // KISSY 1.3.1 抛出异常：Fatal error: undefined is not a function: 'global2' at line 1
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4));
    // console.log(JSON.stringify(data, null, 4))

    test.equal(data.global2.title, 'title')

    test.done()
    return
}

// 支持局部行内命令扩展
exports.test_local_command = function(test) {
    var tpl, data, html;

    var commands = {
        'global3': function(scopes, option) {
            return 'global3-' + option.params[0];
        }
    };

    Handlebars.registerHelper('global3', function(context /*, options*/ ) {
        // console.log('Handlebars context', JSON.stringify(context, null, 4));
        // "title"
        // console.log('Handlebars options', JSON.stringify(options, null, 4));
        /*
            {
                "hash": {},
                "data": {}
            }
        */
        return 'global3-' + context;
    })

    tpl = 'my {{global3 title}}'
    data = Mock4XTpl.mock(tpl)
    html = new XTemplate(tpl, {
        commands: commands
    }).render(data)
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl), null, 4));
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html) // my global3-title
    // console.log(Handlebars.compile(tpl)(data));

    test.equal(new XTemplate(tpl, {
        commands: commands
    }).render(data), Handlebars.compile(tpl)(data))
    test.equal(data.title, 'title')
    test.done()
}

/*
    局部块状命令扩展，需要手动传给 Mock4XTpl.mock(input, options, helpers, partials)
*/
exports.test_local_block_command = function(test) {
    var tpl, data, html;

    var commands = {
        'global4': function(scopes, option) {
            return 'global4-' + option.fn(scopes);
        }
    }

    Handlebars.registerHelper('global4', function(context /*, options*/ ) {
        return 'global4-' + context.fn(this)
    })

    tpl = 'my {{#global4}}{{title}}{{/global4}}'
    data = Mock4XTpl.mock(tpl, {}, commands)
    html = new XTemplate(tpl, {
        commands: commands
    }).render(data)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4));
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html)
    // console.log(Handlebars.compile(tpl)(data));

    test.ok(new XTemplate(tpl, {
        commands: commands
    }).render(data), Handlebars.compile(tpl)(data))
    test.equal(data.title, 'title')
    test.done()
}

/*
    局部后缀名判断命令扩展
*/
exports.test_end_with_command = function(test) {
    var tpl, data, html;

    // Custom placehodler
    Random.extend({
        img4test: function() {
            return this.string('lower', 10) + '.' + this.pick(['jpg', 'gif'])
        }
    })

    var commands = {
        'endsWith': function(scopes, option) {
            return S.endsWith(option.params[0], option.params[1]) ? option.fn(scopes) : '';
        }
    }

    Handlebars.registerHelper('endsWith', function(param1, param2, options) {
        return param1.lastIndexOf(param2) + param2.length === param1.length ? options.fn() : ''
    })

    tpl = heredoc(function() {
        /*
{{d}} ends with 
{{#endsWith d "jpg"}}jpg{{/endsWith}}{{#endsWith d "gif"}}gif{{/endsWith}}
        */
    })
    // Mock4XTpl.debug = true
    data = Mock4XTpl.mock(tpl, {
        d: '@IMG4TEST'
    }, commands)
    // Mock4XTpl.debug = false
    html = new XTemplate(tpl, {
        commands: commands
    }).render(data)
    // console.log(JSON.stringify(Handlebars.parse(tpl), null, 4));
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html)
    // console.log(Handlebars.compile(tpl)(data));

    test.ok(new XTemplate(tpl, {
        commands: commands
    }).render(data), Handlebars.compile(tpl)(data))
    test.equal(data.d.split('.').length, 2)
    test.done()
}
/*
    支持字符串作为全局子模板

    ## 关于 Partials

    注册 Partials 的方法不同：
        XTemplate.addSubTpl('sub-tpl-1', '{{title}}')
        Handlebars.registerPartial("sub-tpl-1", '{{title}}');    
    使用 Partials 的方法不同：
        {{include "sub-tpl-1"}}
        {{> sub-tpl-1}}
    另外，保存的位置也不同：
        partials = Handlebars.partials
        partials = XTemplate.RunTime.subTpls

    因为使用 Partials 的方法不同，在 Handlebars 的词法 src/handlebars.l 的基础上，Mock4Tpl 的 Parser 增加了对 `{{include` 的定义：
        <mu>"{{>"                        return 'OPEN_PARTIAL';
        <mu>"{{include"                  return 'OPEN_PARTIAL';

*/
exports.test_string_sub_tpl = function(test) {
    var tpl4xtpl, data4xtpl, html4xtpl,
        tpl4hdb, data4hdb, html4hdb;

    XTemplate.addSubTpl('sub-tpl-1', '{{title}}')
    Handlebars.registerPartial("sub-tpl-1", '{{title}}');

    tpl4xtpl = '{{include "sub-tpl-1"}}'
    tpl4hdb = '{{> sub-tpl-1}}'
    // test.deepEqual(Handlebars.parse(tpl4xtpl), Handlebars.parse(tpl4hdb))
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl4xtpl), null, 4));
    // console.log(JSON.stringify(Handlebars.parse(tpl4xtpl), null, 4));
    // console.log(JSON.stringify(Handlebars.parse(tpl4hdb), null, 4));

    data4xtpl = Mock4XTpl.mock(tpl4xtpl)
    data4hdb = Mock4XTpl.mock(tpl4xtpl, {}, Handlebars.helpers, Handlebars.partials)
    test.deepEqual(data4xtpl, data4hdb)
    // console.log(JSON.stringify(data4xtpl, null, 4))

    html4xtpl = new XTemplate(tpl4xtpl).render(data4xtpl)
    html4hdb = Handlebars.compile(tpl4hdb)(data4hdb)
    test.deepEqual(html4xtpl, html4hdb)
    // console.log(html)

    test.done()
}

/*
    X 支持函数作为全局子模板
*/

// 支持字符串作为局部子模板
exports.test_string_local_sub_tpl = function(test) {
    var tpl, data;

    var subTpls = {
        'sub-tpl-3': '{{title}}'
    };

    tpl = '{{include "sub-tpl-3"}}'
    data = Mock4XTpl.mock(tpl, {}, {}, subTpls)
    // console.log(JSON.stringify(Mock4XTpl.parse(tpl)))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(data.title, 'title')
    test.done()
}

/*
    X 支持函数作为局部子模板
*/

// 支持简单表达式作为变量：+ - * / %
exports.test_expression_variable = function(test) {
    var tpl, ast, data;

    // tpl = '{{n+3*4/2}}'
    tpl = '{{ n + a.b + c.d - e.f * g.h / i.j % k.l }}'
    ast = Mock4XTpl.parse(tpl)
    data = Mock4XTpl.mock(tpl, {
        'n|1-100': 1
    })
    // console.log(JSON.stringify(ast, null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(typeof data.n, 'number')
    test.done()
}

exports.test_expression_variable_default = function(test) {
    var tpl, ast, data;

    tpl = '{{ n+1 }}'
    ast = Mock4XTpl.parse(tpl)
    // Mock4XTpl._.debug = true
    data = Mock4XTpl.mock(tpl, {})
    // Mock4XTpl._.debug = false
    // console.log(JSON.stringify(ast, null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(typeof data.n, 'number')
    test.done()
}

// 支持关系表达式：=== !== > >= < <=
exports.test_relational_expression = function(test) {
    var tpl, ast, data;

    tpl = '{{#if n > n2+4/2}}{{n+1}}{{else}}{{n2+1}}{{/if}}';
    ast = Mock4XTpl.parse(tpl)
    data = Mock4XTpl.mock(tpl, {
        'n|1-100': 1,
        'n2|1-100': 1
    })
    // console.log(JSON.stringify(ast, null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(typeof data.n, 'number')
    test.equal(typeof data.n2, 'number')
    test.done()
}

// 支持 each 中的关系表达式
exports.test_relational_expression_each = function(test) {
    var tpl, ast, data;

    tpl = heredoc(function() {
        /*
{{#each data}}
  {{#if this > ../limit+1}}
    {{this+1}}-{{xindex+1}}-{{xcount}}|
  {{/if}}
{{/each}}
        */
    })
    ast = Mock4XTpl.parse(tpl)
    // Mock4XTpl._.debug = true
    data = Mock4XTpl.mock(tpl, {})
    // Mock4XTpl._.debug = false
    // console.log(JSON.stringify(ast, null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.ok(util.isArray(data.data))
    data.data.forEach(function(item) {
        test.deepEqual(item, {}, item)
    })
    test.equal(typeof data.limit, 'number', data.limit)

    // 设置 data.data 为 {}
    data = Mock4XTpl.mock(tpl, {
        'data|5': {}
    })
    test.deepEqual(data.data, {}, data.data)

    // 设置 data.data 的元素为 `@INT`
    data = Mock4XTpl.mock(tpl, {
        'data|5': ['@INT']
    })
    test.ok(util.isArray(data.data))
    data.data.forEach(function(item) {
        test.equal(typeof item, 'number', item)
    })

    // 设置 data.data 的元素为 `@INT(1,10)`，即限定为 1~10
    data = Mock4XTpl.mock(tpl, {
        'data|5': ['@INT(1,10)']
    })
    test.ok(util.isArray(data.data))
    data.data.forEach(function(item) {
        test.equal(typeof item, 'number', item)
        test.ok(item >= 1, item)
        test.ok(item <= 10, item)
    })

    // 设置 data.data 的元素为 `@INT(-1,1)`，即限定为 -1~1
    data = Mock4XTpl.mock(tpl, {
        'data|5': ['@INT(-1,1)']
    })
    test.ok(util.isArray(data.data))
    data.data.forEach(function(item) {
        test.equal(typeof item, 'number', item)
        test.ok(item >= -1, item)
        test.ok(item <= 1, item)
    })

    // 设置 data.data 的元素为 `@INT(0,0)`，即总是 0
    data = Mock4XTpl.mock(tpl, {
        'data|5': ['@INT(0,0)']
    })
    test.ok(util.isArray(data.data))
    data.data.forEach(function(item) {
        test.equal(typeof item, 'number', item)
        test.ok(item === 0, item)
    })

    // 设置 data.limit 为 `@FLOAT(-1,1)`，即总是 -1~1
    data = Mock4XTpl.mock(tpl, {
        'limit': '@FLOAT(-1,1)'
    })
    test.equal(typeof data.limit, 'number', data.limit)
    test.ok(data.limit >= -2, data.limit)
    test.ok(data.limit <= 2, data.limit)

    test.done()
}

// 支持 with 中的关系表达式
exports.test_relational_expression_with = function(test) {
    var tpl, ast, data;

    tpl = heredoc(function() {
        /*
{{#with data}}
  {{#if n > ../limit/5}}
    {{n+1}}
  {{/if}}
{{/with}}
        */
    })
    ast = Mock4XTpl.parse(tpl)
    // Mock4XTpl._.debug = true
    data = Mock4XTpl.mock(tpl, {})
    // Mock4XTpl._.debug = false
    // console.log(JSON.stringify(ast, null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(typeof data.data.n, 'number', data.data.n)
    test.equal(typeof data.limit, 'number', data.limit)

    test.done()
}

exports.test_relational_expression_with_float = function(test) {
    var tpl, ast, data;

    tpl = heredoc(function() {
        /*
{{#with data}}
  {{#if n > ../limit/5.0}}
    {{n+1.0}}
  {{/if}}
{{/with}}
        */
    })
    ast = Mock4XTpl.parse(tpl)
    // Mock4XTpl._.debug = true
    data = Mock4XTpl.mock(tpl, {})
    // Mock4XTpl._.debug = false
    // console.log(JSON.stringify(ast, null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(typeof data.data.n, 'number', data.data.n)
    test.ok((data.data.n + '').indexOf('.') > -1, data.data.n)
    test.equal(typeof data.limit, 'number', data.limit)
    test.ok((data.limit + '').indexOf('.') > -1, data.limit)

    test.done()
}

/*
    X 支持 set 设置变量 
    TODO 过滤设置的变量
*/
exports.test_set = function(test) {
    var tpl, ast, data;

    tpl = heredoc(function() {
        /*
{{#each data}}
  {{set n2=this*2 n3=this*3}}
  {{n2}}-{{n3}}|
{{/each}}
        */
    })
    ast = Mock4XTpl.parse(tpl)
    // Mock4XTpl._.debug = true
    data = Mock4XTpl.mock(tpl, {})
    // Mock4XTpl._.debug = false
    // console.log(JSON.stringify(ast, null, 4))
    // console.log(JSON.stringify(data, null, 4))

    data.data.forEach(function(item) {
        test.ok('n2' in item) // false
        test.ok('n3' in item) // false
    })

    test.done()
}

// 支持 mustache 形式的 object
/*
    不建议使用这种不直观的写法，建议的写法如下：
    1. mustache 形式的 object
        {{#with obj}}
            {{prop}}
        {{/with}}
    2. mustache 形式的 array
        {{#each arr}}
            {{prop}}
        {{/each}}
    3. mustache 形式的 boolean
        {{#if bool}}
            {{other}}
        {{/if}}
*/
exports.test_mustache_object = function(test) {
    var tpl, ast, data;

    tpl = '{{#data}}{{name}}-{{age}}{{/data}}'

    ast = Mock4XTpl.parse(tpl)
    data = Mock4XTpl.mock(tpl, {})
    // console.log(JSON.stringify(ast, null, 4))
    // console.log(JSON.stringify(data, null, 4))

    test.equal(data.data.name, 'name')
    test.equal(data.data.age, 'age')

    test.done()
}

exports.test_mustache_array = function(test) {
    var tpl, ast, data;

    tpl = '{{#data}}{{name}}-{{xindex}}/{{xcount}}|{{/data}}'

    // Mock4XTpl._.debug = true
    ast = Mock4XTpl.parse(tpl)
    data = Mock4XTpl.mock(tpl, {
        data: []
    })
    // Mock4XTpl._.debug = false
    // console.log(JSON.stringify(ast, null, 4))
    // console.log(JSON.stringify(data, null, 4))

    data.data.forEach(function(item) {
        test.equal(item.name, 'name')
    })

    test.done()
}

/*
    支持不存在属性警告
    支持未闭合标签报错
*/