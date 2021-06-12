function _function(options) {
    let {
        template,
        context: { currentContext },
    } = options;
    // ( context, options )
    return template.call(currentContext, options);
}
export { _function as function };
