/*! src/mock-prefix.js */
/*!
    Mock - 模拟请求 & 模拟数据
    https://github.com/nuysoft/Mock
    墨智 mozhi.gyy@taobao.com nuysoft@gmail.com
*/
(function(undefined) {
	var Mock = {
		version: '0.1.1',
		_mocked: {}
	}

/*! src/util.js */

/*
    Utilities
*/
var Util = (function() {
    var Util = {}

    Util.extend = function extend() {
        var target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            options, name, src, copy, clone

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

    Util.each('String Object Array RegExp Function'.split(' '), function(value) {
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

    /*
        ### Mock.heredoc(fn)

        * Mock.mockjax(fn)

        以直观、安全的方式书写（多行）HTML 模板。

        **使用示例**如下所示：

            var tpl = Mock.heredoc(function() {
                /*!
            {{email}}{{age}}
            <!-- Mock { 
                email: '@EMAIL',
                age: '@INT(1,100)'
            } -->
                *\/
            })
        
        **相关阅读**
        * [Creating multiline strings in JavaScript](http://stackoverflow.com/questions/805107/creating-multiline-strings-in-javascript)、
    */
    Util.heredoc = function heredoc(fn) {
        return fn.toString()
            .replace(/^[^\/]+\/\*!?/, '')
            .replace(/\*\/[^\/]+$/, '')
            .replace(/^[\s\xA0]+/, '').replace(/[\s\xA0]+$/, '') // .trim()
    }

    Util.noop = function() {}

    return Util
})()



/*! src/random.js */

/*
    ### Mock.Random
    
    Mock.Random 是一个工具类，用于生成各种随机数据。Mock.Random 的方法在数据模板中称为“占位符”，引用格式为 `@占位符(参数 [, 参数])` 。例如：

        var Random = Mock.Random;
        Random.email()
        // => "n.clark@miller.io"
        Mock.mock('@EMAIL')
        // => "y.lee@lewis.org"
        Mock.mock( { email: '@EMAIL' } )
        // => { email: "v.lewis@hall.gov" }

    可以在上面的例子中看到，直接调用 'Random.email()' 时方法名 `email()` 是小写的，而数据模板中的 `@EMAIL` 却是大写。这并对数据模板中的占位符做了特殊处理，也非强制的编写方式，事实上在数据模板中使用小写的 `@email` 也可以达到同样的效果。不过，这是建议的编码风格，以便在阅读时从视觉上提高占位符的识别率，快速识别占位符和普通字符。

    在浏览器中，为了减少需要拼写的字符，Mock.js 把 Mock.Random 暴露给了 window 对象，使之称为全局变量，从而可以直接访问 Random。因此上面例子中的 `var Random = Mock.Random;` 可以省略。在后面的例子中，也将做同样的处理。

    > 在 Node.js 中，仍然需要通过 `Mock.Random` 访问。

    Mock.Random 中的方法与数据模板的 `@占位符` 一一对应，在需要时可以为 Mock.Random 扩展方法，然后在数据模板中通过 `@扩展方法` 引用。例如：
    
        Random.extend({
            xzs: [], // 十二星座？程序员日历？
            xz: function(date){
                return ''
            }
        })
        Random.xz()
        // => ""
        Mock.mock('@XZ')
        // => ""
        Mock.mock({ xz: '@XZ'})
        // => ""
    
    Mock.js 的 [在线编辑器](http://mockjs.com/mock.html) 演示了完整的语法规则和占位符。

    下面是 Mock.Random 内置支持的方法说明。

    （功能，方法签名，参数说明，示例）
*/
var Random = (function() {
    var Random = {
        extend: Util.extend
    }
    /*
        #### Basics
    */
    Random.extend({
        /*
            ##### Random.boolean(min, max, cur)

            返回一个随机的布尔值。

            * Random.boolean()
            * Random.boolean(min, max, cur)
            * Random.bool()
            * Random.bool(min, max, cur)

            `Random.bool(min, max, cur)` 是 `Random.boolean(min, max, cur)` 的简写。在数据模板中，即可以使用（推荐） `BOOLEAN(min, max, cur)`，也可以使用 `BOOL(min, max, cur)`。

            参数的含义和默认值如下所示：

            * 参数 min：可选。指示参数 cur 出现的概率。概率计算公式为 `min / (min + max)`。该参数的默认值为 1，即有 50% 的概率返回参数 cur。
            * 参数 max：可选。指示参数 cur 的相反值（!cur）出现的概率。概率计算公式为 `max / (min + max)`。该参数的默认值为 1，即有 50% 的概率返回参数 cur。
            * 参数 cur：可选。可选值为布尔值 true 或 false。如果未传入任何参数，则返回 true 和 false 的概率各为 50%。该参数没有默认值，在该方法的内部，依据原生方法 Math.random() 返回的（浮点）数来计算和返回布尔值，例如在最简单的情况下，返回值是表达式 `Math.random() >= 0.5` 的执行结果。

            使用示例如下所示：

                var Random = Mock.Random;
                Random.boolean()
                // => true
                Random.boolean(1, 9, true)
                // => false
                Random.bool()
                // => false
                Random.bool(1, 9, false)
                // => true
            
            > 事实上，原生方法 Math.random() 返回的随机（浮点）数的分布并不均匀，是货真价实的伪随机数，将来会替换为基于 ？？ 来生成随机数。?? 对 Math.random() 的实现机制进行了分析和统计，并提供了随机数的参考实现，可以访问[这里](http://??)。
            TODO 统计

        */
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
        /*
            ##### Random.natural(min, max)

            返回一个随机的自然数（大于等于 0 的整数）。
            
            * Random.natural()
            * Random.natural(min)
            * Random.natural(min, max)

            参数的含义和默认值如下所示：
            * 参数 min：可选。指示随机自然数的最小值。默认值为 0。
            * 参数 max：可选。指示随机自然数的最小值。默认值为 9007199254740992。

            使用示例如下所示：

                var Random = Mock.Random;
                Random.natural()
                // => 1002794054057984
                Random.natural(10000)
                // => 71529071126209
                Random.natural(60, 100)
                // => 77
        */
        natural: function(min, max) {
            min = typeof min !== 'undefined' ? parseInt(min, 10) : 0
            max = typeof max !== 'undefined' ? parseInt(max, 10) : 9007199254740992 // 2^53
            return Math.round(Math.random() * (max - min)) + min
        },
        /*
            ##### Random.integer(min, max)

            返回一个随机的整数。

            * Random.integer()
            * Random.integer(min)
            * Random.integer(min, max)

            参数含义和默认值如下所示：
            * 参数 min：可选。指示随机整数的最小值。默认值为 -9007199254740992。
            * 参数 max：可选。指示随机整数的最大值。默认值为 9007199254740992。

            使用示例如下所示：
            Random.integer()
            // => -3815311811805184
            Random.integer(10000)
            // => 4303764511003750
            Random.integer(60,100)
            // => 96
        */
        integer: function(min, max) {
            min = typeof min !== 'undefined' ? parseInt(min, 10) : -9007199254740992
            max = typeof max !== 'undefined' ? parseInt(max, 10) : 9007199254740992 // 2^53
            return Math.round(Math.random() * (max - min)) + min
        },
        int: function(min, max) {
            return this.integer(min, max)
        },
        /*
            ##### Random.float(min, max, dmin, dmax)
            返回一个随机的浮点数。

            * Random.float()
            * Random.float(min)
            * Random.float(min, max)
            * Random.float(min, max, dmin)
            * Random.float(min, max, dmin, dmax)

            参数的含义和默认值如下所示：
            * min：可选。整数部分的最小值。默认值为 -9007199254740992。
            * max：可选。整数部分的最大值。默认值为 9007199254740992。
            * dmin：可选。小数部分位数的最小值。默认值为 0。
            * dmin：可选。小数部分位数的最大值。默认值为 17。

            使用示例如下所示：
                Random.float()
                // => -1766114241544192.8
                Random.float(0)
                // => 556530504040448.25
                Random.float(60, 100)
                // => 82.56779679549358
                Random.float(60, 100, 3)
                // => 61.718533677927894
                Random.float(60, 100, 3, 5)
                // => 70.6849
        */
        float: function(min, max, dmin, dmax) {
            dmin = dmin === undefined ? 0 : dmin
            dmin = Math.max(Math.min(dmin, 17), 0)
            dmax = dmax === undefined ? 17 : dmax
            dmax = Math.max(Math.min(dmax, 17), 0)
            var ret = this.integer(min, max) + '.';
            for (var i = 0, dcount = this.natural(dmin, dmax); i < dcount; i++) {
                ret += this.character('number')
            }
            return parseFloat(ret, 10)
        },
        /*
            ##### Random.character(pool)

            返回一个随机字符。

            * Random.character()
            * Random.character('lower/upper/number/symbol')
            * Random.character(pool)

            参数的含义和默认值如下所示：
            * 参数 pool：可选。表示字符池，将从中选择一个字符返回。
                * 如果传入 'lower'、'upper'、'number'、'symbol'，表示从内置的字符池从选取：
                
                    {
                        lower: "abcdefghijklmnopqrstuvwxyz",
                        upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                        number: "0123456789",
                        symbol: "!@#$%^&*()[]"
                    }

                * 如果未传入该参数，则从 `'lower' + 'upper' + 'number' + 'symbol'` 中随机选取一个字符返回。
            
            使用示例如下所示：

                Random.character()
                // => "P"
                Random.character('lower')
                // => "y"
                Random.character('upper')
                // => "X"
                Random.character('number')
                // => "1"
                Random.character('symbol')
                // => "&"
                Random.character('aeiou')
                // => "u"
        */
        character: function(pool) {
            var pools = {
                lower: "abcdefghijklmnopqrstuvwxyz",
                upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                number: "0123456789",
                symbol: "!@#$%^&*()[]"
            }
            pools.alpha = pools.lower + pools.upper
            pools['undefined'] = pools.lower + pools.upper + pools.number + pools.symbol

            pool = pools[('' + pool).toLowerCase()] || pool
            return pool.charAt(Random.natural(0, pool.length - 1))
        },
        char: function(pool) {
            return this.character(pool)
        },
        /*
            ##### Random.string(pool, min, max)

            返回一个随机字符串。

            * Random.string()
            * Random.string( length )
            * Random.string( pool, length )
            * Random.string( min, max )
            * Random.string( pool, min, max )
            
            参数的含义和默认如下所示：
            * 参数 pool：可选。表示字符池，将从中选择一个字符返回。
                * 如果传入 'lower'、'upper'、'number'、'symbol'，表示从内置的字符池从选取：
                
                    {
                        lower: "abcdefghijklmnopqrstuvwxyz",
                        upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                        number: "0123456789",
                        symbol: "!@#$%^&*()[]"
                    }

                * 如果未传入该参数，则从 `'lower' + 'upper' + 'number' + 'symbol'` 中随机选取一个字符返回。
            * 参数 min：可选。随机字符串的最小长度。默认值为 3。
            * 参数 max：可选。随机字符串的最大长度。默认值为 7。

            使用示例如下所示：

                Random.string()
                // => "pJjDUe"
                Random.string( 5 )
                // => "GaadY"
                Random.string( 'lower', 5 )
                // => "jseqj"
                Random.string( 7, 10 )
                // => "UuGQgSYk"
                Random.string( 'aeiou', 1, 3 )
                // => "ea"
        */
        string: function(pool, min, max) {
            var length;

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
            ##### Random.range(start, stop, step)

            返回一个整型数组。

            * Random.range(stop)
            * Random.range(start, stop)
            * Random.range(start, stop, step)

            参数的含义和默认值如下所示：
            * 参数 start：必选。数组中整数的起始值。
            * 参数 stop：可选。数组中整数的结束值（不包含在返回值中）。
            * 参数 step：可选。数组中整数之间的步长。默认值为 1。

            使用示例如下所示：

                Random.range(10)
                // => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
                Random.range(3, 7)
                // => [3, 4, 5, 6]
                Random.range(1, 10, 2)
                // => [1, 3, 5, 7, 9]
                Random.range(1, 10, 3)
                // => [1, 4, 7]

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
    /*
        #### Date
    */
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
        /*
            ##### Random.format(date, format)

            格式化日期。
        */
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
        /*
            ##### Random.format(date, format)

            生成一个随机的 Date 对象。
        */
        randomDate: function(min, max) { // min, max
            min = min === undefined ? new Date(0) : min
            max = max === undefined ? new Date() : max
            return new Date(Math.random() * (max.getTime() - min.getTime()))
        },
        /*
            ##### Random.date(format)

            返回一个随机的日期字符串。

            * Random.date()
            * Random.date(format)

            参数的含义和默认值如下所示：

            * 参数 format：可选。指示生成的日期字符串的格式。默认值为 `yyyy-MM-dd`。可选的占位符参考自 [Ext.Date](http://docs.sencha.com/ext-js/4-1/#!/api/Ext.Date)，如下所示：

                Format  Description                                                 Example
                ------- ----------------------------------------------------------- -------
                yyyy    A full numeric representation of a year, 4 digits           1999 or 2003
                yy      A two digit representation of a year                        99 or 03
                y       A two digit representation of a year                        99 or 03
                MM      Numeric representation of a month, with leading zeros       01 to 12
                M       Numeric representation of a month, without leading zeros    1 to 12
                dd      Day of the month, 2 digits with leading zeros               01 to 31
                d       Day of the month without leading zeros                      1 to 31
                HH      24-hour format of an hour with leading zeros                00 to 23
                H       24-hour format of an hour without leading zeros             0 to 23
                hh      12-hour format of an hour without leading zeros             1 to 12
                h       12-hour format of an hour with leading zeros                01 to 12
                mm      Minutes, with leading zeros                                 00 to 59
                m       Minutes, without leading zeros                              0 to 59
                ss      Seconds, with leading zeros                                 00 to 59
                s       Seconds, without leading zeros                              0 to 59
                SS      Milliseconds, with leading zeros                            000 to 999
                S       Milliseconds, without leading zeros                         0 to 999
                A       Uppercase Ante meridiem and Post meridiem                   AM or PM
                a       Lowercase Ante meridiem and Post meridiem                   am or pm

            使用示例如下所示：
                
                Random.date()
                // => "2002-10-23"
                Random.date('yyyy-MM-dd')
                // => "1983-01-29"
                Random.date('yy-MM-dd')
                // => "79-02-14"
                Random.date('y-MM-dd')
                // => "81-05-17"
                Random.date('y-M-d')
                // => "84-6-5"

        */
        date: function(format) {
            format = format || 'yyyy-MM-dd'
            return this.format(this.randomDate(), format)
        },
        /*
            ##### Random.time(format)

            返回一个随机的时间字符串。

            * Random.time()
            * Random.time(format)

            参数的含义和默认值如下所示：

            * 参数 format：可选。指示生成的时间字符串的格式。默认值为 `HH:mm:ss`。可选的占位符参考自 [Ext.Date](http://docs.sencha.com/ext-js/4-1/#!/api/Ext.Date)，请参见 [Random.date(format)](#Random.date(format))。

            使用示例如下所示：
                
                Random.time()
                // => "00:14:47"
                Random.time('A HH:mm:ss')
                // => "PM 20:47:37"
                Random.time('a HH:mm:ss')
                // => "pm 17:40:00"
                Random.time('HH:mm:ss')
                // => "03:57:53"
                Random.time('H:m:s')
                // => "3:5:13"
        */
        time: function(format) {
            format = format || 'HH:mm:ss'
            return this.format(this.randomDate(), format)
        },
        /*
            ##### Random.datetime(format)

            返回一个随机的日期和时间字符串。

            * Random.datetime()
            * Random.datetime(format)

            参数的含义和默认值如下所示：

            * 参数 format：可选。指示生成的日期和时间字符串的格式。默认值为 `yyyy-MM-dd HH:mm:ss`。可选的占位符参考自 [Ext.Date](http://docs.sencha.com/ext-js/4-1/#!/api/Ext.Date)，请参见 [Random.date(format)](#Random.date(format))。

            使用示例如下所示：
                
                Random.datetime()
                // => "1977-11-17 03:50:15"
                Random.datetime('yyyy-MM-dd A HH:mm:ss')
                // => "1976-04-24 AM 03:48:25"
                Random.datetime('yy-MM-dd a HH:mm:ss')
                // => "73-01-18 pm 22:12:32"
                Random.datetime('y-MM-dd HH:mm:ss')
                // => "79-06-24 04:45:16"
                Random.datetime('y-M-d H:m:s')
                // => "02-4-23 2:49:40"
        */
        datetime: function(format) {
            format = format || 'yyyy-MM-dd HH:mm:ss'
            return this.format(this.randomDate(), format)
        }
    })
    /*
        #### Image
    */
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
            ##### Random.img(size, background, foreground, format, text)

            * Random.img()
            * Random.img(size)
            * Random.img(size, background)
            * Random.img(size, background, text)
            * Random.img(size, background, foreground, text)
            * Random.img(size, background, foreground, format, text)

            生成一个随机的图片地址。

            **参数的含义和默认值**如下所示：

            * 参数 size：可选。指示图片的宽高，格式为 `'宽x高'`。默认从下面的数组中随机读取一个：

                    [
                        '300x250', '250x250', '240x400', '336x280', 
                        '180x150', '720x300', '468x60', '234x60', 
                        '88x31', '120x90', '120x60', '120x240', 
                        '125x125', '728x90', '160x600', '120x600', 
                        '300x600'
                    ]

            * 参数 background：可选。指示图片的背景色。默认值为 '#000000'。
            * 参数 foreground：可选。指示图片的前景色（文件）。默认值为 '#FFFFFF'。
            * 参数 format：可选。指示图片的格式。默认值为 'png'，可选值包括：'png'、'gif'、'jpg'。
            * 参数 text：可选。指示图片上文字。默认为 ''。

            **使用示例**如下所示：
                
                Random.img()
                // => "http://dummyimage.com/125x125"
                Random.img('200x100')
                // => "http://dummyimage.com/200x100"
                Random.img('200x100', '#fb0a2a')
                // => "http://dummyimage.com/200x100/fb0a2a"
                Random.img('200x100', '#02adea', 'hello')
                // => "http://dummyimage.com/200x100/02adea&text=hello"
                Random.img('200x100', '#00405d', '#FFF', 'mock')
                // => "http://dummyimage.com/200x100/00405d/FFF&text=mock"
                Random.img('200x100', '#ffcc33', '#FFF', 'png', 'js')
                // => "http://dummyimage.com/200x100/ffcc33/FFF.png&text=js"

            生成的路径所对应的图片如下所示：

            ![](http://dummyimage.com/125x125)
            ![](http://dummyimage.com/200x100)
            ![](http://dummyimage.com/200x100/fb0a2a)
            ![](http://dummyimage.com/200x100/02adea&text=hello)
            ![](http://dummyimage.com/200x100/00405d/FFF&text=mock)
            ![](http://dummyimage.com/200x100/ffcc33/FFF.png&text=js)
        */
        image: function(size, background, foreground, format, text) {
            if (arguments.length === 4) {
                text = format
                format = undefined
            }
            if (arguments.length === 3) {
                text = foreground
                foreground = undefined
            }
            if (!size) size = this.pick(this.ad_size)

            if (background && ~background.indexOf('#')) background = background.slice(1)
            if (foreground && ~foreground.indexOf('#')) foreground = foreground.slice(1)

            // http://dummyimage.com/600x400/cc00cc/470047.png&text=hello
            return 'http://dummyimage.com/' + size +
                (background ? '/' + background : '') +
                (foreground ? '/' + foreground : '') +
                (format ? '.' + format : '') +
                (text ? '&text=' + text : '')
        },
        img: function() {
            return this.image.apply(this, arguments)
        }
    })
    Random.extend({
        /*
            BrandColors
            http://brandcolors.net/
            A collection of major brand color codes curated by Galen Gidman.
            大牌公司的颜色集合

            // 获取品牌和颜色
            $('h2').each(function(index, item){
                item = $(item)
                console.log('\'' + item.text() + '\'', ':', '\'' + item.next().text() + '\'', ',')
            })
        */
        brandColors: {
            '4ormat': '#fb0a2a',
            '500px': '#02adea',
            'About.me (blue)': '#00405d',
            'About.me (yellow)': '#ffcc33',
            'Addvocate': '#ff6138',
            'Adobe': '#ff0000',
            'Aim': '#fcd20b',
            'Amazon': '#e47911',
            'Android': '#a4c639',
            'Angie\'s List': '#7fbb00',
            'AOL': '#0060a3',
            'Atlassian': '#003366',
            'Behance': '#053eff',
            'Big Cartel': '#97b538',
            'bitly': '#ee6123',
            'Blogger': '#fc4f08',
            'Boeing': '#0039a6',
            'Booking.com': '#003580',
            'Carbonmade': '#613854',
            'Cheddar': '#ff7243',
            'Code School': '#3d4944',
            'Delicious': '#205cc0',
            'Dell': '#3287c1',
            'Designmoo': '#e54a4f',
            'Deviantart': '#4e6252',
            'Designer News': '#2d72da',
            'Devour': '#fd0001',
            'DEWALT': '#febd17',
            'Disqus (blue)': '#59a3fc',
            'Disqus (orange)': '#db7132',
            'Dribbble': '#ea4c89',
            'Dropbox': '#3d9ae8',
            'Drupal': '#0c76ab',
            'Dunked': '#2a323a',
            'eBay': '#89c507',
            'Ember': '#f05e1b',
            'Engadget': '#00bdf6',
            'Envato': '#528036',
            'Etsy': '#eb6d20',
            'Evernote': '#5ba525',
            'Fab.com': '#dd0017',
            'Facebook': '#3b5998',
            'Firefox': '#e66000',
            'Flickr (blue)': '#0063dc',
            'Flickr (pink)': '#ff0084',
            'Forrst': '#5b9a68',
            'Foursquare': '#25a0ca',
            'Garmin': '#007cc3',
            'GetGlue': '#2d75a2',
            'Gimmebar': '#f70078',
            'GitHub': '#171515',
            'Google Blue': '#0140ca',
            'Google Green': '#16a61e',
            'Google Red': '#dd1812',
            'Google Yellow': '#fcca03',
            'Google+': '#dd4b39',
            'Grooveshark': '#f77f00',
            'Groupon': '#82b548',
            'Hacker News': '#ff6600',
            'HelloWallet': '#0085ca',
            'Heroku (light)': '#c7c5e6',
            'Heroku (dark)': '#6567a5',
            'HootSuite': '#003366',
            'Houzz': '#73ba37',
            'HTML5': '#ec6231',
            'IKEA': '#ffcc33',
            'IMDb': '#f3ce13',
            'Instagram': '#3f729b',
            'Intel': '#0071c5',
            'Intuit': '#365ebf',
            'Kickstarter': '#76cc1e',
            'kippt': '#e03500',
            'Kodery': '#00af81',
            'LastFM': '#c3000d',
            'LinkedIn': '#0e76a8',
            'Livestream': '#cf0005',
            'Lumo': '#576396',
            'Mixpanel': '#a086d3',
            'Meetup': '#e51937',
            'Nokia': '#183693',
            'NVIDIA': '#76b900',
            'Opera': '#cc0f16',
            'Path': '#e41f11',
            'PayPal (dark)': '#1e477a',
            'PayPal (light)': '#3b7bbf',
            'Pinboard': '#0000e6',
            'Pinterest': '#c8232c',
            'PlayStation': '#665cbe',
            'Pocket': '#ee4056',
            'Prezi': '#318bff',
            'Pusha': '#0f71b4',
            'Quora': '#a82400',
            'QUOTE.fm': '#66ceff',
            'Rdio': '#008fd5',
            'Readability': '#9c0000',
            'Red Hat': '#cc0000',
            'Resource': '#7eb400',
            'Rockpack': '#0ba6ab',
            'Roon': '#62b0d9',
            'RSS': '#ee802f',
            'Salesforce': '#1798c1',
            'Samsung': '#0c4da2',
            'Shopify': '#96bf48',
            'Skype': '#00aff0',
            'Snagajob': '#f47a20',
            'Softonic': '#008ace',
            'SoundCloud': '#ff7700',
            'Space Box': '#f86960',
            'Spotify': '#81b71a',
            'Sprint': '#fee100',
            'Squarespace': '#121212',
            'StackOverflow': '#ef8236',
            'Staples': '#cc0000',
            'Status Chart': '#d7584f',
            'Stripe': '#008cdd',
            'StudyBlue': '#00afe1',
            'StumbleUpon': '#f74425',
            'T-Mobile': '#ea0a8e',
            'Technorati': '#40a800',
            'The Next Web': '#ef4423',
            'Treehouse': '#5cb868',
            'Trulia': '#5eab1f',
            'Tumblr': '#34526f',
            'Twitch.tv': '#6441a5',
            'Twitter': '#00acee',
            'TYPO3': '#ff8700',
            'Ubuntu': '#dd4814',
            'Ustream': '#3388ff',
            'Verizon': '#ef1d1d',
            'Vimeo': '#86c9ef',
            'Vine': '#00a478',
            'Virb': '#06afd8',
            'Virgin Media': '#cc0000',
            'Wooga': '#5b009c',
            'WordPress (blue)': '#21759b',
            'WordPress (orange)': '#d54e21',
            'WordPress (grey)': '#464646',
            'Wunderlist': '#2b88d9',
            'XBOX': '#9bc848',
            'XING': '#126567',
            'Yahoo!': '#720e9e',
            'Yandex': '#ffcc00',
            'Yelp': '#c41200',
            'YouTube': '#c4302b',
            'Zalongo': '#5498dc',
            'Zendesk': '#78a300',
            'Zerply': '#9dcc7a',
            'Zootool': '#5e8b1d'
        },
        brands: function() {
            var brands = [];
            for (var b in this.brandColors) {
                brands.push(b)
            }
            return brands
        },
        dataImageHolder: function(size) {
            return 'holder.js/' + size
        },
        /*
            https://github.com/imsky/holder
            Holder renders image placeholders entirely on the client side.
        */
        dataImage: function(size, text) {
            var canvas = (typeof document !== 'undefined') && document.createElement('canvas'),
                ctx = canvas && canvas.getContext && canvas.getContext("2d");
            if (!canvas || !ctx) return ''

            if (!size) size = this.pick(this.ad_size)
            text = text !== undefined ? text : size

            size = size.split('x')

            var width = parseInt(size[0], 10),
                height = parseInt(size[1], 10),
                background = this.brandColors[this.pick(this.brands())],
                foreground = '#FFF',
                text_height = 14,
                font = 'sans-serif';

            canvas.width = width
            canvas.height = height
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.fillStyle = background
            ctx.fillRect(0, 0, width, height)
            ctx.fillStyle = foreground
            ctx.font = "bold " + text_height + "px " + font
            ctx.fillText(text, (width / 2), (height / 2), width)
            return canvas.toDataURL("image/png")
        }
    })
    /*
        #### Color
    */
    Random.extend({
        /*
            ##### Random.color()

            随机生成一个颜色，格式为 '#RRGGBB'。

            * Random.color()

            使用示例如下所示：

                Random.color()
                // => "#3538b2"
        */
        color: function() {
            var colour = Math.floor(Math.random() * (16 * 16 * 16 * 16 * 16 * 16 - 1)).toString(16)
            colour = "#" + ("000000" + colour).slice(-6)
            return colour
        }
    })
    /*
        #### Helpers
    */
    Random.extend({
        /*
            ##### Random.capitalize(word)

            把字符串的第一个字母转换为大写。

            * Random.capitalize(word)

            使用示例如下所示：

                Random.capitalize('hello')
                // => "Hello"
        */
        capitalize: function(word) {
            return word.charAt(0).toUpperCase() + word.substr(1)
        },
        /*
            ##### Random.upper(str)

            把字符串转换为大写。

            * Random.upper(str)

            使用示例如下所示：

                Random.upper('hello')
                // => "HELLO"
        */
        upper: function(str) {
            return str.toUpperCase()
        },
        /*
            ##### Random.lower(str)

            把字符串转换为小写。

            使用示例如下所示：

                Random.lower('HELLO')
                // => "hello"
        */
        lower: function(str) {
            return str.toLowerCase()
        },
        /*
            ##### Random.pick(arr)

            从数组中随机选取一个元素，并返回。

            * Random.pick(arr)

            使用示例如下所示：

                Random.pick(['a', 'e', 'i', 'o', 'u'])
                // => "o"
        */
        pick: function(arr) {
            return arr[this.natural(0, arr.length - 1)]
        },
        /*
            Given an array, scramble the order and return it.
            ##### Random.shuffle(arr)
            
            打乱数组中元素的顺序，并返回。

            * Random.shuffle(arr)

            使用示例如下所示：

                Random.shuffle(['a', 'e', 'i', 'o', 'u'])
                // => ["o", "u", "e", "i", "a"]
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
    /*
        #### Text
    */
    Random.extend({
        /*
            ##### Random.paragraph(len)

            随机生成一段文本。

            * Random.paragraph()
            * Random.paragraph(len)
            * Random.paragraph(min, max)

            参数的含义和默认值如下所示：

            * 参数 len：可选。指示文本中句子的个数。默认值为 3 到 7 之间的随机数。
            * 参数 min：可选。指示文本中句子的最小个数。默认值为 3。
            * 参数 max：可选。指示文本中句子的最大个数。默认值为 7。

            使用示例如下所示：

                Random.paragraph()
                // => "Yohbjjz psxwibxd jijiccj kvemj eidnus disnrst rcconm bcjrof tpzhdo ncxc yjws jnmdmty. Dkmiwza ibudbufrnh ndmcpz tomdyh oqoonsn jhoy rueieihtt vsrjpudcm sotfqsfyv mjeat shnqmslfo oirnzu cru qmpt ggvgxwv jbu kjde. Kzegfq kigj dtzdd ngtytgm comwwoox fgtee ywdrnbam utu nyvlyiv tubouw lezpkmyq fkoa jlygdgf pgv gyerges wbykcxhwe bcpmt beqtkq. Mfxcqyh vhvpovktvl hrmsgfxnt jmnhyndk qohnlmgc sicmlnsq nwku dxtbmwrta omikpmajv qda qrn cwoyfaykxa xqnbv bwbnyov hbrskzt. Pdfqwzpb hypvtknt bovxx noramu xhzam kfb ympmebhqxw gbtaszonqo zmsdgcku mjkjc widrymjzj nytudruhfr uudsitbst cgmwewxpi bye. Eyseox wyef ikdnws weoyof dqecfwokkv svyjdyulk glusauosnu achmrakky kdcfp kujrqcq xojqbxrp mpfv vmw tahxtnw fhe lcitj."
                Random.paragraph(2)
                // => "Dlpec hnwvovvnq slfehkf zimy qpxqgy vwrbi mok wozddpol umkek nffjcmk gnqhhvm ztqkvjm kvukg dqubvqn xqbmoda. Vdkceijr fhhyemx hgkruvxuvr kuez wmkfv lusfksuj oewvvf cyw tfpo jswpseupm ypybap kwbofwg uuwn rvoxti ydpeeerf."
                Random.paragraph(1, 3)
                // => "Qdgfqm puhxle twi lbeqjqfi bcxeeecu pqeqr srsx tjlnew oqtqx zhxhkvq pnjns eblxhzzta hifj csvndh ylechtyu."
        */
        paragraph: function(min, max) {
            var len;
            if (arguments.length === 0) len = Random.natural(3, 7)
            if (arguments.length === 1) len = max = min
            if (arguments.length === 2) {
                min = parseInt(min, 10)
                max = parseInt(max, 10)
                len = Random.natural(min, max)
            }

            var arr = []
            for (var i = 0; i < len; i++) {
                arr.push(Random.sentence())
            }
            return arr.join(' ')
        },
        /*
            ##### Random.sentence(len)

            随机生成一个句子，第一个的单词的首字母大写。

            * Random.sentence()
            * Random.sentence(len)
            * Random.sentence(min, max)

            参数的含义和默认值如下所示：

            * 参数 len：可选。指示句子中单词的个数。默认值为 12 到 18 之间的随机数。
            * 参数 min：可选。指示句子中单词的最小个数。默认值为 12。
            * 参数 max：可选。指示句子中单词的最大个数。默认值为 18。

            使用示例如下所示：

                Random.sentence()
                // => "Jovasojt qopupwh plciewh dryir zsqsvlkga yeam."
                Random.sentence(5)
                // => "Fwlymyyw htccsrgdk rgemfpyt cffydvvpc ycgvno."
                Random.sentence(3, 5)
                // => "Mgl qhrprwkhb etvwfbixm jbqmg."
        */
        sentence: function(min, max) {
            var len;
            if (arguments.length === 0) len = Random.natural(12, 18)
            if (arguments.length === 1) len = max = min
            if (arguments.length === 2) {
                min = parseInt(min, 10)
                max = parseInt(max, 10)
                len = Random.natural(min, max)
            }

            var arr = []
            for (var i = 0; i < len; i++) {
                arr.push(Random.word())
            }
            return Random.capitalize(arr.join(' ')) + '.'
        },
        /*
            ##### Random.word(len)

            随机生成一个单词。

            * Random.word()
            * Random.word(len)
            * Random.word(min, max)

            参数的含义和默认值如下所示：

            * 参数 len：可选。指示单词中字符的个数。默认值为 3 到 10 之间的随机数。
            * 参数 min：可选。指示单词中字符的最小个数。默认值为 3。
            * 参数 max：可选。指示单词中字符的最大个数。默认值为 10。

            使用示例如下所示：

                Random.word()
                // => "fxpocl"
                Random.word(5)
                // => "xfqjb"
                Random.word(3, 5)
                // => "kemh"

            > 目前，单字中字符是随机的小写字母，未来会根据词法生成“可读”的单词。
        */
        word: function(min, max) {
            var len;
            if (arguments.length === 0) len = Random.natural(3, 10)
            if (arguments.length === 1) len = max = min
            if (arguments.length === 2) {
                min = parseInt(min, 10)
                max = parseInt(max, 10)
                len = Random.natural(min, max)
            }

            var result = '';
            for (var i = 0; i < len; i++) {
                result += Random.character('lower')
            }

            return result
        },
        /*
            ##### Random.title(len)

            随机生成一句标题，其中每个单词的首字母大写。

            * Random.title()
            * Random.title(len)
            * Random.title(min, max)

            参数的含义和默认值如下所示：

            * 参数 len：可选。指示单词中字符的个数。默认值为 3 到 7 之间的随机数。
            * 参数 min：可选。指示单词中字符的最小个数。默认值为 3。
            * 参数 max：可选。指示单词中字符的最大个数。默认值为 7。

            使用示例如下所示：

                Random.title()
                // => "Rduqzr Muwlmmlg Siekwvo Ktn Nkl Orn"
                Random.title(5)
                // => "Ahknzf Btpehy Xmpc Gonehbnsm Mecfec"
                Random.title(3, 5)
                // => "Hvjexiondr Pyickubll Owlorjvzys Xfnfwbfk"
        */
        title: function(min, max) {
            var len,
                result = [];

            if (arguments.length === 0) len = Random.natural(3, 7)
            if (arguments.length === 1) len = max = min
            if (arguments.length === 2) {
                min = parseInt(min, 10)
                max = parseInt(max, 10)
                len = Random.natural(min, max)
            }

            for (var i = 0; i < len; i++) {
                result.push(this.capitalize(this.word()))
            }
            return result.join(' ')
        }
    })
    /*
        #### Name
    */
    Random.extend({
        /*
            ##### Random.first()

            随机生成一个常见的英文名。

            * Random.first()
            
            使用示例如下所示：

                Random.first()
                // => "Nancy"
        */
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
        /*
            ##### Random.last()

            随机生成一个常见的英文姓。

            * Random.last()
            
            使用示例如下所示：

                Random.last()
                // => "Martinez"
        */
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
        /*
            ##### Random.name(middle)

            随机生成一个常见的英文姓名。
            
            * Random.name()
            * Random.name(middle)

            参数的含义和默认值如下所示：

            * 参数 middle：可选。布尔值。指示是否生成中间名。
            
            使用示例如下所示：

                Random.name()
                // => "Larry Wilson"
                Random.name(true)
                // => "Helen Carol Martinez"
        */
        name: function(middle) {
            return this.first() + ' ' + (middle ? this.first() + ' ' : '') + this.last()
        }
    })
    /*
        #### Web
    */
    Random.extend({
        /*
            ##### Random.url()

            随机生成一个 URL。

            * Random.url()
            
            使用示例如下所示：

                Random.url()
                // => "http://vrcq.edu/ekqtyfi"
        */
        url: function() {
            return 'http://' + this.domain() + '/' + this.word()
        },
        /*
            ##### Random.domain()

            随机生成一个域名。

            * Random.domain()
            
            使用示例如下所示：

                Random.domain()
                // => "kozfnb.org"
        */
        domain: function(tld) {
            return this.word() + '.' + (tld || this.tld())
        },
        /*
            ##### Random.email()

            随机生成一个邮件地址。

            * Random.email()
            
            使用示例如下所示：

                Random.email()
                // => "x.davis@jackson.edu"
        */
        email: function(domain) {
            return this.character('lower') + '.' + this.last().toLowerCase() + '@' + this.last().toLowerCase() + '.' + this.tld()
            return this.word() + '@' + (domain || this.domain())
        },
        /*
            ##### Random.ip()

            随机生成一个 IP 地址。

            * Random.ip()
            
            使用示例如下所示：

                Random.ip()
                // => "34.206.109.169"
        */
        ip: function() {
            return this.natural(0, 255) + '.' +
                this.natural(0, 255) + '.' +
                this.natural(0, 255) + '.' +
                this.natural(0, 255)
        },
        tlds: ['com', 'org', 'edu', 'gov', 'co.uk', 'net', 'io'],
        /*
            ##### Random.tld()

            随机生成一个顶级域名。

            * Random.tld()
            
            使用示例如下所示：

                Random.tld()
                // => "io"
        */
        tld: function() { // Top Level Domain
            return this.pick(this.tlds)
        }
    })
    /*
        #### Address
        TODO 
    */
    Random.extend({
        areas: ['东北', '华北', '华东', '华中', '华南', '西南', '西北'],
        /*
            ##### Random.area()

            随机生成一个大区。

            * Random.area()
            
            使用示例如下所示：

                Random.area()
                // => "华北"
        */
        area: function() {
            return this.pick(this.areas)
        },

        /*
            > 23 个省：
            '河北省', '山西省', '辽宁省', '吉林省', '黑龙江省', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省', '广东省', '海南省', '四川省', '贵州省', '云南省', '陕西省', '甘肃省', '青海省', '台湾省',
            > 4 个直辖市：
            '北京市', '天津市', '上海市', '重庆市',
            > 5 个自治区：
            '广西壮族自治区', '内蒙古自治区', '西藏自治区', '宁夏回族自治区', '新疆维吾尔自治区',
            > 2 个特别行政区：
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
        /*
            ##### Random.region()

            随机生成一个省（或直辖市、自治区、特别行政区）。

            * Random.region()
            
            使用示例如下所示：

                Random.region()
                // => "辽宁省"
        */
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

    /*
        #### Miscellaneous
    */
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
            http://www.broofa.com/2008/09/javascript-uuid-function/
            http://www.ietf.org/rfc/rfc4122.txt
            http://chancejs.com/#guid

            ##### Random.guid()

            随机生成一个 GUID。

            * Random.guid()
            
            使用示例如下所示：

                Random.guid()
                // => "662C63B4-FD43-66F4-3328-C54E3FF0D56E"
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

            ##### Random.id()

            随机生成一个 18 位身份证。

            * Random.id()
            
            使用示例如下所示：

                Random.id()
                // => "420000200710091854"
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
        },

        /*
            自增主键
            auto increment primary key

            ##### Random.increment()

            生成一个全局的自增整数。

            * Random.increment(step)

            参数的含义和默认值如下所示：
            * 参数 step：可选。整数自增的步长。默认值为 1。

            使用示例如下所示：

                Random.increment()
                // => 1
                Random.increment(100)
                // => 101
                Random.increment(1000)
                // => 1101
        */
        autoIncrementInteger: 0,
        increment: function(step) {
            return this.autoIncrementInteger += (+step || 1)
        },
        inc: function(step) {
            return this.increment(step)
        }
    })

    return Random
})()


/*! src/mock.js */

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

    [正则查看工具](http://www.regexper.com/)
*/
var rkey = /(.+)\|(?:\+(\d+)|(\d+-?\d*)?(?:\.(\d+-?\d*))?)/,
    rrange = /(\d+)-?(\d+)?/,
    rplaceholder = /\\*@([^@#%&()\?\s\/\.]+)(?:\((.*?)\))?/g; // (^(?:.|\r|\n)*?)

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

Handle.gen = function(template, name, obj, templateContext) {
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
            templateContext: templateContext || template,
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
            result[key.replace(rkey, '$1')] = Handle.gen(options.template[key], key, result, options.template)
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
                phed = Handle.placeholder(ph, options.obj, options.templateContext)
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
    placeholder: function(placeholder, obj, templateContext) {
        // 1 key, 2 params
        rplaceholder.exec('')
        var parts = rplaceholder.exec(placeholder),
            key = parts && parts[1],
            lkey = key && key.toLowerCase(),
            okey = this._all()[lkey],
            params = parts && parts[2] ? parts[2].split(/,\s*/) : []

        if (obj && (key in obj)) return obj[key]

        if (templateContext &&
            (typeof templateContext === 'object') &&
            (key in templateContext)
        ) {
            templateContext[key] = Handle.gen(templateContext[key], key, obj, templateContext)
            return templateContext[key]
        }

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


/*! src/mockjax.js */

/*
    ### Mock.mockjax(library)

    覆盖（拦截） Ajax 请求，目前内置支持 jQuery、KISSY。

    对 jQuery Ajax 请求的拦截和响应，通过覆盖前置过滤器、选项 dataFilter 以及数据转换器实现，实现代码请问[这里]()。

    对 KISSY Ajax 请求的拦截和响应，则通过粗鲁地覆盖 KISSY.io(options) 实现，实现代码请问[这里]()。

    因为第三库 Ajax 的实现方式不尽相同，故目前只内置支持了实际开发中（本人和本人所服务的阿里） 常用的 jQuery 和 KISSY。如果需要拦截其他第三方库的 Ajax 请求，可参考对 jQuery 和 KISSY 的实现，覆盖 Mock.mockjax(library)。

    通过方法 Mock.mock(rurl, template) 设置的 URL 和数据模板的映射，均记录在属性 Mock._mocked 中，扩展时可从中获取 URL 对应的数据模板，进而生成和响应模拟数据。Mock._mocked 的数据结构为：
    
        {
            rurl.toString(): {
                rurl: rurl,
                template: template
            },
            ...
        }

    如果业务和场景需要，可以联系 [@墨智]()、[nuysoft](nuysoft@gmail.com) 提供对特定库的内置支持，不过最酷的做法是开发人员能够为 Mock.js 贡献代码。
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
            return Mock.mock(
                jQuery.isFunction(mock.template) ? mock.template() : mock.template
            )
        }
    }

    function prefilter(options) {
        for (var surl in Mock._mocked) {
            var mock = Mock._mocked[surl]

            if (jQuery.type(mock.rurl) === 'string') {
                if (mock.rurl !== options.url) continue
            }
            if (jQuery.type(mock.rurl) === 'regexp') {
                if (!mock.rurl.test(options.url)) continue
            }

            options.dataFilter = convert(mock)
            options.converters['text json'] = convert(mock)
            options.xhr = mockxhr
            break
        }
    }

    jQuery.ajaxPrefilter("*", prefilter)
    jQuery.ajaxPrefilter("json", prefilter)
    jQuery.ajaxPrefilter("jsonp", prefilter)

    return Mock
}

if (typeof jQuery != 'undefined') Mock.mockjax(jQuery)

// for KISSY
if (typeof KISSY != 'undefined' && KISSY.add) {
    Mock.mockjax = function mockjax(KISSY) {
        var _original_ajax = KISSY.io;

        // @白汀 提交：次对象用于模拟kissy的io响应之后的传给success方法的xhr对象，只构造了部分属性，不包含实际KISSY中的完整对象。
        var xhr = {
            readyState: 4,
            responseText: '',
            responseXML: null,
            state: 2,
            status: 200,
            statusText: "success",
            timeoutTimer: null
        };
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
                if (options.success) options.success(data, 'success', xhr)
                if (options.complete) options.complete(data, 'success', xhr)
                return KISSY
            }
            // }
            return _original_ajax.apply(this, arguments)
        }

        // 还原 KISSY.io 上的属性
        for(var name in _original_ajax) {
            KISSY.io[name] = _original_ajax[name]
        }
    }
}


/*! src/expose.js */
/*
    Expose Internal API

    把 Expose 部分放在代码头部非常直观 <https://github.com/kennethcachia/Background-Check/blob/master/background-check.js>
*/
Mock.Util = Util
Mock.Random = Random
Mock.heredoc = Util.heredoc

/*
    For Module Loader
*/
if (typeof module === 'object' && module.exports) {
    // CommonJS
    module.exports = Mock

} else if (typeof define === "function" && define.amd) {
    // AMD modules
    define(function() {
        return Mock
    })

} else if (typeof define === "function" && define.cmd) {
    // CMD modules
    define(function() {
        return Mock
    })

}
// else {
// other, i.e. browser
this.Mock = Mock
this.Random = Random
// }

// For KISSY
if (typeof KISSY != 'undefined') {

    /*
        KISSY.use('components/mock/index', function(S, Mock) {
            console.log(Mock.mock)
        })
    */
    Util.each([
        'mock', 'components/mock/index', 'mock/dist/mock',
        'gallery/Mock/0.1.1/index',
        'gallery/Mock/0.1.2/index'
    ], function register(name) {
        KISSY.add(name, function(S) {
            Mock.mockjax(S)
            return Mock
        }, {
            requires: ['ajax']
        })
    })
}

/*! src/mock4tpl.js */


/*
    Mock4Tpl - 基于客户端模板生成模拟数据

    https://github.com/nuysoft/Mock
    墨智 mozhi.gyy@taobao.com nuysoft@gmail.com
*/
(function(undefined) {
    var Mock4Tpl = {
        version: '0.0.1'
    }

    if (!this.Mock) module.exports = Mock4Tpl

    Mock.tpl = function(input, options, helpers, partials) {
        return Mock4Tpl.mock(input, options, helpers, partials)
    }
    Mock.parse = function(input) {
        return Handlebars.parse(input)
    }

    /*
        Mock4Tpl.mock(input)
        Mock4Tpl.mock(input, options)
        Mock4Tpl.mock(input, options, helpers)
        Mock4Tpl.mock(input, options, helpers, partials)
    */
    Mock4Tpl.mock = function(input, options, helpers, partials) {
        helpers = helpers ? Util.extend({}, helpers, Handlebars.helpers) :
            Handlebars.helpers
        partials = partials ? Util.extend({}, partials, Handlebars.partials) :
            Handlebars.partials
        return Handle.gen(input, null, options, helpers, partials)
    }

    var Handle = {
        debug: Mock4Tpl.debug || false,
        extend: Util.extend
    }

    /*
        Handle.gen(input, context, options, helpers, partials)
        Handle.gen(ast, context, options, helpers, partials)
        Handle.gen(node, context, options, helpers, partials)

        input      HTML 模板
        ast        HTML 模板
        node
        context
        options
        helpers
        partials

        ## 构造路径
        * 对于对象 
            {
                a: {
                    b: {
                        c: d
                    }
                }
            }
            → 
            [ a, b, c, d]
        * 对于数组
            {
                a: [{
                        b: [{
                                c: d
                            }
                        ]
                    }
                ]
            }
            ->
            [ a, [], b, [], c ]

     */
    Handle.gen = function(node, context, options, helpers, partials) {
        if (Util.isString(node)) {
            var ast = Handlebars.parse(node)
            options = Handle.parseOptions(node, options)
            var data = Handle.gen(ast, context, options, helpers, partials)
            return data
        }

        context = context || [{}]
        options = options || {}

        if (this[node.type] === Util.noop) return

        options.__path = options.__path || []

        if (Mock4Tpl.debug || Handle.debug) {
            console.log()
            console.group('[' + node.type + ']', JSON.stringify(node))
            // console.log('[context]', context.length, JSON.stringify(context))
            console.log('[options]', options.__path.length, JSON.stringify(options))
        }

        var preLength = options.__path.length
        this[node.type](node, context, options, helpers, partials)
        options.__path.splice(preLength)

        if (Mock4Tpl.debug || Handle.debug) {
            // console.log('[context]', context.length, JSON.stringify(context))
            console.groupEnd()
        }

        return context[context.length - 1]
    }

    Handle.parseOptions = function(input, options) {
        var rComment = /<!--\s*\n*Mock\s*\n*([\w\W]+?)\s*\n*-->/g;
        var comments = input.match(rComment),
            ret = {}, i, ma, option;
        for (i = 0; comments && i < comments.length; i++) {
            rComment.lastIndex = 0
            ma = rComment.exec(comments[i])
            if (ma) {
                /*jslint evil: true */
                option = new Function('return ' + ma[1])
                option = option()
                Util.extend(ret, option)
            }
        }
        return Util.extend(ret, options)
    }

    /*
        name    字符串，属性名
        options 字符串或对象，数据模板
        context 父节点，任意值
        def     默认值
    */
    Handle.val = function(name, options, context, def) {
        if (name !== options.__path[options.__path.length - 1]) throw new Error(name + '!==' + options.__path)
        if (Mock4Tpl.debug || Handle.debug) console.log('[options]', name, options.__path);
        if (def !== undefined) def = Mock.mock(def)
        if (options) {
            var mocked = Mock.mock(options)
            if (Util.isString(mocked)) return mocked
            if (name in mocked) {
                return mocked[name]
            }
        }
        if (Util.isArray(context[0])) return {}
        return def !== undefined ? def : (name) || Random.word()
    }


    /*
        AST
    */

    Handle.program = function(node, context, options, helpers, partials) {
        for (var i = 0; i < node.statements.length; i++) {
            this.gen(node.statements[i], context, options, helpers, partials)
        }
        // TODO node.inverse
    }

    Handle.mustache = function(node, context, options, helpers, partials) { // string id params
        var i,
            currentContext = context[0],
            contextLength = context.length;

        if (Util.type(currentContext) === 'array') {
            currentContext.push({})
            currentContext = currentContext[currentContext.length - 1]
            context.unshift(currentContext)
        }

        // "isHelper": 1
        // 为何要明确的 isHelper？因为 eligibleHelper 实在不可靠！
        if (node.isHelper || helpers && helpers[node.id.string]) {
            // node.params
            if (node.params.length === 0) {
                // TODO test_helper_this_with_register_and_holder
            } else {
                for (i = 0; i < node.params.length; i++) {
                    this.gen(node.params[i], context, options, helpers, partials)
                }
            }
            // node.hash
            if (node.hash) this.gen(node.hash, context, options, helpers, partials)
        } else {
            // node.id
            this.gen(node.id, context, options, helpers, partials)
            /*
                node.id.type === 'DATA'
                eg @index，放到 DATA 中处理 TODO 
            */
        }
        if (context.length > contextLength) context.splice(0, context.length - contextLength)
    }

    Handle.block = function(node, context, options, helpers, partials) { // mustache program inverse
        var parts = node.mustache.id.parts,
            i, len, cur, val, type,
            currentContext = context[0],
            contextLength = context.length;

        if (node.inverse) {} // TODO

        /*
        ## 关于自定义 block
        {{#block}}{{...}}{{/block}}
        | helper | type     | 模板引擎的行为                              | 模拟数据      | 
        | ------ | -------- | ----------------------------------------- | ------------ |
        | Y      | function | 由 helper 负责返回最后的结果                 | 不处理       |
        | N      | array    | 遍历该数组，渲染包含的 statements            | 默认为对象    |
        | N      | object   | 把该对象作为新 context，渲染包含的 statements | 默认为对象    |
        | N      | boolean  | 用当前 context 渲染包含的 statements         | 默认为对象    |

        ### 为什么默认为对象
        无论默认为对象或数组，当真实数据的类型与默认数据不匹配时，模拟数据的渲染结果都会与预期不符合。
        而把模拟数据的默认值设置为对象，则可以在渲染 object、boolean 时大致符合预期。
        更直观（易读）的做法是
        1. 明确指定数据的类型：数组 []、对象 {}、布尔 true/false。
        2. 遍历数组时，用 each helper。
        3. 为数据属性设置 Mock 参数，例如 `arr|5-10`: []。
        然而，目前开发过程中遇到的更多的是因此数组，这不是一个好习惯，因为在理解上会造成模棱两可的印象。
            我希望 Mock 是一个可用，并且好用的工具，除了这两个原则之外，任何固有的原则都可以放弃，
            因此如果有任何感受和建议，请反馈给我，如果可以贡献代码就更好了。
        
        ### 另外，为什么称为上下文 context，而不是作用域 scope 呢？
        在 Mock4Tpl 的模拟过程中，以及模板引擎的渲染过程中，只是在某个对象或数组上设置或设置属性，是上下文的概念，根本没有“作用域”的概念。
            虽然从理解的角度，这两个过程与作用域极为“相似”，但是如果描述成“相似”，其实是对本质和概念的误导。
            但是。。。好吧，确实“作用域”要更形象，更易于被不了解内部原理的人所接受。
     */

        // block.mustache
        if (node.mustache.isHelper ||
            helpers && helpers[node.mustache.id.string]) {
            type = parts[0] // helper: each if unless with log
            // 指定 Handle 为上下文是为了使用 Handle 的方法
            val = (Helpers[type] || Helpers.custom).apply(this, arguments)
            currentContext = context[0]
        } else {
            for (i = 0; i < parts.length; i++) {
                options.__path.push(parts[i])

                cur = parts[i]

                val = this.val(cur, options, context, {})
                currentContext[cur] = Util.isArray(val) && [] || val

                type = Util.type(currentContext[cur])
                if (type === 'object' || type === 'array') {
                    currentContext = currentContext[cur]
                    context.unshift(currentContext)
                }
            }
        }

        // block.program
        if (node.program) {
            if (Util.type(currentContext) === 'array') {
                len = val.length || Random.integer(3, 7)
                // Handle.program() 可以自己解析和生成数据，但是不知道该重复几次，所以这里需要循环调用
                for (i = 0; i < len; i++) {
                    currentContext.push(typeof val[i] !== 'undefined' ? val[i] : {})

                    options.__path.push('[]')
                    context.unshift(currentContext[currentContext.length - 1])
                    this.gen(node.program, context, options, helpers, partials)
                    options.__path.pop()
                    context.shift()
                }
            } else this.gen(node.program, context, options, helpers, partials)
        }

        if (context.length > contextLength) context.splice(0, context.length - contextLength)
    }

    Handle.hash = function(node, context, options, helpers, partials) {
        var pairs = node.pairs,
            pair, i, j;
        for (i = 0; i < pairs.length; i++) {
            pair = pairs[i]
            for (j = 1; j < pair.length; j++) {
                this.gen(pair[j], context, options, helpers, partials)
            }
        }
    }

    Handle.ID = function(node, context, options) { // , helpers, partials
        var parts = node.parts,
            i, len, cur, prev, def, val, type, valType, preOptions,
            currentContext = context[node.depth], // back path, eg {{../permalink}}
            contextLength = context.length;

        if (Util.isArray(currentContext)) currentContext = context[node.depth + 1]

        if (!parts.length) {
            // TODO 修正父节点的类型
        } else {
            for (i = 0, len = parts.length; i < len; i++) {
                options.__path.push(parts[i])

                cur = parts[i]
                prev = parts[i - 1]
                preOptions = options[prev]

                def = i === len - 1 ? currentContext[cur] : {}
                val = this.val(cur, /*preOptions && preOptions[cur] ? preOptions :*/ options, context, def)

                type = Util.type(currentContext[cur])
                valType = Util.type(val)
                if (type === 'undefined') {
                    // 如果不是最后一个属性，并且当前值不是 [] 或 {}，则修正为 [] 或 {}
                    if (i < len - 1 && valType !== 'object' && valType !== 'array') {
                        currentContext[cur] = {}
                    } else {
                        currentContext[cur] = Util.isArray(val) && [] || val
                    }
                } else {
                    // 已有值
                    // 如果不是最后一个属性，并且不是 [] 或 {}，则修正为 [] 或 {}
                    if (i < len - 1 && type !== 'object' && type !== 'array') {
                        currentContext[cur] = Util.isArray(val) && [] || {}
                    }
                }

                type = Util.type(currentContext[cur])
                if (type === 'object' || type === 'array') {
                    currentContext = currentContext[cur]
                    context.unshift(currentContext)
                }
            }
        }
        if (context.length > contextLength) context.splice(0, context.length - contextLength)
    }

    Handle.partial = function(node, context, options, helpers, partials) {
        var name = node.partialName.name,
            partial = partials && partials[name],
            contextLength = context.length;

        if (partial) Handle.gen(partial, context, options, helpers, partials)

        if (context.length > contextLength) context.splice(0, context.length - contextLength)
    }
    Handle.content = Util.noop
    Handle.PARTIAL_NAME = Util.noop
    Handle.DATA = Util.noop
    Handle.STRING = Util.noop
    Handle.INTEGER = Util.noop
    Handle.BOOLEAN = Util.noop
    Handle.comment = Util.noop

    var Helpers = {}

    Helpers.each = function(node, context, options) {
        var i, len, cur, val, parts, def, type,
            currentContext = context[0];

        parts = node.mustache.params[0].parts // each 只需要处理第一个参数，更多的参数由 each 自己处理
        for (i = 0, len = parts.length; i < len; i++) {
            options.__path.push(parts[i])

            cur = parts[i]
            def = i === len - 1 ? [] : {}

            val = this.val(cur, options, context, def)

            currentContext[cur] = Util.isArray(val) && [] || val

            type = Util.type(currentContext[cur])
            if (type === 'object' || type === 'array') {
                currentContext = currentContext[cur]
                context.unshift(currentContext)
            }
        }

        return val
    }

    Helpers['if'] = Helpers.unless = function(node, context, options) {
        var params = node.mustache.params,
            i, j, cur, val, parts, def, type,
            currentContext = context[0];

        for (i = 0; i < params.length; i++) {
            parts = params[i].parts
            for (j = 0; j < parts.length; j++) {
                if (i === 0) options.__path.push(parts[j])

                cur = parts[j]
                def = j === parts.length - 1 ? '@BOOL(2,1,true)' : {}

                val = this.val(cur, options, context, def)
                if (j === parts.length - 1) {
                    val = val === 'true' ? true :
                        val === 'false' ? false : val
                }

                currentContext[cur] = Util.isArray(val) ? [] : val

                type = Util.type(currentContext[cur])
                if (type === 'object' || type === 'array') {
                    currentContext = currentContext[cur]
                    context.unshift(currentContext)
                }
            }
        }
        return val
    }

    Helpers['with'] = function(node, context, options) {
        var i, cur, val, parts, def,
            currentContext = context[0];

        parts = node.mustache.params[0].parts
        for (i = 0; i < parts.length; i++) {
            options.__path.push(parts[i])

            cur = parts[i]
            def = {}

            val = this.val(cur, options, context, def)

            currentContext = currentContext[cur] = val
            context.unshift(currentContext)
        }
        return val
    }

    Helpers.log = function() {
        // {{log "Look at me!"}}
    }

    Helpers.custom = function(node, context, options) {
        var i, len, cur, val, parts, def, type,
            currentContext = context[0];

        // custom helper
        // 如果 helper 没有参数，则认为是在当前上下文中判断 helper 是否为 true
        if (node.mustache.params.length === 0) {
            return

            // 按理说，Mock4Tpl 不需要也不应该模拟 helper 的行为（返回值），只需要处理 helper 的 params 和 statements。
            // 之所以保留下面的代码，是为了以防需要时扩展，也就是说，如果连 helper 也需要模拟的话！
            options.__path.push(node.mustache.id.string)

            cur = node.mustache.id.string
            def = '@BOOL(2,1,true)'

            val = this.val(cur, options, context, def)

            currentContext[cur] = Util.isArray(val) && [] || val

            type = Util.type(currentContext[cur])
            if (type === 'object' || type === 'array') {
                currentContext = currentContext[cur]
                context.unshift(currentContext)
            }

        } else {
            parts = node.mustache.params[0].parts
            for (i = 0, len = parts.length; i < len; i++) {
                options.__path.push(parts[i])

                cur = parts[i]
                def = i === len - 1 ? [] : {} // 默认值也可以是 []，如果有必要的话

                val = this.val(cur, options, context, def)

                currentContext[cur] = Util.isArray(val) && [] || val

                type = Util.type(currentContext[cur])
                if (type === 'object' || type === 'array') {
                    currentContext = currentContext[cur]
                    context.unshift(currentContext)
                }
            }
        }
        return val
    }

}).call(this);


/*! src/mock4xtpl.js */

(function(undefined) {
    if (typeof KISSY === 'undefined') return

    var Mock4XTpl = {
        debug: false
    }

    var XTemplate;

    KISSY.use('xtemplate', function(S, T) {
        XTemplate = T
    })

    if (!this.Mock) module.exports = Mock4XTpl

    Mock.xtpl = function(input, options, helpers, partials) {
        return Mock4XTpl.mock(input, options, helpers, partials)
    }
    Mock.xparse = function(input) {
        return XTemplate.compiler.parse(input)
    }

    /*
        参数 options 可以通过 {{mock ...}} 指定，有2种方式：
        1. 为属性值设置单独的配置，例如：
            {{title}}{{mock @EMAIL}}
        2. 集中配置整个模板，例如：
            {{#article}}{{title}}{{/article}}
            {{mock title=@EMAIL }}
        支持嵌套指定、上下文，支持所有 Mock 占位符。
    */
    Mock4XTpl.mock = function(input, options, helpers, partials) {
        helpers = helpers ? Util.extend({}, helpers, XTemplate.RunTime.commands) :
            XTemplate.RunTime.commands
        partials = partials ? Util.extend({}, partials, XTemplate.RunTime.subTpls) :
            XTemplate.RunTime.subTpls
        // XTemplate.RunTime.subTpls // 全局子模板
        // xtemplate.option.subTpls 局部子模板
        return this.gen(input, null, options, helpers, partials, {})
    }

    Mock4XTpl.parse = function(input) {
        return XTemplate.compiler.parse(input)
    }

    Mock4XTpl.gen = function(node, context, options, helpers, partials, other) {
        if (typeof node === 'string') {
            if (Mock4XTpl.debug) {
                console.log('[tpl    ]\n', node)
            }
            var ast = this.parse(node)
            options = this.parseOptions(node, options)
            var data = this.gen(ast, context, options, helpers, partials, other)
            return data
        }

        context = context || [{}]
        options = options || {}

        node.type = node.type
        // for (var n in node) node[n] = node[n]

        if (this[node.type] === Util.noop) return

        options.__path = options.__path || []

        if (Mock4XTpl.debug) {
            console.log()
            console.group('[' + node.type + ']', JSON.stringify(node))
            console.log('[context]', '[before]', context.length, JSON.stringify(context))
            console.log('[options]', '[before]', options.__path.length, JSON.stringify(options))
            console.log('[other  ]', '[before]', JSON.stringify(other))
        }

        var preLength = options.__path.length
        this[node.type](node, context, options, helpers, partials, other)

        if (Mock4XTpl.debug) {
            console.log('[__path ]', '[after ]', options.__path);
        }

        if (!other.hold ||
            typeof other.hold === 'function' && !other.hold(node, options, context)) {
            options.__path.splice(preLength)
        }

        if (Mock4XTpl.debug) {
            console.log('[context]', '[after ]', context.length, JSON.stringify(context))
            console.groupEnd()
        }

        return context[context.length - 1]
    }


    /*
        {{email}}{{age}}
        <!-- Mock { email: '@EMAIL' } -->
        <!-- Mock { age: '@INT' } -->

        > 关于模板引擎的注释节点 `{{! 注释内容 }}`（不是 HTML 注释 <!-- -->）：**在 Handlebars 中，注释节点会出现在从 HTML 模板解析得到的语法树中**，因为 Mock.js 是基于 HTML 模板的语法树生成模拟数据，因此从理论上（尚未实现，原因下表），可以通过注释节点来配置数据模板，例如 `{{email}}{{! @EMAIL }}`。这种配置方式的好处有：1) 不需要敲打略显繁琐的 `{{email}}<!-- Mock { email: '@EMAIL' } -->`，2) 可以省去敲打 `email:`，3) 可以就近配置方便阅读。这种配置方式的坏处有：1) 过于零碎不易管理。另外，**KISSY XTempalte 不会把注释节点放入语法树中**。因此，暂时不提供这种配置方式。如果您有更好的想法，欢迎提交 [Issues]() 讨论。
    */
    Mock4XTpl.parseOptions = function(input, options) {
        var rComment = /<!--\s*\n*Mock\s*\n*([\w\W]+?)\s*\n*-->/g;
        var comments = input.match(rComment),
            ret = {}, i, ma, option;
        for (i = 0; comments && i < comments.length; i++) {
            rComment.lastIndex = 0
            ma = rComment.exec(comments[i])
            if (ma) {
                /*jslint evil: true */
                option = new Function('return ' + ma[1])
                option = option()
                Util.extend(ret, option)
            }
        }
        return Util.extend(ret, options)
    }

    Mock4XTpl.parseVal = function(expr, object) {

        function queryArray(prop, context) {
            if (typeof context === 'object' && prop in context) return [context[prop]]

            var ret = []
            for (var i = 0; i < context.length; i++) {
                ret.push.apply(ret, query(prop, [context[i]]))
            }
            return ret
        }

        function queryObject(prop, context) {
            if (typeof context === 'object' && prop in context) return [context[prop]]

            var ret = [];
            for (var key in context) {
                ret.push.apply(ret, query(prop, [context[key]]))
            }
            return ret
        }

        function query(prop, set) {
            var ret = [];
            for (var i = 0; i < set.length; i++) {
                if (typeof set[i] !== 'object') continue
                if (prop in set[i]) ret.push(set[i][prop])
                else {
                    ret.push.apply(ret, Util.isArray(set[i]) ?
                        queryArray(prop, set[i]) :
                        queryObject(prop, set[i]))
                }
            }
            return ret
        }

        function parse(expr, context) {
            var parts = typeof expr === 'string' ? expr.split('.') : expr.slice(0),
                set = [context];
            while (parts.length) {
                set = query(parts.shift(), set)
            }
            return set
        }

        return parse(expr, object)
    }

    Mock4XTpl.val = function(name, options, context, def) {
        if (name !== options.__path[options.__path.length - 1]) throw new Error(name + '!==' + options.__path)
        if (def !== undefined) def = Mock.mock(def)
        if (options) {
            var mocked = Mock.mock(options)
            if (Util.isString(mocked)) return mocked

            // TODO 深沉嵌套配置
            var ret = Mock4XTpl.parseVal(options.__path, mocked)
            if (ret.length > 0) return ret[0]

            if (name in mocked) {
                return mocked[name]
            }
        }
        if (Util.isArray(context[0])) return {}
        return def !== undefined ? def : name
    }

    Mock4XTpl.program = function(node, context, options, helpers, partials, other) {
        // node.statements
        for (var i = 0; i < node.statements.length; i++) {
            this.gen(node.statements[i], context, options, helpers, partials, other)
        }
        // node.inverse
        for (var j = 0; node.inverse && j < node.inverse.length; j++) {
            this.gen(node.inverse[j], context, options, helpers, partials, other)
        }
    }

    Mock4XTpl.block = function(node, context, options, helpers, partials, other) { // mustache program inverse
        var contextLength = context.length

        // node.tpl
        this.gen(node.tpl, context, options, helpers, partials, Util.extend({}, other, {
            /*
                TODO
                {{#noop}}{{body}}{{/noop}}    -> { "noop": { "body": "body"} }
                {{#list nav}}{{url}}{{/list}} -> { "nav": { "url": "url", "title": "title"} }
            */
            def: {}, // 
            hold: true
        }))

        // node.program
        var currentContext = context[0],
            mocked, i, len;
        if (Util.type(currentContext) === 'array') {
            mocked = this.val(options.__path[options.__path.length - 1], options, context)
            len = mocked && mocked.length || Random.integer(3, 7)
            for (i = 0; i < len; i++) {
                // test_relational_expression_each > mocked[i] != undefined
                currentContext.push(mocked && mocked[i] !== undefined ? mocked[i] : {})

                options.__path.push(i)
                context.unshift(currentContext[currentContext.length - 1])

                this.gen(node.program, context, options, helpers, partials, other)

                options.__path.pop()
                context.shift()
            }
        } else this.gen(node.program, context, options, helpers, partials, other)

        if (!other.hold ||
            typeof other.hold === 'function' && !other.hold(node, options, context)) {
            context.splice(0, context.length - contextLength)
        }
    }

    Mock4XTpl.tpl = function(node, context, options, helpers, partials, other) {
        if (node.params && node.params.length) {
            other = Util.extend({}, other, {
                def: {
                    'each': [],
                    'if': '@BOOL(2,1,true)', // node.params[0].type === 'id' ? '@BOOL(2,1,true)' : undefined,
                    'unless': '@BOOL(2,1,false)',
                    'with': {}
                }[node.path.string],
                hold: {
                    'each': true,
                    'if': function(_, __, ___, name, value) { // 暂时不需要关注前三个参数：node, options, context。
                        return typeof value === 'object'
                    },
                    'unless': function(_, __, ___, name, value) {
                        return typeof value === 'object'
                    },
                    'with': true,
                    'include': false
                }[node.path.string]
            })
            // node.params
            for (var i = 0, input; i < node.params.length; i++) {
                if (node.path.string === 'include') {
                    input = partials && partials[node.params[i].value]
                } else input = node.params[i]
                if (input) this.gen(input, context, options, helpers, partials, other)
            }
            // node.hash
            if (node.hash) {
                this.gen(node.hash, context, options, helpers, partials, other)
            }
        } else {
            this.gen(node.path, context, options, helpers, partials, other)
        }
    }
    Mock4XTpl.tplExpression = function(node, context, options, helpers, partials, other) {
        this.gen(node.expression, context, options, helpers, partials, other)
    }

    Mock4XTpl.content = Util.noop
    Mock4XTpl.unaryExpression = Util.noop

    Mock4XTpl.multiplicativeExpression =
        Mock4XTpl.additiveExpression = function(node, context, options, helpers, partials, other) {
            // TODO 如果参与运算是数值型，默认为整数或浮点数
            this.gen(node.op1, context, options, helpers, partials, Util.extend({}, other, {
                def: function() {
                    return node.op2.type === 'number' ?
                        node.op2.value.indexOf('.') > -1 ?
                        Random.float(-Math.pow(10, 10), Math.pow(10, 10), 1, Math.pow(10, 6)) :
                        Random.integer() :
                        undefined
                }()
            }))
            this.gen(node.op2, context, options, helpers, partials, Util.extend({}, other, {
                def: function() {
                    return node.op1.type === 'number' ?
                        node.op1.value.indexOf('.') > -1 ?
                        Random.float(-Math.pow(10, 10), Math.pow(10, 10), 1, Math.pow(10, 6)) :
                        Random.integer() :
                        undefined
                }()
            }))
    }

    Mock4XTpl.relationalExpression = function(node, context, options, helpers, partials, other) {
        this.gen(node.op1, context, options, helpers, partials, other)
        this.gen(node.op2, context, options, helpers, partials, other)
    }

    Mock4XTpl.equalityExpression = Util.noop
    Mock4XTpl.conditionalAndExpression = Util.noop
    Mock4XTpl.conditionalOrExpression = Util.noop
    Mock4XTpl.string = Util.noop
    Mock4XTpl.number = Util.noop
    Mock4XTpl.boolean = Util.noop

    Mock4XTpl.hash = function(node, context, options, helpers, partials, other) {
        var pairs = node.value,
            key;
        for (key in pairs) {
            this.gen(pairs[key], context, options, helpers, partials, other)
        }
    }

    Mock4XTpl.id = function(node, context, options, helpers, partials, other) {
        var contextLength = context.length

        var parts = node.parts,
            currentContext = context[node.depth],
            i, len, cur, def, val;

        function fix(currentContext, index, length, name, val) {
            var type = Util.type(currentContext[name]),
                valType = Util.type(val);
            val = val === 'true' ? true :
                val === 'false' ? false : val
            if (type === 'undefined') {
                // 如果不是最后一个属性，并且当前值不是 [] 或 {}，则修正为 [] 或 {}
                if (index < length - 1 && !Util.isObjectOrArray(val)) {
                    currentContext[name] = {}
                } else {
                    currentContext[name] = Util.isArray(val) && [] || val
                }
            } else {
                // 已有值
                // 如果不是最后一个属性，并且不是 [] 或 {}，则修正为 [] 或 {}
                if (index < length - 1 && type !== 'object' && type !== 'array') {
                    currentContext[name] = Util.isArray(val) && [] || {}
                } else {
                    /*
                        其他情况下，
                        尽量不改变类型（对象、数组、基本类型）的情况下，覆盖已有值，
                        以支持在后面的模拟过程中修正模拟值。
                    */
                    if (type !== 'object' && type !== 'array' &&
                        valType !== 'object' && valType !== 'array') {
                        currentContext[name] = val
                    }
                }


            }
            return currentContext[name]
        }

        if (Util.isArray(currentContext)) currentContext = context[node.depth + 1]

        for (i = 0, len = parts.length; i < len; i++) {
            /*
                TODO 过滤掉 this、内置占位符（xindex、xcount、xkey）、helper，
                然而万全之策是先检查 options 中是否存在对应的配置，如果没有则忽略，如果有责生成。
                不过，在应用中不建议覆盖内置占位符。
                TODO 遇到 xindex、xcount 要修正为数组
                TODO 遇到 xkey 要修正为对象
            */
            if (i === 0 && parts[i] === 'this') continue
            if (/^(xindex|xcount|xkey)$/.test(parts[i])) continue // TODO 需要判断内置占位符（xindex、xcount、xkey）的位置吗，例如是否是第一个？
            if (i === 0 && len === 1 && parts[i] in helpers) continue

            options.__path.push(parts[i])

            cur = parts[i]

            def = i === len - 1 ?
                other.def !== undefined ? other.def :
                context[0][cur] : {}
            val = this.val(cur, options, context, def)

            if (Mock4XTpl.debug) {
                console.log('[def    ]', JSON.stringify(def))
                console.log('[val    ]', JSON.stringify(val))
            }

            val = fix(currentContext, i, len, cur, val)

            if (Util.isObjectOrArray(currentContext[cur])) {
                context.unshift(currentContext = currentContext[cur])
            }
        }

        if (!other.hold ||
            typeof other.hold === 'function' && !other.hold(node, options, context, cur, val)) {
            context.splice(0, context.length - contextLength)
        }
    }

}).call(this);


/*! src/mock-suffix.js */
}).call(this);
