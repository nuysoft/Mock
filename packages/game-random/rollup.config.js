import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";

export default {
    input: "./src/index.ts",
    output: [
        {
            file: `./dist/index.js`,
            format: "es",
        },
    ],
    plugins: [
        // typescript(),
        // rollupPluginDts(),
        babel({
            presets: ["@babel/typescript"],
            extensions: [".ts"],
            exclude: ["node_modules"],
        }),
        commonjs({
            extensions: [".js", ".ts"],
        }),
        nodeResolve({ extensions: [".js", ".ts"] }),
    ],
};
