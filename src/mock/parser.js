/*
    ## Parser

    解析数据模板（属性名部分）。

    * Parser.parse( name )

        ```json
        {
            parameters: [ name, inc, range, decimal ],
            rnage: [ min , max ],

            min: min,
            max: max,
            count : count,

            decimal: decimal,
            dmin: dmin,
            dmax: dmax,
            dcount: dcount
        }
        ```
 */

import Constant from './constant.js';
import { integer } from './random/index.js';
/* jshint -W041 */
export function parser(name = '') {
    if (typeof name !== 'string') name = name + '';
    const parameters = name.match(Constant.RE_KEY);

    const range = parameters && parameters[3] && parameters[3].match(Constant.RE_RANGE);
    const min = range && range[1] && parseInt(range[1], 10); // || 1
    const max = range && range[2] && parseInt(range[2], 10); // || 1
    // repeat || min-max || 1
    const count = range ? (!range[2] && parseInt(range[1], 10)) || integer(min, max) : undefined;

    const decimal = parameters && parameters[4] && parameters[4].match(Constant.RE_RANGE);
    const dmin = decimal && decimal[1] && parseInt(decimal[1], 10); // || 0,
    const dmax = decimal && decimal[2] && parseInt(decimal[2], 10); // || 0,
    // int || dmin-dmax || 0
    const dcount = decimal ? (!decimal[2] && parseInt(decimal[1], 10)) || integer(dmin, dmax) : undefined;

    const result = {
        // 1 name, 2 inc, 3 range, 4 decimal
        parameters,
        // 1 min, 2 max
        range,
        min,
        max,
        // min-max
        count,
        // 是否有 decimal
        decimal,
        dmin,
        dmax,
        dcount, // dmin-dimax
    };

    const isReturn = Object.keys(result).some((key) => key !== undefined);
    if (isReturn) return result;
    return {};
}
