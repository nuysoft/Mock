// module('Mck.valid(template, data)');
import { it, describe, expect, test } from 'vitest';
import Assert from 'assert';
import Mock from '../src/mock';
const valid = Mock.valid;

test('Name', function () {
    console.group('Name');

    var result;

    result = valid(
        {
            name: 1,
        },
        {
            name: 1,
        },
    );
    Assert.equal(result.length, 0, JSON.stringify(result, null, 4));

    result = valid(
        {
            name1: 1,
        },
        {
            name2: 1,
        },
    );
    Assert.equal(result.length, 1, JSON.stringify(result, null, 4));

    console.groupEnd('Name');
});

test('Type', function () {
    console.group('Type');

    var result;

    result = valid(1, '1');
    Assert.equal(result.length, 1, JSON.stringify(result, null, 4));

    result = valid({}, []);
    Assert.equal(result.length, 1, JSON.stringify(result, null, 4));

    result = valid(
        {
            name: 1,
        },
        {
            name: 1,
        },
    );
    Assert.equal(result.length, 0, JSON.stringify(result, null, 4));

    result = valid(
        {
            name: 1,
        },
        {
            name: '1',
        },
    );
    Assert.equal(result.length, 1, JSON.stringify(result, null, 4));

    console.groupEnd('Type');
});

test('Value - Number', function () {
    console.group('Value - Number');

    var result;

    result = valid(
        {
            name: 1,
        },
        {
            name: 1,
        },
    );
    Assert.equal(result.length, 0, JSON.stringify(result, null, 4));

    result = valid(
        {
            name: 1,
        },
        {
            name: 2,
        },
    );
    Assert.equal(result.length, 1, JSON.stringify(result, null, 4));

    result = valid(
        {
            name: 1.1,
        },
        {
            name: 2.2,
        },
    );
    Assert.equal(result.length, 1, JSON.stringify(result, null, 4));

    result = valid(
        {
            'name|1-10': 1,
        },
        {
            name: 5,
        },
    );
    Assert.equal(result.length, 0, JSON.stringify(result, null, 4));

    result = valid(
        {
            'name|1-10': 1,
        },
        {
            name: 0,
        },
    );
    Assert.equal(result.length, 1, JSON.stringify(result, null, 4));

    result = valid(
        {
            'name|1-10': 1,
        },
        {
            name: 11,
        },
    );
    Assert.equal(result.length, 1, JSON.stringify(result, null, 4));

    console.groupEnd('Value - Number');
});

test('Value - String', function () {
    console.group('Value - String');

    var result;

    result = valid(
        {
            name: 'value',
        },
        {
            name: 'value',
        },
    );
    Assert.equal(result.length, 0, JSON.stringify(result, null, 4));

    result = valid(
        {
            name: 'value1',
        },
        {
            name: 'value2',
        },
    );
    Assert.equal(result.length, 1, JSON.stringify(result, null, 4));

    result = valid(
        {
            'name|1': 'value',
        },
        {
            name: 'value',
        },
    );
    Assert.equal(result.length, 0, JSON.stringify(result, null, 4));

    result = valid(
        {
            'name|2': 'value',
        },
        {
            name: 'valuevalue',
        },
    );
    Assert.equal(result.length, 0, JSON.stringify(result, null, 4));

    result = valid(
        {
            'name|2': 'value',
        },
        {
            name: 'value',
        },
    );
    Assert.equal(result.length, 1, JSON.stringify(result, null, 4));

    result = valid(
        {
            'name|2-3': 'value',
        },
        {
            name: 'value',
        },
    );
    Assert.equal(result.length, 1, JSON.stringify(result, null, 4));

    result = valid(
        {
            'name|2-3': 'value',
        },
        {
            name: 'valuevaluevaluevalue',
        },
    );
    Assert.equal(result.length, 1, JSON.stringify(result, null, 4));

    console.groupEnd('Value - String');
});

test('Value - Object', function () {
    console.group('Value - Object');

    var result;

    result = valid(
        {
            name: 1,
        },
        {
            name: 1,
        },
    );
    Assert.equal(result.length, 0, JSON.stringify(result, null, 4));

    result = valid(
        {
            name1: 1,
        },
        {
            name2: 2,
        },
    );
    Assert.equal(result.length, 1, JSON.stringify(result, null, 4));

    result = valid(
        {
            name1: 1,
            name2: 2,
        },
        {
            name3: 3,
        },
    );
    Assert.equal(result.length, 1, JSON.stringify(result, null, 4));

    result = valid(
        {
            name1: 1,
            name2: 2,
        },
        {
            name1: '1',
            name2: '2',
        },
    );
    Assert.equal(result.length, 2, JSON.stringify(result, null, 4));

    console.groupEnd('Value - Object');
});

test('Value - Array', function () {
    console.group('Value - Array');

    var result;

    result = valid([1, 2, 3], [1, 2, 3]);
    Assert.equal(result.length, 0, JSON.stringify(result, null, 4));

    result = valid([1, 2, 3], [1, 2, 3, 4]);
    Assert.equal(result.length, 1, JSON.stringify(result, null, 4));

    result = valid(
        {
            'name|2-3': [1],
        },
        {
            name: [1, 2, 3, 4],
        },
    );
    Assert.equal(result.length, 1, JSON.stringify(result, null, 4));

    result = valid(
        {
            'name|2-3': [1],
        },
        {
            name: [1],
        },
    );
    Assert.equal(result.length, 1, JSON.stringify(result, null, 4));

    result = valid(
        {
            'name|2-3': [1, 2, 3],
        },
        {
            name: [1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3],
        },
    );
    Assert.equal(result.length, 1, JSON.stringify(result, null, 4));

    result = valid(
        {
            'name|2-3': [1, 2, 3],
        },
        {
            name: [1, 2, 3],
        },
    );
    Assert.equal(result.length, 1, JSON.stringify(result, null, 4));

    result = valid(
        {
            'name|2-3': [1],
        },
        {
            name: [1, 1, 1],
        },
    );
    Assert.equal(result.length, 0, JSON.stringify(result, null, 4));

    result = valid(
        {
            'name|2-3': [1],
        },
        {
            name: [1, 2, 3],
        },
    );
    Assert.equal(result.length, 2, JSON.stringify(result, null, 4));

    console.groupEnd('Value - Array');
});
