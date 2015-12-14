define(
    [
        'jquery', 'underscore', 'mock', 'vue', 'highlightjs', 'smooth-scroll',
        './test.template',
        './test.dtd.data',
        './test.dpd.data'
    ],
    function(
        $, _, Mock, Vue, hljs, smoothScroll,
        template, DTD, DPD
    ) {
        Vue.filter('mock', function(value) {
            value = _.isObject(value) ? value : (new Function("return " + value))()
            return Mock.mock(value)
        })
        Vue.filter('img', function(value) {
            return '<img src=' + value + '>'
        })
        Vue.filter('examples.dpd', function(demos) {
            var results = []
            _.each(demos, function(cmd, index) {
                if (cmd === '' || cmd.indexOf('//') === 0) {
                    results.push(cmd)
                    return
                }
                results.push(
                    JSON.stringify(
                        (new Function("return " + cmd))()
                    )
                )
            })
            return results.join('\n')
        })
        Vue.filter('examples.dpd.img', function(demos) {
            var results = []
            _.each(demos, function(cmd, index) {
                if (cmd === '' || cmd.indexOf('//') === 0) {
                    return
                }
                results.push(
                    '<img class="mb10 mr10" src="' +
                    (new Function("return " + cmd))() +
                    '">'
                )
            })
            return results.join('')
        })
        window.Vue = Vue
        window.vm = new Vue({
            el: '#examples',
            data: {
                DTD: DTD,
                DPD: DPD,
                rerun: function(event, type, cmd) {
                    switch (type) {
                        case 'dtd':
                            var code = $(event.target).prev().find('code').text(
                                Vue.filter('json').read(
                                    Vue.filter('mock')(
                                        cmd
                                    )
                                )
                            )
                            break
                        case 'dpd':
                            var code = $(event.target).prev().find('code')
                            if (code.length) {
                                code.text(
                                    Vue.filter('examples.dpd')(
                                        cmd
                                    )
                                )
                            } else {
                                $(event.target).prev().html(
                                    Vue.filter('examples.dpd.img')(
                                        cmd
                                    )
                                )
                            }
                            break

                    }
                    if (code[0]) hljs.highlightBlock(code[0])
                }
            },
            ready: function() {
                smoothScroll.init()

                $(document).ready(function() {
                    $('pre code').each(function(i, block) {
                        hljs.highlightBlock(block)
                    })
                })

                ;
                (function() {
                    return
                    var rows = $('#DTD').find('div.row')
                    _.each(rows, function(row, index) {
                        var $columns = $(row).find('> .col-sm-6 > .code, > .col-sm-6 > .result')
                        var heights = _.map($columns, function(column, index) {
                            return $(column).outerHeight()
                        })
                        $columns.css({
                            'height': Math.max.apply(Math, heights)
                        })
                    })

                })();
            }
        })
    }
)