var Util = require('./util');

// BEGIN(BROWSER)
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

            start = +start, stop = +stop, step = +step

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
            },
            T: 'getTime'
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
        },
        /*
            Ranndom.now(unit, format)
            Ranndom.now()
            Ranndom.now(unit)
            Ranndom.now(format)

            参考自 http://momentjs.cn/docs/#/manipulating/start-of/
        */
        now: function(unit, format) {
            if (arguments.length === 1) {
                if (!/year|month|week|day|hour|minute|second|week/.test(unit)) {
                    format = unit
                    unit = ''
                }
            }
            unit = (unit || '').toLowerCase()
            format = format || 'yyyy-MM-dd HH:mm:ss'

            var date = new Date()
            /* jshint -W086 */
            switch (unit) {
                case 'year':
                    date.setMonth(0)
                case 'month':
                    date.setDate(1)
                case 'week':
                case 'day':
                    date.setHours(0)
                case 'hour':
                    date.setMinutes(0)
                case 'minute':
                    date.setSeconds(0)
                case 'second':
                    date.setMilliseconds(0)
            }
            switch (unit) {
                case 'week':
                    date.setDate(date.getDate() - date.getDay())
            }

            return this.format(date, format)
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

            替代图片源
                http://fpoimg.com/
            参考自 
                http://rensanning.iteye.com/blog/1933310
                http://code.tutsplus.com/articles/the-top-8-placeholders-for-web-designers--net-19485
            
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
        /*
            https://github.com/imsky/holder
            Holder renders image placeholders entirely on the client side.

            dataImageHolder: function(size) {
                return 'holder.js/' + size
            },
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
            return (word + '').charAt(0).toUpperCase() + (word + '').substr(1)
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
            return (str + '').toUpperCase()
        },
        /*
            ##### Random.lower(str)

            把字符串转换为小写。

            使用示例如下所示：

                Random.lower('HELLO')
                // => "hello"
        */
        lower: function(str) {
            return (str + '').toLowerCase()
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
            arr = arr || []
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
            arr = arr || []
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
        },
        /*
            ##### Random.chineseName(count)

            随机生成一个常见的中文姓名。

            * Random.chineseName()
            * Random.chineseName(count)

            参数的含义和默认值如下所示：

            * 参数 count：可选。数字。指示姓名的字数，默认为 2 个或 3 个字的随机姓名。

            使用示例如下所示：

                Random.chineseName()
                // => "林则徐"
                Random.chineseName(2)
                // => "马云"
        */
        chineseName: function(count) {
            var surnames = '赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢邹喻柏水窦章云苏潘葛奚范彭郎鲁韦昌马苗凤花方俞任袁柳酆鲍史唐'.split('');
            var forenames = '贵福生龙元全国胜学祥才发武新利清飞彬富顺信子杰涛昌成康星光天达安岩中茂进林有坚和彪博绍功松善厚庆磊民友裕河哲江超浩亮政谦亨奇固之轮翰朗伯宏言若鸣朋斌梁栋维启克伦翔旭鹏月莺媛艳瑞凡佳嘉琼勤珍贞莉桂娣叶璧璐娅琦晶妍茜秋珊莎锦黛青倩婷姣婉娴瑾颖露瑶怡婵雁蓓'.split('');
            if (typeof count !== 'number') {
                count = Math.random() > 0.66 ? 2 : 3
            }
            var surname = this.pick(surnames)
            var forename = ''
            count = count - 1
            for (var i = 0; i < count; i++) {
                forename += this.pick(forenames)
            }
            return surname + forename;
        },
        cname: function(count) {
            return this.chineseName(count)
        },
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
            // return this.word() + '@' + (domain || this.domain())
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
// END(BROWSER)

module.exports = Random
