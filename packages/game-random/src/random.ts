import { alea as seedrandom } from 'seedrandom';
import { GlobalSeedAtom } from './globalSeed';
function _random(lower: number, upper: number, floating: boolean, seed?: string | undefined) {
    const step = upper - lower;
    seed = seed ?? GlobalSeedAtom()
    const result = lower + step * (seed !== undefined ? seedrandom(seed).quick() : Math.random());

    return floating ? result : Math.floor(result);
}
function random(floating?: boolean): number;
function random(seed?: string): number;
function random(max: number, floating?: boolean): number;
function random(max: number, seed?: string): number;
function random(min: number, max: number, floating: boolean, seed?: string): number;
function random(min: number, max: number, seed?: string): number;
function random(...args: any[]) {
    args = args.filter((i) => i !== undefined);
    const [a, b, c, d] = args;
    switch (args.length) {
        case 0:
            return _random(0, 1, true);
        case 1:
            switch (typeof a) {
                case 'string':
                    return _random(0, 1, false, a);
                case 'boolean':
                    return _random(0, 1, a);
                case 'number':
                    return _random(0, a, false);
            }
        case 2:
            switch (typeof b) {
                case 'string':
                    return _random(0, a, false, b);
                case 'boolean':
                    return _random(0, 1, b);
                case 'number':
                    return _random(a, b, false);
            }
        case 3:
            switch (typeof c) {
                case 'string':
                    return _random(a, b, false, c);
                case 'boolean':
                    return _random(a, b, c);
            }
        default:
            return _random(a, b, c, d);
    }
}
export { random };
