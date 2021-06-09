/*
    ## Miscellaneous
*/
import { v4 as uuid } from "uuid";
import id from "./misc/id.js";
import guid from "./misc/guid.js";

/*
	生成一个全局的自增整数。
	类似自增主键（auto increment primary key）。
*/
let key = 0;
const increment = function (step) {
    return (key += +step || 1);
};
const inc = increment;

// Dice
function d4() {
    return this.natural(1, 4);
}
function d6() {
    return this.natural(1, 6);
}
function d8() {
    return this.natural(1, 8);
}
function d12() {
    return this.natural(1, 12);
}
function d20() {
    return this.natural(1, 20);
}
function d100() {
    return this.natural(1, 100);
}
export { d4, d6, d8, d12, d20, d100, guid, uuid, id, increment, inc };
