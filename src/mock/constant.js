/* global define */
define(function() {
    /*
        RE_KEY
            name|+inc
            name|repeat
            name|min-max
            name|min-max.dmin-dmax
            name|int.dmin-dmax

            1 name, 2 inc, 3 range, 4 decimal

        RE_PLACEHOLDER
            placeholder(*)

        [正则查看工具](http://www.regexper.com/)

        #26 生成规则 支持 负数，例如 number|-100-100
    */
    return {
        GUID: 1,
        RE_KEY: /(.+)\|(?:\+(\d+)|([\+\-]?\d+-?[\+\-]?\d*)?(?:\.(\d+-?\d*))?)/,
        RE_RANGE: /([\+\-]?\d+)-?([\+\-]?\d+)?/,
        RE_PLACEHOLDER: /\\*@([^@#%&()\?\s]+)(?:\((.*?)\))?/g
            // /\\*@([^@#%&()\?\s\/\.]+)(?:\((.*?)\))?/g
    }
})