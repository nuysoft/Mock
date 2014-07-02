module('Mock')

test('Mock.mock( String )', function() {
    doit('@EMAIL', function(tpl, data, message) {
        notEqual(tpl, data, message)
    })
})

test('Mock.mock( {} )', function() {
    doit({
        'list|1-10': [{
            'id|+1': 1,
            'email': '@EMAIL'
        }]
    }, function(tpl, data, message) {
        ok(data.list.length >= 1, message)
        ok(data.list.length <= 10, message)
        _.each(data.list, function(item, index, list) {
            if (index > 0) equal(item.id, list[index - 1].id + 1, message)
        })
    })
})

test('Mock.mock( function() )', function() {
    doit(function() {
        return Mock.mock({
            'list|1-10': [{
                'id|+1': 1,
                'email': '@EMAIL'
            }]
        })
    }, function(tpl, data, message) {
        ok(data.list.length >= 1, message)
        ok(data.list.length <= 10, message)
        _.each(data.list, function(item, index, list) {
            if (index > 0) equal(item.id, list[index - 1].id + 1, message)
        })
    })
})
