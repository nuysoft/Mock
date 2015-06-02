<!-- ## Mock.js -->

<h2 class="hide" href="#">Mock.js</h2>
<img class="hide" src="mockjs.png" wid>

<h1 style="color: #428BCA; margin-bottom: 30px;">
    <i class="iconlogo" style="font-size: 80px;">&#x3435;</i>
    <span>Mock.js</span>
</h1>

[![Build Status](https://api.travis-ci.org/nuysoft/Mock.png?branch=master)](http://travis-ci.org/nuysoft/Mock)
<!-- [![GitHub version](https://badge.fury.io/gh/nuysoft%2FMock.png)](http://badge.fury.io/gh/nuysoft%2FMock) -->
<!-- [![NPM version](https://badge.fury.io/js/mockjs.png)](http://badge.fury.io/js/mockjs) -->
<!-- [![Bower version](https://badge.fury.io/bo/mockjs.png)](http://badge.fury.io/bo/mockjs) -->
[![Views in the last 24 hours](https://sourcegraph.com/api/repos/github.com/nuysoft/Mock/counters/views-24h.png)](https://github.com/nuysoft/Mock/)

Mock.js 是一款<!-- 有用且好用的  -->模拟数据生成器，旨在帮助前端攻城师独立于后端进行开发，帮助编写单元测试。提供了以下模拟功能：

* 根据数据模板生成模拟数据
* 模拟 Ajax 请求，生成并返回模拟数据
* 基于 HTML 模板生成模拟数据

## 在线编辑器 
<!-- 没有 Live Demo 的库都是耍流氓  -->

* [数据模板编辑器](./editor.html#help)
* [Handlebars &amp; Mustache](./demo/mock4tpl.html)
* [KISSY XTemplate](./demo/mock4xtpl.html)

## 下载

<p>
    <a href="./dist/mock.js" class="btn btn-success w250">
        Development Version (0.1.10)
    </a> - <i>73kB, Uncompressed</i>
</p>
<p>
    <a href="./dist/mock-min.js" class="btn btn-primary w250">
        Production Version (0.1.10)
    </a> - <i>32kB, Minified</i>
</p>
<p>
    <a href="https://github.com/nuysoft/Mock" class="btn btn-default w250">
        从 Github 获取最新版本
    </a> - <i>Unreleased</i>
</p>

<iframe src="http://ghbtns.com/github-btn.html?user=nuysoft&repo=Mock&type=watch&count=true&size=large"
  allowtransparency="true" frameborder="0" scrolling="0" width="131" height="30"></iframe>

<iframe src="http://ghbtns.com/github-btn.html?user=nuysoft&repo=Mock&type=fork&count=true&size=large"
  allowtransparency="true" frameborder="0" scrolling="0" width="140" height="30"></iframe>

<!-- <iframe src="http://ghbtns.com/github-btn.html?user=nuysoft&type=follow&count=true&size=large"
  allowtransparency="true" frameborder="0" scrolling="0" width="165" height="30"></iframe> -->

## 分享文档

* [懒懒交流会 2014.5.30](/doc/lanlan.html)

## 用法

### 浏览器

<iframe width="100%" height="200" src="http://jsfiddle.net/DgJrj/embedded/html,js,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

### Node (CommonJS)

    // 安装
    npm install mockjs
    
    // 使用
    var Mock = require('mockjs');
    var data = Mock.mock({
        'list|1-10': [{
            'id|+1': 1
        }]
    });
    console.log(JSON.stringify(data, null, 4))

### Bower

<!-- If you'd like to use [bower](http://bower.io/), it's as easy as: -->
    
    npm install -g bower
    bower install --save mockjs
    
    <script type="text/javascript" src="./bower_components/mockjs/dist/mock.js"></script>


### RequireJS (AMD)

<iframe width="100%" height="350" src="http://jsfiddle.net/uTSqT/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

### Sea.js (CMD)

<iframe width="100%" height="350" src="http://jsfiddle.net/5jX6e/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

### KISSY

<iframe width="100%" height="400" src="http://jsfiddle.net/En2sX/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

<!-- 
Mock.js 已入驻 [KISSY Gallery](https://github.com/kissygalleryteam)，阿里同学可以直接加载 `gallery/Mock/0.1.1/index`：

<iframe width="100%" height="400" src="http://jsfiddle.net/8VNQQ/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>
-->

### Random CLI

    // 安装
    npm install mockjs -g

    // 执行
    $ random url
    // => http://rmcpx.org/funzwc

---

## 语法规范

Mock.js 的语法规范包括两部分：

1. 数据模板定义（Data Temaplte Definition，DTD）
2. 数据占位符定义（Data Placeholder Definition，DPD）

### 数据模板定义 DTD

**数据模板中的每个属性由 3 部分构成：属性名、生成规则、属性值：**
    
    // 属性名   name
    // 生成规则 rule
    // 属性值   value
    'name|rule': value

**注意：**

* 属性名 和 生成规则 之间用 `|` 分隔。
* 生成规则 是可选的。
* 生成规则 有 7 种格式：
    1. `'name|min-max': value`
    1. `'name|count': value`
    1. `'name|min-max.dmin-dmax': value`
    1. `'name|min-max.dcount': value`
    1. `'name|count.dmin-dmax': value`
    1. `'name|count.dcount': value`
    1. `'name|+step': value`
* **生成规则 的 含义 需要依赖 属性值 才能确定。**
* 属性值 中可以含有 `@占位符`。
* 属性值 还指定了最终值的初始值和类型。

<!-- 感谢 @麦少 同学对 Mock.js 语法的整理和分析，才有了这版相对清晰的语法文档。 -->

**生成规则和示例：**

1. 属性值是字符串 **String**
    1. `'name|min-max': 'value'` 通过重复 `'value'` 生成一个字符串，重复次数大于等于 `min`，小于等于 `max`。
    2. `'name|count': 'value'` 通过重复 `'value'` 生成一个字符串，重复次数等于 `count`。
2. 属性值是数字 **Number**
    1. `'name|+1': 100` 属性值自动加 1，初始值为 100
    2. `'name|1-100': 100` 生成一个大于等于 1、小于等于 100 的整数，属性值 100 只用来确定类型。
    3. `'name|1-100.1-10': 100` 生成一个浮点数，整数部分大于等于 1、小于等于 100，小数部分保留 1 到 10 位。

            {
                'number1|1-100.1-10': 1,
                'number2|123.1-10': 1,
                'number3|123.3': 1,
                'number4|123.10': 1.123
            }
            // =>
            {
                "number1": 12.92,
                "number2": 123.51,
                "number3": 123.777,
                "number4": 123.1231091814
            }
3. 属性值是布尔型 **Boolean**
    1. `'name|1': value` 随机生成一个布尔值，值为 true 的概率是 1/2，值为 false 的概率是 1/2。
    2. `'name|min-max': value` 随机生成一个布尔值，值为 `value` 的概率是 `min / (min + max)`，值为 `!value` 的概率是 `max / (min + max)`。
4. 属性值是对象 **Object**
    1. `'name|min-max': {}` 从属性值 `{}` 中随机选取 `min` 到 `max` 个属性。
    2. `'name|count': {}` 从属性值 `{}` 中随机选取 `count` 个属性。
5. 属性值是数组 **Array**
    1. `'name|1': [{}, {} ...]` 从属性值 `[{}, {} ...]` 中随机选取 1 个元素，作为最终值。
    2. `'name|min-max': [{}, {} ...]` 通过重复属性值 `[{}, {} ...]` 生成一个新数组，重复次数大于等于 `min`，小于等于 `max`。
    3. `'name|count': [{}, {} ...]` 通过重复属性值 `[{}, {} ...]` 生成一个新数组，重复次数为 `count`。
6. 属性值是数组 **Function**

    `'name': function(){}` 执行函数 `function(){}`，取其返回值作为最终的属性值，上下文为 `'name'` 所在的对象。

### 数据占位符定义 DPD

占位符 只是在属性值字符串中占个位置，并不出现在最终的属性值中。占位符 的格式为：
    
    @占位符
    @占位符(参数 [, 参数])

**注意：**

1. 用 `@` 来标识其后的字符串是 占位符。
2. 占位符 引用的是 `Mock.Random` 中的方法。
3. 通过 `Mock.Random.extend()` 来扩展自定义占位符。
4. 占位符 也可以引用 数据模板 中的属性。
5. 占位符 会优先引用 数据模板 中的属性。

        {
            name: {
                first: '@FIRST',
                middle: '@FIRST',
                last: '@LAST',
                full: '@first @middle @last'
            }
        }
        // =>
        {
            "name": {
                "first": "Charles",
                "middle": "Brenda",
                "last": "Lopez",
                "full": "Charles Brenda Lopez"
            }
        }

---


## Mock

### Mock.mock( rurl?, rtype?, template|function(options) )

根据数据模板生成模拟数据。

* **Mock.mock( template )**

    根据数据模板生成模拟数据。

* **Mock.mock( rurl, template )**

    记录数据模板。当拦截到匹配 `rurl` 的 Ajax 请求时，将根据数据模板 `template` 生成模拟数据，并作为响应数据返回。

* **Mock.mock( rurl, function(options) )**

    记录用于生成响应数据的函数。当拦截到匹配 `rurl` 的 Ajax 请求时，函数 `function(options)` 将被执行，并把执行结果作为响应数据返回。

* **Mock.mock( rurl, rtype, template )**
    
    记录数据模板。当拦截到匹配 `rurl` 和 `rtype` 的 Ajax 请求时，将根据数据模板 `template` 生成模拟数据，并作为响应数据返回。

* **Mock.mock( rurl, rtype, function(options) )**

    记录用于生成响应数据的函数。当拦截到匹配 `rurl` 和 `rtype` 的 Ajax 请求时，函数 `function(options)` 将被执行，并把执行结果作为响应数据返回。

**参数的含义和默认值**如下所示：

* **参数 rurl**：可选。表示需要拦截的 URL，可以是 URL 字符串或 URL 正则。例如 `/\/domain\/list\.json/`、`'/domian/list.json'`。
* **参数 rtype**：可选。表示需要拦截的 Ajax 请求类型。例如 `GET`、`POST`、`PUT`、`DELETE` 等。
* **参数 template**：可选。表示数据模板，可以是对象或字符串。例如 `{ 'data|1-10':[{}] }`、`'@EMAIL'`。
* **参数 function(options)**：可选。表示用于生成响应数据的函数。
* **参数 options**：指向本次请求的 Ajax 选项集。

下面是 Mock.mock() 的 5 种参数格式以及语法规范的使用示例：

**示例1：**Mock.mock( template )

<iframe width="100%" height="300" src="http://jsfiddle.net/Y3rg6/1/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

**示例2：**Mock.mock( rurl, template )

<iframe width="100%" height="300" src="http://jsfiddle.net/BeENf/3/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

**示例3：**Mock.mock( rurl, function(options) )

<iframe width="100%" height="300" src="http://jsfiddle.net/2s5t5/3/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

**示例4：**Mock.mock( rurl, rtype, template )

<iframe width="100%" height="300" src="http://jsfiddle.net/Eq68p/2/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

**示例5：**Mock.mock( rurl, rtype, function(options) )

<iframe width="100%" height="300" src="http://jsfiddle.net/6dpV5/4/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>




### Mock.mockjax(library)

覆盖（拦截） Ajax 请求，目前内置支持 jQuery、Zepto、KISSY。

对 jQuery Ajax 请求的拦截和响应，通过覆盖前置过滤器、选项 dataFilter 以及数据转换器实现，实现代码请问[这里](https://github.com/nuysoft/Mock/blob/master/src/mockjax.js#L5)。

对 KISSY Ajax 请求的拦截和响应，则通过粗鲁地覆盖 KISSY.io(options) 实现，实现代码请问[这里](https://github.com/nuysoft/Mock/blob/master/src/mockjax.js#L72)。

因为第三库 Ajax 的实现方式不尽相同，故目前只内置支持了实际开发中（本人和所服务的阿里） 常用的 jQuery、Zepto 和 KISSY。如果需要拦截其他第三方库的 Ajax 请求，可参考对 jQuery、Zepto 和 KISSY 的实现，覆盖 `Mock.mockjax(library)`。

通过方法 `Mock.mock( rurl, rtype, template|function(options) )` 设置的 URL 和数据模板的映射，均记录在属性 `Mock._mocked` 中，扩展时可从中获取 URL 对应的数据模板，进而生成和响应模拟数据。`Mock._mocked` 的数据结构为：

    {
        (rurl + rtype): {
            rurl: rurl,
            rtype: rtype,
            template: template
        },
        ...
    }

<!-- 如果业务和场景需要，可以联系 [@墨智]()、[nuysoft](nuysoft@gmail.com) 提供对特定库的内置支持，不过最酷的做法是开发人员能够为 Mock.js 贡献代码。 -->
<!-- 感谢 @麦少 同学对 Mock.mockjax(library) 的重构，并增加了对 Zepto.js 的支持。 -->

### Mock.tpl(input, options, helpers, partials)

* Mock.tpl(input)
* Mock.tpl(input, options)
* Mock.tpl(input, options, helpers)
* Mock.tpl(input, options, helpers, partials)

基于 Handlebars、Mustache 的 HTML 模板生成模拟数据。

**参数的含义和默认值**如下所示：

* **参数 input**：必选。可以是 HTML 模板，或者经过 Handlebars 解析的语法树（`Handlebars.parse(input)`）。将基于该参数生成模拟数据。
* **参数 options**：可选。对象。称为“数据模板”，用于配置生成模拟数据的规则。例如 `{ 'email': '@EMAIL' }`，在生成模拟数据时，所有 `email` 属性对应的值将是一个邮件地址。
* **参数 helpers**：可选。对象。表示局部 helper。全局 helper 会自动从 `Handlebars.helpers` 中读取。
* **参数 partials**：可选。对象。表示局部子模板。全局子模板会自动从 `Handlebars.partials` 中读取。

**使用示例**如下所示：

    // 基于 HTML 模板生成模拟数据
    Mock.tpl('this is {{title}}!')
    // => {title: "title"}
    
    // 基于 HTML 模板和数据模板生成模拟数据
    Mock.tpl('this is {{title}}!', {
        title: '@TITLE'
    })
    // => {title: "Guhwbgehq Isuzssx Ywvwt Dkp"}
    
    // 基于 HTML 模板生成模拟数据，传入了局部命令。
    Mock.tpl('this is {{title}}!', {}, {
        title: function(){
            return 'my title'
        }
    })
    // => {title: "title"}
    
    // 基于 HTML 模板生成模拟数据，传入了局部子模板。
    Mock.tpl('{{> "sub-tpl"}}', {}, {}, {
        'sub-tpl': '{{title}}'
    })
    // => {title: "title"}

数据模板 `options` 可以在调用 Mock.tpl(input, options, helpers, partials) 时传入，也可以在 HTML 模板中通过 HTML 注释配置（为了避免侵入现有的代码和开发模式），格式为 `<!-- Mock {} -->` 。下面的 2 个示例演示了通过 HTML 注释配置数据模板的两种方式：集中配置、分散配置。
    
**示例1：**在 HTML 模板中通过一个 HTML 注释**集中**配置数据模板。

    var tpl = Mock.heredoc(function() {
        /*!
    {{email}}{{age}}
    <!-- Mock { 
        email: '@EMAIL',
        age: '@INT(1,100)'
    } -->
        */
    })
    var data = Mock.tpl(tpl)
    console.log(JSON.stringify(data, null, 4))
    // =>
    {
        "email": "t.lee@clark.net",
        "age": 33
    }

**示例2：**在 HTML 模板中通过多个 HTML 注释**分散**配置数据模板。

    var tpl = Mock.heredoc(function() {
        /*!
    {{email}}{{age}}
    <!-- Mock { 
        email: '@EMAIL'
    } -->
    <!-- Mock { age: '@INT(1,100)' } -->
        */
    })
    var data = Mock.tpl(tpl)
    console.log(JSON.stringify(data, null, 4))
    // =>
    {
        "email": "j.walker@brown.edu",
        "age": 83
    }


### Mock.xtpl(input, options, helpers, partials)

* Mock.xtpl(input)
* Mock.xtpl(input, options)
* Mock.xtpl(input, options, helpers)
* Mock.xtpl(input, options, helpers, partials)

基于 KISSY XTempalte 的 HTML 模板生成模拟数据。

**参数的含义和默认值**如下所示：

* **参数 input**：必选。可以是 HTML 模板，或者经过 KISSY XTempalte 解析的语法树（`XTemplate.compiler.parse(input)`）。将基于该参数生成模拟数据。
* **参数 options**：可选。对象。称为“数据模板”，用于配置生成模拟数据的规则。例如 `{ 'email': '@EMAIL' }`，在生成模拟数据时，所有 `email` 属性对应的值将是一个邮件地址。
* **参数 helpers**：可选。对象。表示局部命令。全局命令会自动从 `XTemplate.RunTime.commands` 中读取。
* **参数 partials**：可选。对象。表示局部子模板。全局子模板会自动从 `XTemplate.RunTime.subTpls` 中读取。

**使用示例**如下所示：

    // 基于 HTML 模板生成模拟数据
    Mock.xtpl('this is {{title}}!')
    // => {title: "title"}
    
    // 基于 HTML 模板和数据模板生成模拟数据
    Mock.xtpl('this is {{title}}!', {
        title: '@TITLE'
    })
    // => {title: "Guhwbgehq Isuzssx Ywvwt Dkp"}
    
    // 基于 HTML 模板生成模拟数据，传入了局部命令。
    Mock.xtpl('this is {{title}}!', {}, {
        title: function(){
            return 'my title'
        }
    })
    // => {title: "title"}
    
    // 基于 HTML 模板生成模拟数据，传入了局部子模板。
    Mock.xtpl('{{include "sub-tpl"}}', {}, {}, {
        'sub-tpl': '{{title}}'
    })
    // => {title: "title"}

数据模板 `options` 可以在调用 Mock.xtpl(input, options, helpers, partials) 时传入，也可以在 HTML 模板中通过 HTML 注释配置（为了避免侵入现有的代码和开发模式），格式为 `<!-- Mock {} -->` 。下面的 2 个示例演示了通过 HTML 注释配置数据模板的两种方式：集中配置、分散配置。
    
**示例1：**在 HTML 模板中通过一个 HTML 注释**集中**配置数据模板。

    var tpl = Mock.heredoc(function() {
        /*!
    {{email}}{{age}}
    <!-- Mock { 
        email: '@EMAIL',
        age: '@INT(1,100)'
    } -->
        */
    })
    var data = Mock.xtpl(tpl)
    console.log(JSON.stringify(data, null, 4))
    // =>
    {
        "email": "t.lee@clark.net",
        "age": 33
    }

**示例2：**在 HTML 模板中通过多个 HTML 注释**分散**配置数据模板。

    var tpl = Mock.heredoc(function() {
        /*!
    {{email}}{{age}}
    <!-- Mock { 
        email: '@EMAIL'
    } -->
    <!-- Mock { age: '@INT(1,100)' } -->
        */
    })
    var data = Mock.xtpl(tpl)
    console.log(JSON.stringify(data, null, 4))
    // =>
    {
        "email": "j.walker@brown.edu",
        "age": 83
    }


### Mock.heredoc(fn)

* Mock.heredoc(fn)

以直观、舒适、安全的方式书写（多行）HTML 模板。

**使用示例**如下所示：

    var tpl = Mock.heredoc(function() {
        /*!
    {{email}}{{age}}
    <!-- Mock { 
        email: '@EMAIL',
        age: '@INT(1,100)'
    } -->
        */
    })
    console.log(tpl)
    // =>
    "{{email}}{{age}}
    <!-- Mock { 
        email: '@EMAIL',
        age: '@INT(1,100)'
    } -->"

**相关阅读**

* [Creating multiline strings in JavaScript](http://stackoverflow.com/questions/805107/creating-multiline-strings-in-javascript)、

## Mock.Random

Mock.Random 是一个工具类，用于生成各种随机数据。Mock.Random 的方法在数据模板中称为“占位符”，引用格式为 `@占位符(参数 [, 参数])` 。例如：

    var Random = Mock.Random;
    Random.email()
    // => "n.clark@miller.io"
    Mock.mock('@EMAIL')
    // => "y.lee@lewis.org"
    Mock.mock( { email: '@EMAIL' } )
    // => { email: "v.lewis@hall.gov" }

可以在上面的例子中看到，直接调用 'Random.email()' 时方法名 `email()` 是小写的，而数据模板中的 `@EMAIL` 却是大写。这并非对数据模板中的占位符做了特殊处理，也非强制的编写方式，事实上在数据模板中使用小写的 `@email` 也可以达到同样的效果。不过，这是建议的编码风格，以便在阅读时从视觉上提高占位符的识别度，快速识别占位符和普通字符。

在浏览器中，为了减少需要拼写的字符，Mock.js 把 Mock.Random 暴露给了 window 对象，使之成为全局变量，从而可以直接访问 Random。因此上面例子中的 `var Random = Mock.Random;` 可以省略。在后面的例子中，也将做同样的处理。

> 在 Node.js 中，仍然需要通过 `Mock.Random` 访问。

Mock.Random 提供的完整方法（占位符）如下：

| Type          | Method
| ------------- | -----------------------------------------------------------------------------
| Basics        | boolean natural integer float character string range date time datetime now
| Image         | image dataImage
| Color         | color
| Text          | paragraph sentence word title
| Name          | first last name
| Web           | url domain email ip tld
| Address       | area region
| Helpers       | capitalize upper lower pick shuffle
| Miscellaneous | guid id

<script id="fixPlaceholderLink" type="text/javascript">
    $('#fixPlaceholderLink').prev('table')
        .find('td:nth-child(1)').each(function(index, td) {
            $(td).contents().wrapAll(
                $('<a>').attr('href', '#' + $(td).text())
            )
        })
        .end()
        .find('td:nth-child(2)').each(function(index, td) {
            var methods = $(td).text().split(' ')
            var links = $()
            $(methods).each(function(mindex, m) {
                links.push(
                    $('<a>').attr('href', '#' + m).text(m)[0]
                )
                if (mindex < methods.length - 1) {
                    links.push(
                        $('<span>').text(', ')[0]
                    )
                }
            })
            $(td).empty().append(links)
        })
        .end()
</script>

Mock.Random 中的方法与数据模板的 `@占位符` 一一对应，在需要时可以为 Mock.Random 扩展方法，然后在数据模板中通过 `@扩展方法` 引用。例如：

    Random.extend({
        constellations: ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'],
        constellation: function(date){
            return this.pick(this.constellations)
        }
    })
    Random.constellation()
    // => "水瓶座"
    Mock.mock('@CONSTELLATION')
    // => "天蝎座"
    Mock.mock({ constellation: '@CONSTELLATION'})
    // => { constellation: "射手座" }

下面是 Mock.Random 内置支持的方法说明。

**你可以打开控制台，随意地试验这些方法。**

### Basics

#### Random.boolean(min, max, cur)

* Random.boolean()
* Random.boolean(min, max, cur)

返回一个随机的布尔值。

**参数的含义和默认值**如下所示：

* 参数 min：可选。指示参数 cur 出现的概率。概率计算公式为 `min / (min + max)`。该参数的默认值为 1，即有 50% 的概率返回参数 cur。
* 参数 max：可选。指示参数 cur 的相反值（!cur）出现的概率。概率计算公式为 `max / (min + max)`。该参数的默认值为 1，即有 50% 的概率返回参数 cur。
* 参数 cur：可选。可选值为布尔值 true 或 false。如果未传入任何参数，则返回 true 和 false 的概率各为 50%。该参数没有默认值，在该方法的内部，依据原生方法 Math.random() 返回的（浮点）数来计算和返回布尔值，例如在最简单的情况下，返回值是表达式 `Math.random() >= 0.5` 的执行结果。

**使用示例**如下所示：

    Random.boolean()
    // => true
    Random.boolean(1, 9, true)
    // => false
    Random.bool()
    // => false
    Random.bool(1, 9, false)
    // => true

<!-- 事实上，原生方法 Math.random() 返回的随机（浮点）数的分布并不均匀，是货真价实的伪随机数，将来会替换为基于 ？？ 来生成随机数。?? 对 Math.random() 的实现机制进行了分析和统计，并提供了随机数的参考实现，可以访问[这里](http://??)。
TODO 统计 -->

#### Random.natural(min, max)

* Random.natural()
* Random.natural(min)
* Random.natural(min, max)

返回一个随机的自然数（大于等于 0 的整数）。

**参数的含义和默认值**如下所示：

* 参数 min：可选。指示随机自然数的最小值。默认值为 0。
* 参数 max：可选。指示随机自然数的最小值。默认值为 9007199254740992。

**使用示例**如下所示：

    Random.natural()
    // => 1002794054057984
    Random.natural(10000)
    // => 71529071126209
    Random.natural(60, 100)
    // => 77

#### Random.integer(min, max)

* Random.integer()
* Random.integer(min)
* Random.integer(min, max)

返回一个随机的整数。

**参数的含义和默认值**如下所示：

* 参数 min：可选。指示随机整数的最小值。默认值为 -9007199254740992。
* 参数 max：可选。指示随机整数的最大值。默认值为 9007199254740992。

**使用示例**如下所示：

    Random.integer()
    // => -3815311811805184
    Random.integer(10000)
    // => 4303764511003750
    Random.integer(60,100)
    // => 96

#### Random.float(min, max, dmin, dmax)

* Random.float()
* Random.float(min)
* Random.float(min, max)
* Random.float(min, max, dmin)
* Random.float(min, max, dmin, dmax)

返回一个随机的浮点数。

**参数的含义和默认值**如下所示：

* 参数 min：可选。整数部分的最小值。默认值为 -9007199254740992。
* 参数 max：可选。整数部分的最大值。默认值为 9007199254740992。
* 参数 dmin：可选。小数部分位数的最小值。默认值为 0。
* 参数 dmin：可选。小数部分位数的最大值。默认值为 17。

**使用示例**如下所示：

    Random.float()
    // => -1766114241544192.8
    Random.float(0)
    // => 556530504040448.25
    Random.float(60, 100)
    // => 82.56779679549358
    Random.float(60, 100, 3)
    // => 61.718533677927894
    Random.float(60, 100, 3, 5)
    // => 70.6849

#### Random.character(pool)

返回一个随机字符。

* Random.character()
* Random.character('lower/upper/number/symbol')
* Random.character(pool)

**参数的含义和默认值**如下所示：

* 参数 pool：可选。字符串。表示字符池，将从中选择一个字符返回。
    * 如果传入 `'lower'` 或 `'upper'`、`'number'`、`'symbol'`，表示从内置的字符池从选取：

            {
                lower: "abcdefghijklmnopqrstuvwxyz",
                upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                number: "0123456789",
                symbol: "!@#$%^&*()[]"
            }

    * 如果未传入该参数，则从 `'lower' + 'upper' + 'number' + 'symbol'` 中随机选取一个字符返回。

**使用示例**如下所示：

    Random.character()
    // => "P"
    Random.character('lower')
    // => "y"
    Random.character('upper')
    // => "X"
    Random.character('number')
    // => "1"
    Random.character('symbol')
    // => "&"
    Random.character('aeiou')
    // => "u"

#### Random.string(pool, min, max)

返回一个随机字符串。

* Random.string()
* Random.string( length )
* Random.string( pool, length )
* Random.string( min, max )
* Random.string( pool, min, max )

**参数的含义和默认值**如下所示：

* 参数 pool：可选。字符串。表示字符池，将从中选择一个字符返回。
    * 如果传入 `'lower'` 或 `'upper'`、`'number'`、`'symbol'`，表示从内置的字符池从选取：
    
            {
                lower: "abcdefghijklmnopqrstuvwxyz",
                upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                number: "0123456789",
                symbol: "!@#$%^&*()[]"
            }

    * 如果未传入该参数，则从 `'lower' + 'upper' + 'number' + 'symbol'` 中随机选取一个字符返回。
* 参数 min：可选。随机字符串的最小长度。默认值为 3。
* 参数 max：可选。随机字符串的最大长度。默认值为 7。

**使用示例**如下所示：

    Random.string()
    // => "pJjDUe"
    Random.string( 5 )
    // => "GaadY"
    Random.string( 'lower', 5 )
    // => "jseqj"
    Random.string( 7, 10 )
    // => "UuGQgSYk"
    Random.string( 'aeiou', 1, 3 )
    // => "ea"

#### Random.range(start, stop, step)

* Random.range(stop)
* Random.range(start, stop)
* Random.range(start, stop, step)

返回一个整型数组。

**参数的含义和默认值**如下所示：

* 参数 start：必选。数组中整数的起始值。
* 参数 stop：可选。数组中整数的结束值（不包含在返回值中）。
* 参数 step：可选。数组中整数之间的步长。默认值为 1。

**使用示例**如下所示：

    Random.range(10)
    // => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    Random.range(3, 7)
    // => [3, 4, 5, 6]
    Random.range(1, 10, 2)
    // => [1, 3, 5, 7, 9]
    Random.range(1, 10, 3)
    // => [1, 4, 7]

#### Random.date(format)

* Random.date()
* Random.date(format)

返回一个随机的日期字符串。

**参数的含义和默认值**如下所示：

* 参数 format：可选。指示生成的日期字符串的格式。默认值为 `yyyy-MM-dd`。可选的占位符参考自 [Ext.Date](http://docs.sencha.com/ext-js/4-1/#!/api/Ext.Date)，如下所示：

| Format  | Description                                                 | Example
| ------- | ----------------------------------------------------------- | --------------
| yyyy    | A full numeric representation of a year, 4 digits           | 1999 or 2003
| yy      | A two digit representation of a year                        | 99 or 03
| y       | A two digit representation of a year                        | 99 or 03
| MM      | Numeric representation of a month, with leading zeros       | 01 to 12
| M       | Numeric representation of a month, without leading zeros    | 1 to 12
| dd      | Day of the month, 2 digits with leading zeros               | 01 to 31
| d       | Day of the month without leading zeros                      | 1 to 31
| HH      | 24-hour format of an hour with leading zeros                | 00 to 23
| H       | 24-hour format of an hour without leading zeros             | 0 to 23
| hh      | 12-hour format of an hour without leading zeros             | 1 to 12
| h       | 12-hour format of an hour with leading zeros                | 01 to 12
| mm      | Minutes, with leading zeros                                 | 00 to 59
| m       | Minutes, without leading zeros                              | 0 to 59
| ss      | Seconds, with leading zeros                                 | 00 to 59
| s       | Seconds, without leading zeros                              | 0 to 59
| SS      | Milliseconds, with leading zeros                            | 000 to 999
| S       | Milliseconds, without leading zeros                         | 0 to 999
| A       | Uppercase Ante meridiem and Post meridiem                   | AM or PM
| a       | Lowercase Ante meridiem and Post meridiem                   | am or pm
| T       | Milliseconds, since 1970-1-1 00:00:00 UTC                   | 759883437303

**使用示例**如下所示：
    
    Random.date()
    // => "2002-10-23"
    Random.date('yyyy-MM-dd')
    // => "1983-01-29"
    Random.date('yy-MM-dd')
    // => "79-02-14"
    Random.date('y-MM-dd')
    // => "81-05-17"
    Random.date('y-M-d')
    // => "84-6-5"

#### Random.time(format)

* Random.time()
* Random.time(format)

返回一个随机的时间字符串。

**参数的含义和默认值**如下所示：

* 参数 format：可选。指示生成的时间字符串的格式。默认值为 `HH:mm:ss`。可选的占位符参考自 [Ext.Date](http://docs.sencha.com/ext-js/4-1/#!/api/Ext.Date)，请参见 [Random.date(format)](#date)。

**使用示例**如下所示：
    
    Random.time()
    // => "00:14:47"
    Random.time('A HH:mm:ss')
    // => "PM 20:47:37"
    Random.time('a HH:mm:ss')
    // => "pm 17:40:00"
    Random.time('HH:mm:ss')
    // => "03:57:53"
    Random.time('H:m:s')
    // => "3:5:13"

#### Random.datetime(format)

* Random.datetime()
* Random.datetime(format)

返回一个随机的日期和时间字符串。

**参数的含义和默认值**如下所示：

* 参数 format：可选。指示生成的日期和时间字符串的格式。默认值为 `yyyy-MM-dd HH:mm:ss`。可选的占位符参考自 [Ext.Date](http://docs.sencha.com/ext-js/4-1/#!/api/Ext.Date)，请参见 [Random.date(format)](#date)。

**使用示例**如下所示：
    
    Random.datetime()
    // => "1977-11-17 03:50:15"
    Random.datetime('yyyy-MM-dd A HH:mm:ss')
    // => "1976-04-24 AM 03:48:25"
    Random.datetime('yy-MM-dd a HH:mm:ss')
    // => "73-01-18 pm 22:12:32"
    Random.datetime('y-MM-dd HH:mm:ss')
    // => "79-06-24 04:45:16"
    Random.datetime('y-M-d H:m:s')
    // => "02-4-23 2:49:40"

#### Random.now(unit, format)

* Ranndom.now(unit, format)
* Ranndom.now()
* Ranndom.now(format)
* Ranndom.now(unit)

返回当前的日期和时间字符串。

**参数的含义和默认值**如下所示：

* 参数 unit：可选。表示时间单元，用于对当前日期和时间进行格式化。可选值有：`year`、`month`、`week`、`day`、`hour`、`minute`、`second`、`week`，默认不会格式化。
* 参数 format：可选。指示生成的日期和时间字符串的格式。默认值为 `yyyy-MM-dd HH:mm:ss`。可选的占位符参考自 [Ext.Date](http://docs.sencha.com/ext-js/4-1/#!/api/Ext.Date)，请参见 [Random.date(format)](#date)。

> Random.now() 的实现参考了 (Moment.js)[http://momentjs.cn/docs/#/manipulating/start-of/]。

**使用示例**如下所示：
    
    Random.now()
    // => "2014-04-29 20:08:38 "
    Random.now('day', 'yyyy-MM-dd HH:mm:ss SS')
    // => "2014-04-29 00:00:00 000"
    Random.now('day')
    // => "2014-04-29 00:00:00 "
    Random.now('yyyy-MM-dd HH:mm:ss SS')
    // => "2014-04-29 20:08:38 157"

    Random.now('year')
    // => "2014-01-01 00:00:00"
    Random.now('month')
    // => "2014-04-01 00:00:00"
    Random.now('week')
    // => "2014-04-27 00:00:00"
    Random.now('day')
    // => "2014-04-29 00:00:00"
    Random.now('hour')
    // => "2014-04-29 20:00:00"
    Random.now('minute')
    // => "2014-04-29 20:08:00"
    Random.now('second')
    // => "2014-04-29 20:08:38"

### Image

#### Random.image(size, background, foreground, format, text)

* Random.image()
* Random.image(size)
* Random.image(size, background)
* Random.image(size, background, text)
* Random.image(size, background, foreground, text)
* Random.image(size, background, foreground, format, text)

生成一个随机的图片地址。

> **Random.image()** 用于生成高度自定义的图片地址，一般情况下，应该使用更简单的 [**Random.dataImage()**](#dataImage)。

**参数的含义和默认值**如下所示：

* 参数 size：可选。指示图片的宽高，格式为 `'宽x高'`。默认从下面的数组中随机读取一个：

        [
            '300x250', '250x250', '240x400', '336x280', 
            '180x150', '720x300', '468x60', '234x60', 
            '88x31', '120x90', '120x60', '120x240', 
            '125x125', '728x90', '160x600', '120x600', 
            '300x600'
        ]

* 参数 background：可选。指示图片的背景色。默认值为 '#000000'。
* 参数 foreground：可选。指示图片的前景色（文件）。默认值为 '#FFFFFF'。
* 参数 format：可选。指示图片的格式。默认值为 'png'，可选值包括：'png'、'gif'、'jpg'。
* 参数 text：可选。指示图片上的文字。默认为参数 size。

**使用示例**如下所示：
    
    Random.image()
    // => "http://dummyimage.com/125x125"
    Random.image('200x100')
    // => "http://dummyimage.com/200x100"
    Random.image('200x100', '#fb0a2a')
    // => "http://dummyimage.com/200x100/fb0a2a"
    Random.image('200x100', '#02adea', 'Hello')
    // => "http://dummyimage.com/200x100/02adea&text=Hello"
    Random.image('200x100', '#00405d', '#FFF', 'Mock.js')
    // => "http://dummyimage.com/200x100/00405d/FFF&text=Mock.js"
    Random.image('200x100', '#ffcc33', '#FFF', 'png', '!')
    // => "http://dummyimage.com/200x100/ffcc33/FFF.png&text=!"

生成的路径所对应的图片如下所示：

![](http://dummyimage.com/125x125)
![](http://dummyimage.com/200x100)
![](http://dummyimage.com/200x100/fb0a2a)
![](http://dummyimage.com/200x100/02adea&text=Hello)
![](http://dummyimage.com/200x100/00405d/FFF&text=Mock.js)
![](http://dummyimage.com/200x100/ffcc33/FFF.png&text=!)

#### Random.dataImage(size, text)

* Random.dataImage()
* Random.dataImage(size)
* Random.dataImage(size, text)

生成一段随机的 Base64 图片编码。

> 如果需要生成高度自定义的图片，请使用 [**Random.image()**](#image)。

**参数的含义和默认值**如下所示：

* 参数 size：可选。指示图片的宽高，格式为 `'宽x高'`。默认从下面的数组中随机读取一个：

        [
            '300x250', '250x250', '240x400', '336x280', 
            '180x150', '720x300', '468x60', '234x60', 
            '88x31', '120x90', '120x60', '120x240', 
            '125x125', '728x90', '160x600', '120x600', 
            '300x600'
        ]

* 参数 text：可选。指示图片上的文字。默认为参数 size。

> 图片的背景色是随机的，取值范围参考自 <http://brandcolors.net/>。

**使用示例**如下所示：
    
    Random.dataImage()
    // => "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAB9CAYAAACPgGwlAAAFJElEQVR4Xu2dS0hUURzG/1Yqlj2otJe10AqCoiJaFFTUpgcUhLaKCIogKCEiCl0U1SIIF1EIQlFEtCmkpbWSHlAQYRYUlI9Ie6nYmI9hfIx1LpzL3PGO/aeuM/r/f7PRufe7d873/ea75xw3ZjTumDtMeKlKIAPQVfF2zAK6PuaArpA5oAO6xgQUesacDugKE1BoGU0HdIUJKLSMpgO6wgQUWkbTAV1hAgoto+mArjABhZbRdEBXmIBCy2g6oCtMQKFlNB3QFSag0DKaDugKE1BoGU0HdIUJKLSMpgO6wgQUWkbTAV1hAgoto+mArjABhZbRdEBXmIBCy2g6oCtMQKFlNB3QFSag0DKaDugKE1BoGU0HdIUJKLSMpgO6wgQUWkbTAV1hAgoto+mArjABhZbRdEBXmIBCy2g6oCtMQKFlNB3QFSag0DKaDugKE1BoGU0HdIUJKLQ8bpo+fft+ylxYSJ23LvpisOfNST/N7ENniYa9/0xy4GsTdT+6+09Yx9t4/slEgovSDt2EO3P3YcoqWuUMsWln3oihFlTWUlbhSvf4UKid2iqOUfhVrXussKZ9xHXh10/oW1lxUnmNt/EkNXimOK3QTTtn7Sv1DDUees66rTT/3B0a/NFCvc9raOqf9+YL0PfiIX0/f8ADPdrXTZEPde6xyMd66rx5wXlvnwThN8/cL4ttc7S3i0L3rjqaVI2HyWdMZGmFbhwtvv7cgZm7ZS9NyS/wbboBb1ttwQy2tdLng2s90OOPxSa24FI15azZTAOtDdRyZAOZe84ru0GTps2g0P1r7pcjVeMZE5rMm6Yduh3nktt1CaHHesk/XUW5W4sp8v4lfTm5ywN9eCBCQz/baOBLE0Ua3rgg4z/DPCUmz5xD2SvWU6IpIBXjYTIKXDahoNtHvUmho/KMZ5HmN6f31FZT2+Wjbmix12dkZtNoTwYO9P8dT+A0mTecMNBNwPmnKmnyrDyKhxnv1U4B0d5f9KmkyHPaPinMwfYrJxKu7v8GPajxMDkFKpsQ0JMJ2KZjmm8e9817CjxNt/O4Odjf+JZaj2/zDXQ06EGNJ1CSSdws7dDNAsvsr7OXr3UWVeG6x87wv5WXOD9jAzZbtf7md669nscP3KbOLa2gaE+Xc27axl2UWbB0xLxvFmnmuJnTzU/7e+wuIJXjSYJToNK0Q/ebi41Du3Xz20bZBGJX3fH3Mav0jqpyd9Xvt3o3W0Ezt492H/tZQY8nUIpJ3izt0J39s8/L7q9N03NWb/LVhOuferZyWYuX0WDnD2evHv+XOPs5sdc4+/RFRX+eECFnn25eqRpPkpwClacdeqBucDNWAoDOikmWCNBl8WS5AXRWTLJEgC6LJ8sNoLNikiUCdFk8WW4AnRWTLBGgy+LJcgPorJhkiQBdFk+WG0BnxSRLBOiyeLLcADorJlkiQJfFk+UG0FkxyRIBuiyeLDeAzopJlgjQZfFkuQF0VkyyRIAuiyfLDaCzYpIlAnRZPFluAJ0VkywRoMviyXID6KyYZIkAXRZPlhtAZ8UkSwTosniy3AA6KyZZIkCXxZPlBtBZMckSAbosniw3gM6KSZYI0GXxZLkBdFZMskSALosnyw2gs2KSJQJ0WTxZbgCdFZMsEaDL4slyA+ismGSJAF0WT5YbQGfFJEsE6LJ4stwAOismWSJAl8WT5QbQWTHJEgG6LJ4sN4DOikmWCNBl8WS5AXRWTLJEgC6LJ8sNoLNikiUCdFk8WW4AnRWTLNFvXskYA3TG3JwAAAAASUVORK5CYII="

![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH0AAAB9CAYAAACPgGwlAAAFJElEQVR4Xu2dS0hUURzG/1Yqlj2otJe10AqCoiJaFFTUpgcUhLaKCIogKCEiCl0U1SIIF1EIQlFEtCmkpbWSHlAQYRYUlI9Ie6nYmI9hfIx1LpzL3PGO/aeuM/r/f7PRufe7d873/ea75xw3ZjTumDtMeKlKIAPQVfF2zAK6PuaArpA5oAO6xgQUesacDugKE1BoGU0HdIUJKLSMpgO6wgQUWkbTAV1hAgoto+mArjABhZbRdEBXmIBCy2g6oCtMQKFlNB3QFSag0DKaDugKE1BoGU0HdIUJKLSMpgO6wgQUWkbTAV1hAgoto+mArjABhZbRdEBXmIBCy2g6oCtMQKFlNB3QFSag0DKaDugKE1BoGU0HdIUJKLSMpgO6wgQUWkbTAV1hAgoto+mArjABhZbRdEBXmIBCy2g6oCtMQKFlNB3QFSag0DKaDugKE1BoGU0HdIUJKLQ8bpo+fft+ylxYSJ23LvpisOfNST/N7ENniYa9/0xy4GsTdT+6+09Yx9t4/slEgovSDt2EO3P3YcoqWuUMsWln3oihFlTWUlbhSvf4UKid2iqOUfhVrXussKZ9xHXh10/oW1lxUnmNt/EkNXimOK3QTTtn7Sv1DDUees66rTT/3B0a/NFCvc9raOqf9+YL0PfiIX0/f8ADPdrXTZEPde6xyMd66rx5wXlvnwThN8/cL4ttc7S3i0L3rjqaVI2HyWdMZGmFbhwtvv7cgZm7ZS9NyS/wbboBb1ttwQy2tdLng2s90OOPxSa24FI15azZTAOtDdRyZAOZe84ru0GTps2g0P1r7pcjVeMZE5rMm6Yduh3nktt1CaHHesk/XUW5W4sp8v4lfTm5ywN9eCBCQz/baOBLE0Ua3rgg4z/DPCUmz5xD2SvWU6IpIBXjYTIKXDahoNtHvUmho/KMZ5HmN6f31FZT2+Wjbmix12dkZtNoTwYO9P8dT+A0mTecMNBNwPmnKmnyrDyKhxnv1U4B0d5f9KmkyHPaPinMwfYrJxKu7v8GPajxMDkFKpsQ0JMJ2KZjmm8e9817CjxNt/O4Odjf+JZaj2/zDXQ06EGNJ1CSSdws7dDNAsvsr7OXr3UWVeG6x87wv5WXOD9jAzZbtf7md669nscP3KbOLa2gaE+Xc27axl2UWbB0xLxvFmnmuJnTzU/7e+wuIJXjSYJToNK0Q/ebi41Du3Xz20bZBGJX3fH3Mav0jqpyd9Xvt3o3W0Ezt492H/tZQY8nUIpJ3izt0J39s8/L7q9N03NWb/LVhOuferZyWYuX0WDnD2evHv+XOPs5sdc4+/RFRX+eECFnn25eqRpPkpwClacdeqBucDNWAoDOikmWCNBl8WS5AXRWTLJEgC6LJ8sNoLNikiUCdFk8WW4AnRWTLBGgy+LJcgPorJhkiQBdFk+WG0BnxSRLBOiyeLLcADorJlkiQJfFk+UG0FkxyRIBuiyeLDeAzopJlgjQZfFkuQF0VkyyRIAuiyfLDaCzYpIlAnRZPFluAJ0VkywRoMviyXID6KyYZIkAXRZPlhtAZ8UkSwTosniy3AA6KyZZIkCXxZPlBtBZMckSAbosniw3gM6KSZYI0GXxZLkBdFZMskSALosnyw2gs2KSJQJ0WTxZbgCdFZMsEaDL4slyA+ismGSJAF0WT5YbQGfFJEsE6LJ4stwAOismWSJAl8WT5QbQWTHJEgG6LJ4sN4DOikmWCNBl8WS5AXRWTLJEgC6LJ8sNoLNikiUCdFk8WW4AnRWTLNFvXskYA3TG3JwAAAAASUVORK5CYII=)

因为图片的 Base64 编码比较长，下面只显示生成的图片效果。

    Random.dataImage('200x100')

<img id="dataImage_size">
<script type="text/javascript">
    $('#dataImage_size').prop('src', Random.dataImage('200x100'))
</script>

    Random.dataImage('300x100', 'Hello Mock.js!')
<img id="dataImage_size_text">
<script type="text/javascript">
    $('#dataImage_size_text').prop('src', Random.dataImage('300x100', 'Hello Mock.js!'))
</script>

### Color

#### Random.color()

* Random.color()

随机生成一个颜色，格式为 '#RRGGBB'。

**使用示例**如下所示：

    Random.color()
    // => "#3538b2"

### Helpers

#### Random.capitalize(word)

* Random.capitalize(word)

把字符串的第一个字母转换为大写。

**使用示例**如下所示：

    Random.capitalize('hello')
    // => "Hello"

#### Random.upper(str)

* Random.upper(str)

把字符串转换为大写。

**使用示例**如下所示：

    Random.upper('hello')
    // => "HELLO"

#### Random.lower(str)

* Random.lower(str)

把字符串转换为小写。

**使用示例**如下所示：

    Random.lower('HELLO')
    // => "hello"

#### Random.pick(arr)

* Random.pick(arr)

从数组中随机选取一个元素，并返回。

**使用示例**如下所示：

    Random.pick(['a', 'e', 'i', 'o', 'u'])
    // => "o"

#### Random.shuffle(arr)

* Random.shuffle(arr)

打乱数组中元素的顺序，并返回。

**使用示例**如下所示：

    Random.shuffle(['a', 'e', 'i', 'o', 'u'])
    // => ["o", "u", "e", "i", "a"]

### Text

#### Random.paragraph(len)

* Random.paragraph()
* Random.paragraph(len)
* Random.paragraph(min, max)

随机生成一段文本。

**参数的含义和默认值**如下所示：

* 参数 len：可选。指示文本中句子的个数。默认值为 3 到 7 之间的随机数。
* 参数 min：可选。指示文本中句子的最小个数。默认值为 3。
* 参数 max：可选。指示文本中句子的最大个数。默认值为 7。

**使用示例**如下所示：

    Random.paragraph()
    // => "Yohbjjz psxwibxd jijiccj kvemj eidnus disnrst rcconm bcjrof tpzhdo ncxc yjws jnmdmty. Dkmiwza ibudbufrnh ndmcpz tomdyh oqoonsn jhoy rueieihtt vsrjpudcm sotfqsfyv mjeat shnqmslfo oirnzu cru qmpt ggvgxwv jbu kjde. Kzegfq kigj dtzdd ngtytgm comwwoox fgtee ywdrnbam utu nyvlyiv tubouw lezpkmyq fkoa jlygdgf pgv gyerges wbykcxhwe bcpmt beqtkq. Mfxcqyh vhvpovktvl hrmsgfxnt jmnhyndk qohnlmgc sicmlnsq nwku dxtbmwrta omikpmajv qda qrn cwoyfaykxa xqnbv bwbnyov hbrskzt. Pdfqwzpb hypvtknt bovxx noramu xhzam kfb ympmebhqxw gbtaszonqo zmsdgcku mjkjc widrymjzj nytudruhfr uudsitbst cgmwewxpi bye. Eyseox wyef ikdnws weoyof dqecfwokkv svyjdyulk glusauosnu achmrakky kdcfp kujrqcq xojqbxrp mpfv vmw tahxtnw fhe lcitj."
    
    Random.paragraph(2)
    // => "Dlpec hnwvovvnq slfehkf zimy qpxqgy vwrbi mok wozddpol umkek nffjcmk gnqhhvm ztqkvjm kvukg dqubvqn xqbmoda. Vdkceijr fhhyemx hgkruvxuvr kuez wmkfv lusfksuj oewvvf cyw tfpo jswpseupm ypybap kwbofwg uuwn rvoxti ydpeeerf."
    
    Random.paragraph(1, 3)
    // => "Qdgfqm puhxle twi lbeqjqfi bcxeeecu pqeqr srsx tjlnew oqtqx zhxhkvq pnjns eblxhzzta hifj csvndh ylechtyu."

#### Random.sentence(len)

* Random.sentence()
* Random.sentence(len)
* Random.sentence(min, max)

随机生成一个句子，第一个的单词的首字母大写。

**参数的含义和默认值**如下所示：

* 参数 len：可选。指示句子中单词的个数。默认值为 12 到 18 之间的随机数。
* 参数 min：可选。指示句子中单词的最小个数。默认值为 12。
* 参数 max：可选。指示句子中单词的最大个数。默认值为 18。

**使用示例**如下所示：

    Random.sentence()
    // => "Jovasojt qopupwh plciewh dryir zsqsvlkga yeam."
    Random.sentence(5)
    // => "Fwlymyyw htccsrgdk rgemfpyt cffydvvpc ycgvno."
    Random.sentence(3, 5)
    // => "Mgl qhrprwkhb etvwfbixm jbqmg."

#### Random.word(len)

* Random.word()
* Random.word(len)
* Random.word(min, max)

随机生成一个单词。

**参数的含义和默认值**如下所示：

* 参数 len：可选。指示单词中字符的个数。默认值为 3 到 10 之间的随机数。
* 参数 min：可选。指示单词中字符的最小个数。默认值为 3。
* 参数 max：可选。指示单词中字符的最大个数。默认值为 10。

**使用示例**如下所示：

    Random.word()
    // => "fxpocl"
    Random.word(5)
    // => "xfqjb"
    Random.word(3, 5)
    // => "kemh"

> 目前单词中的字符是随机的小写字母，未来会根据词法生成“可读”的单词。

#### Random.title(len)

* Random.title()
* Random.title(len)
* Random.title(min, max)

随机生成一句标题，其中每个单词的首字母大写。

**参数的含义和默认值**如下所示：

* 参数 len：可选。指示单词中字符的个数。默认值为 3 到 7 之间的随机数。
* 参数 min：可选。指示单词中字符的最小个数。默认值为 3。
* 参数 max：可选。指示单词中字符的最大个数。默认值为 7。

**使用示例**如下所示：

    Random.title()
    // => "Rduqzr Muwlmmlg Siekwvo Ktn Nkl Orn"
    Random.title(5)
    // => "Ahknzf Btpehy Xmpc Gonehbnsm Mecfec"
    Random.title(3, 5)
    // => "Hvjexiondr Pyickubll Owlorjvzys Xfnfwbfk"

### Name

#### Random.first()

* Random.first()

随机生成一个常见的英文名。

**使用示例**如下所示：

    Random.first()
    // => "Nancy"

#### Random.last()

* Random.last()

随机生成一个常见的英文姓。

**使用示例**如下所示：

    Random.last()
    // => "Martinez"

#### Random.name()

* Random.name()
* Random.name(middle)

随机生成一个常见的英文姓名。

**参数的含义和默认值**如下所示：

* 参数 middle：可选。布尔值。指示是否生成中间名。

**使用示例**如下所示：

    Random.name()
    // => "Larry Wilson"
    Random.name(true)
    // => "Helen Carol Martinez"

#### Random.chineseName()

* Random.chineseName()
* Random.chineseName(count)

随机生成一个常见的中文姓名。

**参数的含义和默认值**如下所示：

* 参数 count：可选。数字。指示姓名的字数，默认为 2 个或 3 个字的随机姓名。

**使用示例**如下所示：

    Random.chineseName()
    // => "林则徐"
    Random.chineseName(2)
    // => "马云"

> `Random.chineseName()` 可以简写为 `Random.cname()`。从 Mock 0.2 开始，将只保留 `Random.cname()`。

### Web

#### Random.url()

* Random.url()

随机生成一个 URL。

**使用示例**如下所示：

    Random.url()
    // => "http://vrcq.edu/ekqtyfi"

#### Random.domain()

* Random.domain()

随机生成一个域名。

**使用示例**如下所示：

    Random.domain()
    // => "kozfnb.org"

#### Random.email()

* Random.email()

随机生成一个邮件地址。

**使用示例**如下所示：

    Random.email()
    // => "x.davis@jackson.edu"

#### Random.ip()

* Random.ip()

随机生成一个 IP 地址。

**使用示例**如下所示：

    Random.ip()
    // => "34.206.109.169"

#### Random.tld()

* Random.tld()

随机生成一个顶级域名。

**使用示例**如下所示：

    Random.tld()
    // => "net"

### Address

#### Random.area()

* Random.area()

随机生成一个（中国）大区。

**使用示例**如下所示：

    Random.area()
    // => "华北"

#### Random.region()

* Random.region()

随机生成一个（中国）省（或直辖市、自治区、特别行政区）。

**使用示例**如下所示：

    Random.region()
    // => "辽宁省"

### Miscellaneous

#### Random.guid()

* Random.guid()

随机生成一个 GUID。

**使用示例**如下所示：

    Random.guid()
    // => "662C63B4-FD43-66F4-3328-C54E3FF0D56E"

#### Random.id()

* Random.id()

随机生成一个 18 位身份证。

**使用示例**如下所示：

    Random.id()
    // => "420000200710091854"

#### Random.increment(step)

生成一个全局的自增整数。

* Random.increment(step)

参数的含义和默认值如下所示：

* 参数 step：可选。整数自增的步长。默认值为 1。

使用示例如下所示：

    Random.increment()
    // => 1
    Random.increment(100)
    // => 101
    Random.increment(1000)
    // => 1101


---

## 感谢

最初的灵感来自 [Angry Birds of JavaScript- Green Bird: Mocking Introduction](http://www.elijahmanor.com/angry-birds-of-javascript-green-bird-mocking/)，语法参考了 [mockJSON](https://github.com/mennovanslooten/mockJSON)，随机数据参考了 [Chance.js](http://chancejs.com/)。

<!-- 灵感来自 [Elijah Manor])(http://elijahmanor.com/) 的系列博文 [Angry Birds of JavaScript Series](http://www.elijahmanor.com/angry-birds-of-javascript-series/) 中的 [Angry Birds of JavaScript- Green Bird: Mocking Introduction](http://www.elijahmanor.com/angry-birds-of-javascript-green-bird-mocking/) -->