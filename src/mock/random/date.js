/*
    ## Date
*/
import { integer } from "./basic/number.js"; // 随机生成整数的函数
import _patternLetters from "./date/_patternLetters.js";
const reRule = new RegExp(`(${Object.keys(_patternLetters).join("|")})`, "g");

export default {
    // 日期占位符集合。
    _patternLetters,
    // 日期占位符正则。
    _rformat: reRule,
    // 格式化日期。
    _formatDate: function (date, format) {
        return format.replace(
            this._rformat,
            function creatNewSubString($0, flag) {
                // 这个函数用于捕获格式化日期的关键字，然后进行替换
                let targetPattern = patternLetters[flag];
                return typeof targetPattern === "function"
                    ? targetPattern(date)
                    : targetPattern in patternLetters
                    ? creatNewSubString($0, targetPattern)
                    : date[targetPattern]();
            }
        );
    },
    // 生成一个随机的 Date 对象。
    _randomDate: function (min = new Date(0), max = new Date()) {
        return new Date(integer(min.getTime(), max.getTime()));
    },
    // 返回一个随机的日期字符串。
    date: function (format = "yyyy-MM-dd") {
        return this._formatDate(this._randomDate(), format);
    },
    // 返回一个随机的时间字符串。
    time: function (format = "HH:mm:ss") {
        return this._formatDate(this._randomDate(), format);
    },
    // 返回一个随机的日期和时间字符串。
    datetime: function (format = "yyyy-MM-dd HH:mm:ss") {
        return this._formatDate(this._randomDate(), format);
    },

    // 返回当前的日期和时间字符串。
    now: function (unit, format) {
        // now(unit) now(format)
        if (arguments.length === 1) {
            // now(format)
            if (!/year|month|day|hour|minute|second|week/.test(unit)) {
                format = unit;
                unit = "";
            }
        }
        unit = (unit || "").toLowerCase();
        format = format || "yyyy-MM-dd HH:mm:ss";

        var date = new Date();

        /* jshint -W086 */
        // 参考自 http://momentjs.cn/docs/#/manipulating/start-of/
        switch (unit) {
            case "year":
                date.setMonth(0);
            case "month":
                date.setDate(1);
            case "week":
            case "day":
                date.setHours(0);
            case "hour":
                date.setMinutes(0);
            case "minute":
                date.setSeconds(0);
            case "second":
                date.setMilliseconds(0);
        }
        switch (unit) {
            case "week":
                date.setDate(date.getDate() - date.getDay());
        }

        return this._formatDate(date, format);
    },
    // KonghaYao 新增函数：生成固定时间段的时间戳
    timestamp: function (min, max) {
        if (min instanceof Date && max instanceof Date)
            return this._randomDate(min, max);
        return this._randomDate();
    },
};
