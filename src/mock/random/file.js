// 用于生成 Blob 和 File 型数据的工具
import { type } from '../util.js';
import { word } from './text/text_en.js';
function prepare(anyData) {
    let prepared;
    switch (type(anyData)) {
        case 'array':
            prepared = anyData;
            break;
        default:
            prepared = [anyData];
    }
    return prepared;
}
export function genFile(anyData) {
    return new File(prepare(anyData), word());
}
export function genBlob(anyData) {
    return new Blob(prepare(anyData));
}
