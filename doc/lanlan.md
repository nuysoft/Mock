title: Mock.js
author:
  name: 墨智 / 高云
  email: mozhi.gyy@alibaba-inc.com
  url: http://nuysoft.com
output: lanlan.html
controls: true

--

<!-- 
    随堂问题：

    我在分享的过程中会做一些提问和调查，需要各位的配合，我会根据你们的回答调整分享的内容。

    * 使用过 Mock.js 的请举一下手
    * 使用过 RAP（阿里妈妈）、IF（天猫）、中途岛（淘宝）、River（集团）之一的请举一下手
    * 了解过 http://json-schema.org/ 的请举一下手
    * 访问过 http://www.json-generator.com/ 的请举一下手

 -->

<style type="text/css">
    @font-face {
        font-family: 'logo';
        src: url('../demo/assets/font_1390195988_9420388.eot'); /* IE9*/
        src: url('../demo/assets/font_1390195988_9420388.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
        url('../demo/assets/font_1390195989_0386753.woff') format('woff'), /* chrome、firefox */
        url('../demo/assets/font_1390195988_7969282.ttf') format('truetype'), /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
        url('../demo/assets/font_1390195989_0668917.svg#svgFontName') format('svg'); /* iOS 4.1- */
    }
    .iconlogo {
        font-family: "logo";
        font-size: 120%;
        font-style: normal;
        font-weight: normal;
        font-variant: normal;
        display: inline-block;
        speak: none;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    .mock_color {
        color:#428BCA;
    }
    .about_logo .citun {
        width: 49%;
    }
    .dependencies img { 
        max-height: 100px; 
        padding: 18px;
    }
    .dependencies .text {
        display: inline-block;
        height: 100px;
        padding: 18px;
        text-align: center;
        min-width: 100px;
    }
    .mr10 {
        margin-right: 10px;
    }
    .mb10 {
        margin-bottom: 10px;
    }
    .mt20 {
        margin-top: 20px;
    }
    .ml20 {
        margin-left: 20px;
    }
</style>

<h1 class="mock_color">
    <i class="iconlogo">&#x3435;</i>
    <span>Mock.js</span>
</h1>

## 生成模拟数据

<div style="text-align: center; font-size: 18px; margin-top: 36px;">
    <div style="margin-bottom: 4px;">墨智 / 高云</div>
    <div style="margin-bottom: 4px;">[mozhi.gyy@alibaba-inc.com](mailto:mozhi.gyy@alibaba-inc.com)</div>
    <div style="margin-bottom: 4px;"><https://github.com/nuysoft/Mock></div>
    <div style="margin-bottom: 4px;"><http://mockjs.com></div>
    <div>
        <iframe data-src="http://ghbtns.com/github-btn.html?user=nuysoft&repo=Mock&type=watch&count=true&size=large" allowtransparency="true" frameborder="0" scrolling="0" width="131" height="30"></iframe>
        <iframe data-src="http://ghbtns.com/github-btn.html?user=nuysoft&repo=Mock&type=fork&count=true&size=large"allowtransparency="true" frameborder="0" scrolling="0" width="140" height="30"></iframe>
    </div>
</div>

--

### <i class="iconlogo mock_color">&#x3435;</i>

<p class="about_logo">
    <img class="citun" src="../demo/assets/citun_1.jpg" alt="">
    <img class="citun" src="../demo/assets/citun_2.jpg" alt="">
</p>

*蓝色 Logo 出自设计师 @山峰，图片来自 [刺豚_百度百科](http://baike.baidu.com/view/260039.htm)。*

<!--  -->

--

<style>
    .question {
        font-size: 250%;
        font-weight: bold;
    }
</style>

### 开始之前

[mockjs.com](http://mockjs.com/)

[![](../demo/assets/doc.png)](/doc/lanlan.html)

<!-- 数据模板编辑器 -->

--

### 开始之前 - ？

<p class="question">Mock.js</p>

--

### 开始之前 - ？

<p class="question">RAP、IF、River、中途岛</p>

--

### 开始之前 - ？

<p class="question">[json-schema.org](http://json-schema.org/)</p>

--

### 开始之前 - ？

<p class="question">[json-generator.com](http://www.json-generator.com/)</p>

--

### 内容

* Mock.js 是什么
    <!-- 
    * 模拟数据生成器
    * 定位：HTML CSS JavaScript Data
    * 问题：定位、缘起、静态数据、动态数据、拦截请求
    * 升华：
    * 
     -->
* 快速开始
* 数据模板
* 数据占位符
* 未来规划
* 问答

--

### Mock.js 是什么

<span class="label label-default name">HTML</span>

    <a class="url" href="url">{{url}}</a>

<span class="label label-default name">CSS</span>

    .url { color: #428BCA; }

--

### Mock.js 是什么

<span class="label label-default name">JS</span>

    $('.url').on('mouseenter', function(event){ })

<span class="label label-default name">DATA</span>

    { url: 'http://mockjs.com' }

<span class="label label-danger">Warning</span> 数据是必不可少的一环，但解决方案很少

--

### Mock.js 是什么

<span class="label label-default name">AJAX</span>
    
    $.ajax({
        url: '...',
        sucess: function(data, status, xhr){
            // ...
        }
    })

<span class="label label-danger">Warning</span> 如果接口不稳定，怎么办？

--

### Mock.js 是什么

    var data = {
        list: [
            { "id": 1, "name": "Jennifer Allen" },
            { "id": 2, "name": "Donna Lopez" },
            { "id": 3, "name": "Edward Davis" }
        ]
    }
    function sucess(data, status, xhr) { ... }

    // $.ajax({ ... })
    sucess(data)

--

### Mock.js 是什么

<span class="label label-danger mr10 mb10">Warning</span> 制造静态数据很无趣，例如可能很长

<span class="label label-danger mr10 mb10">Warning</span> 静态数据的类型很多，例如图片

<span class="label label-danger mr10 mb10">Warning</span> 需要修改既有代码

<span class="label label-danger mr10 mb10">Warning</span> 测试用例单一

--

### Mock.js 是什么

<span class="label label-success mr10 mb10">期望1</span> 生成随机数据

<span class="label label-success mr10 mb10">期望2</span> 拦截 Ajax 请求

--

### Mock.js 是什么

<span class="label label-success mr10 mb10">期望3</span> 开发无侵入

<span class="label label-success mr10 mb10">期望4</span> 引入方便，用法简单

<span class="label label-success mr10 mb10">期望5</span> 数据类型丰富

<span class="label label-success mr10 mb10">期望6</span> 符合直觉的接口

<span class="label label-success mr10 mb10">期望7</span> 一目了然的文档

--

### Mock.js 是什么

# <span class="label label-success mr10 mb10">可用</span> <span class="label label-success mr10 mb10">好用</span>

--

### Mock.js 是什么

一款模拟数据生成器。

<span class="label label-success mr10 mb10">功能 1</span> 基于 数据模板 生成 模拟数据

<span class="label label-success mr10 mb10">功能 2</span> 类型丰富的 随机数据

<span class="label label-success mr10 mb10">功能 3</span> 模拟 Ajax 请求

<span class="label label-success mr10 mb10">功能 4</span> ~~基于 HTML 模板生成模拟数据~~

--

### Mock.js 是什么

<span class="label label-primary mr10 mb10">价值 1</span> 前端攻城师独立于后端进行开发

<span class="label label-primary mr10 mb10">价值 2</span> 提高单元测试覆盖率

--

### 快速开始

<span class="label label-success mr10 mb10">第 1 步</span> 安装 Mock.js

    npm install bower -g
    bower install mockjs --save

<span class="label label-success mr10 mb10">第 2 步</span> 引入 Mock.js

    <script src="./bower_components/mockjs/dist/mock.js"></script>

--

### 快速开始

<span class="label label-success mr10 mb10">第 3 步</span> 调用 `Mock.mock( template )` 生成模拟数据

    var data = Mock.mock({
        'list|1-10': [{
            'id|+1': 1
        }]
    })
    console.log(
        JSON.stringify(data, null, 4)
    )

--

### 快速开始

<span class="label label-success mr10 mb10">生成的模拟数据</span>

    {
        "list": [
            { "id": 1 },
            { "id": 2 },
            { "id": 3 },
            { "id": 4 }
        ]
    }

--

### 快速开始

<span class="label label-success">第 3 步</span> 调用 `Mock.mock( url, template )` 拦截 Ajax

    Mock.mock('hello.json', {
        'list|1-10': [{
            'id|+1': 1
        }]
    })

--

### 快速开始

<span class="label label-success mr10 mb10">发起 Ajax 请求</span>

    $.ajax({
        url: 'hello.json',
        dataType: 'json'
    }).done(function(data, status, xhr){
        console.log(
            JSON.stringify(data, null, 4)
        )    
    })

--

### 快速开始

<span class="label label-success mr10 mb10">响应的模拟数据</span>

    {
        "list": [
            { "id": 1 },
            { "id": 2 },
            { "id": 3 },
            { "id": 4 },
            { "id": 5 }
        ]
    }

--

### 数据模板

每个属性由 <span class="label label-success">3</span> 部分构成：

    // 属性名   name
    // 生成规则 rule
    // 属性值   value
    'name|rule': value

--

### 数据模板

<style>
    .dtd .label-primary {
        display: inline-block;
        width: 131px;
        line-height: 1.2;
    }
</style>

<p class="dtd">
    <span class="label label-primary mr10 mb10">String</span>
    <span class="label label-success mr10 mb10">'name|min-max': 'value'</span>
</p>
<p class="dtd">
    <span class="label label-primary mr10 mb10">Number</span>
    <span class="label label-success mr10 mb10">'name|min-max.dmin-dmax': value</span>
</p>
<p class="dtd">
    <span class="label label-primary mr10 mb10">Boolean</span>
    <span class="label label-success mr10 mb10">'name|min-max': value</span>
</p>

--

### 数据模板

<p class="dtd">
    <span class="label label-primary mr10 mb10">Object</span>
    <span class="label label-success mr10 mb10">'name|min-max': {}</span>
</p>
<p class="dtd">
    <span class="label label-primary mr10 mb10">Array</span>
    <span class="label label-success mr10 mb10">'name|min-max': [{}, {} ...]</span>
</p>
<p class="dtd">
    <span class="label label-primary mr10 mb10">Function</span>
    <span class="label label-success mr10 mb10">'name': function(){}</span>
</p>

--

### 数据占位符

格式：

    @占位符
    @占位符(参数 [, 参数])

与 <span class="label label-success mb10">Mock.Random</span> 中的方法一一对应

--

### 数据占位符

<style>
    .dpd .label-primary {
        display: inline-block;
        width: 26%;
        line-height: 1.2;
    }
</style>

<span class="label label-success mb10">Mock.Random</span>

<p class="dpd">
    <span class="label label-primary mr10 mb10">Basics</span>
    <span class="label label-primary mr10 mb10">Image</span>
    <span class="label label-primary mr10 mb10">Color</span>
    <span class="label label-primary mr10 mb10">Text</span>
    <span class="label label-primary mr10 mb10">Name</span>
    <span class="label label-primary mr10 mb10">Web</span>
    <span class="label label-primary mr10 mb10">Address</span>
    <span class="label label-primary mr10 mb10">Miscellaneous</span>
    <span class="label label-primary mr10 mb10">Helpers</span>
</p>

--

### 数据占位符

<span class="label label-success mb10">Mock.Random.extend()</span>

    Mock.Random.extend({
        hero: function() {
            return this.pick([
                '盖伦 德玛西亚',
                '艾希 寒冰射手',
                '瑞兹 流浪法师'
            ])
        }
    })

--

### 数据占位符

<span class="label label-success mb10">Mock.Random.extend()</span>

    Mock.Random.hero()
    // => "艾希 寒冰射手"

    Random.hero()
    // => "瑞兹 流浪法师"

--

### 数据占位符

<span class="label label-success mb10">Mock.Random.extend()</span>

    Mock.mock('@hero')
    // => "瑞兹 流浪法师"

    Mock.mock({
      free: '@hero'
    })
    // => { free: "盖伦 德玛西亚"}

--

### 阿里妈妈的实践

<span class="label label-success mr10 mb10">集中管理数据模板</span>
    
    KISSY.add("app/models/data", function(S, Mock) {

        Mock.mock('foo.json', { ... })
        Mock.mock('bar.json', { ... })
        Mock.mock('faz.json', { ... })

    }, {
        requires: ['components/mock/index']
    })

--

### 阿里妈妈的实践

<span class="label label-success mr10 mb10">根据 URL 中是否含有参数 mock 动态加载数据模板</span>
    
    // http://host:port?mock
    var mock = ~location.search.indexOf('mock')
    if(mock) KISSY.use('app/models/data')

<!-- 
    // protocol://host:port/pathname?search&mock
    // http://host:port/index.html?mock
 -->

--

### 未来规划

1. 基于 模板 校验 数据
    
    <span class="label label-success mr10 mb10">Mock.valid(template, data)</span>

2. 基于 正则 生成 数据
    
    <span class="label label-success mr10 mb10">Mock.mock( regexp )</span>
--

### 回顾一下

* Mock.js 是什么
* 数据模板
* 数据占位符

> 只做一件事，并做好。——《Unix 编程艺术》

--

### 问答

1. 你如何看待 JSON Schema？

    看上去很美。

2. Mock.js 如何协同 RAP（阿里妈妈）、IF（天猫）、中途岛（淘宝）、River（集团）？

    目前 RAP、中途岛、River 基于 Mock.js 生成随机数据。

--
### 问答

<p class="mock_color" style="position: relative; text-align: center;">
    <i class="iconlogo" style="font-size: 1000%;">&#x3435;</i>
    <span style="position: absolute; left: 40%; top: 5%; font-size: 200%;">？</span>
</p>

--

<h1 class="mock_color">求 Star</h1>

--

### 没有了

<p style="text-align: center; font-size: 64px;">谢谢各位的聆听</p>

无论您对模拟数据有什么见解，或者对 Mock.js 有什么建议，或者遇到什么不爽的地方，欢迎来 [砸砖](https://github.com/nuysoft/Mock/issues/) 和 [交流](mailto:nuysoft@gmail.com)。




<style>
table {
  max-width: 100%;
  background-color: transparent;
}

th {
  text-align: left;
}

.table {
  width: 100%;
  margin-bottom: 20px;
}

.table > thead > tr > th,
.table > tbody > tr > th,
.table > tfoot > tr > th,
.table > thead > tr > td,
.table > tbody > tr > td,
.table > tfoot > tr > td {
  padding: 8px;
  line-height: 1.428571429;
  vertical-align: top;
  border-top: 1px solid #dddddd;
}

.table > thead > tr > th {
  vertical-align: bottom;
  border-bottom: 2px solid #dddddd;
}

.table > caption + thead > tr:first-child > th,
.table > colgroup + thead > tr:first-child > th,
.table > thead:first-child > tr:first-child > th,
.table > caption + thead > tr:first-child > td,
.table > colgroup + thead > tr:first-child > td,
.table > thead:first-child > tr:first-child > td {
  border-top: 0;
}

.table > tbody + tbody {
  border-top: 2px solid #dddddd;
}

.table .table {
  background-color: #ffffff;
}

.table-condensed > thead > tr > th,
.table-condensed > tbody > tr > th,
.table-condensed > tfoot > tr > th,
.table-condensed > thead > tr > td,
.table-condensed > tbody > tr > td,
.table-condensed > tfoot > tr > td {
  padding: 5px;
}

.table-bordered {
  border: 1px solid #dddddd;
}

.table-bordered > thead > tr > th,
.table-bordered > tbody > tr > th,
.table-bordered > tfoot > tr > th,
.table-bordered > thead > tr > td,
.table-bordered > tbody > tr > td,
.table-bordered > tfoot > tr > td {
  border: 1px solid #dddddd;
}

.table-bordered > thead > tr > th,
.table-bordered > thead > tr > td {
  border-bottom-width: 2px;
}

.label {
  display: inline;
  padding: .2em .6em .3em;
  /*font-size: 75%;*/
  font-weight: bold;
  line-height: 1;
  color: #ffffff;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: .25em;
}

.label[href]:hover,
.label[href]:focus {
  color: #ffffff;
  text-decoration: none;
  cursor: pointer;
}

.label:empty {
  display: none;
}

.btn .label {
  position: relative;
  top: -1px;
}

.label-default {
  background-color: #999999;
}

.label-default[href]:hover,
.label-default[href]:focus {
  background-color: #808080;
}

.label-primary {
  background-color: #428bca;
}

.label-primary[href]:hover,
.label-primary[href]:focus {
  background-color: #3071a9;
}

.label-success {
  background-color: #5cb85c;
}

.label-success[href]:hover,
.label-success[href]:focus {
  background-color: #449d44;
}

.label-info {
  background-color: #5bc0de;
}

.label-info[href]:hover,
.label-info[href]:focus {
  background-color: #31b0d5;
}

.label-warning {
  background-color: #f0ad4e;
}

.label-warning[href]:hover,
.label-warning[href]:focus {
  background-color: #ec971f;
}

.label-danger {
  background-color: #d9534f;
}

.label-danger[href]:hover,
.label-danger[href]:focus {
  background-color: #c9302c;
}
</style>

<style type="text/css">
    pre {
        padding: 0px;
    }
    .hljs {
        font-size: 200%;
    }
</style>
<link rel="stylesheet" href="../bower_components/highlightjs/styles/rainbow.css">
<script src="../bower_components/highlightjs/highlight.pack.js"></script>
<script src="../bower_components/jquery/dist/jquery.js"></script>
<script src="../dist/mock.js"></script>
<script>hljs.initHighlightingOnLoad();</script>