/* global define */
define(
    [
        'mock/constant', 'mock/util', 'mock/parser'
    ],
    function(
        Constant, Util, Parser
    ) {
        function toJSONSchema(template, name) {
            // type rule properties items
            var result = {
                name: typeof name === 'string' ? name.replace(Constant.RE_KEY, '$1') : name,
                template: template,
                type: Util.type(template), // 可能不准确，例如 { 'name|1': [{}, {} ...] }
                rule: Parser.parse(name)
            }

            switch (result.type) {
                case 'array':
                    result.items = []
                    Util.each(template, function(value, index) {
                        result.items.push(
                            toJSONSchema(value, index)
                        )
                    })
                    break
                case 'object':
                    result.properties = []
                    Util.each(template, function(value, name) {
                        result.properties.push(
                            toJSONSchema(value, name)
                        )
                    })
                    break
            }

            return result

        }

        return toJSONSchema
    }
)