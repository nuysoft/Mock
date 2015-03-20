define(
    [
        'jquery', 'underscore', 'mock', 'highlightjs',
        './test.template',
        './test.dpd.data'
    ],
    function(
        $, _, Mock, hljs,
        template, data
    ) {
        var hooks = {
            'Random.dataImage( size?, text? )': function(wrapper, subTypeCmds, results) {
                for (var index = results.length - 1, item; index >= 0; index--) {
                    item = results[index]
                    if (item !== '' && item.indexOf('//') !== 0) {
                        wrapper.after($('<img src=' + item + '>'))
                    }
                }
                // _.each(results, function(item, index) {
                //     if (item === '' || item.indexOf('//') === 0) return
                //     wrapper.after($('<img src=' + item + '>'))
                // })
            }
        }
        _.each(data, function(typeCmds, type) {
            var wrapper = $('<div class="mb20">').appendTo('#DPD')
            wrapper.append('<a name="' + type + '"></a>') // .replace(/[\W]/g, '-')
            wrapper.append('<h3>' + type + '</h3>')
            _.each(typeCmds, function(subTypeCmds, method) {
                var results = []
                _.each(subTypeCmds, function(cmd, index) {
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
                wrapper.append('<a name="' + method + '"></a>')
                wrapper.append('<h4>' + method + '</h4>')
                wrapper.append(
                    _.template(template)({
                        type: type,
                        code: subTypeCmds.join('\n'),
                        result: results.join('\n'),
                        badge: 'Data Placeholder'
                    })
                )
                if (hooks[method]) hooks[method](wrapper, subTypeCmds, results)
            })
        })

        var tpl = ' <ul>\
                        <% for(var type in data) { %>\
                        <li>\
                            <b><a href="#<%= type %>"><%= type %></a></b>\
                            <br>\
                            <% for(var methods = _.keys(data[type]), index = 0; index < methods.length; index++ ) { %>\
                                <% var method = methods[index] %>\
                                <% var short = method.replace(/Random.([^(]+)(.+)/, "$1") %>\
                                <a href="#<%= method %>"><%= short %></a><%= index < methods.length - 1 ? "," : ""%>\
                            <% } %>\
                        </li>\
                        <% } %>\
                    </ul>'
        $('#dpdCatalog').html(
            _.template(tpl)({
                data: data
            })
        )
    }
)