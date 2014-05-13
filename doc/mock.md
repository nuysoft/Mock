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


