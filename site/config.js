require.config({
    paths: {
        jquery: 'bower_components/jquery/dist/jquery',
        underscore: 'bower_components/underscore/underscore',
        highlightjs: 'bower_components/highlightjs/highlight.pack',
        mock: 'bower_components/mockjs/dist/mock'
    },
    shim: {
        highlightjs: {
            exports: 'hljs'
        }
    }
})

var DEBUG = ~location.search.indexOf('mock.debug')
if (DEBUG) {
    require.config({
        paths: {
            mock: '../dist/mock',
        },
        shim: {}
    })
}