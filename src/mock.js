/*
    Mock - 模拟请求 & 模拟数据
    https://github.com/nuysoft/Mock
    墨智 mozhi.gyy@taobao.com nuysoft@gmail.com
*/
(function(global) {
    var Mock = {
        _mocked: {}
    };

    // mock ajax
    Mock.mockjax = function(jQuery) {
        function mockxhr() {
            return {
                open: jQuery.noop,
                send: jQuery.noop,
                getAllResponseHeaders: jQuery.noop,
                readyState: 4,
                status: 200
            }
        }

        function convert(mock) {
            return function() {
                return Mock.gen(mock.template)
            }
        }

        jQuery.ajaxPrefilter("*", function(options) {
            for (var surl in Mock._mocked) {
                var mock = Mock._mocked[surl]
                if (!mock.rurl.test(options.url)) continue
                options.converters['text json'] = convert(mock)
                options.xhr = mockxhr
                break;
            }
        })

        return Mock
    }
    if (global.jQuery) Mock.mockjax(jQuery)

    // mock data
    var fromCharCode = String.fromCharCode,
        floor = Math.floor,
        round = Math.round,
        random = Math.random,
        randomNumber = function() {
            return Mock._data.NUMBER[floor(random() * Mock._data.NUMBER.length)]
        },
        randomDate = function randomDate() {
            return new Date(floor(random() * new Date().valueOf()))
        },
        type = function(obj) {
            return (obj === null || obj === undefined) ? String(obj) : Object.prototype.toString.call(obj).match(/\[object (\w+)\]/)[1].toLowerCase()
        }

    Mock.mock = function(rurl, template) {
        if (arguments.length === 1) return Mock.gen(rurl)
        Mock._mocked[rurl] = {
            rurl: rurl,
            template: template
        }
        return Mock
    }
    Mock.gen = function(template, name) {
        // 1 name, 2 inc, 3 range, 4 decimal
        var rkey = /(\w+)\|(?:\+(\d+)|(\d+-?\d*)?(?:\.(\d+-?\d*))?)/,
            rrange = /(\d+)-?(\d+)?/,
            parameters = (name = name || '').match(rkey),

            range = parameters && parameters[3] && parameters[3].match(rrange),
            min = range && parseInt(range[1], 10) || 1,
            max = range && parseInt(range[2], 10) || 1,
            count = range && !range[2] && parseInt(range[1], 10) || round(random() * (max - min)) + min || 1,

            decimal = parameters && parameters[4] && parameters[4].match(rrange),
            dmin = decimal && parseInt(decimal[1], 10) || 0,
            dmax = decimal && parseInt(decimal[2], 10) || 0,
            dcount = decimal && !decimal[2] && decimal[1] || round(random() * (dmax - dmin)) + dmin || 0,

            point = parameters && parameters[4],
            result, i
        switch (type(template)) {
            case 'array':
                if (count === 1 && template.length > 1) {
                    result = template[floor(random() * template.length)];
                } else {
                    result = []
                    for (i = 0; i < count; i++) {
                        result[i] = Mock.gen(template[0]);
                    }
                }
                break
            case 'object':
                result = {}
                for (var key in template) {
                    result[key.replace(rkey, '$1')] = Mock.gen(template[key], key);
                    var inc = key.match(rkey)
                    if (inc && inc[2] && type(template[key]) == 'number') {
                        template[key] += parseInt(inc[2], 10);
                    }
                }
                break
            case 'number':
                result = ''
                if (point) { // float
                    template += ''
                    var parts = template.split('.')
                    parts[0] = range ? count : parts[0]
                    parts[1] = (parts[1] || '').slice(0, dcount)
                    for (i = 0; parts[1].length < dcount; i++) {
                        parts[1] += randomNumber()
                    }
                    result = parseFloat(parts.join('.'))
                } else result = range && !parameters[2] ? count : template; // integer
                break
            case 'boolean':
                // TODO Probability
                result = parameters ? random() >= 0.5 : template;
                break
            case 'string':
                if (template.length) {
                    result = ''
                    for (i = 0; i < count; i++) result += template

                    var placeholders = result.match(/@([A-Z_0-9]+(?:\([^@]+\))?)/g) || []
                    for (i = 0; i < placeholders.length; i++) {
                        var ph = placeholders[i]
                        result = result.replace(ph, Mock.genRandom(ph))
                    }
                } else {
                    result = ''
                    for (i = 0; i < count; i++) result += fromCharCode(floor(random() * 255))

                }
                break
            default:
                result = template
                break
        }
        return result
    }

    Mock.genRandom = function(placeholder) {
        var parts = placeholder.match(/@([^\(\)]+)(?:\((.+)\))?/), // key params
            key = parts && parts[1],
            params = parts && parts[2] ? parts[2].split(/,\s*/) : []

        if (!(key in Mock._data)) return key

        var d = Mock._data[key]

        switch (type(d)) {
            case 'array':
                return d[floor(d.length * random())]
            case 'function':
                return d.apply({}, params)
        }
    }

    Mock._data = {
        NUMBER: "0123456789".split(''),
        LETTER_UPPER: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(''),
        LETTER_LOWER: "abcdefghijklmnopqrstuvwxyz".split(''),
        MALE_FIRST_NAME: ["James", "John", "Robert", "Michael", "William", "David",
            "Richard", "Charles", "Joseph", "Thomas", "Christopher", "Daniel",
            "Paul", "Mark", "Donald", "George", "Kenneth", "Steven", "Edward",
            "Brian", "Ronald", "Anthony", "Kevin", "Jason", "Matthew", "Gary",
            "Timothy", "Jose", "Larry", "Jeffrey", "Frank", "Scott", "Eric"],
        FEMALE_FIRST_NAME: ["Mary", "Patricia", "Linda", "Barbara", "Elizabeth",
            "Jennifer", "Maria", "Susan", "Margaret", "Dorothy", "Lisa", "Nancy",
            "Karen", "Betty", "Helen", "Sandra", "Donna", "Carol", "Ruth", "Sharon",
            "Michelle", "Laura", "Sarah", "Kimberly", "Deborah", "Jessica",
            "Shirley", "Cynthia", "Angela", "Melissa", "Brenda", "Amy", "Anna"],
        LAST_NAME: ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller",
            "Davis", "Garcia", "Rodriguez", "Wilson", "Martinez", "Anderson",
            "Taylor", "Thomas", "Hernandez", "Moore", "Martin", "Jackson",
            "Thompson", "White", "Lopez", "Lee", "Gonzalez", "Harris", "Clark",
            "Lewis", "Robinson", "Walker", "Perez", "Hall", "Young", "Allen"],
        EMAIL: function() {
            return Mock.genRandom('@LETTER_LOWER') + '.' + Mock.genRandom('@LAST_NAME').toLowerCase() + '@' + Mock.genRandom('@LAST_NAME').toLowerCase() + '.com';
        },
        DATE: function() { /*format*/
            var date = randomDate(),
                yyyy = 'getFullYear',
                MM = function(date) {
                    var m = date.getMonth() + 1;
                    return m < 10 ? '0' + m : m;
                },
                dd = function(date) {
                    var d = date.getDate();
                    return d < 10 ? '0' + d : d;
                };
            return date[yyyy]() + '-' + MM(date) + '-' + dd(date);
        },
        TIME: function() { /*format*/
            var date = randomDate(),
                HH = function(date) {
                    var h = date.getHours();
                    return h < 10 ? '0' + h : h;
                },
                mm = function(date) {
                    var m = date.getMinutes();
                    return m < 10 ? '0' + m : m;
                },
                ss = function(date) {
                    var s = date.getSeconds();
                    return s < 10 ? '0' + s : s;
                };
            return HH(date) + ':' + mm(date) + ':' + ss(date);
        },
        DATETIME: function() { /*format*/
            return Mock._data.DATE() + ' ' + Mock._data.TIME();
        },
        LOREM: function() {
            var words = 'lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' ');
            var index = floor(random() * words.length);
            return words[index];
        },
        LOREM_IPSUM: function() {
            var words = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' ');
            var result = [];
            var length = floor(random() * words.length / 2);
            for (var i = 0; i < length; i++) {
                var index = floor(random() * words.length);
                result.push(words[index]);
            }
            return result.join(' ');
        }
    }
    /*
        For Module Loader
     */
    if (typeof define === "function") { // for seajs
        define(function() {
            return Mock;
        });
    }
    if (typeof module !== 'undefined' && module.exports) { // for node
        module.exports = Mock;
    }
    if (typeof KISSY != 'undefined' && KISSY.add) { // for kissy
        KISSY.add('components/mock/index', function(S) {
            Mock.mockjax = function(S) {
                var _original_ajax = S.io;
                S.io = function(options) {
                    // if (options.dataType === 'json') {
                    for (var surl in Mock._mocked) {
                        var mock = Mock._mocked[surl];
                        if (!mock.rurl.test(options.url)) continue

                        console.log('[mock]', options.url, '>', mock.rurl)
                        var data = Mock.gen(mock.template)
                        options.success(data)
                        options.complete(data)
                        return S
                    }
                    // }
                    return _original_ajax.apply(this, arguments);
                }
            }
            Mock.mockjax(S);
            return Mock;
        }, {
            requires: ['ajax']
        })
    }

    global.Mock = Mock;

    return Mock;

})(this)