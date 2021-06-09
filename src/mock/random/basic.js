/*
    ## Basics
*/
import { integer, natural } from "./basic/number.js";
import { boolean } from "./basic/boolean.js";
import { character } from "./basic/character.js";
import { string } from "./basic/string.js";
import { range } from "./basic/range.js";
import { float } from "./basic/float.js";
export default {
    // 返回一个随机的布尔值。
    boolean,
    bool: boolean,
    integer,
    int: integer,
    // 返回一个随机的自然数（大于等于 0 的整数）。
    natural,

    // 返回一个随机的浮点数。
    float,
    // 返回一个随机字符。
    character,
    char: character,
    // 返回一个随机字符串。
    string,
    str: string,
    // 返回一个整型数组。
    range,
};
