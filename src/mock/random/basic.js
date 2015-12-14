/*
    ## Basics
*/
module.exports = {
    // 返回一个随机的布尔值。
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
    // 返回一个随机的自然数（大于等于 0 的整数）。
    natural: function(min, max) {
        min = typeof min !== 'undefined' ? parseInt(min, 10) : 0
        max = typeof max !== 'undefined' ? parseInt(max, 10) : 9007199254740992 // 2^53
        return Math.round(Math.random() * (max - min)) + min
    },
    // 返回一个随机的整数。
    integer: function(min, max) {
        min = typeof min !== 'undefined' ? parseInt(min, 10) : -9007199254740992
        max = typeof max !== 'undefined' ? parseInt(max, 10) : 9007199254740992 // 2^53
        return Math.round(Math.random() * (max - min)) + min
    },
    int: function(min, max) {
        return this.integer(min, max)
    },
    // 返回一个随机的浮点数。
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
    // 返回一个随机字符。
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
    // 返回一个随机字符串。
    string: function(pool, min, max) {
        var len
        switch (arguments.length) {
            case 0: // ()
                len = this.natural(3, 7)
                break
            case 1: // ( length )
                len = pool
                pool = undefined
                break
            case 2:
                // ( pool, length )
                if (typeof arguments[0] === 'string') {
                    len = min
                } else {
                    // ( min, max )
                    len = this.natural(pool, min)
                    pool = undefined
                }
                break
            case 3:
                len = this.natural(min, max)
                break
        }

        var text = ''
        for (var i = 0; i < len; i++) {
            text += this.character(pool)
        }

        return text
    },
    str: function( /*pool, min, max*/ ) {
        return this.string.apply(this, arguments)
    },
    // 返回一个整型数组。
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