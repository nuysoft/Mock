module('Mck.valid(template, data)')

if (!window.valid) {
    window.valid = Mock.valid
}

test('Name', function() {
    console.group('Name')

    var result;

    result = valid({
        name: 1
    }, {
        name: 1
    })
    equal(result.length, 0, JSON.stringify(result, null, 4))

    result = valid({
        name1: 1
    }, {
        name2: 1
    })
    equal(result.length, 1, JSON.stringify(result, null, 4))

    console.groupEnd('Name')
})

test('Type', function() {
    console.group('Type')

    var result;

    result = valid(
        1,
        '1'
    )
    equal(result.length, 1, JSON.stringify(result, null, 4))

    result = valid({}, [])
    equal(result.length, 1, JSON.stringify(result, null, 4))

    result = valid({
        name: 1
    }, {
        name: 1
    })
    equal(result.length, 0, JSON.stringify(result, null, 4))

    result = valid({
        name: 1
    }, {
        name: '1'
    })
    equal(result.length, 1, JSON.stringify(result, null, 4))

    console.groupEnd('Type')
})

test('Value - Number', function() {
    console.group('Value - Number')

    var result;

    result = valid({
        name: 1
    }, {
        name: 1
    })
    equal(result.length, 0, JSON.stringify(result, null, 4))

    result = valid({
        name: 1
    }, {
        name: 2
    })
    equal(result.length, 1, JSON.stringify(result, null, 4))

    result = valid({
        name: 1.1
    }, {
        name: 2.2
    })
    equal(result.length, 1, JSON.stringify(result, null, 4))

    result = valid({
        'name|1-10': 1
    }, {
        name: 5
    })
    equal(result.length, 0, JSON.stringify(result, null, 4))

    result = valid({
        'name|1-10': 1
    }, {
        name: 0
    })
    equal(result.length, 1, JSON.stringify(result, null, 4))

    result = valid({
        'name|1-10': 1
    }, {
        name: 11
    })
    equal(result.length, 1, JSON.stringify(result, null, 4))

    console.groupEnd('Value - Number')
})

test('Value - String', function() {
    console.group('Value - String')

    var result;

    result = valid({
        name: 'value'
    }, {
        name: 'value'
    })
    equal(result.length, 0, JSON.stringify(result, null, 4))

    result = valid({
        name: 'value1'
    }, {
        name: 'value2'
    })
    equal(result.length, 1, JSON.stringify(result, null, 4))

    result = valid({
        'name|1': 'value'
    }, {
        name: 'value'
    })
    equal(result.length, 0, JSON.stringify(result, null, 4))

    result = valid({
        'name|2': 'value'
    }, {
        name: 'valuevalue'
    })
    equal(result.length, 0, JSON.stringify(result, null, 4))

    result = valid({
        'name|2': 'value'
    }, {
        name: 'value'
    })
    equal(result.length, 1, JSON.stringify(result, null, 4))

    result = valid({
        'name|2-3': 'value'
    }, {
        name: 'value'
    })
    equal(result.length, 1, JSON.stringify(result, null, 4))

    result = valid({
        'name|2-3': 'value'
    }, {
        name: 'valuevaluevaluevalue'
    })
    equal(result.length, 1, JSON.stringify(result, null, 4))

    console.groupEnd('Value - String')
})

test('Value - Object', function() {
    console.group('Value - Object')

    var result;

    result = valid({
        name: 1
    }, {
        name: 1
    })
    equal(result.length, 0, JSON.stringify(result, null, 4))

    result = valid({
        name1: 1
    }, {
        name2: 2
    })
    equal(result.length, 1, JSON.stringify(result, null, 4))

    result = valid({
        name1: 1,
        name2: 2
    }, {
        name3: 3
    })
    equal(result.length, 1, JSON.stringify(result, null, 4))

    result = valid({
        name1: 1,
        name2: 2
    }, {
        name1: '1',
        name2: '2'
    })
    equal(result.length, 2, JSON.stringify(result, null, 4))

    console.groupEnd('Value - Object')
})

test('Value - Array', function() {
    console.group('Value - Array')

    var result;

    result = valid(
        [1, 2, 3], [1, 2, 3]
    )
    equal(result.length, 0, JSON.stringify(result, null, 4))

    result = valid(
        [1, 2, 3], [1, 2, 3, 4]
    )
    equal(result.length, 1, JSON.stringify(result, null, 4))

    result = valid({
        'name|2-3': [1]
    }, {
        'name': [1, 2, 3, 4]
    })
    equal(result.length, 1, JSON.stringify(result, null, 4))

    result = valid({
        'name|2-3': [1]
    }, {
        'name': [1]
    })
    equal(result.length, 1, JSON.stringify(result, null, 4))

    result = valid({
        'name|2-3': [1, 2, 3]
    }, {
        'name': [1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3]
    })
    equal(result.length, 1, JSON.stringify(result, null, 4))

    result = valid({
        'name|2-3': [1, 2, 3]
    }, {
        'name': [1, 2, 3]
    })
    equal(result.length, 1, JSON.stringify(result, null, 4))

    result = valid({
        'name|2-3': [1]
    }, {
        'name': [1, 1, 1]
    })
    equal(result.length, 0, JSON.stringify(result, null, 4))

    result = valid({
        'name|2-3': [1]
    }, {
        'name': [1, 2, 3]
    })
    equal(result.length, 2, JSON.stringify(result, null, 4))

    console.groupEnd('Value - Array')
})