/* global define */
/*
    #### Basics
*/
define(function() {
    return {
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
            
            > 事实上，原生方法 Math.random() 返回的随机（浮点）数的分布并不均匀，是货真价实的伪随机数，将来会替换为基于 window.crytpo 来生成随机数。?? 对 Math.random() 的实现机制进行了分析和统计，并提供了随机数的参考实现，可以访问[这里](http://??)。
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
            * 参数 max：可选。指示随机自然数的最大值。默认值为 9007199254740992。

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
            * Random.float(minFloat, maxFloat)

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
                ret += (
                    // 最后一位不能为 0：如果最后一位为 0，会被 JS 引擎忽略掉。
                    (i < dcount - 1) ? this.character('number') : this.character('123456789')
                )
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
                lower: 'abcdefghijklmnopqrstuvwxyz',
                upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                number: '0123456789',
                symbol: '!@#$%^&*()[]'
            }
            pools.alpha = pools.lower + pools.upper
            pools['undefined'] = pools.lower + pools.upper + pools.number + pools.symbol

            pool = pools[('' + pool).toLowerCase()] || pool
            return pool.charAt(this.natural(0, pool.length - 1))
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

            其他实现
                // https://code.google.com/p/jslibs/wiki/JavascriptTips
                Math.random().toString(36).substr(2) 
        */
        string: function(pool, min, max) {
            var length;

            // string( pool, min, max )
            if (arguments.length === 3) {
                length = this.natural(min, max)
            }
            if (arguments.length === 2) {
                // string( pool, length )
                if (typeof arguments[0] === 'string') {
                    length = min
                } else {
                    // string( min, max )
                    length = this.natural(pool, min)
                    pool = undefined
                }
            }
            // string( length )
            if (arguments.length === 1) {
                length = pool
                pool = undefined
            }
            // string()
            if (arguments.length === 0) {
                length = this.natural(3, 7)
            }

            var text = ''
            for (var i = 0; i < length; i++) {
                text += this.character(pool)
            }
            return text
        },
        str: function( /*pool, min, max*/ ) {
            return this.string.apply(this, arguments)
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
            // range( stop )
            if (arguments.length <= 1) {
                stop = start || 0;
                start = 0;
            }
            // range( start, stop )
            step = arguments[2] || 1;

            start = +start
            stop = +stop
            step = +step

            var len = Math.max(Math.ceil((stop - start) / step), 0);
            var idx = 0;
            var range = new Array(len);

            while (idx < len) {
                range[idx++] = start;
                start += step;
            }

            return range;
        }
    }
})