import { natural } from "../basic.js";
export default function range(defaultMin, defaultMax, min, max) {
    return min === undefined
        ? natural(defaultMin, defaultMax) // (min,max)
        : max === undefined
        ? min // ( min,max,len )
        : natural(parseInt(min, 10), parseInt(max, 10)); // ( min, max )
}
