'use strict';

var Mock = require('./dist/mock.js')

// http://www.network-science.de/ascii/ doom
console.log(Mock.heredoc(function() {
    /*
___  ___              _        _      
|  \/  |             | |      (_)     
| .  . |  ___    ___ | | __    _  ___ 
| |\/| | / _ \  / __|| |/ /   | |/ __|
| |  | || (_) || (__ |   <  _ | |\__ \
\_|  |_/ \___/  \___||_|\_\(_)| ||___/
                             _/ |     
                            |__/      
     */
}))

module.exports = function(grunt) {

    // Displays the execution time of grunt tasks. Can help when optimizing build times.
    require('time-grunt')(grunt)

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: ['Gruntfile.js', 'package.json', 'src/**/*.js', 'test/**/*.js',
                '!src/xhr.js', '!src/MockHttpRequest.js',
                '!**/*-prefix.js', '!**/*-suffix.js',
                '!**/node_modules/**/*.js', '!**/bower_components/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        qunit: {
            files: [
                'test/mock.html'
            ]
        },
        nodeunit: {
            all: ['test/nodeunit/*.js', '!test/**/noop.*']
        },
        watch: {
            dev: {
                files: ['<%= jshint.files %>', 'test/**/*.*', 'doc/**/*.md', 'doc/template.html', '!doc/index.md'],
                tasks: ['base']
            },
            doc: {
                files: ['Gruntfile.js', 'doc/**/*.md', 'doc/template.html', '!doc/index.md'],
                tasks: ['concat:doc', 'markdown:doc', 'cleaver', 'copy:doc']
            },
            build: {}
        },
        concat: {
            mock: {
                options: {
                    separator: '\n\n',
                    process: function(src, filepath) {
                        var banner = '/*! ' + filepath + ' */\n';
                        // var rbrowser = /\/\/ BEGIN\(BROWSER\)\n([.\s]*)\n\/\/ END\(BROWSER\)/mg
                        var BEGEIN = '// BEGIN(BROWSER)',
                            END = '// END(BROWSER)';
                        var indexOfBEGEIN = src.indexOf(BEGEIN),
                            indexOfEND = src.indexOf(END);
                        if (indexOfBEGEIN != -1 && indexOfEND != -1) {
                            return banner + src.slice(indexOfBEGEIN + BEGEIN.length, indexOfEND)
                        }
                        return banner + src
                    }
                },
                src: ['src/mock-prefix.js',
                    'src/util.js', 'src/random.js',
                    'src/mock.js',
                    // 'src/xhr.js',
                    'src/mockjax.js',
                    'src/expose.js',
                    'src/mock4tpl.js',
                    'src/mock4xtpl.js',
                    'src/mock-suffix.js'
                ],
                dest: 'dist/mock.js'
            },
            doc: {
                options: {
                    separator: '\n\n'
                },
                src: ['doc/getting-started.md',
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
        clean: {
            dest: ["dist/**.**"]
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
                    preserveComments: 'some' // false all some
                },
                files: [{
                    expand: true,
                    cwd: 'dist/',
                    src: ['**/*.js', '!**/*-min.js'],
                    dest: 'dist/',
                    ext: '.js'
                }]
            },
            release: {
                options: {
                    sourceMap: './mock-min.map'
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
        exec: {
            doc: {
                command: 'node ../push'
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

    grunt.loadNpmTasks('grunt-contrib-jshint')
    grunt.loadNpmTasks('grunt-contrib-qunit')
    grunt.loadNpmTasks('grunt-contrib-watch')
    grunt.loadNpmTasks('grunt-contrib-nodeunit')
    grunt.loadNpmTasks('grunt-contrib-uglify')
    grunt.loadNpmTasks('grunt-contrib-concat')
    grunt.loadNpmTasks('grunt-contrib-copy')
    grunt.loadNpmTasks('grunt-contrib-clean')
    grunt.loadNpmTasks('grunt-contrib-connect')
    grunt.loadNpmTasks('grunt-exec')
    grunt.loadNpmTasks('grunt-markdown')
    grunt.loadNpmTasks('grunt-cleaver')

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