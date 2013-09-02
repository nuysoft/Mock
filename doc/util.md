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