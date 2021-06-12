# Mockjs-esm 项目

## 简介

Mockjs-esm 是 Mockjs 的 esm 版本，由于 Mockjs 源代码实在太过久远，本人用了 4 天时间将 Mockjs 的大部分模块进行细分与简化，便于广大开发者学习。

## 与 Mockjs 的异同点

### 同

1. Mockjs-esm 沿袭 Mockjs 的所有 API，不对任何的 API 进行更改。

### 异

1. 对源代码中的大部分循环遍历逻辑进行了修改。
2. 引用 lodash 和 color 库对源代码中的随机函数和颜色转换等函数进行简化。（原作者当年是没有依靠任何库的，这一点令我很佩服）
3. 源代码打包方式改为 rollup 打包，生成 esm 版本和 iife 版本。
4. 扩充 Mockjs 的功能，比如提供 timestamp 模板等。
