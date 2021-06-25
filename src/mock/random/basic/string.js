import { natural } from "./number.js";
import { times } from "lodash-es";
import { character } from "./character.js";
const string = function (...args) {
    var len, pool, min, max;
    switch (args.length) {
        case 0: // ()
            len = natural(3, 7);
            break;
        case 1: // ( length )
            [len] = args;
            break;
        case 2:
            // ( pool, length )
            if (typeof arguments[0] === "string") {
                [pool, len] = args;
            } else {
                // ( min, max )
                [min, max] = args;
                len = natural(min, max);
            }
            break;
        case 3:
            // (pool,min,max)
            [pool, min, max] = args;
            len = natural(min, max);
            break;
    }
    return times(len, () => character(pool)).join("");
};
export { string, string as str };
