function _function(options) {
    const {
        template,
        context: { currentContext },
    } = options;
    // ( context, options )
    return template.call(currentContext, options);
}
export { _function as function };
