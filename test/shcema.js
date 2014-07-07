module('Mock.toJSONSchema(template)')

function doToJSONSchema(template, validator) {
    var schema = toJSONSchema(template)
    // console.log(JSON.stringify(schema, null, 4))
    validator(
        template,
        schema,
        JSON.stringify(template, null, 4) + ' => ' + JSON.stringify(schema, null, 4)
    )
}

test('Type', function() {
    doToJSONSchema(1, function(template, schema, message) {
        equal(schema.name, undefined, message)
        equal(schema.type, 'number', message)
        for (var n in schema.rule) {
            equal(schema.rule[n], null, message)
        }
    })
    doToJSONSchema(true, function(template, schema, message) {
        equal(schema.name, undefined, message)
        equal(schema.type, 'boolean', message)
        for (var n in schema.rule) {
            equal(schema.rule[n], null, message)
        }
    })
    doToJSONSchema('', function(template, schema, message) {
        equal(schema.name, undefined, message)
        equal(schema.type, 'string', message)
        for (var n in schema.rule) {
            equal(schema.rule[n], null, message)
        }
    })
    doToJSONSchema(function() {}, function(template, schema, message) {
        equal(schema.name, undefined, message)
        equal(schema.type, 'function', message)
        for (var n in schema.rule) {
            equal(schema.rule[n], null, message)
        }
    })
    doToJSONSchema(/\d/, function(template, schema, message) {
        equal(schema.name, undefined, message)
        equal(schema.type, 'regexp', message)
        for (var n in schema.rule) {
            equal(schema.rule[n], null, message)
        }
    })
    doToJSONSchema([], function(template, schema, message) {
        equal(schema.name, undefined, message)
        equal(schema.type, 'array', message)
        for (var n in schema.rule) {
            equal(schema.rule[n], null, message)
        }
        deepEqual(schema.items, [], message)
    })
    doToJSONSchema({}, function(template, schema, message) {
        equal(schema.name, undefined, message)
        equal(schema.type, 'object', message)
        for (var n in schema.rule) {
            equal(schema.rule[n], null, message)
        }
        deepEqual(schema.properties, [], message)
    })

})

test('Object', function() {
    doToJSONSchema({
        a: {
            b: {
                c: {
                    d: {}
                }
            }
        }
    }, function(template, schema, message) {
        equal(schema.name, undefined, message)
        equal(schema.type, 'object', message)

        var properties;
        // root.properties
        properties = schema.properties
        equal(properties.length, 1, message)
        equal(properties[0].name, 'a', message)
        equal(properties[0].type, 'object', message)
        // root.a.properties
        properties = properties[0].properties
        equal(properties.length, 1, message)
        equal(properties[0].name, 'b', message)
        equal(properties[0].type, 'object', message)
        // root.a.b.properties
        properties = properties[0].properties
        equal(properties.length, 1, message)
        equal(properties[0].name, 'c', message)
        equal(properties[0].type, 'object', message)
        // root.a.b.c.properties
        properties = properties[0].properties
        equal(properties.length, 1, message)
        equal(properties[0].name, 'd', message)
        equal(properties[0].type, 'object', message)
        // root.a.b.c.d.properties
        properties = properties[0].properties
        equal(properties.length, 0, message)
    })

})

test('Array', function() {
    doToJSONSchema([
        [
            ['foo', 'bar']
        ]
    ], function(template, schema, message) {
        equal(schema.name, undefined, message)
        equal(schema.type, 'array', message)

        var items;
        // root.items
        items = schema.items
        equal(items.length, 1, message)
        equal(items[0].type, 'array', message)
        // root[0].items
        items = items[0].items
        equal(items.length, 1, message)
        equal(items[0].type, 'array', message)
        // root[0][0].items
        items = items[0].items
        equal(items.length, 2, message)
        equal(items[0].type, 'string', message)
        equal(items[1].type, 'string', message)
    })
})