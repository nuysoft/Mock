"use strict";

/* global window */
/* global define */
/* global KISSY */

(function(factory) {

    var expose = factory()
    expose(factory, function() {
        window.expose = expose
    })

}(function() {

    // BEGIN(BROWSER)

    /*
        * expose(id, dependencies, factory, globals)
        * expose(id, factory, globals)
        * expose(dependencies, factory, globals)
        * expose(factory, globals)
        * expose(factory)
    
        模块化（Modular），适配主流加载器。

        https://gist.github.com/nuysoft/7974409
    */
    function expose(id, dependencies, factory, globals) {
        var argsLen = arguments.length
        var args = []

        switch (argsLen) {
            case 1:
                // expose(factory)
                factory = id
                id = dependencies = globals = undefined
                break
            case 2:
                // expose(factory, globals)
                factory = id
                globals = dependencies
                id = dependencies = undefined
                break
            case 3:
                globals = factory
                factory = dependencies
                if (id instanceof Array) {
                    // expose(dependencies, factory, globals)
                    dependencies = id
                    id = undefined
                } else {
                    // expose(id, factory, globals)
                    dependencies = undefined
                }
                break
            default:
                // expose(id, dependencies, factory, globals)
        }

        if (typeof module === 'object' && module.exports) {
            // CommonJS
            module.exports = factory()

        } else if (typeof define === "function" && define.amd) {
            // AMD modules
            // define(id?, dependencies?, factory)
            // https://github.com/amdjs/amdjs-api/wiki/AMD
            if (id !== undefined) args.push(id)
            if (dependencies !== undefined) args.push(dependencies)
            args.push(factory)
            define.apply(window, args)

        } else if (typeof define === "function" && define.cmd) {
            // CMD modules
            // define(id?, deps?, factory)
            // https://github.com/seajs/seajs/issues/242
            if (id !== undefined) args.push(id)
            if (dependencies !== undefined) args.push(dependencies)
            args.push(factory)
            define.apply(window, args)

        } else if (typeof KISSY != 'undefined') {
            // For KISSY 1.4
            // http://docs.kissyui.com/1.4/docs/html/guideline/kmd.html
            if (!window.define) {
                window.define = function define(id, dependencies, factory) {
                    // KISSY.add(name?, factory?, deps)
                    function proxy( /*arguments*/ ) {
                        var args = [].slice.call(arguments, 1, arguments.length)
                        return factory.apply(window, args)
                    }
                    switch (arguments.length) {
                        case 2:
                            // KISSY.add(factory, deps)
                            factory = dependencies
                            dependencies = id
                            KISSY.add(proxy, {
                                requires: dependencies.concat(['node'])
                            })
                            break
                        case 3:
                            // KISSY.add(name?, factory, deps)
                            KISSY.add(id, proxy, {
                                requires: dependencies.concat(['node'])
                            })
                            break
                    }
                }
                window.define.kmd = {}
            }
            define(id, dependencies, factory)

        } else {
            // Browser globals
            if (globals) globals()

        }
    }

    // END(BROWSER)

    return expose

}));
