var TEMPLATE = Mock.heredoc(function() {
    /*
    <div class="row">
        <div class="col-sm-6 code">
            <span class="badge"><%= badge %></span>
            <pre><code class="javascript"><%= code %></code></pre>
        </div>
        <div class="col-sm-6 result">
            <span class="badge">Result</span>
            <pre><code class="javascript"><%= result %></code></pre>
        </div>
    </div>
     */
})

;
(function() {
    var tpls = {
        'String': {
            '\'name|min-max\': string': [{
                'string|1-10': '★'
            }],
            '\'name|count\': string': [{
                'string|3': '★★★'
            }]
        },
        'Number': {
            '\'name|+1\': number': [{
                'number|+1': 100
            }],
            '\'name|min-max\': number': [{
                'number|1-100': 100
            }],
            '\'name|min-max.dmin-dmax\': number': [{
                'number|1-100.1-10': 1
            }, {
                'number|123.1-10': 1
            }, {
                'number|123.3': 1
            }, {
                'number|123.10': 1.123
            }]
        },
        'Boolean': {
            '\'name|1\': boolean': [{
                'boolean|1': true
            }],
            '\'name|min-max\': boolean': [{
                'boolean|1-2': true
            }]
        },
        'Object': {
            '\'name|count\': object': [{
                'object|2': {
                    '310000': '上海市',
                    '320000': '江苏省',
                    '330000': '浙江省',
                    '340000': '安徽省'
                }
            }],
            '\'name|min-max\': object': [{
                'object|2-4': {
                    '110000': '北京市',
                    '120000': '天津市',
                    '130000': '河北省',
                    '140000': '山西省'
                }
            }]
        },
        'Array': {
            '\'name|1\': array': [{
                'array|1': ['AMD', 'CMD', 'UMD']
            }],
            '\'name|+1\': array': [{
                'array|+1': ['AMD', 'CMD', 'UMD']
            }, {
                'array|1-10': [{
                    'name|+1': ['Hello', 'Mock.js', '!']
                }]
            }],
            '\'name|min-max\': array': [{
                'array|1-10': ['Mock.js']
            }, {
                'array|1-10': ['Hello', 'Mock.js', '!']
            }],
            '\'name|count\': array': [{
                'array|3': ['Mock.js']
            }, {
                'array|3': ['Hello', 'Mock.js', '!']
            }],
        },
        'Function': {
            '\'name\': function': [
                Mock.heredoc(function() {
                    /*
{
    'foo': 'Syntax Demo',
    'name': function() {
        return this.foo
    }
}
                     */
                })
            ]
        },
        'RegExp': {
            '\'name\': regexp': [
                Mock.heredoc(function() {
                    /*
{
    'regexp': /[a-z][A-Z][0-9]/
}
                     */
                }),
                Mock.heredoc(function() {
                    /*
{
    'regexp': /\w\W\s\S\d\D/
}
                     */
                }),
                Mock.heredoc(function() {
                    /*
{
    'regexp': /\d{5,10}/
}
                     */
                })
            ]
        },
        'Path': {
            'Absolute Path': [{
                'foo': 'Hello',
                'nested': {
                    a: {
                        b: {
                            c: 'Mock.js'
                        }
                    }
                },
                'absolutePath': '@/foo @/nested/a/b/c'
            }],
            'Relative Path': [{
                'foo': 'Hello',
                'nested': {
                    a: {
                        b: {
                            c: 'Mock.js'
                        }
                    }
                },
                'relativePath': {
                    a: {
                        b: {
                            c: '@../../../foo @../../../nested/a/b/c'
                        }
                    }
                }
            }]
        }
    }

    _.each(tpls, function(typeTpls, type) {
        var wrapper = $('<div class="mb20">').appendTo('#DTD')
        wrapper.append('<h3>' + type + '</h3>')
        _.each(typeTpls, function(syntaxTpls, syntax) {
            wrapper.append('<h4><code>' + syntax + '</code></h4>')
            // wrapper.append('<p>通过重复 <code>string</code> 生成一个字符串，重复次数大于等于 <code>min</code>，小于等于 <code>max</code>。<p>')
            _.each(syntaxTpls, function(tpl, index) {
                var code = _.isObject(tpl) ? JSON.stringify(tpl, null, 2) : tpl
                tpl = _.isObject(tpl) ? tpl : (new Function("return " + tpl))()
                wrapper.append(
                    _.template(TEMPLATE)({
                        code: 'Mock.mock(' + code + ')',
                        result: JSON.stringify(Mock.mock(tpl), null, 2),
                        badge: 'Data Template'
                    })
                )
            })

        })
    })

    var rows = $('#DTD').find('div.row')
    _.each(rows, function(row, index) {
        var $columns = $(row).find('> .code, > .result')
        var heights = _.map($columns, function(column, index) {
            return $(column).outerHeight()
        })
        $columns.css({
            // 'height': Math.max.apply(Math, heights)
        })
    })

})()

