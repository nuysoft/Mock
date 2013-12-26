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

/*
    ## Mock

    ### Mock.mock()

    * Mock.mock(template) 根据数据模板生成模拟数据。
    * Mock.mock(rurl, template) 记录数据模板，当拦截到匹配的 Ajax 请求时，生成并返回模拟数据。

    * Mock.mock(rurl, rtype, template)
    * Mock.mock(rurl, rtype, function)

    参数的含义如下所示：
    * 参数 rurl：可选。表示需要拦截的 URL，可以是 URL 字符串或 URL 正则。例如 `/\/domain\/list\.json/`、`'/domian/list.json'`。
    * 参数 template：必须。表示数据模板，可以是对象或字符串。例如 `{ 'data|1-10':[{}] }`、`'@EMAIL'`。

    数据模板中的每个属性由 3 部分构成，以 `'data|1-10':[{}]` 为例：

    * 属性名：例如 `data`。
    * 参数：指示生成数据的规则。例如 `|1-10`，指示生成的数组中含有 1 至 10 个元素。
    * 属性值：表示初始值、占位符、类型。例如 `[{}]`，表示属性值一个数组，数组中的元素是 `{}`。属性值中含有占位符时，将被替换为对应的随机数据，例如 `'email': '@EMAIL'`，`'@EMAIL'`将被替换为随机生成的邮件地址。

    参数和属性值部分的语法规范和示例如下：

    * `'data|1-10':[{}]` 构造一个数组，含有 1-10 个元素
    * `'data|1':[item, item, item]` 从数组中随机挑选一个元素做为属性值
    * `'id|+1': 1` 属性 id 值自动加一，初始值为 1
    * `'grade|1-100': 1` 生成一个 1-100 之间的整数
    * `'float|1-10.1-10': 1` 生成一个浮点数，整数部分的范围是 1-10，保留小数点后 1-10 位小数
    * `'star|1-10': '★'` 重复 1-10 次
    * `'repeat|10': 'A'` 重复 10 次
    * `'published|0-1': false` 随机生成一个布尔值
    * `'email': '@EMAIL'` 随即生成一个 Email
    * `'date': '@DATE'` 随即生成一段日期字符串，默认格式为 yyyy-MM-dd
    * `'time': '@TIME'` 随机生成一段时间字符串，默认格式为 HH:mm:ss
    * `'datetime': '@DATETIME'` 随机生成一段时间字符串，默认格式为 yyyy-MM-dd HH:mm:ss
    
    Mock.js 的 [在线编辑器](http://nuysoft.com/project/mock/demo/mock.html) 演示了完整的语法规范和占位符。

    下面是 Mock.mock() 的两种参数格式以及规则的使用示例：

    <iframe width="100%" height="300" src="http://jsfiddle.net/VRjgz/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

    <iframe width="100%" height="300" src="http://jsfiddle.net/n8D6k/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>
*/
Mock.mock = function(rurl, rtype, template) {
    if (arguments.length === 1) return Handle.gen(rurl)
    if (arguments.length === 2) {
        template = rtype
        rtype = undefined
    }
    Mock._mocked[rurl + (rtype || '')] = {
        rurl: rurl,
        rtype: rtype,
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
                // 
                /*
                    对备选元素不再做解析？为什么呢？应该解析！！！
                    例如下面的数据模板，希望从数组中选取一个元素作为属性值：
                    {
                        'opt|1': [{
                                method: 'GET'
                            }, {
                                method: 'POST'
                            }, {
                                method: 'HEAD'
                            }, {
                                method: 'DELETE'
                            }
                        ]
                    }
                    如果对备选元素不做解析，则返回的是备选元素之一；如果对备选元素进行解析，则会返回备选元素之一的副本，因此需要特别注意。
                */
                result = Random.pick(Handle.gen(options.template))
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
                        result = phed === 'true' ? true :
                            phed === 'false' ? false :
                            phed // 已经是布尔值
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
    _all: function() {
        var re = {};
        for (var key in Random) re[key.toLowerCase()] = key
        return re
    },
    placeholder: function(placeholder, obj) {
        // 1 key, 2 params
        rplaceholder.exec('')
        var parts = rplaceholder.exec(placeholder),
            key = parts && parts[1],
            lkey = key && key.toLowerCase(),
            okey = this._all()[lkey],
            params = parts && parts[2] ? parts[2].split(/,\s*/) : []
        if (obj && (key in obj)) return obj[key]

        if (!(key in Random) && !(lkey in Random) && !(okey in Random)) return placeholder

        for (var i = 0; i < params.length; i++) {
            rplaceholder.exec('')
            if (rplaceholder.test(params[i])) {
                params[i] = Handle.placeholder(params[i], obj)
            }
        }

        var handle = Random[key] || Random[lkey] || Random[okey]
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