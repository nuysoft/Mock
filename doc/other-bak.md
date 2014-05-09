# Mock - 模拟请求 & 模拟数据

## 模拟请求
通过添加前置过滤器、重写 XHR 对象，根据 URL 返回匹配的模拟数据。

## 模拟数据
基于一套数据模板语法，简化模拟数据的构造过程。

## DEMO & Test Case
* DEMO: 
    * [demo/mock.html](demo/mock.html)
    * [demo/mock4tpl.html](demo/mock4tpl.html)
    * [demo/mock4xtpl.html](demo/mock4xtpl.html)
* NodeUnit: 
    * [test/nodeuinit/mock-node.js](test/nodeuinit/mock-node.js)
    * [test/nodeuinit/mock4tpl-node.js](test/nodeuinit/mock4tpl-node.js)
    * [test/nodeuinit/mock4xtpl-node.js](test/nodeuinit/mock4xtpl-node.js)
* QUnit: 
    * [test/mock.html](test/mock.html)
    * [test/mock.js](test/mock.js)

## 依赖 & 支持
* 无依赖
* 支持的模块加载器：CommonJS、AMD、KISSY
* 可以直接在浏览器中引入


## API
* `Mock.mock(rurl, template)` 记录数据模板，当拦截到 Ajax 请求时生成模拟数据并返回。
* `Mock.mock(template)` 根据数据模板生成模拟数据。
* `Mock.Random` 生成随机元数据，参见“支持的占位符”。
* `Mock4Tpl.mock(input, options, helpers, partials)` 基于客户端模板生成模拟数据。


## 语法

#### 1. 每个属性包含 3 部分：

以 `'data|1-10':[{}]` 为例：
* 属性名 - 例如 `data`。
* 参数 - 指示生成数据的规则，例如 `|1-10`。
* 属性值 - 表示初始值、占位符、类型，例如 `[{}]`。

#### 2. 支持的语法：
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

#### 3. 支持的占位符
* @BOOL, @NATURAL, @INTEGER, @CHARACTER, @STRING
* @DATE, @TIME, @DATETIME
* @AD_SIZE, @SCREEN_SIZE, @VIDEO_SIZE, @IMG
* @COLOR
* @PARAGRAPH, @SENTENCE, @WORD
* @FIRST, @LAST, @NAME
* @DOMAIN, @EMAIL, @IP, @TLD
* @GUID, @ID

TODO: @ADDRESS, @CITY, @PHONE, @AREACODE, @STREET, @STREET_SUFFIXES, @STREET_SUFFIX, @STATES, @STATE, @ZIP
    

## 参考资料
* <http://www.elijahmanor.com/2013/04/angry-birds-of-javascript-green-bird.html>
* <http://nuysoft.com/2013/04/15/angry-birds-of-javascript-green-bird-mocking/>
* <https://github.com/mennovanslooten/mockJSON>
* <https://github.com/appendto/jquery-mockjax>
* <http://chancejs.com/>


## 2014.5.9
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
* `'star|1-10': '★'` 生成一个字符串，重复 1-10 次 `'★'`
* `'repeat|10': 'A'` 生成一个字符串，重复 10 次 `'A'`
* `'published|1-2': false` 随机生成一个布尔值，值为 false 的概率是 1/3，值为 true 的概率是 2/3
* `'email': '@EMAIL'` 随即生成一个 Email
* `'date': '@DATE'` 随即生成一段日期字符串，默认格式为 `yyyy-MM-dd`
* `'time': '@TIME'` 随机生成一段时间字符串，默认格式为 `HH:mm:ss`
* `'datetime': '@DATETIME'` 随机生成一段时间字符串，默认格式为 `yyyy-MM-dd HH:mm:ss`

Mock.js 的 [在线编辑器](./demo/mock.html) 演示了完整的语法规范和占位符。 
