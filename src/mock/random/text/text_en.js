import range from "./range.js";
import { character } from "../basic.js";

// 随机生成一个句子，第一个单词的首字母大写。
function sentence(min, max) {
    var len = range(12, 18, min, max);
    let string = [...Array(len)].map(() => word()).join("");
    return capitalize(string) + ".";
}

// 随机生成一个单词。
function word(min, max) {
    var len = range(3, 10, min, max);
    return [...Array(len)].map(() => character("lower")).join("");
}

// 随机生成一段文本。
function paragraph(min, max) {
    var len = range(3, 7, min, max);
    return [...Array(len)].map((i) => sentence());
}

// 随机生成一句标题，其中每个单词的首字母大写。
function title(min, max) {
    var len = range(3, 7, min, max);
    return [...Array(len)].map(() => capitalize(word())).join("");
}
export { word, paragraph, sentence, title };
