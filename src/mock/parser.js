/*
	## Parser

	解析数据模板（属性名部分）。

	* Parser.parse( name )
		
		```json
		{
			parameters: [ name, inc, range, decimal ],
			rnage: [ min , max ],

			min: min,
			max: max,
			count : count,

			decimal: decimal,
			dmin: dmin,
			dmax: dmax,
			dcount: dcount
		}
		```
 */

var Constant = require('./constant')
var Random = require('./random/')

/* jshint -W041 */
module.exports = {
	parse: function(name) {
		name = name == undefined ? '' : (name + '')

		var parameters = (name || '').match(Constant.RE_KEY)

		var range = parameters && parameters[3] && parameters[3].match(Constant.RE_RANGE)
		var min = range && range[1] && parseInt(range[1], 10) // || 1
		var max = range && range[2] && parseInt(range[2], 10) // || 1
			// repeat || min-max || 1
			// var count = range ? !range[2] && parseInt(range[1], 10) || Random.integer(min, max) : 1
		var count = range ? !range[2] ? parseInt(range[1], 10) : Random.integer(min, max) : undefined

		var decimal = parameters && parameters[4] && parameters[4].match(Constant.RE_RANGE)
		var dmin = decimal && decimal[1] && parseInt(decimal[1], 10) // || 0,
		var dmax = decimal && decimal[2] && parseInt(decimal[2], 10) // || 0,
			// int || dmin-dmax || 0
		var dcount = decimal ? !decimal[2] && parseInt(decimal[1], 10) || Random.integer(dmin, dmax) : undefined

		var result = {
			// 1 name, 2 inc, 3 range, 4 decimal
			parameters: parameters,
			// 1 min, 2 max
			range: range,
			min: min,
			max: max,
			// min-max
			count: count,
			// 是否有 decimal
			decimal: decimal,
			dmin: dmin,
			dmax: dmax,
			// dmin-dimax
			dcount: dcount
		}

		for (var r in result) {
			if (result[r] != undefined) return result
		}

		return {}
	}
}