$(function() {
    $('.content').css('opacity', 1)

    var win = $(window),
        ctn = $('.content'),
        ctns = $('.content .window'),
        bar = $('.content .handler');

    function resize(divide) {
        ctns.width(win.width() / 2 - 60)
            .height(win.height() - ctn.offset().top - 40)
        bar.css('left', win.width() / 2 - bar.width() / 2)
        return resize;
    }
    win.on('resize', resize(true));

    // 
    var editor = CodeMirror.fromTextArea($('#editor').get(0), {
        lineNumbers: true,
        autofocus: true,
        mode: mode || 'javascript',
        theme: 'neat'
    });

    var result = CodeMirror.fromTextArea($('#result').get(0), {
        readOnly: true,
        mode: 'javascript',
        theme: 'neat'
    });

    window.editor = editor
    window.result = result

    /*
     
     */

    $('#save').on('click', function(event) {
        return
        try {
            var data = editor.getValue()
            new Function('return ' + data)
            $.ajax({
                url: '/save?test=true',
                data: {
                    tpl: data
                },
                type: 'post',
                dataType: 'json'
            })
        } catch (exception) {
            alert(exception)
        }
    })

    $('#beautifier').on('click', function(event) {})
    $('#share').on('click', function(event) {})
    $('#account').on('click', function(event) {})

});