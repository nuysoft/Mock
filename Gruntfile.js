'use strict';

module.exports = function(grunt) {

    // Load multiple grunt tasks using globbing patterns
    require("load-grunt-tasks")(grunt)
    // Displays the execution time of grunt tasks
    require('time-grunt')(grunt)

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: [
                'Gruntfile.js', 'package.json',
                'src/*.js', 'src/fix/expose.js',
                'test/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        qunit: {
            files: [
                'test/*.html'
            ]
        },
        nodeunit: {
            all: ['test/nodeunit/*.js']
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
                    'src/random.js',
                    'src/mock.js',
                    'src/xhr.js',

                    'src/fix/suffix.js'
                ],
                dest: 'dist/mock.js'
            },
            doc: {
                options: {
                    separator: '\n\n'
                },
                src: [
                    'doc/getting-started.md',
                    'doc/spec.md',
                    'doc/mock.md',
                    'doc/mockjax.md',
                    'doc/mock4tpl.md',
                    'doc/mock4xtpl.md',
                    'doc/util.md',
                    'doc/random.md',
                    'doc/other.md'
                ],
                dest: 'doc/index.md'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy HH:MM:ss") %> */\n'
            },
            dev: {
                options: {
                    beautify: true,
                    compress: false,
                    mangle: false,
                    preserveComments: 'all' // false all some
                },
                files: [{
                    expand: true,
                    cwd: 'dist/',
                    src: ['**/*.js', '!**/*-min.js'],
                    dest: 'dist/',
                    ext: '.js'
                }]
            },
            dist: {
                options: {
                    sourceMap: 'dist/mock-min.map'
                },
                files: [{
                    expand: true,
                    cwd: 'dist/',
                    src: ['**/*.js', '!**/*-min.js'],
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
                    dest: '../mockjs.github.com/'
                }, {
                    expand: true,
                    cwd: './',
                    src: ['index.html', 'favicon.ico', 'editor.html'],
                    dest: '../mockjs.github.com/'
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
        'jshint', 'nodeunit', 'concat:mock', 'qunit',
        'uglify',
        'doc-base'
    ]) // 'copy:demo',
    grunt.registerTask('travis', ['jshint', 'nodeunit', 'qunit']) // grunt travis --verbose
    grunt.registerTask('default', ['base', 'connect', 'watch:dev'])
    grunt.registerTask('doc-base', ['concat:doc', 'markdown:doc', 'cleaver', 'copy:doc', 'copy:kissy'])
    grunt.registerTask('doc', ['doc-base', 'connect', 'watch:doc'])

    grunt.registerTask('build', ['jshint', 'nodeunit', 'concat', 'qunit', 'uglify'])
};