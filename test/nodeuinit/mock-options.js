var Mock4XTpl = require('../../src/mock4xtpl'),
    Util = require('../../src/util'),
    KISSY = require('kissy');

var XTemplate;
exports.setUp = function(callback) {
    KISSY.Config.debug = false
    KISSY.use('xtemplate', function(S, T) {
        XTemplate = T
        callback()
    })
}

exports.test_simple = function(test) {
    var tpl, options;

    tpl = Util.heredoc(function() {
        /*
{{email}}{{age}}
<!-- Mock { 
    email: '@EMAIL' 
} -->
<!-- Mock { age: '@INT' } -->
        */
    })
    options = Mock4XTpl.parseOptions(tpl, {})
    // console.log(JSON.stringify(options, null, 4));

    test.equal(options.email, '@EMAIL')
    test.equal(options.age, '@INT')

    options = Mock4XTpl.parseOptions(tpl, {
        age: '@INT(1,10)'
    })
    test.equal(options.age, '@INT(1,10)')

    test.done()
}