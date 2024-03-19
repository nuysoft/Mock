import { random } from 'game-random';
import { times } from 'lodash-es';
import { character } from '../basic';
import { capitalize } from '../helper';
// 随机生成一个句子，第一个单词的首字母大写。
function sentence(min = 12, max = 18) {
    switch (arguments.length) {
        case 1:
            max = min;
    }
    const len = random(min, max);
    const string = times(len, () => word()).join(' ');
    return capitalize(string) + '.';
}

// 随机生成一个单词。
function word(min = 3, max = 10) {
    switch (arguments.length) {
        case 1:
            max = min;
    }
    const len = random(min, max);
    return times(len, () => character('lower')).join('');
}

// 随机生成一段文本。
function paragraph(min = 3, max = 7) {
    switch (arguments.length) {
        case 1:
            max = min;
    }
    const len = random(min, max);
    return times(len, () => sentence()).join('\n');
}

// 随机生成一句标题，其中每个单词的首字母大写。
function title(min = 3, max = 7) {
    switch (arguments.length) {
        case 1:
            max = min;
    }
    const len = random(min, max);
    return times(len, () => word(1, 1))
        .join('')
        .toUpperCase();
}
export { word, paragraph, sentence, title };
