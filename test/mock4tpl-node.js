var util = require('util'),
    Mock4Tpl = require('../src/mock4tpl'),
    Print = require('node-print'),
    Handlebars = require('handlebars');

function heredoc(f) {
    return f.toString()
        .replace(/^[^\/]+\/\*!?/, '')
        .replace(/\*\/[^\/]+$/, '')
        .trim();
}

function run(tpl, options) {
    // console.log()
    // console.log(tpl);
    // console.log(options);

    var ast = Handlebars.parse(tpl);
    // console.log(ast);
    // console.log(JSON.stringify(ast, null, 4));

    var data = Mock4Tpl.gen(ast, null, options)
    // console.log(JSON.stringify(data, null, 4));
    return data
}

exports.testMustache = function(test) {
    var tpl = heredoc(function() {
        /*
{{obj}}
{{obj.prop}}
    */
    })
    var data = run(tpl, {
        s: '@EMAIL'
    })
    test.ok(typeof data.obj === 'object')
    test.ok(typeof data.obj.prop === 'string')
    test.done();
}

exports.testBlock = function(test) {
    var tpl = heredoc(function() {
        /*
{{#exist}}
    {{title}}
{{/exist}}
    */
    })
    run(tpl, {
        'exist|0-1': true
    })

    test.ok(true)
    test.done();
}

exports.testEach = function(test) {
    var tpl = heredoc(function() {
        /*
{{#each articles.[10].[#comments]}}
    <h1>{{subject}}</h1>
    <div>
        {{body}}
    </div>
{{/each}}
    */
    })
    run(tpl)

    test.ok(true)
    test.done();
}

