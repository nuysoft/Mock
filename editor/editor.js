// UI
(function() {
    function resize() {
        $('.viewport')
            .height($(window).height() - $('.header').height())
            .css('opacity', 1)
        return resize;
    }
    $(window).on('resize', resize(true));

    var navLinks = ['help', 'about', 'account']
    $.each(navLinks, function(_, className) {
        $('div.header')
            .on('click', 'a.' + className, function() {
                var viewport = $('.viewport')
                if (viewport.hasClass('viewport-' + className)) {
                    viewport.removeClass('viewport-sidebar')
                    $.each(navLinks, function(_, sibling) {
                        viewport.removeClass('viewport-' + sibling)
                    })
                    return
                }
                $.each(navLinks, function(_, sibling) {
                    viewport.removeClass('viewport-' + sibling)
                })
                viewport.addClass('viewport-sidebar')
                    .addClass('viewport-' + className)
            })
    })

    switch (location.hash) {
        case '#help':
            $('a.help').click()
            break
        case '#about':
            $('a.about').click()
            break
        case '#account':
            $('a.account').click()
            break
    }

    // debug
    $('.template').css('background-color', Random.color())
    $('.result').css('background-color', Random.color())
    // $('.sidebar .help').css('background-color', Random.color())
    // $('.sidebar .about').css('background-color', Random.color())
    // $('.sidebar .content').append('<p>' + Random.paragraph() + '</p>')
    // $('.sidebar .content').append('<p>' + Random.paragraph() + '</p>')

})();

