require.config({
    paths: {
        jquery: 'bower_components/jquery/dist/jquery',
        underscore: 'bower_components/underscore/underscore',
        highlightjs: 'bower_components/highlightjs/highlight.pack',
        mock: '../dist/mock'
    },
    shim: {
        highlightjs: {
            exports: 'hljs'
        }
    }
})