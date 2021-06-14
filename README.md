# Mockjs-esm 项目

## 简介

Mockjs-esm 是 [Mockjs](http://mockjs.com/) 的 esm 版本，由于 [Mockjs](http://mockjs.com/) 源代码实在太过久远，本人用了 4 天时间将 [Mockjs](http://mockjs.com/) 的大部分模块进行细分与简化，便于广大开发者学习。

## 与 [Mockjs](http://mockjs.com/) 的异同点

### 同

1. Mockjs-esm 沿袭 [Mockjs](http://mockjs.com/) 的所有 API，不对任何的 API 进行更改。

### 异

1. 对源代码中的大部分循环遍历逻辑进行了修改。
2. 引用 lodash 和 color 库对源代码中的随机函数和颜色转换等函数进行简化。（原作者当年是没有依靠任何库的，这一点令我很佩服）
3. 源代码打包方式改为 rollup 打包，生成 esm 版本和 iife 版本。
4. 扩充 [Mockjs](http://mockjs.com/) 的功能，比如提供 timestamp 模板等。
5. 更改随机颜色为从 [中国色](http://zhongguose.com) 中抽取一种颜色。 (中国色 数据来自于 http://zhongguose.com)
6. 删除 XHR 代理时的同步行为，这个行为已经不被浏览器所使用。

## 教程

本项目维持与 [Mockjs](http://mockjs.com/) 一致的 API，故原作者的教程是完全可以实现的。
官方网站：http://mockjs.com/

## 新的功能

1. 生成 timestamp

```js
Mock.mock('@timestamp') // 生成数字型的 timestamp
```

## 从 Mockjs 迁移到 Mockjs-esm

不用修改任何的 API ，只需要改变 Mockjs 的引用方式即可。

```html
<script src="https://cdn.jsdelivr.net/npm/mockjs-esm/dist/mock.min.js"></script>
```

## 作者的闲聊

Mockjs 无疑是一个非常优秀的开源库，这个开源库在模块化思想还没有开始流行，运用类似 jQuery 的编程结构完成了对 Mockjs 的编写，作者的功底很深厚，几乎每个代码文件都有 500 多行，大量运用函数重载，但是整个 Mockjs 的 bug 出奇的少，足见其对于整个项目的理解。

我想要对 Mockjs 进行修改的原因是我的前端爬虫项目需要一个前端的 API 后台，而 Mockjs 对 fetch 这个已经流行了很久的新 API 没有进行适配！所以我下定决心将 Mockjs 全部使用 esm 模块化的方式对源代码进行了重写，重写过程中发现了很多不严谨的地方也加以了限制，对于某些底层的繁复的代码使用 lodash 的函数进行了替代。完善后的 Mockjs 是完全可以运行在浏览器端的，而且完整地运行相应地函数。
