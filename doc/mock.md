## Mock

### Mock.mock()

* Mock.mock(template) <br>根据数据模板生成模拟数据。
* Mock.mock(rurl, template) <br>记录数据模板，当拦截到匹配的 Ajax 请求时，生成并返回模拟数据。

**参数的含义和默认值**如下所示：

* 参数 rurl：可选。表示需要拦截的 URL，可以是 URL 字符串或 URL 正则。例如 `/\/domain\/list\.json/`、`'/domian/list.json'`。
* 参数 template：必须。表示数据模板，可以是对象或字符串。例如 `{ 'data|1-10':[{}] }`、`'@EMAIL'`。

**数据模板中的每个属性由 3 部分构成**，以 `'data|1-10':[{}]` 为例：

* 属性名：例如 `data`。
* 参数：指示生成数据的规则。例如 `|1-10`，指示生成的数组中含有 1 至 10 个元素。
* 属性值：表示初始值、占位符、类型。例如 `[{}]`，表示属性值一个数组，数组中的元素是 `{}`。属性值中含有占位符时，将被替换为对应的随机数据，例如 `'email': '@EMAIL'`，`'@EMAIL'`将被替换为随机生成的邮件地址。

**参数和属性值部分的语法规范和示例**如下所示：

* `'data|1-10':[{}]` 构造一个数组，含有 1-10 个元素
* `'data|1':[item, item, item]` 从数组中随机挑选一个元素做为属性值
* `'id|+1': 1` 属性 id 值自动加一，初始值为 1
* `'grade|1-100': 1` 生成一个 1-100 之间的整数
* `'float|1-10.1-10': 1` 生成一个浮点数，整数部分的范围是 1-10，保留小数点后 1-10 位小数
* `'star|1-10': '★'` 重复 1-10 次
* `'repeat|10': 'A'` 重复 10 次
* `'published|0-1': false` 随机生成一个布尔值
* `'email': '@EMAIL'` 随即生成一个 Email
* `'date': '@DATE'` 随即生成一段日期字符串，默认格式为 yyyy-MM-dd
* `'time': '@TIME'` 随机生成一段时间字符串，默认格式为 HH:mm:ss
* `'datetime': '@DATETIME'` 随机生成一段时间字符串，默认格式为 yyyy-MM-dd HH:mm:ss

Mock.js 的 [在线编辑器](./demo/mock.html) 演示了完整的语法规范和占位符。

下面是 Mock.mock() 的两种参数格式以及语法规范的使用示例：

**示例1：**Mock.mock(template)

<iframe width="100%" height="300" src="http://jsfiddle.net/Y3rg6/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

**示例2：**Mock.mock(rurl, template)

<iframe width="100%" height="300" src="http://jsfiddle.net/BeENf/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>