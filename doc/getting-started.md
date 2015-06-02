<!-- ## Mock.js -->

<h2 class="hide" href="#">Mock.js</h2>
<img class="hide" src="mockjs.png" wid>

<h1 style="color: #428BCA; margin-bottom: 30px;">
    <i class="iconlogo" style="font-size: 80px;">&#x3435;</i>
    <span>Mock.js</span>
</h1>

[![Build Status](https://api.travis-ci.org/nuysoft/Mock.png?branch=master)](http://travis-ci.org/nuysoft/Mock)
<!-- [![GitHub version](https://badge.fury.io/gh/nuysoft%2FMock.png)](http://badge.fury.io/gh/nuysoft%2FMock) -->
<!-- [![NPM version](https://badge.fury.io/js/mockjs.png)](http://badge.fury.io/js/mockjs) -->
<!-- [![Bower version](https://badge.fury.io/bo/mockjs.png)](http://badge.fury.io/bo/mockjs) -->
[![Views in the last 24 hours](https://sourcegraph.com/api/repos/github.com/nuysoft/Mock/counters/views-24h.png)](https://github.com/nuysoft/Mock/)

Mock.js 是一款<!-- 有用且好用的  -->模拟数据生成器，旨在帮助前端攻城师独立于后端进行开发，帮助编写单元测试。提供了以下模拟功能：

* 根据数据模板生成模拟数据
* 模拟 Ajax 请求，生成并返回模拟数据
* 基于 HTML 模板生成模拟数据

## 在线编辑器 
<!-- 没有 Live Demo 的库都是耍流氓  -->

* [数据模板编辑器](./editor.html#help)
* [Handlebars &amp; Mustache](./demo/mock4tpl.html)
* [KISSY XTemplate](./demo/mock4xtpl.html)

## 下载

<p>
    <a href="./dist/mock.js" class="btn btn-success w250">
        Development Version (0.1.10)
    </a> - <i>73kB, Uncompressed</i>
</p>
<p>
    <a href="./dist/mock-min.js" class="btn btn-primary w250">
        Production Version (0.1.10)
    </a> - <i>32kB, Minified</i>
</p>
<p>
    <a href="https://github.com/nuysoft/Mock" class="btn btn-default w250">
        从 Github 获取最新版本
    </a> - <i>Unreleased</i>
</p>

<iframe src="http://ghbtns.com/github-btn.html?user=nuysoft&repo=Mock&type=watch&count=true&size=large"
  allowtransparency="true" frameborder="0" scrolling="0" width="131" height="30"></iframe>

<iframe src="http://ghbtns.com/github-btn.html?user=nuysoft&repo=Mock&type=fork&count=true&size=large"
  allowtransparency="true" frameborder="0" scrolling="0" width="140" height="30"></iframe>

<!-- <iframe src="http://ghbtns.com/github-btn.html?user=nuysoft&type=follow&count=true&size=large"
  allowtransparency="true" frameborder="0" scrolling="0" width="165" height="30"></iframe> -->

## 分享文档

* [懒懒交流会 2014.5.30](/doc/lanlan.html)

## 用法

### 浏览器

<iframe width="100%" height="200" src="http://jsfiddle.net/DgJrj/embedded/html,js,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

### Node (CommonJS)

    // 安装
    npm install mockjs
    
    // 使用
    var Mock = require('mockjs');
    var data = Mock.mock({
        'list|1-10': [{
            'id|+1': 1
        }]
    });
    console.log(JSON.stringify(data, null, 4))

### Bower

<!-- If you'd like to use [bower](http://bower.io/), it's as easy as: -->
    
    npm install -g bower
    bower install --save mockjs
    
    <script type="text/javascript" src="./bower_components/mockjs/dist/mock.js"></script>


### RequireJS (AMD)

<iframe width="100%" height="350" src="http://jsfiddle.net/uTSqT/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

### Sea.js (CMD)

<iframe width="100%" height="350" src="http://jsfiddle.net/5jX6e/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

### KISSY

<iframe width="100%" height="400" src="http://jsfiddle.net/En2sX/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

<!-- 
Mock.js 已入驻 [KISSY Gallery](https://github.com/kissygalleryteam)，阿里同学可以直接加载 `gallery/Mock/0.1.1/index`：

<iframe width="100%" height="400" src="http://jsfiddle.net/8VNQQ/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>
-->

### Random CLI

    // 安装
    npm install mockjs -g

    // 执行
    $ random url
    // => http://rmcpx.org/funzwc

---