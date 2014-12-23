/* global define */
define(
    [
        'mock/util',
        './basic', './date', './image', './color', './text', './name', './web', './address', './helper', './misc'
    ],
    function(
        Util,
        Basic, Date, Image, Color, Text, Name, Web, Address, Helper, Misc

    ) {
        /*
            ### Mock.Random
            
            Mock.Random 是一个工具类，用于生成各种随机数据。Mock.Random 的方法在数据模板中称为“占位符”，引用格式为 `@占位符(参数 [, 参数])` 。例如：

                var Random = Mock.Random;
                Random.email()
                // => "n.clark@miller.io"
                Mock.mock('@EMAIL')
                // => "y.lee@lewis.org"
                Mock.mock( { email: '@EMAIL' } )
                // => { email: "v.lewis@hall.gov" }

            可以在上面的例子中看到，直接调用 'Random.email()' 时方法名 `email()` 是小写的，而数据模板中的 `@EMAIL` 却是大写。这并对数据模板中的占位符做了特殊处理，也非强制的编写方式，事实上在数据模板中使用小写的 `@email` 也可以达到同样的效果。不过，这是建议的编码风格，以便在阅读时从视觉上提高占位符的识别率，快速识别占位符和普通字符。

            在浏览器中，为了减少需要拼写的字符，Mock.js 把 Mock.Random 暴露给了 window 对象，使之称为全局变量，从而可以直接访问 Random。因此上面例子中的 `var Random = Mock.Random;` 可以省略。在后面的例子中，也将做同样的处理。

            > 在 Node.js 中，仍然需要通过 `Mock.Random` 访问。

            Mock.Random 中的方法与数据模板的 `@占位符` 一一对应，在需要时可以为 Mock.Random 扩展方法，然后在数据模板中通过 `@扩展方法` 引用。例如：
            
                Random.extend({
                    xzs: [], // 十二星座？程序员日历？
                    xz: function(date){
                        return ''
                    }
                })
                Random.xz()
                // => ""
                Mock.mock('@XZ')
                // => ""
                Mock.mock({ xz: '@XZ'})
                // => ""
            
            Mock.js 的 [在线编辑器](http://mockjs.com/mock.html) 演示了完整的语法规则和占位符。

            下面是 Mock.Random 内置支持的方法说明。

            （功能，方法签名，参数说明，示例）
        */

        var Random = {
            extend: Util.extend
        }

        Random.extend(Basic)
        Random.extend(Date)
        Random.extend(Image)
        Random.extend(Color)
        Random.extend(Text)
        Random.extend(Name)
        Random.extend(Web)
        Random.extend(Address)
        Random.extend(Helper)
        Random.extend(Misc)
        
        return Random
    }
)