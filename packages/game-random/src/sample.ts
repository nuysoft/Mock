import { random } from './random';

export function sample<T>(arr: T[], seed?: string): T {
    return arr[random(0, arr.length, false, seed)];
}

function _sampleSize<T>(collection: T[], n: number, seed?: string): T[] {
    const copy = [...collection];
    if (n >= collection.length) return copy;
    if (n < 0) return [];
    const temp = [];
    while (temp.length < n) {
        const result = random(0, copy.length, seed);

        temp.push(copy.splice(result, 1)[0]);
    }
    return temp;
}

function sampleSize<T>(collection: T[], seed?: string): T[];
function sampleSize<T>(collection: T[], n?: number): T[];
function sampleSize<T>(collection: T[], n: number, seed?: string): T[];
function sampleSize<T>(collection: T[], ...args: any[]): T[] {
    args = args.filter((i) => i !== undefined);
    const [a, b] = args;
    switch (args.length) {
        case 0:
            return _sampleSize(collection, 1);
        case 1:
            switch (typeof a) {
                case 'string':
                    return _sampleSize(collection, 1, a);
                case 'number':
                    return _sampleSize(collection, a);
            }
        default:
            return _sampleSize(collection, a, b);
    }
}
export { sampleSize };
