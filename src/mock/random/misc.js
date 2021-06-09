/*
    ## Miscellaneous
*/
var DICT = require('./address_dict')
module.exports = {
	// Dice
	d4: function() {
		return this.natural(1, 4)
	},
	d6: function() {
		return this.natural(1, 6)
	},
	d8: function() {
		return this.natural(1, 8)
	},
	d12: function() {
		return this.natural(1, 12)
	},
	d20: function() {
		return this.natural(1, 20)
	},
	d100: function() {
		return this.natural(1, 100)
	},
	/*
	    随机生成一个 GUID。

	    http://www.broofa.com/2008/09/javascript-uuid-function/
	    [UUID 规范](http://www.ietf.org/rfc/rfc4122.txt)
	        UUIDs (Universally Unique IDentifier)
	        GUIDs (Globally Unique IDentifier)
	        The formal definition of the UUID string representation is provided by the following ABNF [7]:
	            UUID                   = time-low "-" time-mid "-"
	                                   time-high-and-version "-"
	                                   clock-seq-and-reserved
	                                   clock-seq-low "-" node
	            time-low               = 4hexOctet
	            time-mid               = 2hexOctet
	            time-high-and-version  = 2hexOctet
	            clock-seq-and-reserved = hexOctet
	            clock-seq-low          = hexOctet
	            node                   = 6hexOctet
	            hexOctet               = hexDigit hexDigit
	            hexDigit =
	                "0" / "1" / "2" / "3" / "4" / "5" / "6" / "7" / "8" / "9" /
	                "a" / "b" / "c" / "d" / "e" / "f" /
	                "A" / "B" / "C" / "D" / "E" / "F"
	    
	    https://github.com/victorquinn/chancejs/blob/develop/chance.js#L1349
	*/
	guid: function() {
		var pool = "abcdefABCDEF1234567890",
			guid = this.string(pool, 8) + '-' +
			this.string(pool, 4) + '-' +
			this.string(pool, 4) + '-' +
			this.string(pool, 4) + '-' +
			this.string(pool, 12);
		return guid
	},
	uuid: function() {
		return this.guid()
	},
	/*
	    随机生成一个 18 位身份证。

	    [身份证](http://baike.baidu.com/view/1697.htm#4)
	        地址码 6 + 出生日期码 8 + 顺序码 3 + 校验码 1
	    [《中华人民共和国行政区划代码》国家标准(GB/T2260)](http://zhidao.baidu.com/question/1954561.html)
	*/
	id: function() {
		var id,
			sum = 0,
			rank = [
				"7", "9", "10", "5", "8", "4", "2", "1", "6", "3", "7", "9", "10", "5", "8", "4", "2"
			],
			last = [
				"1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"
			]

		id = this.pick(DICT).id +
			this.date('yyyyMMdd') +
			this.string('number', 3)

		for (var i = 0; i < id.length; i++) {
			sum += id[i] * rank[i];
		}
		id += last[sum % 11];

		return id
	},

	/*
	    生成一个全局的自增整数。
	    类似自增主键（auto increment primary key）。
	*/
	increment: function() {
		var key = 0
		return function(step) {
			return key += (+step || 1) // step?
		}
	}(),
	inc: function(step) {
		return this.increment(step)
	}
}