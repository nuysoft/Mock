# Mock - 模拟请求 & 模拟数据

## 模拟请求
通过添加前置过滤器、重写 XHR 对象，从模拟数据中读取 URL 匹配的数据。

## 模拟数据
基于一套数据模板语法，简化模拟数据的构造过程。

## DEMO & Test Case
* Demo: [demo/mock.html](https://github.com/nuysoft/Mock/blob/master/demo/mock.html)
* NodeUnit: [test/mock-node.js](https://github.com/nuysoft/Mock/blob/master/test/mock-node.js)
* QUnit: [test/mock.html](https://github.com/nuysoft/Mock/blob/master/test/mock.html), [test/mock.js](https://github.com/nuysoft/Mock/blob/master/test/mock.js)

## 依赖 & 支持
* 无依赖
* 目前支持的模块加载器：Node、SeaJS、KISSY

## API
* Mock.mock(rurl, template) - 记录数据模板，拦截到 Ajax 请求时生成模拟数据并返回。
* Mock.mock(template) - 根据数据模板生成模拟数据.

## 语法

1. 每个属性包含 3 部分：
    * 属性名
    * 参数
    * 属性值 - 表示初始值、占位符、类型。

2. 支持的语法：
    * `'data|1-10':[{}]` - 构造一个数组，含有 1-10 个元素
    * `'id|+1': 1` - 属性 id 值自动加一，初始值为 1
    * `'grade|1-100': 1` - 生成一个 1-100 之间的整数
    * `'float|1-10.1-10': 1` - 生成一个浮点数，整数部分的范围是 1-10，保留小数点后 1-10 位小数
    * `'star|1-10': '★'` - 重复 1-10 次
    * `'repeat|10': 'A'` - 重复 10 次
    * `'published|0-1': false` - 随机生成一个布尔值
    * `'email': '@EMAIL'` - 随即生成一个 Email
    * `'date': '@DATE'` - 随即生成一段日期字符串，格式为 yyyy-MM-dd
    * `'time': '@TIME(yyyy-mm-dd)'` - 随机生成一段时间字符串，格式为 HH-mm-ss

3. 支持的占位符
    * @NUMBER
    * @LETTER_UPPER
    * @LETTER_LOWER
    * @MALE_FIRST_NAME
    * @FEMALE_FIRST_NAME
    * @LAST_NAME
    * @EMAIL
    * @DATE
    * @TIME
    * @DATETIME
    * @LOREM
    * @LOREM_IPSUM

## 参考资料：
* <http://www.elijahmanor.com/2013/04/angry-birds-of-javascript-green-bird.html>
* <http://nuysoft.com/2013/04/15/angry-birds-of-javascript-green-bird-mocking/>
* <https://github.com/mennovanslooten/mockJSON>
* <https://github.com/appendto/jquery-mockjax>