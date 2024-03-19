import { random } from '../dist/index.js';
import { describe, it, expect } from 'vitest';
const isFloat = (a) => (a + '').indexOf('.') !== -1;
const isBetween = (a, b, c) => a >= b && a < c;
const testTime = 1000;

describe('random', () => {
    it('null', () => {
        const res = [...Array(testTime).keys()].map(() => random());
        res.forEach((i) => {
            expect(i + '').toContain('.');
            expect(i).toBeLessThan(1);
            expect(i).toBeGreaterThanOrEqual(0);
        });
    });
    it('max', () => {
        const res = [...Array(testTime).keys()].map(() => random(5)).every((i) => !isFloat(i) && isBetween(i, 0, 5));
        expect(res).toBe(true);
    });

    it('seed', () => {
        const target = random(5, '2233');
        const res = [...Array(testTime).keys()].map(() => random(5, '2233')).every((i) => !isFloat(i) && i === target);
        expect(res).toBe(true);
    });
    it('floating', () => {
        const res = [...Array(testTime).keys()].map(() => random(true)).every((i) => isFloat(i));
        expect(res).toBe(true);
    });

    it('min,max', () => {
        const res = [...Array(testTime).keys()].map(() => random(1, 6)).every((i) => !isFloat(i) && isBetween(i, 1, 6));
        expect(res).toBe(true);
    });

    it('max,floating', () => {
        const res = [...Array(testTime).keys()]
            .map(() => random(5, true))
            .every((i) => isFloat(i) && isBetween(i, 0, 5));
        expect(res).toBe(true);
    });

    it('max,seed', () => {
        const target = random(5, 'Konghayao');
        const res = [...Array(testTime).keys()]
            .map(() => random(5, 'Konghayao'))
            .every((i) => !isFloat(i) && i === target);
        expect(res).toBe(true);
    });
    it('min,max,floating', () => {
        const res = [...Array(testTime).keys()]
            .map(() => random(5, 100, true))
            .every((i) => isFloat(i) && isBetween(i, 5, 100));
        expect(res).toBe(true);
    });
    it('min,max,seed', () => {
        const target = random(100, 'Konghayao');
        const res = [...Array(testTime).keys()]
            .map(() => random(100, 'Konghayao'))
            .every((i) => !isFloat(i) && i === target);
        expect(res).toBe(true);
    });
    it('min,max,floating,seed', () => {
        const target = random(20, 100, true, 'Konghayao');
        const res = [...Array(testTime).keys()]
            .map(() => random(20, 100, true, 'Konghayao'))
            .every((i) => isFloat(i) && i === target);
        expect(res).toBe(true);
    });
});
