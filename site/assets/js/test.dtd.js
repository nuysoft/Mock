define(
    [
        'jquery', 'underscore', 'mock', 'highlightjs',
        './test.template',
        './test.dtd.data'
    ],
    function(
        $, _, Mock, hljs,
        template, data
    ) {
        _.each(data, function(typeTpls, type) {
            var wrapper = $('<div class="mb20">').appendTo('#DTD')
            wrapper.append('<a name="' + type + '"></a>') // .replace(/[\W]/g, '-')
            wrapper.append('<div class="fontsize-16">' + type + '</div>')
            _.each(typeTpls, function(syntaxTpls, syntax) {
                wrapper.append('<a name="' + syntax + '"></a>') // .replace(/[\W]/g, '-')
                wrapper.append('<h4><code>' + syntax + '</code></h4>')
                    // wrapper.append('<p>通过重复 <code>string</code> 生成一个字符串，重复次数大于等于 <code>min</code>，小于等于 <code>max</code>。<p>')
                _.each(syntaxTpls, function(tpl, index) {
                    var code = _.isObject(tpl) ? JSON.stringify(tpl, null, 2) : tpl
                    tpl = _.isObject(tpl) ? tpl : (new Function("return " + tpl))()
                    wrapper.append(
                        _.template(template)({
                            code: 'Mock.mock(' + code + ')',
                            result: JSON.stringify(Mock.mock(tpl), null, 2),
                            badge: 'Data Template'
                        })
                    )
                })

            })
        })

        var tpl = ' <ul>\
                        <% for(var type in data) { %>\
                        <li>\
                            <a href="#<%= type %>"><%= type %></a>\
                        </li>\
                        <% } %>\
                    </ul>'
        $('#dtdCatalog').html(
            _.template(tpl)({
                data: data
            })
        )

        $(document).ready(function() {
            $('pre code').each(function(i, block) {
                hljs.highlightBlock(block)
            })

            $(document.body).on('click', '.rerun', function(event) {
                var result = $(event.target).parent('.result').parent('.col-sm-6')
                var data = result.prev()
                var code = result.find('pre code').text(
                    JSON.stringify(
                        eval(data.find('pre').text()), null, 2
                    )
                )
                hljs.highlightBlock(code[0])
            })
        })
    }
)

;
(function() {
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

})();