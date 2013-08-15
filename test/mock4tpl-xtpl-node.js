var Mock4Tpl = require('../src/tpl/mock4tpl'),
    Parser = require('../src/tpl/parser'),
    Handlebars = require('handlebars')
    KISSY = require('kissy'),
    S = KISSY,
    Random = require('../src/random'),
    Util = require('../src/util'),
    util = require('util'),
    Print = require('node-print');

KISSY.Config.debug = false

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

    tpl = 'this is {{title}}!'
    ast = Parser.parse(tpl)
    data = Mock4Tpl.mock(tpl)
    // console.log(JSON.stringify(Parser.parse(tpl), null, 4));
    // console.log(JSON.stringify(data, null, 4))

    test.equal(new XTemplate(tpl).render(data), Handlebars.compile(tpl)(data))
    test.equal(data.title, 'title')
    test.done()
}

/*
    ## 关于 @
    在 XTempalte 中，@ 可以用到内置 helper 的起始符号；
    在 Handlebars 中则是私有数据的起始符号。
    建议以 Handlebars 为准。
    TODO
*/
exports.test_if = function(test) {
    var tpl, data;

    tpl = heredoc(function() {
        /*
{{#if title}}
  has title
{{/if}}
{{#if title2}}
  has title2
{{else}}
  not has title2
{{/if}}'
        */
    })
    data = Mock4Tpl.mock(tpl)
    // console.log(JSON.stringify(Parser.parse(tpl), null, 4));
    // console.log(JSON.stringify(data, null, 4))

    test.equal(new XTemplate(tpl).render(data), Handlebars.compile(tpl)(data))
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
    data = Mock4Tpl.mock(tpl)
    // console.log(JSON.stringify(Parser.parse(tpl), null, 4));
    // console.log(JSON.stringify(data, null, 4))

    test.equal(new XTemplate(tpl).render(data), Handlebars.compile(tpl)(data))
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
    data = Mock4Tpl.mock(tpl)
    // console.log(JSON.stringify(Parser.parse(tpl), null, 4));
    // console.log(JSON.stringify(data, null, 4))

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
    data = Mock4Tpl.mock(tpl)
    // console.log(JSON.stringify(Parser.parse(tpl), null, 4));
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
    data = Mock4Tpl.mock(tpl)
    // console.log(JSON.stringify(Parser.parse(tpl), null, 4));
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

exports.test_comment = function(test) {
    var tpl, data;

    tpl = heredoc(function() {
        /*
my {{!
'comment
\n}}
{{title}}
        */
    })
    data = Mock4Tpl.mock(tpl)
    // console.log(JSON.stringify(Parser.parse(tpl), null, 4));
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
    data = Mock4Tpl.mock(tpl)
    html = new XTemplate(tpl).render(data)
    // console.log(JSON.stringify(Parser.parse(tpl), null, 4));
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html) // my  \oooo
    // console.log(Handlebars.compile(tpl)(data)); // my  \\{{title}}oo

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
    data = Mock4Tpl.mock(tpl, {
        title: '<a>'
    })
    html = new XTemplate(tpl).render(data)
    // console.log(JSON.stringify(Parser.parse(tpl), null, 4));
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
    data = Mock4Tpl.mock(tpl, {}, XTemplate.RunTime.commands)
    html = new XTemplate(tpl).render(data)
    // console.log(JSON.stringify(Parser.parse(tpl), null, 4));
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
    data = Mock4Tpl.mock(tpl, {}, XTemplate.RunTime.commands)
    html = new XTemplate(tpl).render(data)
    // console.log(JSON.stringify(Parser.parse(tpl), null, 4));
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html)
    // console.log(Handlebars.compile(tpl)(data));
    /*
        {
            "title": "title"
        }
    */

    test.equal(new XTemplate(tpl).render(data), Handlebars.compile(tpl)(data))
    test.equal(data.title, 'title')


    data = Mock4Tpl.mock(tpl, {
        global2: []
    }, XTemplate.RunTime.commands)
    // console.log(JSON.stringify(data, null, 4))
    test.equal(new XTemplate(tpl).render(data), Handlebars.compile(tpl)(data))
    test.equal(data.title, 'title')
    /*
        {
            "title": "title"
        }
    */


    data = Mock4Tpl.mock(tpl, {
        global2: {}
    })
    // console.log(JSON.stringify(data, null, 4))
    test.equal(new XTemplate(tpl).render(data), Handlebars.compile(tpl)(data))
    test.equal(data.global2.title, 'title')
    /*
        {
            "global2": {
                "title": "title"
            }
        }
    */


    data = Mock4Tpl.mock(tpl, {})
    // console.log(JSON.stringify(data, null, 4))
    test.equal(new XTemplate(tpl).render(data), Handlebars.compile(tpl)(data))
    test.equal(data.global2.title, 'title')
    /*
        {
            "global2": {
                "title": "title"
            }
        }
    */


    data = Mock4Tpl.mock(tpl, {
        global2: []
    })
    // console.log(JSON.stringify(data, null, 4))
    test.equal(new XTemplate(tpl).render(data), Handlebars.compile(tpl)(data))
    test.ok(util.isArray(data.global2))
    for (var i = 0; i < data.global2.length; i++) {
        test.equal(data.global2[i].title, 'title')
    }
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
                }
            ]
        }
    */


    tpl = 'my {{#global2.[3]}}{{title}}{{/global2.[3]}}'


    data = Mock4Tpl.mock(tpl, {})
    test.notEqual(new XTemplate(tpl).render(data), Handlebars.compile(tpl)(data)) // TODO
    /*
        "" !== "my title"
        XTemplate 输出空字符串，Handlebars 可以正常渲染：my title
    */
    /*
        {
            "global2": {
                "3": {
                    "title": "title"
                }
            }
        }
    */


    data = Mock4Tpl.mock(tpl, {
        global2: []
    })
    // console.log(JSON.stringify(data, null, 4))
    test.notEqual(new XTemplate(tpl).render(data), Handlebars.compile(tpl)(data))
    test.ok(util.isArray(data.global2))
    /*
        "" !== "my title"
        XTemplate 输出空字符串，Handlebars 可以正常渲染：my title
    */
    /*
        {
            "global2": [
                null,
                null,
                null,
                {
                    "title": "title"
                }
            ]
        }
    */

    // test.equal(1, 2 /*, '1 vs 2'*/ ) // >> Error: 1 == 2
    // test.equal(2, 1 /*, '2 vs 1'*/ ) // >> Error: 2 == 1
    // test.equal(0, 2 /*, '0 vs 2'*/ ) // >> Error: 2 == 0
    // test.equal(2, 0 /*, '2 vs 0'*/ ) // >> Error: 0 == 2

    test.done()

}

