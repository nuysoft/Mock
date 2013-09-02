## Mock.js

Mock.js 是一款模拟数据生成器，提供以下模拟功能：

* 根据数据模板生成模拟数据
* 模拟 Ajax 请求，生成并返回模拟数据
* 基于 HTML 模板生成模拟数据

## 在线编辑器

* [Data](./demo/mock.html)
* [Handlebars &amp; Mustache](./demo/mock4tpl.html)
* [KISSY XTemplate](./demo/mock4xtpl.html)

## 下载

<p>
    <a href="./dist/mock.js" class="btn btn-success w250">
        Development Version (0.1.1)
    </a> - <i>57kB, Uncompressed</i>
</p>
<p>
    <a href="./dist/mock-min.js" class="btn btn-primary w250">
        Production Version (0.1.1)
    </a> - <i>23kB, Minified</i>
</p>
<p>
    <a href="https://github.com/nuysoft/Mock" class="btn btn-default w250">
        从 Github 获取最新版本
    </a> - <i>Unreleased</i>
</p>

## 用法

### 浏览器

<iframe width="100%" height="200" src="http://jsfiddle.net/LyDdD/embedded/html,js,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

### Node

    // 安装
    npm install mockjs
    
    // 使用
    var Mock = require('mockjs');
    var data = Mock.mock({
        'list|1-3': [{
            'id|+1': 1
        }]
    });
    console.log(JSON.stringify(data, null, 4))

### RequireJS

todo

### Sea.js

todo

### KISSY

<iframe width="100%" height="375" src="http://jsfiddle.net/5zKvf/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>