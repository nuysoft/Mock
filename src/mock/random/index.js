/*
    ## Mock.Random
    
    工具类，用于生成各种随机数据。
*/

var Util = require('../util')

var Random = {
    extend: Util.extend
}

Random.extend(require('./basic'))
Random.extend(require('./date'))
Random.extend(require('./image'))
Random.extend(require('./color'))
Random.extend(require('./text'))
Random.extend(require('./name'))
Random.extend(require('./web'))
Random.extend(require('./address'))
Random.extend(require('./helper'))
Random.extend(require('./misc'))

module.exports = Random