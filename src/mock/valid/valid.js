/*
    ## valid(template, data)

    校验真实数据 data 是否与数据模板 template 匹配。
    
    实现思路：
    1. 解析规则。
        先把数据模板 template 解析为更方便机器解析的 JSON-Schame
        name               属性名 
        type               属性值类型
        template           属性值模板
        properties         对象属性数组
        items              数组元素数组
        rule               属性值生成规则
    2. 递归验证规则。
        然后用 JSON-Schema 校验真实数据，校验项包括属性名、值类型、值、值生成规则。

    提示信息 
    https://github.com/fge/json-schema-validator/blob/master/src/main/resources/com/github/fge/jsonschema/validator/validation.properties
    [JSON-Schama validator](http://json-schema-validator.herokuapp.com/)
    [Regexp Demo](http://demos.forbeslindesay.co.uk/regexp/)
*/
var Util = require('../util')
var toJSONSchema = require('../schema')

function valid(template, data) {
    var schema = toJSONSchema(template)
    var result = Diff.diff(schema, data)
    for (var i = 0; i < result.length; i++) {
        // console.log(Assert.message(result[i]))
    }
    return result
}

/*
    ## name
        有生成规则：比较解析后的 name
        无生成规则：直接比较
    ## type
        无类型转换：直接比较
        有类型转换：先试着解析 template，然后再检查？
    ## value vs. template
        基本类型
            无生成规则：直接比较
            有生成规则：
                number
                    min-max.dmin-dmax
                    min-max.dcount
                    count.dmin-dmax
                    count.dcount
                    +step
                    整数部分
                    小数部分
                boolean 
                string  
                    min-max
                    count
    ## properties
        对象
            有生成规则：检测期望的属性个数，继续递归
            无生成规则：检测全部的属性个数，继续递归
    ## items
        数组
            有生成规则：
                `'name|1': [{}, {} ...]`            其中之一，继续递归
                `'name|+1': [{}, {} ...]`           顺序检测，继续递归
                `'name|min-max': [{}, {} ...]`      检测个数，继续递归
                `'name|count': [{}, {} ...]`        检测个数，继续递归
            无生成规则：检测全部的元素个数，继续递归
*/
var Diff = {
    diff: function diff(schema, data, name /* Internal Use Only */ ) {
        var result = []

        // 先检测名称 name 和类型 type，如果匹配，才有必要继续检测
        if (
            this.name(schema, data, name, result) &&
            this.type(schema, data, name, result)
        ) {
            this.value(schema, data, name, result)
            this.properties(schema, data, name, result)
            this.items(schema, data, name, result)
        }

        return result
    },
    /* jshint unused:false */
    name: function(schema, data, name, result) {
        var length = result.length

        Assert.equal('name', schema.path, name + '', schema.name + '', result)

        if (result.length !== length) return false
        return true
    },
    type: function(schema, data, name, result) {
        var length = result.length

        Assert.equal('type', schema.path, Util.type(data), schema.type, result)

        if (result.length !== length) return false
        return true
    },
    value: function(schema, data, name, result) {
        var length = result.length

        var rule = schema.rule
        var templateType = Util.type(schema.template)
        if (templateType === 'object' || templateType === 'array') return

        // 无生成规则
        if (!schema.rule.parameters) {
            Assert.equal('value', schema.path, data, schema.template, result)
            return
        }

        // 有生成规则
        switch (templateType) {
            case 'number':
                var parts = (data + '').split('.')
                parts[0] = +parts[0]

                // 整数部分
                // |min-max
                if (rule.min !== undefined && rule.max !== undefined) {
                    Assert.greaterThanOrEqualTo('value', schema.path, parts[0], rule.min, result)
                        // , 'numeric instance is lower than the required minimum (minimum: {expected}, found: {actual})')
                    Assert.lessThanOrEqualTo('value', schema.path, parts[0], rule.max, result)
                }
                // |count
                if (rule.min !== undefined && rule.max === undefined) {
                    Assert.equal('value', schema.path, parts[0], rule.min, result, '[value] ' + name)
                }

                // 小数部分
                if (rule.decimal) {
                    // |dmin-dmax
                    if (rule.dmin !== undefined && rule.dmax !== undefined) {
                        Assert.greaterThanOrEqualTo('value', schema.path, parts[1].length, rule.dmin, result)
                        Assert.lessThanOrEqualTo('value', schema.path, parts[1].length, rule.dmax, result)
                    }
                    // |dcount
                    if (rule.dmin !== undefined && rule.dmax === undefined) {
                        Assert.equal('value', schema.path, parts[1].length, rule.dmin, result)
                    }
                }

                break

            case 'boolean':
                break
            case 'string':
                // 'aaa'.match(/a/g)
                var actualRepeatCount = data.match(new RegExp(schema.template, 'g'))
                actualRepeatCount = actualRepeatCount ? actualRepeatCount.length : actualRepeatCount

                // |min-max
                if (rule.min !== undefined && rule.max !== undefined) {
                    Assert.greaterThanOrEqualTo('value', schema.path, actualRepeatCount, rule.min, result)
                    Assert.lessThanOrEqualTo('value', schema.path, actualRepeatCount, rule.max, result)
                }
                // |count
                if (rule.min !== undefined && rule.max === undefined) {
                    Assert.equal('value', schema.path, actualRepeatCount, rule.min, result)
                }
                break
        }

        if (result.length !== length) return false
        return true
    },
    properties: function(schema, data, name, result) {
        var length = result.length

        var rule = schema.rule
        var keys = Util.keys(data)
        if (!schema.properties) return

        // 无生成规则
        if (!schema.rule.parameters) {
            Assert.equal('properties length', schema.path, keys.length, schema.properties.length, result)
        } else {
            // 有生成规则
            // |min-max
            if (rule.min !== undefined && rule.max !== undefined) {
                Assert.greaterThanOrEqualTo('properties length', schema.path, keys.length, rule.min, result)
                Assert.lessThanOrEqualTo('properties length', schema.path, keys.length, rule.max, result)
            }
            // |count
            if (rule.min !== undefined && rule.max === undefined) {
                Assert.equal('properties length', schema.path, keys.length, rule.min, result)
            }
        }

        if (result.length !== length) return false

        for (var i = 0; i < keys.length; i++) {
            result.push.apply(
                result,
                this.diff(
                    schema.properties[i],
                    data[keys[i]],
                    keys[i]
                )
            )
        }

        if (result.length !== length) return false
        return true
    },
    items: function(schema, data, name, result) {
        var length = result.length

        if (!schema.items) return

        var rule = schema.rule

        // 无生成规则
        if (!schema.rule.parameters) {
            Assert.equal('items length', schema.path, data.length, schema.items.length, result)
        } else {
            // 有生成规则
            // |min-max
            if (rule.min !== undefined && rule.max !== undefined) {
                Assert.greaterThanOrEqualTo('items', schema.path, data.length, (rule.min * schema.items.length), result,
                    '[{utype}] array is too short: {path} must have at least {expected} elements but instance has {actual} elements')
                Assert.lessThanOrEqualTo('items', schema.path, data.length, (rule.max * schema.items.length), result,
                    '[{utype}] array is too long: {path} must have at most {expected} elements but instance has {actual} elements')
            }
            // |count
            if (rule.min !== undefined && rule.max === undefined) {
                Assert.equal('items length', schema.path, data.length, (rule.min * schema.items.length), result)
            }
        }

        if (result.length !== length) return false

        for (var i = 0; i < data.length; i++) {
            result.push.apply(
                result,
                this.diff(
                    schema.items[i % schema.items.length],
                    data[i],
                    i % schema.items.length
                )
            )
        }

        if (result.length !== length) return false
        return true
    }
}

