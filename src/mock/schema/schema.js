/* global define */
/*
    ## toJSONSchema
 */
define(
    [
        'mock/constant', 'mock/util', 'mock/parser'
    ],
    function(
        Constant, Util, Parser
    ) {
        function toJSONSchema(template, name, path /* Internal Use Only */ ) {
            // type rule properties items
            path = path || []
            var result = {
                name: typeof name === 'string' ? name.replace(Constant.RE_KEY, '$1') : name,
                template: template,
                type: Util.type(template), // 可能不准确，例如 { 'name|1': [{}, {} ...] }
                rule: Parser.parse(name)
            }
            result.path = path.slice(0)
            result.path.push(name === undefined ? 'data' : result.name)

            switch (result.type) {
                case 'array':
                    result.items = []
                    Util.each(template, function(value, index) {
                        result.items.push(
                            toJSONSchema(value, index, result.path)
                        )
                    })
                    break
                case 'object':
                    result.properties = []
                    Util.each(template, function(value, name) {
                        result.properties.push(
                            toJSONSchema(value, name, result.path)
                        )
                    })
                    break
            }

            return result

        }

        return toJSONSchema
    }
)