// src/mock/mock-prefix.js
/*
    Mock - 模拟请求 & 模拟数据
    https://github.com/nuysoft/Mock
    墨智 mozhi.gyy@taobao.com nuysoft@gmail.com
*/
(function(undefined) {
	var Mock = {
		VERSION: '0.1.1',
		_mocked: {}
	}

// src/mock/util.js

/*
    Utilities
*/
var Util = (function() {
    var Util = {}

    Util.extend = function extend() {
        var target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            options, name, src, copy

        if (length === 1) {
            target = this
            i = 0
        }

        for (; i < length; i++) {
            options = arguments[i]
            if (!options) continue

            for (name in options) {
                src = target[name]
                copy = options[name]

                if (target === copy) continue
                if (copy === undefined) continue

                if (Util.isArray(copy) || Util.isObject(copy)) {
                    if (Util.isArray(copy)) clone = src && Util.isArray(src) ? src : []
                    if (Util.isObject(copy)) clone = src && Util.isObject(src) ? src : {}

                    target[name] = Util.extend(clone, copy)
                } else {
                    target[name] = copy
                }
            }
        }

        return target
    }

    Util.each = function each(obj, iterator, context) {
        var i, key
        if (this.type(obj) === 'number') {
            for (i = 0; i < obj; i++) {
                iterator(i, i)
            }
        } else if (obj.length === +obj.length) {
            for (i = 0; i < obj.length; i++) {
                if (iterator.call(context, obj[i], i, obj) === false) break
            }
        } else {
            for (key in obj) {
                if (iterator.call(context, obj[key], key, obj) === false) break
            }
        }
    }

    Util.type = function type(obj) {
        return (obj === null || obj === undefined) ? String(obj) : Object.prototype.toString.call(obj).match(/\[object (\w+)\]/)[1].toLowerCase()
    }

    Util.each('String Object Array'.split(' '), function(value) {
        Util['is' + value] = function(obj) {
            return Util.type(obj) === value.toLowerCase()
        }
    })

    Util.isObjectOrArray = function(value) {
        return Util.isObject(value) || Util.isArray(value)
    }

    Util.isNumeric = function(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }

    Util.heredoc = function heredoc(fn) {
        return fn.toString()
            .replace(/^[^\/]+\/\*!?/, '')
            .replace(/\*\/[^\/]+$/, '')
            .trim();
    }

    Util.noop = function() {}

    return Util
})()



// src/mock/random.js

/*
    Random
*/
var Random = (function() {
    var Random = {
        extend: Util.extend
    }
    // Basics
    Random.extend({
        boolean: function(min, max, cur) {
            if (cur !== undefined) {
                min = typeof min !== 'undefined' && !isNaN(min) ? parseInt(min, 10) : 1
                max = typeof max !== 'undefined' && !isNaN(max) ? parseInt(max, 10) : 1
                return Math.random() > 1.0 / (min + max) * min ? !cur : cur
            }

            return Math.random() >= 0.5
        },
        bool: function(min, max, cur) {
            return this.boolean(min, max, cur)
        },
        // 自然数
        natural: function(min, max) {
            min = typeof min !== 'undefined' ? parseInt(min, 10) : 0
            max = typeof max !== 'undefined' ? parseInt(max, 10) : 9007199254740992 // 2^53
            return Math.round(Math.random() * (max - min)) + min
        },
        // 整数
        integer: function(min, max) {
            min = typeof min !== 'undefined' ? parseInt(min, 10) : -9007199254740992
            max = typeof max !== 'undefined' ? parseInt(max, 10) : 9007199254740992 // 2^53
            return Math.round(Math.random() * (max - min)) + min
        },
        int: function(min, max) {
            return this.integer(min, max)
        },
        float: function(min, max, dmin, dmax) {
            var ret = this.integer(min, max) + '.' + this.natural(dmin, dmax)
            return parseFloat(ret, 10)
        },
        character: function(pool) {
            var pools = {
                lower: "abcdefghijklmnopqrstuvwxyz",
                upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                number: "0123456789",
                symbol: "!@#$%^&*()[]"
            }
            pools.alpha = pools.lower + pools.upper
            pools['undefined'] = pools.lower + pools.upper

            pool = pools[('' + pool).toLowerCase()] || pool
            return pool.charAt(Random.natural(0, pool.length - 1))
        },
        char: function(pool) {
            return this.character(pool)
        },
        /*
            string( pool, min, max )
            string( min, max )
            string( pool, length )
            string( length )
        */
        string: function(pool, min, max) {
            var length

            // string( pool, min, max )
            if (arguments.length === 3) {
                length = Random.natural(min, max)
            }
            if (arguments.length === 2) {
                // string( pool, length )
                if (typeof arguments[0] === 'string') {
                    length = min
                } else {
                    // string( min, max )
                    length = Random.natural(pool, min)
                    pool = undefined
                }
            }
            // string( length )
            if (arguments.length === 1) {
                length = pool
                pool = undefined
            }
            if (arguments.length === 0) {
                length = Random.natural(3, 7)
            }

            var text = ''
            for (var i = 0; i < length; i++) {
                text += Random.character(pool)
            }
            return text
        },
        str: function(pool, min, max) {
            return this.string(pool, min, max)
        },
        /*
            range(stop)
            range(start, stop)
            range(start, stop, step)

            Generate an integer Array containing an arithmetic progression.
            http://underscorejs.org/#range
        */
        range: function(start, stop, step) {
            if (arguments.length <= 1) {
                stop = start || 0;
                start = 0;
            }
            step = arguments[2] || 1;

            var len = Math.max(Math.ceil((stop - start) / step), 0);
            var idx = 0;
            var range = new Array(len);

            while (idx < len) {
                range[idx++] = start;
                start += step;
            }

            return range;
        }
    })
    // Date
    Random.extend({
        patternLetters: {
            yyyy: 'getFullYear',
            yy: function(date) {
                return ('' + date.getFullYear()).slice(2)
            },
            y: 'yy',

            MM: function(date) {
                var m = date.getMonth() + 1
                return m < 10 ? '0' + m : m
            },
            M: function(date) {
                return date.getMonth() + 1
            },

            dd: function(date) {
                var d = date.getDate()
                return d < 10 ? '0' + d : d
            },
            d: 'getDate',

            HH: function(date) {
                var h = date.getHours()
                return h < 10 ? '0' + h : h
            },
            H: 'getHours',
            hh: function(date) {
                var h = date.getHours() % 12
                return h < 10 ? '0' + h : h
            },
            h: function(date) {
                return date.getHours() % 12
            },

            mm: function(date) {
                var m = date.getMinutes()
                return m < 10 ? '0' + m : m
            },
            m: 'getMinutes',

            ss: function(date) {
                var s = date.getSeconds()
                return s < 10 ? '0' + s : s
            },
            s: 'getSeconds',

            SS: function(date) {
                var ms = date.getMilliseconds()
                return ms < 10 && '00' + ms || ms < 100 && '0' + ms || ms
            },
            S: 'getMilliseconds',

            A: function(date) {
                return date.getHours() < 12 ? 'AM' : 'PM'
            },
            a: function(date) {
                return date.getHours() < 12 ? 'am' : 'pm'
            }
        }
    })
    Random.extend({
        rformat: new RegExp((function() {
            var re = []
            for (var i in Random.patternLetters) re.push(i)
            return '(' + re.join('|') + ')'
        })(), 'g'),
        format: function(date, format) {
            var patternLetters = Random.patternLetters,
                rformat = Random.rformat
            return format.replace(rformat, function($0, flag) {
                return typeof patternLetters[flag] === 'function' ?
                    patternLetters[flag](date) :
                    patternLetters[flag] in patternLetters ?
                    arguments.callee($0, patternLetters[flag]) :
                    date[patternLetters[flag]]()
            })
        },
        randomDate: function() { // min, max
            return new Date(Math.floor(Math.random() * new Date().valueOf()))
        },
        date: function(format) {
            format = format || 'yyyy-MM-dd'
            return this.format(this.randomDate(), format)
        },
        time: function(format) {
            format = format || 'HH:mm:ss'
            return this.format(this.randomDate(), format)
        },
        datetime: function(format) {
            format = format || 'yyyy-MM-dd HH:mm:ss'
            return this.format(this.randomDate(), format)
        }
    })
    // Image
    Random.extend({
        ad_size: [
                '300x250', '250x250', '240x400', '336x280', '180x150',
                '720x300', '468x60', '234x60', '88x31', '120x90',
                '120x60', '120x240', '125x125', '728x90', '160x600',
                '120x600', '300x600'
        ],
        screen_size: [
                '320x200', '320x240', '640x480', '800x480', '800x480',
                '1024x600', '1024x768', '1280x800', '1440x900', '1920x1200',
                '2560x1600'
        ],
        video_size: ['720x480', '768x576', '1280x720', '1920x1080'],
        /*
        IMG(size, background, foreground, format, text)
        IMG(size, background, foreground, text)
        IMG(size, background, text)
        IMG(size, background)
        IMG(size)
    */
        img: function(size, background, foreground, format, text) {
            if (arguments.length === 4) {
                text = format
                format = undefined
            }
            if (arguments.length === 3) text = foreground
            if (!size) size = this.pick(this.ad_size)

            // http://dummyimage.com/600x400/cc00cc/470047.png&text=hello
            return 'http://dummyimage.com/' + size +
                (background ? '/' + background : '') +
                (foreground ? '/' + foreground : '') +
                (format ? '.' + format : '') +
                (text ? '&text=' + text : '')
        }
    })
    // Color
    Random.extend({
        color: function() {
            var colour = Math.floor(Math.random() * (16 * 16 * 16 * 16 * 16 * 16 - 1)).toString(16)
            colour = "#" + ("000000" + colour).slice(-6)
            return colour
        }
    })
    // Helpers
    Random.extend({
        /*
            Capitalize the first letter of a word.
        */
        capitalize: function(word) {
            return word.charAt(0).toUpperCase() + word.substr(1)
        },
        upper: function(word) {
            return word.toUpperCase()
        },
        lower: function(word) {
            return word.toLowerCase()
        },
        /*
            Given an array, pick a random element and return it.
        */
        pick: function(arr) {
            return arr[this.natural(0, arr.length - 1)]
        },
        /*
            Given an array, scramble the order and return it.
        */
        shuffle: function(arr) {
            var old = arr.slice(0),
                result = [],
                index = 0,
                length = old.length;
            for (var i = 0; i < length; i++) {
                index = this.natural(0, old.length - 1)
                result.push(old[index])
                old.splice(index, 1)
            }
            return result
        }
    })
    // Text
    Random.extend({
        paragraph: function(len) {
            len = len || Random.natural(3, 7)
            var arr = []
            for (var i = 0; i < len; i++) {
                arr.push(Random.sentence())
            }
            return arr.join(' ')
        },
        /*
            TODO 支持可变的单词数
            sentence(min, max)   
            sentence(len)
        */
        sentence: function(len) {
            len = len || Random.natural(12, 18)
            var arr = []
            for (var i = 0; i < len; i++) {
                arr.push(Random.word())
            }
            return Random.capitalize(arr.join(' ')) + '.'
        },
        /*
            word( min, max )
            word( len )
        */
        word: function(min, max) {
            var result = [],
                len;

            min = typeof min !== 'undefined' ? parseInt(min, 10) : 1
            max = typeof max !== 'undefined' ? parseInt(max, 10) : min
            len = Random.natural(min, max)

            for (var i = 0; i < min; i++) result.push(Random.string('lower', 3, 10))

            return result.join(' ')
        },
        title: function() {
            var result = [],
                len = Random.natural(3, 7);
            for (var i = 0; i < len; i++) {
                result.push(this.capitalize(this.word()))
            }
            return result.join(' ')
        }
    })
    // Name
    Random.extend({
        first: function() {
            var names = [
                // male
                "James", "John", "Robert", "Michael", "William",
                    "David", "Richard", "Charles", "Joseph", "Thomas",
                    "Christopher", "Daniel", "Paul", "Mark", "Donald",
                    "George", "Kenneth", "Steven", "Edward", "Brian",
                    "Ronald", "Anthony", "Kevin", "Jason", "Matthew",
                    "Gary", "Timothy", "Jose", "Larry", "Jeffrey",
                    "Frank", "Scott", "Eric"
            ].concat([
                // female
                "Mary", "Patricia", "Linda", "Barbara", "Elizabeth",
                    "Jennifer", "Maria", "Susan", "Margaret", "Dorothy",
                    "Lisa", "Nancy", "Karen", "Betty", "Helen",
                    "Sandra", "Donna", "Carol", "Ruth", "Sharon",
                    "Michelle", "Laura", "Sarah", "Kimberly", "Deborah",
                    "Jessica", "Shirley", "Cynthia", "Angela", "Melissa",
                    "Brenda", "Amy", "Anna"
            ])
            return this.pick(names)
            return this.capitalize(this.word())
        },
        last: function() {
            var names = [
                    "Smith", "Johnson", "Williams", "Brown", "Jones",
                    "Miller", "Davis", "Garcia", "Rodriguez", "Wilson",
                    "Martinez", "Anderson", "Taylor", "Thomas", "Hernandez",
                    "Moore", "Martin", "Jackson", "Thompson", "White",
                    "Lopez", "Lee", "Gonzalez", "Harris", "Clark",
                    "Lewis", "Robinson", "Walker", "Perez", "Hall",
                    "Young", "Allen"
            ]
            return this.pick(names)
            return this.capitalize(this.word())
        },
        name: function(middle) {
            return this.first() + ' ' + (middle ? this.first() + ' ' : '') + this.last()
        }
    })
    // Web
    Random.extend({
        url: function() {
            return 'http://' + this.domain() + '/' + this.word()
        },
        domain: function(tld) {
            return this.word() + '.' + (tld || this.tld())
        },
        email: function(domain) {
            return this.character('lower') + '.' + this.last().toLowerCase() + '@' + this.last().toLowerCase() + '.' + this.tld()
            return this.word() + '@' + (domain || this.domain())
        },
        ip: function() {
            return this.natural(0, 255) + '.' +
                this.natural(0, 255) + '.' +
                this.natural(0, 255) + '.' +
                this.natural(0, 255)
        },
        tlds: ['com', 'org', 'edu', 'gov', 'co.uk', 'net', 'io'],
        tld: function() { // Top Level Domain
            return this.pick(this.tlds)
        }
    })
    // Address TODO 
    Random.extend({
        areas: ['东北', '华北', '华东', '华中', '华南', '西南', '西北'],
        area: function() {
            return this.pick(this.areas)
        },

        /*
            // 23个省 
            '河北省', '山西省', '辽宁省', '吉林省', '黑龙江省', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省', '广东省', '海南省', '四川省', '贵州省', '云南省', '陕西省', '甘肃省', '青海省', '台湾省',
            // 4个直辖市 
            '北京市', '天津市', '上海市', '重庆市',
            // 5个自治区 
            '广西壮族自治区', '内蒙古自治区', '西藏自治区', '宁夏回族自治区', '新疆维吾尔自治区',
            // 2个特别行政区
            '香港特别行政区', '澳门特别行政区'
        */
        regions: [
                '110000 北京市', '120000 天津市', '130000 河北省', '140000 山西省', '150000 内蒙古自治区',
                '210000 辽宁省', '220000 吉林省', '230000 黑龙江省',
                '310000 上海市', '320000 江苏省', '330000 浙江省', '340000 安徽省', '350000 福建省', '360000 江西省', '370000 山东省',
                '410000 河南省', '420000 湖北省', '430000 湖南省', '440000 广东省', '450000 广西壮族自治区', '460000 海南省',
                '500000 重庆市', '510000 四川省', '520000 贵州省', '530000 云南省', '540000 西藏自治区',
                '610000 陕西省', '620000 甘肃省', '630000 青海省', '640000 宁夏回族自治区', '650000 新疆维吾尔自治区', '650000 新疆维吾尔自治区',
                '710000 台湾省',
                '810000 香港特别行政区', '820000 澳门特别行政区'
        ],
        region: function() {
            return this.pick(this.regions).split(' ')[1]
        },


        address: function() {

        },
        city: function() {

        },
        phone: function() {

        },
        areacode: function() {

        },
        street: function() {

        },
        street_suffixes: function() {

        },
        street_suffix: function() {

        },
        states: function() {

        },
        state: function() {

        },
        zip: function(len) {
            var zip = ''
            for (var i = 0; i < (len || 6); i++) zip += this.natural(0, 9)
            return zip
        }
    })
    // TODO ...
    Random.extend({
        todo: function() {
            return 'todo'
        }
    })
    // Miscellaneous
    Random.extend({
        // Dice
        d4: function() {
            return this.natural(1, 4)
        },
        d6: function() {
            return this.natural(1, 6)
        },
        d8: function() {
            return this.natural(1, 8)
        },
        d12: function() {
            return this.natural(1, 12)
        },
        d20: function() {
            return this.natural(1, 20)
        },
        d100: function() {
            return this.natural(1, 100)
        },
        /*
            Guid
            http://www.broofa.com/2008/09/javascript-uuid-function/
            http://www.ietf.org/rfc/rfc4122.txt
            http://chancejs.com/#guid
        */
        guid: function() {

            var pool = "ABCDEF1234567890",
                guid = this.string(pool, 8) + '-' +
                    this.string(pool, 4) + '-' +
                    this.string(pool, 4) + '-' +
                    this.string(pool, 4) + '-' +
                    this.string(pool, 12);
            return guid
        },
        /*
            [身份证](http://baike.baidu.com/view/1697.htm#4)
                地址码 6 + 出生日期码 8 + 顺序码 3 + 校验码 1
            [《中华人民共和国行政区划代码》国家标准(GB/T2260)](http://zhidao.baidu.com/question/1954561.html)
        */
        id: function() {
            var id,
                sum = 0,
                rank = [
                        "7", "9", "10", "5", "8", "4", "2", "1", "6", "3", "7", "9", "10", "5", "8", "4", "2"
                ],
                last = [
                        "1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"
                ];

            id = this.pick(this.regions).split(' ')[0] +
                this.date('yyyyMMdd') +
                this.string('number', 3)

            for (var i = 0; i < id.length; i++) {
                sum += id[i] * rank[i];
            }
            id += last[sum % 11];

            return id
        }
    })

    return Random
})()


// src/mock/mock.js

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


// src/mock/mockjax.js

/*
    mock ajax
*/
// for jQuery
Mock.mockjax = function mockjax(jQuery) {
    function mockxhr() {
        return {
            open: jQuery.noop,
            send: jQuery.noop,
            getAllResponseHeaders: jQuery.noop,
            readyState: 4,
            status: 200
        }
    }

    function convert(mock) {
        return function() {
            return Mock.mock(mock.template)
        }
    }

    jQuery.ajaxPrefilter("*", function(options) {
        for (var surl in Mock._mocked) {
            var mock = Mock._mocked[surl]

            if (jQuery.type(mock.rurl) === 'string') {
                if (mock.rurl !== options.url) continue
            }
            if (jQuery.type(mock.rurl) === 'regexp') {
                if (!mock.rurl.test(options.url)) continue
            }

            options.converters['text json'] = convert(mock)
            options.xhr = mockxhr
            break
        }
    })

    return Mock
}

if (typeof jQuery != 'undefined') Mock.mockjax(jQuery)

// for KISSY
if (typeof KISSY != 'undefined' && KISSY.add) {
    Mock.mockjax = function mockjax(KISSY) {
        var _original_ajax = KISSY.io;
        KISSY.io = function(options) {
            // if (options.dataType === 'json') {
            for (var surl in Mock._mocked) {
                var mock = Mock._mocked[surl];

                if (KISSY.type(mock.rurl) === 'string') {
                    if (mock.rurl !== options.url) continue
                }
                if (KISSY.type(mock.rurl) === 'regexp') {
                    if (!mock.rurl.test(options.url)) continue
                }

                console.log('[mock]', options.url, '>', mock.rurl)
                var data = Mock.mock(mock.template)
                console.log('[mock]', data)
                if (options.success) options.success(data)
                if (options.complete) options.complete(data)
                return KISSY
            }
            // }
            return _original_ajax.apply(this, arguments)
        }
    }
}


// src/mock/expose.js
/*
    Expose Internal API
*/
Mock.Util = Util
Mock.Random = Random

/*
    For Module Loader
*/
if (typeof module === 'object' && module.exports) {
    // CommonJS
    module.exports = Mock;

} else if (typeof define === "function" && define.amd) {
    // AMD modules
    define(function() {
        return Mock;
    });

} else {
    // other, i.e. browser
    this.Mock = Mock;
}

// for KISSY
if (typeof KISSY != 'undefined') {

    /*
        KISSY.use('components/mock/index', function(S, Mock) {
            console.log(Mock.mock);
        })
    */
    
    KISSY.add('mock', function(S) {
        Mock.mockjax(S)
        return Mock
    }, {
        requires: ['ajax']
    })

    KISSY.add('components/mock/index', function(S) {
        Mock.mockjax(S)
        return Mock
    }, {
        requires: ['ajax']
    })
}

// src/mock/mock-suffix.js
}).call(this);
