import { sample } from "lodash-es";
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
    return sample(pool);
};
export { character, character as char };
