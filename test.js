var Mock = require('./mock'),
    print = require('node-print'),
    $ = require('jquery');

Mock.mockjax($);


// mock test
var re,tpl;
re = Mock.mock({
    'key|1-10': 'abc',
    'precent|1-10': 1
})
console.log(JSON.stringify(re, null, 4));

tpl = {
    'data|1-10': [{
        'id|+1': 1,
        'grade|1-100': 1,
        'float1|.1-10': 10,
        'float2|1-100.1-10': 1,
        'star|1-5': '★',
        'cn|1-5': '汉字',
        'repeat|10': 'A',
        'published|0-1': false,
        'email': '@EMAIL',
        'date': '@DATE',
        'time': '@TIME',
        'datetime': '@DATETIME'
    }]
}
re = Mock.mock(tpl)
// 
console.log(tpl);
print.pt(re.data);

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Mock
} else {
    global.Mock = Mock
}

// ajax test
Mock.mock(/.+.json/, {
    "data|5-10": [{
        "id|+1": 1000,
        "married|0-1": true,
        "name": "@MALE_FIRST_NAME @LAST_NAME",
        "sons": '@NUMBER',
        'daughters|0-3': [{
            "age|0-31": 0,
            "name": "@FEMALE_FIRST_NAME"
        }]
    }],
    info: {
        "oK|0-1": true,
        "message": "@MALE_FIRST_NAME @LAST_NAME"
    }
});
$.ajax('test.json', {
    dataType: 'json'
}).success(function(data, statusText, jqXHR) {
    $('#result').html(JSON.stringify(data, null, 4))
    print.pt(data.data);
    // console.log(data, statusText, jqXHR);
}).fail(function(jqXHR, statusText, error) {
    console.error(error && error.message)
}).complete(function(jqXHR, statusText) {
    // console.log(jqXHR, statusText);
})