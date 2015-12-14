require.config({
    paths: {
        jquery: 'bower_components/jquery/dist/jquery',
        underscore: 'bower_components/underscore/underscore',
        highlightjs: 'bower_components/highlightjs/highlight.pack',
        mock: 'bower_components/mockjs/dist/mock',
        vue: 'bower_components/vue/dist/vue',
        'smooth-scroll': 'bower_components/smooth-scroll/dist/js/smooth-scroll'
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
            mock: '../dist/mock'
        },
        shim: {}
    })
}