exports.testComplex = function(test) {
    var tpl = heredoc(function() {
        /*
{{#exist}}
<div class="entry">
    <h1>{{title}}</h1>
    <div class="body">
        {{body}}
    </div>
    
    {{#bar}}
        {{foobar}}
    {{/bar}}

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
    run(tpl, {
        'exist|0-1': true,
        'foobar|1-100': 1,
        title: '@STRING(upper,10)',
        subject: '@BOOL',
        body: '@SENTENCE',
        // exist: true,
        articles: [],
        bar: []
    })

    test.ok(true)
    test.done();
}

var TC_CHANNEL = heredoc(function() {
    /*
<div class="dropdown" style="text-align:left; width:210px; height: 24px; line-height: 24px; float:right; margin-bottom:10px;">
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
      {{#list}}
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
      {{#children}}
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
      {{/children}}
      {{/list}}

    </tbody>
  </table>
</div>
*/
})

exports.testScene = function(test) {
    var data = run(TC_CHANNEL, {
        'id|+1': 1,
        'list|10': [],
        children: [],
        '分组|1': '@AREA',
        '渠道|1': '@REGION',
        'percent|1-100': 1,
        'UV占比': '@percent%',
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
    })
    // console.log();
    // console.log(data);
    var children = data.list[0].children
    for (var i = 0; i < data.list.length; i++) {
        delete data.list[i].children
    }
    if (false) {
        console.log('\ntestScene:');
        Print.pt(data.list)
        Print.pt(children)
    }

    test.ok(true)
    test.done();
}

// TODO
exports.testCustomHelperBlock = function(test) {
    var data = run('{{#list people}}{{firstName}} {{lastName}}{{/list}}', {
        firstName: '@FIRST',
        lastName: '@LAST'
    })
    if (false) {
        console.log('\ntestCustomHelperBlock:');
        Print.pt(data.people)
    }

    test.ok(true)
    test.done();
}

exports.testSimplePath = function(test) {
    var result = run('<p>{{name}}</p>', {})

    test.ok(result.name)
    test.done()
}
exports.testNestedPath = function(test) {
    var tpl = heredoc(function() {
        /*!
<div class="entry">
  <h1>{{title}}</h1>
  <h2>By {{author.name}}</h2>

  <div class="body">
    {{body}}
  </div>
</div>
         */
    })

    var result = run(tpl)
    test.ok(result.title === 'title')
    test.ok(typeof result.author === 'object')
    test.ok(result.author.name === 'name')
    test.ok(result.body === 'body')

    test.done()
}

// TODO
exports.testBackPath = function(test) {
    var tpl = heredoc(function() {
        /*!
<h1>Comments</h1>

<div id="comments">
  {{#each comments}}
  <h2><a href="/posts/{{../permalink}}#{{id}}">{{title}}</a></h2>
  <div>{{body}}</div>
  {{/each}}
</div>
         */
    })
    var ast = Handlebars.parse(tpl);
    // console.log(JSON.stringify(ast, null, 4));
    var result = Mock4Tpl.gen(ast, null, {
        'comments|1-2': [],
        'id|+1': 100,
        'body': '@SENTENCE'
    })

    // console.log(result);
    test.ok(result)

    test.done()
}

exports.testNameConflict = function(test) {
    var tpl = '<p>{{./name}} or {{this/name}} or {{this.name}}</p>'
    var ast = Handlebars.parse(tpl)
    // console.log(JSON.stringify(ast, null, 4));
    var result = Mock4Tpl.gen(ast)
    // console.log(result)

    test.ok(result)
    test.done()
}

exports.testComment = function(test) {
    var tpl = heredoc(function() {
        /*
<div class="entry">
  {{! only output this author names if an author exists }}
  {{#if author}}
    <h1>{{firstName}} {{lastName}}</h1>
  {{/if}}
</div>
        */
    })
    var ast = Handlebars.parse(tpl)
    // console.log(JSON.stringify(ast, null, 4));
    var result = Mock4Tpl.gen(ast)
    // console.log(result)

    test.ok(result)
    test.done()
}

exports.testCustomHelper = function(test) {
    var tpl = heredoc(function() {
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
    var ast = Handlebars.parse(tpl)
    // console.log(JSON.stringify(ast, null, 4));
    var result = Mock4Tpl.gen(ast, null, {
        middle: 'custom middle',
        author: {
            firstName: '@FIRST',
            lastName: '@LAST',
            middle: '@LAST',
            hello: 'word'
        },
        body: '@SENTENCE'
    })
    // console.log(JSON.stringify(result, null, 4))

    test.ok(result)
    test.ok(typeof result.author === 'object')
    test.ok('body' in result)
    test.ok(util.isArray(result.comments))
    test.ok('author' in result.comments[0])
    test.ok('body' in result.comments[0])
    test.ok('firstName' in result.comments[0].author)
    test.ok('lastName' in result.comments[0].author)
    test.ok('middle' in result.comments[0].author)
    test.ok('hello' in result.comments[0].author)
    test.done()
}

exports.test_context_of_custom_helper_without_register = function(test) {
    var tpl = heredoc(function() {
        /*
<ul>
  {{#each items}}
  <li>{{agree_button}}</li>
  {{/each}}
</ul>
        */
    })
    var ast = Handlebars.parse(tpl)
    // console.log(JSON.stringify(ast, null, 4));
    var result = Mock4Tpl.gen(ast)
    // console.log(JSON.stringify(result, null, 4))

    test.ok(util.isArray(result.items))
    test.ok('agree_button' in result.items[0]) // helper 成了属性！
    test.done()
}

// 尴尬的命名
exports.test_context_of_custom_helper_with_all_helpers = function(test) {

    Handlebars.registerHelper('agree_button', function() {
        return new Handlebars.SafeString(
            "<button>I agree. I " + this.emotion + " " + this.name + "</button>");
    });

    var tpl = heredoc(function() {
        /*
<ul>
  {{#each items}}
  <li>{{agree_button}}</li>
  {{/each}}
</ul>
        */
    })
    var ast = Handlebars.parse(tpl)
    // console.log(JSON.stringify(ast, null, 4));
    var result = Mock4Tpl.gen(ast, null, {}, Handlebars.helpers)
    // console.log(JSON.stringify(result, null, 4))
    // console.log(Handlebars.helpers)

    test.ok(util.isArray(result.items))
    test.ok(!('agree_button' in result.items[0]))
    test.done()
}

// 命名变长时，驼峰式不易读
exports.test_context_of_custom_helper_with_helpers_and_options = function(test) {

    Handlebars.registerHelper('agree_button', function() {
        return new Handlebars.SafeString(
            "<button>I agree. I " + this.emotion + " " + this.name + "</button>");
    });

    var tpl = heredoc(function() {
        /*
<ul>
  {{#each items}}
  <li>{{agree_button}}</li>
  {{/each}}
</ul>
        */
    })
    var ast = Handlebars.parse(tpl)
    // console.log(JSON.stringify(ast, null, 4));
    var result = Mock4Tpl.gen(ast, null, {
        'items|1-10': [{
                'id|+1': 1,
                name: '@FIRST @LAST',
                emotion: '@SENTENCE'
            }
        ]
    }, Handlebars.helpers)
    // console.log(JSON.stringify(result, null, 4))
    // console.log(Handlebars.helpers)

    test.ok(util.isArray(result.items))
    test.ok(result.items.length >= 1 && result.items.length <= 10)
    test.ok(!('agree_button' in result.items[0]))
    test.ok('name' in result.items[0])
    test.ok('emotion' in result.items[0])
    test.done()
}

exports.test_build_in_helper_with = function(test) {
    var tpl = heredoc(function() {
        /*
<div class="entry">
  <h1>{{title}}</h1>

  {{#with author}}
  <h2>By {{firstName}} {{lastName}}</h2>
  {{/with}}
</div>
        */
    })
    var ast = Handlebars.parse(tpl)
    // console.log(JSON.stringify(ast, null, 4));
    var result = Mock4Tpl.gen(ast)
    // console.log(JSON.stringify(result, null, 4))

    test.ok(result)
    test.done()
}

exports.test_build_in_helper_each = function(test) {
    var tpl = heredoc(function() {
        /*
<ul class="people_list">
  {{#each people}}
  <li>{{this}}</li>
  {{/each}}
</ul>
        */
    })
    var ast = Handlebars.parse(tpl)
    // console.log(JSON.stringify(ast, null, 4));
    var result = Mock4Tpl.gen(ast, null, { // 需要指定数据生成规则，否则默认为 {}
        'people|1-10': ['@EMAIL']
    })
    // console.log(JSON.stringify(result, null, 4))

    test.ok(util.isArray(result.people))
    test.ok(result.people.length >= 1 && result.people.length <= 10)
    test.done()
}

// TODO
exports.test_build_in_helper_each_else = function(test) {
    var tpl = heredoc(function() {
        /*
{{#each paragraphs}}
  <p>{{this}}</p>
{{else}}
  <p class="empty">No content</p>
{{/each}}
        */
    })
    var ast = Handlebars.parse(tpl)
    // console.log(JSON.stringify(ast, null, 4));
    var result = Mock4Tpl.gen(ast, null, {
        'paragraphs|1-10': ['@EMAIL']
    })
    // console.log(JSON.stringify(result, null, 4))

    test.ok(util.isArray(result.paragraphs))
    test.ok(result.paragraphs.length >= 1 && result.paragraphs.length <= 10)
    test.done()
}

exports.test_build_in_helper_if_without_options = function(test) {
    var tpl = heredoc(function() {
        /*
<div class="entry">
  {{#if author}}
  <h1>{{firstName}} {{lastName}}</h1>
  {{/if}}
</div>
        */
    })
    var ast = Handlebars.parse(tpl)
    // console.log(JSON.stringify(ast, null, 4));
    var result = Mock4Tpl.gen(ast)
    // console.log(JSON.stringify(result, null, 4))

    test.ok('firstName' in result)
    test.ok('lastName' in result)
    test.done()
}

exports.test_build_in_helper_if_with_options = function(test) {
    var tpl = heredoc(function() {
        /*
<div class="entry">
  {{#if author}}
  <h1>{{firstName}} {{lastName}}</h1>
  {{/if}}
</div>
        */
    })
    var ast = Handlebars.parse(tpl)
    // console.log(JSON.stringify(ast, null, 4));
    var result = Mock4Tpl.gen(ast, null, {
        author: {}
    })
    // console.log(JSON.stringify(result, null, 4))

    test.ok('author' in result)
    test.ok('firstName' in result.author)
    test.ok('lastName' in result.author)
    test.done()
}

exports.test_build_in_helper_if_else = function(test) {
    var tpl = heredoc(function() {
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
    var ast = Handlebars.parse(tpl)
    // console.log(JSON.stringify(ast, null, 4));
    var result = Mock4Tpl.gen(ast)
    // console.log(JSON.stringify(result, null, 4))
    test.ok('author' in result)
    test.ok('firstName' in result)
    test.ok('lastName' in result)

    result = Mock4Tpl.gen(ast, null, {
        author: {}
    })
    test.ok('author' in result)
    test.ok('firstName' in result.author)
    test.ok('lastName' in result.author)
    // console.log(JSON.stringify(result, null, 4))

    test.ok(result)
    test.done()
}

exports.test_helper_unless = function(test) {
    var tpl = heredoc(function() {
        /*
<div class="entry">
  {{#unless license}}
  <h3 class="warning">WARNING: This entry does not have a license!</h3>
  {{/unless}}
</div>
        */
    })
    var ast = Handlebars.parse(tpl)
    // console.log(JSON.stringify(ast, null, 4));

    var result = Mock4Tpl.gen(ast)
    // console.log(JSON.stringify(result, null, 4))
    test.ok('license' in result)
    test.ok(typeof result.license === 'boolean')

    result = Mock4Tpl.gen(ast, null, {
        license: '@SENTENCE'
    })
    // console.log(JSON.stringify(result, null, 4))
    test.ok('license' in result)
    test.ok(typeof result.license === 'string')

    result = Mock4Tpl.gen(ast, null, {
        'license|1': ['MIT', '']
    })
    // console.log(JSON.stringify(result, null, 4))
    test.ok('license' in result)
    test.ok(typeof result.license === 'string')
    test.ok(result.license === 'MIT' || result.license === '')

    test.done()
}

exports.test_helper_log = function(test) {
    var tpl = '{{log "Look at me!"}}'
    var ast = Handlebars.parse(tpl)
    // console.log(JSON.stringify(ast, null, 4));
    var result = Mock4Tpl.gen(ast)
    // console.log(JSON.stringify(result, null, 4))

    var prop
    for (prop in result) {}
    test.ok(prop === undefined)
    test.done()
}