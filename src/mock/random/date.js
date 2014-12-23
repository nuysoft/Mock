/* global define */
/*
    #### Date
*/
define(function() {
    var patternLetters = {
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
    return {
        patternLetters: patternLetters,
        rformat: new RegExp((function() {
            var re = []
            for (var i in patternLetters) re.push(i)
            return '(' + re.join('|') + ')'
        })(), 'g'),
        /*
            ##### Random.format(date, format)

            格式化日期。
        */
        format: function(date, format) {
            return format.replace(this.rformat, function creatNewSubString($0, flag) {
                return typeof patternLetters[flag] === 'function' ? patternLetters[flag](date) :
                    patternLetters[flag] in patternLetters ? creatNewSubString($0, patternLetters[flag]) :
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
    }
})