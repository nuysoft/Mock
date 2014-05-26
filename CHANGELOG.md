# Changelog

### 2014.5.26 V0.1.2

1. [!] 重构 Mock.mockjax()
2. [!] 更新 package.json/devDependencies
3. [+] 增加 懒懒交流会 PPT

### 2014.5.9 V0.1.2
1. [+] 支持 [`Mock.mock(rurl, rtype, template)`](http://mockjs.com/#mock)
2. [+] 支持 [`'name|min-max': {}`、`'name|count': {}`](http://mockjs.com/#语法规范)
3. [+] 支持 [`'name': function(){}`](http://mockjs.com/#语法规范)
4. [+] 新增占位符 [@NOW](http://mockjs.com/#now)
5. [+] 更新了 [语法规范](http://mockjs.com/#语法规范)

### 2013.9.6
1. 增加占位符 @DATAIMAGE
2. 解析占位符时**完全**忽略大小写

### 2013.9.3
1. 文档增加用法示例：Sea.js (CMD)、RequireJS (AMD)
2. 增加对 CMD 规范的支持
3. 生成 SourceMap 文件 `dist/mock-min.map`

### 2013.8.21
1. 100% 基于客户端模板生成模拟数据，支持 KISSY XTemplate。
1. 调整文件结构。

### 2013.8.11
1. 80% 基于客户端模板生成模拟数据。
1. 完善针对 KISSY XTemplate 的测试用例 [test/mock4tpl-xtpl-node.js](test/mock4tpl-xtpl-node.js)。
1. [Mock4Tpl](src/tpl/mock4tpl.js) 支持 Partials。
1. Mock 支持转义 @。
1. 更新 README.md，增加对 Mock4Tpl 的说明。
1. 完善 [demo](demo/)。
1. 减少 Mock、Mock4Tpl 暴漏的 API。

### 2013.8.7
1. 75% 基于客户端模板生成模拟数据。
1. 完善测试用例 [test/mock4tpl-node.js](test/mock4tpl-node.js)。
1. 重构文件和目录结构，把代码模块化。
1. 参考 Handlebars.js，引入 Jison 生成模板解析器。

#### 2013.8.2
1. 60% 基于客户端模板生成模拟数据。
1. 增加测试用例 [test/mock4tpl-node.js](test/mock4tpl-node.js)，参考自 <http://handlebarsjs.com/>。

#### 2013.7.31
1. 50% 基于客户端模板生成模拟数据。

#### 2013.7.18
1. 增加占位符 @COLOR。
1. 完善对占位符的解析，过滤掉 `#%&()?/.`。
1. 对“支持的占位符”分组。

#### 2013.7.12
1. Mock.mock(rurl, template) 的参数 rurl 可以是字符串或正则。
1. 把产生随机元数据的接口封装到 Mock.Random 中。
1. 增加对日期的格式化。
1. 增加占位符 @IMG、@PARAGRAPH、@SENTENCE、@WORD、@FIRST、@LAST、@NAME、@DOMAIN、@EMAIL、@IP、@ID。
1. 支持嵌套的占位符，例如 `@IMG(@AD_SIZE)`。
1. 支持把普通属性当作占位符使用，例如 `@IMG(@size)`。