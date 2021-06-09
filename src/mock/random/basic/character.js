import { natural } from "./number.js";
const pools = {
    lower: "abcdefghijklmnopqrstuvwxyz",
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    number: "0123456789",
    symbol: "!@#$%^&*()[]",
};
pools.alpha = pools.lower + pools.upper;
pools.default = pools.lower + pools.upper + pools.number + pools.symbol;

const character = function (pool = "default") {
    if (pools.hasOwnProperty(pool.toLocaleLowerCase())) {
        pool = pools[pool.toLowerCase()];
    }
    return pool.charAt(natural(0, pool.length - 1));
};
export { character };
