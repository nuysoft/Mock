import * as RE from '../regexp/index.js';

export function regexp({ rule: { count }, template: { source } }) {
    // 'name': /regexp/,
    // 'name|1-5': /regexp/,
    const Source = count === undefined ? source : Array(count).fill(source).join('');
    return RE.Handler.gen(RE.Parser.parse(Source));
}
