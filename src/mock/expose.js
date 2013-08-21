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