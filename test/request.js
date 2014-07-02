module('Request')

window.XMLHttpRequest = MockXMLHttpRequest

test('jQuery.ajax()', function() {
    stop()
    $.ajax({
        url: Math.random(),
        dataType: 'json'
    }).done(function(data, textStatus, jqXHR) {
        // 不会进入
    }).fail(function(jqXHR, textStatus, errorThrown) {
        // 浏览器 || PhantomJS
        ok(jqXHR.status === 404 || jqXHR.status === 0, errorThrown)
    }).always(function() {
        start()
    })

})

test('jQuery.getScript()', function() {
    stop()
    $.getScript('./materiels/noop.js', function(script, textStatus, jqXHR) {
        ok(script, script)
        start()
    })
})

test('jQuery.load()', function() {
    stop()
    $('<div>').load('./materiels/noop.html', function(responseText, textStatus, jqXHR) {
        ok(responseText, responseText)
        start()
    })
})

test('Mock.mock( rurl, template )', function() {
    Mock.mock(/rurl_template.json/, {
        'list|1-10': [{
            'id|+1': 1,
            'email': '@EMAIL'
        }]
    })

    stop()

    $.ajax({
        url: 'rurl_template.json',
        dataType: 'json'
    }).done(function(data, textStatus, jqXHR) {
        var message = 'rurl_template.json => ' + JSON.stringify(data, null, 4)
        ok(data.list.length >= 1, message)
        ok(data.list.length <= 10, message)
        _.each(data.list, function(item, index, list) {
            if (index > 0) equal(item.id, list[index - 1].id + 1, message)
        })

    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR, textStatus, errorThrown)
    }).always(function() {
        start()
    })

})

test('Mock.mock( rurl, function(options) )', function() {
    Mock.mock(/rurl_function\.json/, function(options) {
        return Mock.mock({
            'list|1-10': [{
                'id|+1': 1,
                'email': '@EMAIL'
            }]
        })
    })

    stop()

    $.ajax({
        url: 'rurl_function.json',
        dataType: 'json'
    }).done(function(data, status, jqXHR) {
        var message = 'rurl_function.json => ' + JSON.stringify(data, null, 4)
        ok(data.list.length >= 1, message)
        ok(data.list.length <= 10, message)
        _.each(data.list, function(item, index, list) {
            if (index > 0) equal(item.id, list[index - 1].id + 1, message)
        })

    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR, textStatus, errorThrown)
    }).always(function() {
        start()
    })

})

test('Mock.mock( rurl, rtype, template )', function() {

    Mock.mock(/rurl_rtype_template\.json/, 'get', {
        'list|1-10': [{
            'id|+1': 1,
            'email': '@EMAIL',
            type: 'get'
        }]
    })
    Mock.mock(/rurl_rtype_template\.json/, 'post', {
        'list|1-10': [{
            'id|+1': 1,
            'email': '@EMAIL',
            type: 'post'
        }]
    })

    stop()

    var count = 0

    function success(data) {
        count++
    }

    function complete() {
        if (count === 2) start()
    }

    $.ajax({
        url: 'rurl_rtype_template.json',
        type: 'get',
        dataType: 'json'
    }).done(function(data, status, jqXHR) {
        var message = 'GET rurl_rtype_template.json => ' + JSON.stringify(data, null, 4)
        ok(data.list.length >= 1, message)
        ok(data.list.length <= 10, message)
        equal(data.list[0].type, 'get', message)
        _.each(data.list, function(item, index, list) {
            if (index > 0) equal(item.id, list[index - 1].id + 1, message)
        })
    }).done(success).always(complete)

    $.ajax({
        url: 'rurl_rtype_template.json',
        type: 'post',
        dataType: 'json'
    }).done(function(data, status, jqXHR) {
        var message = 'POST rurl_rtype_template.json => ' + JSON.stringify(data, null, 4)
        ok(data.list.length >= 1, message)
        ok(data.list.length <= 10, message)
        equal(data.list[0].type, 'post', message)
        _.each(data.list, function(item, index, list) {
            if (index > 0) equal(item.id, list[index - 1].id + 1, message)
        })
    }).done(success).always(complete)

})

test('Mock.mock( rurl, rtype, function(options) )', function() {

    Mock.mock(/rurl_rtype_function\.json/, /get/, function() {
        return {
            type: 'get'
        }
    })
    Mock.mock(/rurl_rtype_function\.json/, /post|put/, function(options) {
        return {
            type: options.type.toLowerCase()
        }
    })

    stop()

    var count = 0

    function success(data) {
        count++
    }

    function complete() {
        if (count === 3) start()
    }

    $.ajax({
        url: 'rurl_rtype_function.json',
        type: 'get',
        dataType: 'json'
    }).done(function(data, status, jqXHR) {
        var message = 'GET rurl_rtype_function.json => ' + JSON.stringify(data, null, 4)
        equal(data.type, 'get', message)
    }).done(success).always(complete)

    $.ajax({
        url: 'rurl_rtype_function.json',
        type: 'post',
        dataType: 'json'
    }).done(function(data, status, jqXHR) {
        var message = 'POST rurl_rtype_function.json => ' + JSON.stringify(data, null, 4)
        equal(data.type, 'post', message)
    }).done(success).always(complete)

    $.ajax({
        url: 'rurl_rtype_function.json',
        type: 'put',
        dataType: 'json'
    }).done(function(data, status, jqXHR) {
        var message = 'PUT rurl_rtype_function.json => ' + JSON.stringify(data, null, 4)
        equal(data.type, 'put', message)
    }).done(success).always(complete)

})