/*
    ## Mock.Random
    
    工具类，用于生成各种随机数据。
*/

import * as basic from "./basic";
import * as color from "./color";
import * as name from "./name";
import * as helper from "./helper";
import * as mise from "./misc";
import date from "./date";
import image from "./image";
import text from "./text";
import web from "./web";
import address from "./address";

const Random = Object.assign({}, basic, date, image, color, text, name, web, address, helper, mise);
export default Random;
export { Random };
