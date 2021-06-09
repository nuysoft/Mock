/*
    ## Mock.Random
    
    工具类，用于生成各种随机数据。
*/

import basic from "./basic";
import date from "./date";
import image from "./image";
import color from "./color";
import text from "./text";
import name from "./name";
import web from "./web";
import address from "./address";
import helper from "./helper";
import mise from "./misc";
const Random = Object.assign(
    {},
    basic,
    date,
    image,
    color,
    text,
    name,
    web,
    address,
    helper,
    mise
);
export default Random;
export { Random };
