import resolve from 'rollup-plugin-node-resolve'; // 帮助寻找node_modules里的包
import commonjs from 'rollup-plugin-commonjs'; // 将非ES6语法的包转为ES6可用

import json from '@rollup/plugin-json';

export default {
    input: './src/mock.js', // 打包入口
    output: {
        // 打包出口
        file: './dist/mock.cjs.js',
        format: 'cjs',
        name: 'Mock',
        exports: 'auto',
        external: ['crypto'],
        globals: {
            window: 'window', // 告诉rollup 全局变量$即是jquery
            crypto: 'crypto',
        },
    },
    plugins: [
        json(),
        resolve({
            jsnext: true,
            main: true,
            browser: false,
        }),
        commonjs({
            // non-CommonJS modules will be ignored, but you can also
            // specifically include/exclude files
            include: ['node_modules/**', './src/**'], // Default: undefined
            ignoreGlobal: true,
            sourceMap: false, // Default: true
        }), // 将 CommonJS 转换成 ES2015 模块供 Rollup 处理
    ],
};
