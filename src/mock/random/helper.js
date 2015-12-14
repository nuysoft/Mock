/*
    ## Helpers
*/
module.exports = {
	// 把字符串的第一个字母转换为大写。
	capitalize: function(word) {
		return (word + '').charAt(0).toUpperCase() + (word + '').substr(1)
	},
	// 把字符串转换为大写。
	upper: function(str) {
		return (str + '').toUpperCase()
	},
	// 把字符串转换为小写。
	lower: function(str) {
		return (str + '').toLowerCase()
	},
	// 从数组中随机选取一个元素，并返回。
	pick: function pick(arr, min, max) {
		arr = arr || []
		switch (arguments.length) {
			case 1:
				return arr[this.natural(0, arr.length - 1)]
			case 2:
				max = min
					/* falls through */
			case 3:
				return this.shuffle(arr, min, max)

		}
	},
	/*
	    打乱数组中元素的顺序，并返回。
	    Given an array, scramble the order and return it.

	    其他的实现思路：
	        // https://code.google.com/p/jslibs/wiki/JavascriptTips
	        result = result.sort(function() {
	            return Math.random() - 0.5
	        })
	*/
	shuffle: function shuffle(arr, min, max) {
		arr = arr || []
		var old = arr.slice(0),
			result = [],
			index = 0,
			length = old.length;
		for (var i = 0; i < length; i++) {
			index = this.natural(0, old.length - 1)
			result.push(old[index])
			old.splice(index, 1)
		}
		switch (arguments.length) {
			case 0:
			case 1:
				return result
			case 2:
				max = min
					/* falls through */
			case 3:
				min = parseInt(min, 10)
				max = parseInt(max, 10)
				return result.slice(0, this.natural(min, max))
		}
	},
	/*
	    * Random.order(item, item)
	    * Random.order([item, item ...])

	    顺序获取数组中的元素

	    [JSON导入数组支持数组数据录入](https://github.com/thx/RAP/issues/22)

	    不支持单独调用！
	*/
	order: function order(array) {
		order.cache = order.cache || {}

		if (arguments.length > 1) array = [].slice.call(arguments, 0)

		// options.context.path/templatePath
		var options = order.options
		var templatePath = options.context.templatePath.join('.')

		var cache = (
			order.cache[templatePath] = order.cache[templatePath] || {
				index: 0,
				array: array
			}
		)

		return cache.array[cache.index++ % cache.array.length]
	}
}