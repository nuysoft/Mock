/*
    Expose Internal API
*/
Mock4Tpl.parse = parser.parse
Mock4Tpl.AST = AST

/*
    For Module Loader
*/
if (typeof module === 'object' && module.exports) {
    // CommonJS
    module.exports = Mock4Tpl;

} else if (typeof define === "function" && define.amd) {
    // AMD modules
    define(function() {
        return Mock4Tpl;
    });

} else {
    // other, i.e. browser
    this.Mock4Tpl = Mock4Tpl;
}

// for KISSY
if (typeof KISSY != 'undefined') {

    KISSY.add('mock4tpl', function() {
        return Mock4Tpl
    }, {
        requires: ['mock']
    })

    KISSY.add('components/mock4tpl/index', function() {
        return Mock4Tpl
    }, {
        requires: ['mock']
    })
}