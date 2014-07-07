"use strict";

/* global window    */
/* global expose    */
/* global Mock      */
/* global Util      */

(function(factory) {

    expose(['util', 'handle'], factory, function() {
        window.toJSONSchema = factory(Util, Handle)
    })

}(function(Util, Handle) {

    // BEGIN(BROWSER)

    function toJSONSchema(template, name) {
        // type rule properties items

        var result = {
            name: typeof name === 'string' ? name.replace(Handle.RE_KEY, '$1') : name,
            template: template,
            type: Util.type(template),
            rule: Handle.rule(name)
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

    // END(BROWSER)

    return toJSONSchema

}));