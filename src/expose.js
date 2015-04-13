/*
    Expose Internal API

    把 Expose 部分放在代码头部非常直观 <https://github.com/kennethcachia/Background-Check/blob/master/background-check.js>
*/
Mock.Util = Util
// Mock.FakeXMLHttpRequest = FakeXMLHttpRequest
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
    define('mock', [], function() {
        return Mock
    })
    define('mockjs', [], function() {
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
        'mock', 'components/mock/', 'mock/dist/mock',
        'gallery/Mock/0.1.9/'
    ], function register(name) {
        KISSY.add(name, function(S) {
            Mock.mockjax(S)
            return Mock
        }, {
            requires: ['ajax']
        })
    })
}