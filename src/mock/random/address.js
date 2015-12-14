/*
    ## Address
*/

var DICT = require('./address_dict')
var REGION = ['东北', '华北', '华东', '华中', '华南', '西南', '西北']

module.exports = {
    // 随机生成一个大区。
    region: function() {
        return this.pick(REGION)
    },
    // 随机生成一个（中国）省（或直辖市、自治区、特别行政区）。
    province: function() {
        return this.pick(DICT).name
    },
    // 随机生成一个（中国）市。
    city: function(prefix) {
        var province = this.pick(DICT)
        var city = this.pick(province.children)
        return prefix ? [province.name, city.name].join(' ') : city.name
    },
    // 随机生成一个（中国）县。
    county: function(prefix) {
        var province = this.pick(DICT)
        var city = this.pick(province.children)
        var county = this.pick(city.children) || {
            name: '-'
        }
        return prefix ? [province.name, city.name, county.name].join(' ') : county.name
    },
    // 随机生成一个邮政编码（六位数字）。
    zip: function(len) {
        var zip = ''
        for (var i = 0; i < (len || 6); i++) zip += this.natural(0, 9)
        return zip
    }

    // address: function() {},
    // phone: function() {},
    // areacode: function() {},
    // street: function() {},
    // street_suffixes: function() {},
    // street_suffix: function() {},
    // states: function() {},
    // state: function() {},
}