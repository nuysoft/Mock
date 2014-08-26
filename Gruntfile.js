'use strict';

module.exports = function(grunt) {

    // Load multiple grunt tasks using globbing patterns
    require("load-grunt-tasks")(grunt)
    // Displays the execution time of grunt tasks
    require('time-grunt')(grunt)

    var pkg = grunt.file.readJSON('package.json')
    var mock_version_js = 'mock-' + pkg.version + '.js'

    grunt.initConfig({
        pkg: pkg,
        jshint: {
            files: [
                'Gruntfile.js', 'package.json',
                'src/*.js', 'src/fix/expose.js', '!src/regexp_parser.js',
                'test/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        qunit: {
            options: {
                '--web-security': false,
                timeout: 30000,
                coverage: {
                    baseUrl: '.',
                    src: ['dist/mock.js'],
                    instrumentedFiles: 'tmp',
                    htmlReport: 'coverage/html',
                    lcovReport: 'coverage/lcov',
                    statementsThresholdPct: 60.0,
                    disposeCollector: true
                }
            },
            files: [
                'test/qunit.html'
            ]
        },
        coveralls: {
            options: {
                force: true
            },
            main_target: {
                src: '<%= qunit.options.coverage.lcovReport %>/lcov.info'
            }
        },
        watch: {
            dev: {
                files: ['<%= jshint.files %>', 'test/**/*.*', 'doc/**/*.md', 'doc/template.html', '!doc/index.md'],
                tasks: ['base']
            },
            doc: {
                files: ['Gruntfile.js', 'doc/**/*.md', 'doc/template.html', '!doc/index.md'],
                tasks: ['concat:doc', 'markdown:doc', 'cleaver', 'copy:doc']
            }
        },
        concat: {
            dist: {
                options: {
                    separator: '\n\n',
                    process: function(src, filepath) {
                        var banner = '/*! ' + filepath + ' */\n'
                        var BEGEIN = '// BEGIN(BROWSER)'
                        var END = '// END(BROWSER)'
                        var indexOfBEGEIN = src.indexOf(BEGEIN)
                        var indexOfEND = src.indexOf(END)
                        if (indexOfBEGEIN != -1 && indexOfEND != -1) {
                            return banner + src.slice(indexOfBEGEIN + BEGEIN.length, indexOfEND)
                        }
                        return banner + src
                    }
                },
                src: [
                    'src/fix/prefix-1.js',
                    'src/fix/prefix-2.js',
                    'src/fix/expose.js',
                    'src/fix/prefix-3.js',

                    'src/util.js',
                    'src/regexp_parser.js',
                    'src/regexp_handler.js',
                    'src/random.js',
                    'src/handle.js',
                    'src/mock.js',
                    'src/xhr.js',
                    'src/schema.js',
                    'src/valid.js',

                    'src/fix/suffix.js'
                ],
                dest: 'dist/' + mock_version_js
            },
            doc: {
                options: {
                    separator: '\n\n'
                },
                src: [
                    'doc/getting-started.md',
                    'doc/spec.md',
                    'doc/mock.md',
                    // 'doc/mockjax.md',
                    // 'doc/mock4tpl.md',
                    // 'doc/mock4xtpl.md',
                    'doc/schema.md',
                    'doc/util.md',
                    'doc/random.md',
                    'doc/other.md'
                ],
                dest: 'doc/index.md'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("dd-mm-yyyy HH:MM:ss") %> */'
            },
            dev: {
                options: {
                    beautify: true,
                    compress: false,
                    mangle: false,
                    preserveComments: 'all' // false all some
                },
                files: [{
                    extDot: 'last',
                    expand: true,
                    cwd: 'dist/',
                    src: [mock_version_js, 'mock.js'],
                    dest: 'dist/',
                    ext: '.js'
                }]
            },
            dist: {
                options: {
                    sourceMap: true,
                },
                files: [{
                    extDot: 'last',
                    expand: true,
                    cwd: 'dist/',
                    src: [mock_version_js, 'mock.js'],
                    dest: 'dist/',
                    ext: '-min.js'
                }]
            }
        },
        markdown: {
            options: {
                template: 'doc/template.html'
            },
            doc: {
                expand: true,
                cwd: 'doc/',
                src: ['index.md'],
                dest: './',
                ext: '.html'
            }
        },
        cleaver: {
            lanlan: {
                expand: true,
                cwd: 'doc/',
                src: ['lanlan.md'],
                dest: 'doc/',
                ext: '.htm'
            }
        },
        copy: {
            demo: {
                files: [{
                    expand: true,
                    src: ['dist/**', 'demo/**',
                        'node_modules/jquery/tmp/**',
                        'node_modules/codemirror/**',
                        'node_modules/handlebars/dist/**'
                    ],
                    dest: '../../nuysoft.github.com/project/mock/'
                }]
            },
            lastest: {
                files: [{
                    expand: true,
                    src: ['dist/mock-' + pkg.version + '.js'],
                    dest: 'dist/',
                    rename: function(dest, src) {
                        return 'dist/mock.js'
                    }
                }]
            },
            doc: {
                files: [{
                    expand: true,
                    src: ['dist/**', 'demo/**', 'doc/**',
                        'node_modules/jquery/tmp/**',
                        'node_modules/codemirror/**',
                        'node_modules/handlebars/dist/**',
                        'bower_components/**',
                        'editor/**',
                    ],
                    dest: '../mockjs.github.com/0.2.0/'
                }, {
                    expand: true,
                    cwd: './',
                    src: ['index.html', 'favicon.ico', 'editor.html'],
                    dest: '../mockjs.github.com/0.2.0/'
                }]
            },
            kissy: {
                files: [{
                    src: ['dist/mock.js'],
                    dest: '../kissy-gallery/Mock/0.1.1/build/index.js'
                }, {
                    src: ['dist/mock-min.js'],
                    dest: '../kissy-gallery/Mock/0.1.1/build/index-min.js'
                }]
            }
        },
        connect: { // grunt connect:server:keepalive
            server: {
                options: {
                    port: 5050,
                    base: '.',
                    host: '0.0.0.0'
                }
            }
        }
    })

    grunt.registerTask('base', [
        'jshint', 'concat', 'qunit', 'uglify',
        'doc-base'
    ]) // 'copy:demo',
    grunt.registerTask('travis', ['jshint', 'qunit', 'coveralls']) // grunt travis --verbose
    grunt.registerTask('default', ['base', 'connect', 'watch:dev'])
    grunt.registerTask('doc-base', ['concat:doc', 'markdown:doc', 'cleaver', 'copy:doc', 'copy:kissy'])
    grunt.registerTask('doc', ['doc-base', 'connect', 'watch:doc'])

    grunt.registerTask('build', ['jshint', 'concat', 'copy:lastest', 'qunit', 'uglify'])
};