import resolve from "rollup-plugin-node-resolve"; // 帮助寻找node_modules里的包
import commonjs from "rollup-plugin-commonjs"; // 将非ES6语法的包转为ES6可用
import liver from "rollup-plugin-livereload";
import json from "@rollup/plugin-json";

export default {
    input: "./src/mock.js", // 打包入口
    output: [
        {
            // 打包出口
            dir: "./dist",
            format: "es",
        },
        {
            // 打包出口
            file: "./dist/mock.min.js",
            format: "iife",
            name: "Mock",
        },
    ],
    plugins: [
        json(),
        resolve({
            jsnext: true,
            main: true,
            browser: true,
        }),
        commonjs({
            // non-CommonJS modules will be ignored, but you can also
            // specifically include/exclude files
            include: ["node_modules/**", "./src/**"], // Default: undefined
            ignoreGlobal: false,
            sourceMap: false, // Default: true
        }), // 将 CommonJS 转换成 ES2015 模块供 Rollup 处理
        liver(),
    ],
};
