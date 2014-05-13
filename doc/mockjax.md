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