// Save, Tidy
(function() {
    var tabSize = 4;

    // Init
    if (false && location.pathname.length > 1) {
        var id = location.pathname.slice(1)
        $.getJSON('/mock/item/' + id, function(data) {
            tplEditor.setValue(
                JSON.stringify(data.tpl, null, tabSize) || ''
            )
            $('.viewport textarea[name=tpl]').val(
                JSON.stringify(data.tpl, null, tabSize) || ''
            )
        })
    }

    // Save, Tidy
    $('div.header')
        .on('click', 'a.save', function(event) {
            if (!tplEditor.getValue()) return

            $.ajax({
                url: '/mock/save',
                data: {
                    tpl: tplEditor.getValue()
                },
                success: function(data) {
                    location.pathname = '/' + data.id
                }
            })
        })
        .on('click', 'a.tidy', function(event) {
            stringify(tplEditor.getValue())
        })

    function stringify(tpl) {
        tpl = js_beautify(tpl)
        // tpl = tpl.replace(/^([\r\n]*)/i, '')
        //     .replace(/([\r\n]*$)/i, '')
        // tpl = new Function('return ' + tpl)
        // tpl = tpl() || ''
        // tpl = JSON.stringify(tpl, null, tabSize)
        tplEditor.setValue(tpl)
    }

    function render(tpl) {
        try {
            tpl = tpl.replace(/^([\r\n]*)/i, '')
                .replace(/([\r\n]*$)/i, '')
            tpl = new Function('return ' + tpl)
            tpl = tpl()
        } catch (error) {
            tpl = error.toString()
        }

        var data
        try {
            data = Mock.mock(tpl) || ''
            data = JSON.stringify(data, null, tabSize)    
        } catch (error) {
            data = error.toString()
        }
        $('textarea[name=data]').val(data)
        dataEditor.setValue(data)

        var size = (function size(data) {
            var ma = encodeURIComponent(data).match(/%[89ABab]/g);
            return data.length + (ma ? ma.length : 0)
        })(data)
        size = (size / 1024).toFixed(2)
        $('span.badge').text(size + ' kB')
    }

    // Editor
    var tplTextarea = $('textarea[name=tpl]')
    var tplEditor = CodeMirror
        .fromTextArea(tplTextarea.get(0), {
            tabSize: tabSize,
            tabMode: 'spaces', // or 'shift'
            indentUnit: tabSize,
            matchBrackets: true,
            lineNumbers: true,
            lineWrapping: true,
            autofocus: true,
            mode: 'application/json',
            theme: 'neat',
            autoCloseBrackets: true
        })
    tplEditor.on('change', function(instance) {
        render(instance.getValue())
    })
    tplEditor.on('scroll', function(instance) {
        var scrollInfo = tplEditor.getScrollInfo()
        var percent = scrollInfo.top / (scrollInfo.height - scrollInfo.clientHeight)

        var dataEditorScrollInfo = dataEditor.getScrollInfo()
        var dataEditorTop = (dataEditorScrollInfo.height - dataEditorScrollInfo.clientHeight) * percent

        dataEditor.scrollTo(dataEditorScrollInfo.left, dataEditorTop)
    })

    var dataEditor = CodeMirror
        .fromTextArea($('textarea[name=data]').get(0), {
            lineNumbers: true,
            autofocus: false,
            mode: 'javascript',
            theme: 'neat',
            autoCloseBrackets: true
        })

    // Syntax Demo
    var EXAMPLE_SYNTAX = Mock.heredoc(function() {
        /*!
{
    'title': 'Syntax Demo',

    'string1|1-10': '★',
    'string2|3': 'value',

    'number1|+1': 100,
    'number2|1-100': 100,
    'number3|1-100.1-10': 1,
    'number4|123.1-10': 1,
    'number5|123.3': 1,
    'number6|123.10': 1.123,

    'boolean1|1': true,
    'boolean2|1-2': true,

    'object1|2-4': {
        '110000': '北京市',
        '120000': '天津市',
        '130000': '河北省',
        '140000': '山西省'
    },
    'object2|2': {
        '310000': '上海市',
        '320000': '江苏省',
        '330000': '浙江省',
        '340000': '安徽省'
    },

    'array1|1': ['AMD', 'CMD', 'KMD', 'UMD'],
    'array2|1-10': ['Mock.js'],
    'array3|3': ['Mock.js'],

    'function': function() {
        return this.title
    }
}
    */
    })
    var EXAMPLE_PLACEHOLDER = Mock.heredoc(function() {
        /*!
{
    basics: {
        boolean1: '@BOOLEAN',
        boolean2: '@BOOLEAN(1, 9, true)',

        natural1: '@NATURAL',
        natural2: '@NATURAL(10000)',
        natural3: '@NATURAL(60, 100)',

        integer1: '@INTEGER',
        integer2: '@INTEGER(10000)',
        integer3: '@INTEGER(60, 100)',

        float1: '@FLOAT',
        float2: '@FLOAT(0)',
        float3: '@FLOAT(60, 100)',
        float4: '@FLOAT(60, 100, 3)',
        float5: '@FLOAT(60, 100, 3, 5)',

        character1: '@CHARACTER',
        character2: '@CHARACTER("lower")',
        character3: '@CHARACTER("upper")',
        character4: '@CHARACTER("number")',
        character5: '@CHARACTER("symbol")',
        character6: '@CHARACTER("aeiou")',

        string1: '@STRING',
        string2: '@STRING(5)',
        string3: '@STRING("lower",5)',
        string4: '@STRING(7, 10)',
        string5: '@STRING("aeiou", 1, 3)',

        range1: '@RANGE(10)',
        range2: '@RANGE(3, 7)',
        range3: '@RANGE(1, 10, 2)',
        range4: '@RANGE(1, 10, 3)',

        date: '@DATE',
        time: '@TIME',

        datetime1: '@DATETIME',
        datetime2: '@DATETIME("yyyy-MM-dd A HH:mm:ss")',
        datetime3: '@DATETIME("yyyy-MM-dd a HH:mm:ss")',
        datetime4: '@DATETIME("yy-MM-dd HH:mm:ss")',
        datetime5: '@DATETIME("y-MM-dd HH:mm:ss")',
        datetime6: '@DATETIME("y-M-d H:m:s")',

        now: '@NOW',
        nowYear: '@NOW("year")',
        nowMonth: '@NOW("month")',
        nowDay: '@NOW("day")',
        nowHour: '@NOW("hour")',
        nowMinute: '@NOW("minute")',
        nowSecond: '@NOW("second")',
        nowWeek: '@NOW("week")',
        nowCustom: '@NOW("yyyy-MM-dd HH:mm:ss SS")'
    },
    image: {
        image1: '@IMAGE',
        image2: '@IMAGE("100x200", "#000")',
        image3: '@IMAGE("100x200", "#000", "hello")',
        image4: '@IMAGE("100x200", "#000", "#FFF", "hello")',
        image5: '@IMAGE("100x200", "#000", "#FFF", "png", "hello")',

        dataImage1: '@DATAIMAGE',
        dataImage2: '@DATAIMAGE("200x100")',
        dataImage3: '@DATAIMAGE("300x100", "Hello Mock.js!")'
    },
    color: {
        color: '@COLOR',
        render: function(){
          $('.header').css('background', this.color)
        }
    },
    text: {
        title1: '@TITLE',
        title2: '@TITLE(5)',
        title3: '@TITLE(3, 5)',

        word1: '@WORD',
        word2: '@WORD(5)',
        word3: '@WORD(3, 5)',

        sentence1: '@SENTENCE',
        sentence2: '@SENTENCE(5)',
        sentence3: '@SENTENCE(3, 5)',

        paragraph1: '@PARAGRAPH',
        paragraph2: '@PARAGRAPH(2)',
        paragraph3: '@PARAGRAPH(1, 3)'
    },
    name: {
        first: '@FIRST',
        last: '@LAST',
        name1: '@NAME',
        name2: '@NAME(true)'
    },
    web: {
        url: '@URL',
        domain: '@DOMAIN',
        email: '@EMAIL',
        ip: '@IP',
        tld: '@TLD',
    },
    address: {
        area: '@AREA',
        region: '@REGION'
    },
    miscellaneous: {
        guid: '@GUID',
        id: '@ID',
        'increment1|3': [
            '@INCREMENT'
        ],
        'increment2|3': [
            '@INCREMENT(10)'
        ]
    },
    helpers: {
        capitalize1: '@CAPITALIZE()',
        capitalize2: '@CAPITALIZE("hello")',

        upper1: '@UPPER',
        upper2: '@UPPER("hello")',

        lower1: '@LOWER',
        lower2: '@LOWER("HELLO")',

        pick1: '@PICK',
        pick2: '@PICK("abc")',
        pick3: '@PICK(["a", "b", "c"])',
        
        shuffle1: '@SHUFFLE',
        shuffle2: '@SHUFFLE(["a", "b", "c"])'
    }
}
    */
    })

    $('.viewport .help')
        .on('click', 'a.importSyntaxExample', function(event) {
            tplEditor.setValue(EXAMPLE_SYNTAX)
        })
        .on('click', 'a.importPlaceholderExample', function(event) {
            tplEditor.setValue(EXAMPLE_PLACEHOLDER)
        })

    tplEditor.setValue(EXAMPLE_SYNTAX)
    
})()

// 
;
(function() {})()