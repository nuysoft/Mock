import { sample, sampleSize } from '../dist/index.js';
import { describe, it, expect } from 'vitest';
const testTime = 100;
const arr = [...Array(1000).keys()].map((i) => i + '');
const seed = '123232';
describe('sample', () => {
    it('arr', () => {
        const res = [...Array(testTime).keys()].map(() => sample(arr));

        res.forEach((i) => {
            expect(arr).toContain(i);
        });
    });
    it('arr, seed', () => {
        const res = [...Array(testTime).keys()].map((i) => sample(arr, seed));

        const target = sample(arr, seed);
        res.forEach((i) => {
            expect(i).toEqual(target);
        });
    });
});

describe('sampleSize', () => {
    it('null', () => {
        const res = [...Array(testTime).keys()].map((i) => sampleSize(arr));

        res.forEach((i) => {
            expect(i.length).toBe(1);
            expect(arr).toContain(i[0]);
        });
    });
    it('number', () => {
        const res = [...Array(testTime).keys()].map((i) => sampleSize(arr, 10));

        res.forEach((i) => {
            expect(i.length).toBe(10);
            i.forEach((ii) => {
                expect(arr).toContain(ii);
            });
        });
    });
    it('seed', () => {
        const res = [...Array(testTime).keys()].map((i) => sampleSize(arr, seed));

        const target = sampleSize(arr, seed);
        res.forEach((i) => {
            expect(i.length).toBe(1);
            expect(i).toEqual(target);
        });
    });

    it('number,seed', () => {
        const res = [...Array(testTime).keys()].map((i) => sampleSize(arr, 10, seed));
        const target = sampleSize(arr, 10, seed);
        res.forEach((i) => {
            expect(i.length).toBe(10);
            expect(i).toEqual(target);
        });
    });
});
