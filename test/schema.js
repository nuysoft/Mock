module('Mock.toJSONSchema(template)')

if(!window.toJSONSchema){
    window.toJSONSchema = Mock.toJSONSchema
}

function doToJSONSchema(template, validator) {
    var schema = toJSONSchema(template)
    var message = (JSON.stringify(template, null, 4) || template.toString()) +
        ' => ' +
        JSON.stringify(schema, null, 4)
    console.log(message)
    validator(
        template,
        schema,
        message
    )
}

test('Type', function() {
    doToJSONSchema(1, function(template, schema, message) {
        equal(schema.name, undefined, message)
        equal(schema.type, 'number')
        for (var n in schema.rule) {
            equal(schema.rule[n], null)
        }
    })
    doToJSONSchema(true, function(template, schema, message) {
        equal(schema.name, undefined, message)
        equal(schema.type, 'boolean')
        for (var n in schema.rule) {
            equal(schema.rule[n], null)
        }
    })
    doToJSONSchema('', function(template, schema, message) {
        equal(schema.name, undefined, message)
        equal(schema.type, 'string')
        for (var n in schema.rule) {
            equal(schema.rule[n], null)
        }
    })
    doToJSONSchema(function() {}, function(template, schema, message) {
        equal(schema.name, undefined, message)
        equal(schema.type, 'function')
        for (var n in schema.rule) {
            equal(schema.rule[n], null)
        }
    })
    doToJSONSchema(/\d/, function(template, schema, message) {
        equal(schema.name, undefined, message)
        equal(schema.type, 'regexp')
        for (var n in schema.rule) {
            equal(schema.rule[n], null)
        }
    })
    doToJSONSchema([], function(template, schema, message) {
        equal(schema.name, undefined, message)
        equal(schema.type, 'array')
        for (var n in schema.rule) {
            equal(schema.rule[n], null)
        }
        deepEqual(schema.items, [])
    })
    doToJSONSchema({}, function(template, schema, message) {
        equal(schema.name, undefined, message)
        equal(schema.type, 'object')
        for (var n in schema.rule) {
            equal(schema.rule[n], null)
        }
        deepEqual(schema.properties, [])
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
        equal(schema.type, 'object')

        var properties;
        // root.properties
        properties = schema.properties
        equal(properties.length, 1)
        equal(properties[0].name, 'a')
        equal(properties[0].type, 'object')
        // root.a.properties
        properties = properties[0].properties
        equal(properties.length, 1)
        equal(properties[0].name, 'b')
        equal(properties[0].type, 'object')
        // root.a.b.properties
        properties = properties[0].properties
        equal(properties.length, 1)
        equal(properties[0].name, 'c')
        equal(properties[0].type, 'object')
        // root.a.b.c.properties
        properties = properties[0].properties
        equal(properties.length, 1)
        equal(properties[0].name, 'd')
        equal(properties[0].type, 'object')
        // root.a.b.c.d.properties
        properties = properties[0].properties
        equal(properties.length, 0)
    })

})

test('Array', function() {
    doToJSONSchema([
        [
            ['foo', 'bar']
        ]
    ], function(template, schema, message) {
        equal(schema.name, undefined, message)
        equal(schema.type, 'array')

        var items;
        // root.items
        items = schema.items
        equal(items.length, 1)
        equal(items[0].type, 'array')
        // root[0].items
        items = items[0].items
        equal(items.length, 1)
        equal(items[0].type, 'array')
        // root[0][0].items
        items = items[0].items
        equal(items.length, 2)
        equal(items[0].type, 'string')
        equal(items[1].type, 'string')
    })
})

test('String Rule', function() {
    doToJSONSchema({
        'string|1-10': '★'
    }, function(template, schema, message) {
        equal(schema.name, undefined, message)
        equal(schema.type, 'object')

        var properties;
        // root.properties
        properties = schema.properties
        equal(properties.length, 1)
        equal(properties[0].type, 'string')
        equal(properties[0].rule.min, 1)
        equal(properties[0].rule.max, 10)
    })
    doToJSONSchema({
        'string|3': 'value',
    }, function(template, schema, message) {
        equal(schema.name, undefined, message)
        equal(schema.type, 'object')

        var properties;
        // root.properties
        properties = schema.properties
        equal(properties.length, 1)
        equal(properties[0].type, 'string')
        equal(properties[0].rule.min, 3)
        equal(properties[0].rule.max, undefined)
    })
})
