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