/*
    完善、友好的提示信息
    
    Equal, not equal to, greater than, less than, greater than or equal to, less than or equal to
    路径 验证类型 描述 

    Expect path.name is less than or equal to expected, but path.name is actual.

    Expect path.name is less than or equal to expected, but path.name is actual.
    Expect path.name is greater than or equal to expected, but path.name is actual.

*/
var Assert = {
    message: function(item) {
        return (item.message ||
                '[{utype}] Expect {path}\'{ltype} is {action} {expected}, but is {actual}')
            .replace('{utype}', item.type.toUpperCase())
            .replace('{ltype}', item.type.toLowerCase())
            .replace('{path}', Util.isArray(item.path) && item.path.join('.') || item.path)
            .replace('{action}', item.action)
            .replace('{expected}', item.expected)
            .replace('{actual}', item.actual)
    },
    equal: function(type, path, actual, expected, result, message) {
        if (actual === expected) return true
        var item = {
            path: path,
            type: type,
            actual: actual,
            expected: expected,
            action: 'equal to',
            message: message
        }
        item.message = Assert.message(item)
        result.push(item)
        return false
    },
    notEqual: function(type, path, actual, expected, result, message) {
        if (actual !== expected) return true
        var item = {
            path: path,
            type: type,
            actual: actual,
            expected: expected,
            action: 'not equal to',
            message: message
        }
        item.message = Assert.message(item)
        result.push(item)
        return false
    },
    greaterThan: function(type, path, actual, expected, result, message) {
        if (actual > expected) return true
        var item = {
            path: path,
            type: type,
            actual: actual,
            expected: expected,
            action: 'greater than',
            message: message
        }
        item.message = Assert.message(item)
        result.push(item)
        return false
    },
    lessThan: function(type, path, actual, expected, result, message) {
        if (actual < expected) return true
        var item = {
            path: path,
            type: type,
            actual: actual,
            expected: expected,
            action: 'less to',
            message: message
        }
        item.message = Assert.message(item)
        result.push(item)
        return false
    },
    greaterThanOrEqualTo: function(type, path, actual, expected, result, message) {
        if (actual >= expected) return true
        var item = {
            path: path,
            type: type,
            actual: actual,
            expected: expected,
            action: 'greater than or equal to',
            message: message
        }
        item.message = Assert.message(item)
        result.push(item)
        return false
    },
    lessThanOrEqualTo: function(type, path, actual, expected, result, message) {
        if (actual <= expected) return true
        var item = {
            path: path,
            type: type,
            actual: actual,
            expected: expected,
            action: 'less than or equal to',
            message: message
        }
        item.message = Assert.message(item)
        result.push(item)
        return false
    }
}

valid.Diff = Diff
valid.Assert = Assert

module.exports = valid