exports.test_local_command = function(test) {
    var tpl, data, html;

    XTemplate.addCommand('global3', function(scopes, option) {
        return 'global3-' + option.params[0]
    })

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
    data = Mock4Tpl.mock(tpl)
    html = new XTemplate(tpl).render(data)
    // console.log(JSON.stringify(Parser.parse(tpl), null, 4));
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html)
    // console.log(Handlebars.compile(tpl)(data));

    test.equal(new XTemplate(tpl).render(data), Handlebars.compile(tpl)(data))
    test.equal(data.title, 'title')
    test.done()
}

exports.test_local_block_command = function(test) {
    var tpl, data, html;

    XTemplate.addCommand('global4', function(scopes, option) {
        return 'global4-' + option.fn(scopes)
    })

    Handlebars.registerHelper('global4', function(context /*, options*/ ) {
        return 'global4-' + context.fn(this)
    })

    tpl = 'my {{#global4}}{{title}}{{/global4}}'
    data = Mock4Tpl.mock(tpl, {}, XTemplate.RunTime.commands)
    html = new XTemplate(tpl).render(data)
    // console.log(JSON.stringify(Parser.parse(tpl), null, 4));
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html)
    // console.log(Handlebars.compile(tpl)(data));

    test.ok(new XTemplate(tpl).render(data), Handlebars.compile(tpl)(data))
    test.equal(data.title, 'title')
    test.done()
}

exports.test_end_with_command = function(test) {
    var tpl, data, html;

    // Custom placehodler
    Random.extend({
        img4test: function() {
            return this.string('lower', 10) + '.' + this.pick(['jpg', 'gif'])
        }
    })

    XTemplate.addCommand('endsWith', function(scopes, option) {
        return S.endsWith(option.params[0], option.params[1]) ? option.fn(scopes) : '';
    })

    Handlebars.registerHelper('endsWith', function(param1, param2, options) {
        return param1.lastIndexOf(param2) + param2.length === param1.length ? options.fn() : ''
    })

    tpl = heredoc(function() {
        /*
{{d}} ends with 
{{#endsWith d "jpg"}}jpg{{/endsWith}}{{#endsWith d "gif"}}gif{{/endsWith}}
        */
    })
    // Mock4Tpl.debug = true
    data = Mock4Tpl.mock(tpl, {
        d: '@IMG4TEST'
    }, XTemplate.RunTime.commands)
    // Mock4Tpl.debug = false
    html = new XTemplate(tpl).render(data)
    // console.log(JSON.stringify(Parser.parse(tpl), null, 4));
    // console.log(JSON.stringify(data, null, 4))
    // console.log(html)
    // console.log(Handlebars.compile(tpl)(data));

    test.ok(new XTemplate(tpl).render(data), Handlebars.compile(tpl)(data))
    test.equal(data.d.split('.').length, 2)
    test.done()
}
/*
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
    test.deepEqual(Parser.parse(tpl4xtpl), Parser.parse(tpl4hdb))
    // console.log(JSON.stringify(Parser.parse(tpl4xtpl), null, 4));
    // console.log(JSON.stringify(Parser.parse(tpl4hdb), null, 4));

    data4xtpl = Mock4Tpl.mock(tpl4xtpl, {}, XTemplate.RunTime.commands, XTemplate.RunTime.subTpls)
    data4hdb = Mock4Tpl.mock(tpl4xtpl, {}, Handlebars.helpers, Handlebars.partials)
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
    X 支持字符串作为局部子模板
    X 支持函数作为局部子模板
    X 支持简单表达式作为变量
    X 支持关系表达式
    X 支持 each 中的关系表达式
    X 支持 with 中的关系表达式
    X 支持 set 设置变量
    支持 mustache 形式的 object
    支持 mustache 形式的 array
    支持不存在属性警告
    X 支持未闭合标签报错
*/



