import resolve from "rollup-plugin-node-resolve"; // 帮助寻找node_modules里的包
import commonjs from "rollup-plugin-commonjs"; // 将非ES6语法的包转为ES6可用
import { terser } from "rollup-plugin-terser";
import license from "rollup-plugin-license";
import del from "rollup-plugin-delete";
import json from "@rollup/plugin-json";
export default {
    input: "./src/mock.js", // 打包入口
    output: [
        {
            // 打包出口
            file: "./dist/mock.js",
            format: "es",
        },
        {
            // 打包出口
            file: "./dist/Mock.min.js",
            format: "iife",
            name: "Mock",
        },
    ],
    plugins: [
        del({ targets: "dist/*" }),
        json(),
        resolve({
            browser: true,
        }),
        commonjs({
            ignoreGlobal: false,
            sourceMap: false, // Default: true
        }), // 将 CommonJS 转换成 ES2015 模块供 Rollup 处理
        terser(),
        license({
            banner: {
                content: {
                    file: "./LICENSE",
                },
            },
        }),
    ],
};
