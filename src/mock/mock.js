var Random = require('./random'),
    Util = require('./util');

var Mock = module.exports = {
    _mocked: {}
};

// BEGIN(BROWSER)
/*
    mock data
*/

/*
    rkey
        name|+inc
        name|repeat
        name|min-max
        name|min-max.dmin-dmax
        name|int.dmin-dmax

        1 name, 2 inc, 3 range, 4 decimal
    rplaceholder
        placeholder(*)
*/
var rkey = /(.+)\|(?:\+(\d+)|(\d+-?\d*)?(?:\.(\d+-?\d*))?)/,
    rrange = /(\d+)-?(\d+)?/,
    rplaceholder = /\\*@([^@#%&()\?\s\/\.]+)(?:\((.+?)\))?/g; // (^(?:.|\r|\n)*?)

Mock.extend = Util.extend

Mock.mock = function(rurl, template) {
    if (arguments.length === 1) return Handle.gen(rurl)
    Mock._mocked[rurl] = {
        rurl: rurl,
        template: template
    }
    return Mock
}

var Handle = {
    extend: Util.extend
}

Handle.gen = function(template, name, obj) {
    var parameters = (name = name || '').match(rkey),

        range = parameters && parameters[3] && parameters[3].match(rrange),
        min = range && parseInt(range[1], 10), // || 1
        max = range && parseInt(range[2], 10), // || 1
        // repeat || min-max || 1
        count = range ? !range[2] && parseInt(range[1], 10) || Random.integer(min, max) : 1,

        decimal = parameters && parameters[4] && parameters[4].match(rrange),
        dmin = decimal && parseInt(decimal[1], 10), // || 0,
        dmax = decimal && parseInt(decimal[2], 10), // || 0,
        // int || dmin-dmax || 0
        dcount = decimal ? !decimal[2] && parseInt(decimal[1], 10) || Random.integer(dmin, dmax) : 0,

        point = parameters && parameters[4],
        type = Util.type(template),
        result;

    if (Handle[type]) {
        result = Handle[type]({
            type: type,
            template: template,
            name: name,
            obj: obj,

            parameters: parameters,
            range: range,
            min: min,
            max: max,
            count: count,
            decimal: decimal,
            dmin: dmin,
            dmax: dmax,
            dcount: dcount,
            point: point
        })
        return result
    }
    return template
}

Handle.extend({
    array: function(options) {
        var result = [],
            i, j;
        // 'arr': [{ 'email': '@EMAIL' }, { 'email': '@EMAIL' }]
        if (!options.parameters) {
            for (i = 0; i < options.template.length; i++) {
                result.push(Handle.gen(options.template[i]))
            }
        } else {
            // 'method|1': ['GET', 'POST', 'HEAD', 'DELETE']
            if (options.count === 1 && options.template.length > 1) {
                // 对备选元素不再做解析
                result = Random.pick(options.template)
            } else {
                // 'data|1-10': [{}]
                for (i = 0; i < options.count; i++) {
                    j = 0
                    do {
                        result.push(Handle.gen(options.template[j++]))
                    } while (j < options.template.length)
                }
            }
        }
        return result
    },
    object: function(options) {
        var result = {}, key, inc;
        for (key in options.template) {
            result[key.replace(rkey, '$1')] = Handle.gen(options.template[key], key, result)
            // 'id|+1': 1
            inc = key.match(rkey)
            if (inc && inc[2] && Util.type(options.template[key]) === 'number') {
                options.template[key] += parseInt(inc[2], 10)
            }
        }
        return result
    },
    number: function(options) {
        var result, parts, i;
        if (options.point) { // float
            options.template += ''
            parts = options.template.split('.')
            // 'float1|.1-10': 10,
            // 'float2|1-100.1-10': 1,
            // 'float3|999.1-10': 1,
            // 'float4|.3-10': 123.123,
            parts[0] = options.range ? options.count : parts[0]
            parts[1] = (parts[1] || '').slice(0, options.dcount)
            for (i = 0; parts[1].length < options.dcount; i++) {
                parts[1] += Random.character('number')
            }
            result = parseFloat(parts.join('.'), 10)
        } else { // integer
            // 'grade1|1-100': 1,
            result = options.range && !options.parameters[2] ? options.count : options.template
        }
        return result
    },
    boolean: function(options) {
        var result;
        // 'prop|multiple': false, 当前值是相反值的概率倍数
        // 'prop|probability-probability': false, 当前值与相反值的概率
        result = options.parameters ? Random.bool(options.min, options.max, options.template) : options.template
        return result
    },
    string: function(options) {
        var result = '',
            i, placeholders, ph, phed;
        if (options.template.length) {
            // 'star|1-5': '★',
            for (i = 0; i < options.count; i++) {
                result += options.template
            }
            // 'email|1-10': '@EMAIL, ',
            placeholders = result.match(rplaceholder) || [] // A-Z_0-9 > \w_
            for (i = 0; i < placeholders.length; i++) {
                ph = placeholders[i]
                // TODO 只有转义斜杠是偶数时，才不需要解析占位符？
                if (/^\\/.test(ph)) {
                    placeholders.splice(i--, 1)
                    continue
                }
                phed = Handle.placeholder(ph, options.obj)
                if (placeholders.length === 1 && ph === result) { // 
                    if (Util.isNumeric(phed)) {
                        result = parseFloat(phed, 10)
                        break
                    }
                    if (/^(true|false)$/.test(phed)) {
                        result = phed === 'true' ? true : false
                        break
                    }
                }
                result = result.replace(ph, phed)
            }
        } else {
            // 'ASCII|1-10': '',
            // 'ASCII': '',
            result = options.range ? Random.string(options.count) : options.template
        }
        return result
    }
})

Handle.extend({
    placeholder: function(placeholder, obj) {
        // 1 key, 2 params
        rplaceholder.exec('')
        var parts = rplaceholder.exec(placeholder),
            key = parts && parts[1],
            lkey = key && key.toLowerCase(),
            params = parts && parts[2] ? parts[2].split(/,\s*/) : []
        if (obj && (key in obj)) return obj[key]

        if (!(key in Random) && !(lkey in Random)) return placeholder

        for (var i = 0; i < params.length; i++) {
            rplaceholder.exec('')
            if (rplaceholder.test(params[i])) {
                params[i] = Handle.placeholder(params[i], obj)
            }
        }

        var handle = Random[key] || Random[lkey]
        switch (Util.type(handle)) {
            case 'array':
                return Random.pick(handle)
            case 'function':
                var re = handle.apply(Random, params)
                if (re === undefined) re = ''
                return re
        }
    }
})
// END(BROWSER)