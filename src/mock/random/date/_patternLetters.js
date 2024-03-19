export default {
    yyyy: 'getFullYear',
    yy: function (date) {
        return ('' + date.getFullYear()).slice(2);
    },
    y: 'yy',

    MM: function (date) {
        const m = date.getMonth() + 1;
        return m < 10 ? '0' + m : m;
    },
    M: function (date) {
        return date.getMonth() + 1;
    },

    dd: function (date) {
        const d = date.getDate();
        return d < 10 ? '0' + d : d;
    },
    d: 'getDate',

    HH: function (date) {
        const h = date.getHours();
        return h < 10 ? '0' + h : h;
    },
    H: 'getHours',
    hh: function (date) {
        const h = date.getHours() % 12;
        return h < 10 ? '0' + h : h;
    },
    h: function (date) {
        return date.getHours() % 12;
    },

    mm: function (date) {
        const m = date.getMinutes();
        return m < 10 ? '0' + m : m;
    },
    m: 'getMinutes',

    ss: function (date) {
        const s = date.getSeconds();
        return s < 10 ? '0' + s : s;
    },
    s: 'getSeconds',

    SS: function (date) {
        const ms = date.getMilliseconds();
        return (ms < 10 && '00' + ms) || (ms < 100 && '0' + ms) || ms;
    },
    S: 'getMilliseconds',

    A: function (date) {
        return date.getHours() < 12 ? 'AM' : 'PM';
    },
    a: function (date) {
        return date.getHours() < 12 ? 'am' : 'pm';
    },
    T: 'getTime',
};
