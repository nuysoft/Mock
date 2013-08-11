# Mock - 模拟请求 & 模拟数据

## 模拟请求
通过添加前置过滤器、重写 XHR 对象，从模拟数据中读取 URL 匹配的数据。

## 模拟数据
基于一套数据模板语法，简化模拟数据的构造过程。

## DEMO & Test Case
* Demo: [demo/mock.html](demo/mock.html), [demo/mock4tpl.html](demo/mock4tpl.html)
* NodeUnit: <test/mock-node.js>, <test/mock4tpl-node.js>, <test/mock4tpl-xtpl-node.js>
* QUnit: [test/mock.html](test/mock.html), [test/mock.js](test/mock.js)

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
* TODO: @ADDRESS, @CITY, @PHONE, @AREACODE, @STREET, @STREET_SUFFIXES, @STREET_SUFFIX, @STATES, @STATE, @ZIP
    

## 参考资料：
* <http://www.elijahmanor.com/2013/04/angry-birds-of-javascript-green-bird.html>
* <http://nuysoft.com/2013/04/15/angry-birds-of-javascript-green-bird-mocking/>
* <https://github.com/mennovanslooten/mockJSON>
* <https://github.com/appendto/jquery-mockjax>
* <http://chancejs.com/>


## 更新日志

#### 2013.7.12
1. Mock.mock(rurl, template) 的参数 rurl 可以是字符串或正则。
1. 把产生随机元数据的接口封装到 Mock.Random 中。
1. 增加对日期的格式化。
1. 增加占位符 @IMG、@PARAGRAPH、@SENTENCE、@WORD、@FIRST、@LAST、@NAME、@DOMAIN、@EMAIL、@IP、@ID。
1. 支持嵌套的占位符，例如 `@IMG(@AD_SIZE)`。
1. 支持把普通属性当作占位符使用，例如 `@IMG(@size)`。

#### 2013.7.18
1. 增加占位符 @COLOR。
1. 完善对占位符的解析，过滤掉 `#%&()?/.`。
1. 对“支持的占位符”分组。

#### 2013.7.31
1. 50% 基于客户端模板生成模拟数据。

#### 2013.8.2
1. 60% 基于客户端模板生成模拟数据。
1. 增加测试用例 [test/mock4tpl-node.js](test/mock4tpl-node.js)，参考自 <http://handlebarsjs.com/>。

### 2013.8.7
1. 75% 基于客户端模板生成模拟数据。
1. 完善测试用例 [test/mock4tpl-node.js](test/mock4tpl-node.js)。
1. 重构文件和目录结构，把代码模块化。
1. 参考 Handlebars.js，引入 Jison 生成模板解析器。

### 2013.8.11
1. 80% 基于客户端模板生成模拟数据。
1. 完善针对 KISSY XTemplate 的测试用例 [test/mock4tpl-xtpl-node.js](test/mock4tpl-xtpl-node.js)。
1. [Mock4Tpl](src/tpl/mock4tpl.js) 支持 Partials。
1. Mock 支持转义 @。
1. 更新 README.md，增加对 Mock4Tpl 的说明。
1. 完善 [demo](demo/)。
1. 减少 Mock、Mock4Tpl 暴漏的 API。


## 规划
1. √ 暴露产生随机元数据的接口。
1. 重构项目结构，设计更好用的 API。
1. 80% 基于客户端模板生成模拟数据。
1. 50% 提供随机图片生成服务。
1. 30% 提供自定义模板数据的保存和访问服务。
1. 提供真正的随机数。
1. 支持 UUID、SHA、MD5


## TODO
1. Handlebars vs XTemplate，测试、语法
1. √ 占位符：支持转义 `@`
1. 在测试用例增加期望的断言个数
1. {{#}} {{^}} 的冲突
1. 嵌套占位符：支持设置参数
1. 嵌套占位符：支持为不同路径设置不同的占位符
1. 增加对 URL 中参数 mock 的判断
1. 如何扩展占位符