;
(function() {
    var cmds = {
        'Basic': {
            'Random.boolean( min?, max?, current? )': [
                '// Random.boolean()',
                'Random.boolean()',
                'Mock.mock(\'@boolean\')',
                'Mock.mock(\'@boolean()\')',
                '',
                '// Random.boolean( min, max, current )',
                'Random.boolean(1, 9, true)',
                'Mock.mock(\'@boolean(1, 9, true)\')',
            ],
            'Random.natural( min, max )': [
                '// Random.natural()',
                'Random.natural()',
                'Mock.mock(\'@natural\')',
                'Mock.mock(\'@natural()\')',
                '',
                '// Random.natural( min )',
                'Random.natural(10000)',
                'Mock.mock(\'@natural(10000)\')',
                '',
                '// Random.natural( min, max )',
                'Random.natural(60, 100)',
                'Mock.mock(\'@natural(60, 100)\')'
            ],
            'Random.integer( min, max )': [
                '// Random.integer()',
                'Random.integer()',
                'Mock.mock(\'@integer\')',
                'Mock.mock(\'@integer()\')',
                '',
                '// Random.integer( min )',
                'Random.integer(10000)',
                'Mock.mock(\'@integer(10000)\')',
                '',
                '// Random.integer( min, max )',
                'Random.integer(60, 100)',
                'Mock.mock(\'@integer(60, 100)\')',
            ],
            'Random.float( min, max, dmin, dmax )': [
                '// Random.float()',
                'Random.float()',
                'Mock.mock(\'@float\')',
                'Mock.mock(\'@float()\')',
                '',
                '// Random.float( min )',
                'Random.float(0)',
                'Mock.mock(\'@float(0)\')',
                '',
                '// Random.float( min, max )',

                '',
                '// Random.float( min, max, dmin )',

                '',
                '// Random.float( min, max, dmin, dmax )',

                '',
            ]

            // 'float',
            // 'float(0)',
            // 'float(60, 100)',
            // 'float(60, 100, 3)',
            // 'float(60, 100, 3, 5)',
            // 'character',
            // "character(\"lower\")",
            // 'character(\\\'upper\')',
            // 'character(\\\'number\')',
            // 'character(\'symbol\')',
            // 'character(\'aeiou\')',
        }
    }

    _.each(cmds, function(typeCmds, type) {
        var wrapper = $('<div class="mb20">').appendTo('#DPD')
        wrapper.append('<h3>' + type + '</h3>')
        _.each(typeCmds, function(subTypeCmds, method) {
            var results = []
            _.each(subTypeCmds, function(cmd, index) {
                if (cmd === '' || cmd.indexOf('//') === 0) {
                    results.push(cmd)
                    return
                }
                results.push(
                    (new Function("return " + cmd))()
                )
            })
            wrapper.append('<h4>' + method + '</h4>')
            wrapper.append(
                _.template(TEMPLATE)({
                    type: type,
                    code: subTypeCmds.join('\n'),
                    result: results.join('\n'),
                    badge: 'Data Placeholder'
                })
            )
        })
    })
})();