import seedrandom from 'seedrandom';
import { GlobalSeedAtom } from './globalSeed'
const isArray = function ($: any) {
    return Object.prototype.toString.call($) === '[object Array]';
};

const seedRand = function (func: () => number, min: number, max: number) {
    return Math.floor(func() * (max - min + 1)) + min;
};

const shuffle = function <T>(arr: T[], seed?: string) {
    if (!isArray(arr)) return null;

    const size = arr.length;
    seed = seed ?? GlobalSeedAtom()
    const rng = seedrandom(seed);
    const resp = [];
    const keys = [];

    for (let i = 0; i < size; i++) keys.push(i);
    for (let i = 0; i < size; i++) {
        const r = seedRand(rng, 0, keys.length - 1);
        const g = keys[r];
        keys.splice(r, 1);
        resp.push(arr[g]);
    }
    return resp;
};

const unshuffle = function <T>(arr: T[], seed?: string) {
    if (!isArray(arr)) return null;
    const size = arr.length;
    seed = seed ?? GlobalSeedAtom()
    const rng = seedrandom(seed);
    const resp = [];
    const keys = [];

    for (let i = 0; i < size; i++) {
        resp.push(null);
        keys.push(i);
    }

    for (let i = 0; i < size; i++) {
        const r = seedRand(rng, 0, keys.length - 1);
        const g = keys[r];
        keys.splice(r, 1);
        resp[g] = arr[i];
    }

    return resp;
};

export { shuffle, unshuffle as unShuffle };
