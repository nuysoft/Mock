'use strict';
module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: ['Gruntfile.js', 'package.json', 'src/**/*.js', 'test/**/*.js',
                    '!**/*-prefix.js', '!**/*-suffix.js', '!src/tpl/parser.js', '!src/tpl/parser/parser.js'
            ], // 
            options: {
                jshintrc: '.jshintrc'
            }
        },
        qunit: {
            files: ['test/mock.html', 'test/mock-*.html',
                    'test/mock4tpl.html', 'test/mock4tpl-*.html',
                    'test/**/*.html'
            ]
        },
        nodeunit: {
            all: ['test/*-node.js' /*, 'test/mock4xtemplate-node.js'*/ ]
        },
        watch: {
            dev: {
                files: ['<%= jshint.files %>', 'test/**/*.*'],
                tasks: ['jshint', 'nodeunit', 'concat' /*, 'qunit'*/ ]
            },
            build: {
                files: ['<%= jshint.files %>', 'test/**/*.*'],
                tasks: ['jshint', 'nodeunit', 'concat' /*, 'qunit'*/ ]
            }
        },
        concat: {
            options: {
                separator: '\n\n',
                process: function(src, filepath) {
                    var banner = '// ' + filepath + '\n';
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
            mock: {
                src: ['src/mock-prefix.js',
                        'src/util.js', 'src/random.js', 'src/mock.js', 'src/mockjax.js', 'src/expose.js',
                        'src/mock-suffix.js'
                ],
                dest: 'dist/mock.js'
            },
            parser: {
                options: {
                    process: function(src) {
                        return src
                    }
                },
                src: ['src/tpl/parser/parser-prefix.js',
                        'src/tpl/parser/parser.js', 'src/tpl/parser/ast.js',
                        'src/tpl/parser/parser-suffix.js'
                ],
                dest: 'src/tpl/parser.js'
            },
            mock4tpl: {
                src: ['src/tpl/mock4tpl-prefix.js',
                        'src/tpl/parser.js', 'src/tpl/mock4tpl.js', 'src/tpl/expose.js',
                        'src/tpl/mock4tpl-suffix.js'
                ],
                dest: 'dist/mock4tpl.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            mock: {
                expand: true,
                cwd: 'dist/',
                src: ['**/*.js', '!**/*-min.js'],
                dest: 'dist/',
                ext: '-min.js'
            }
        },
        exec: {
            parser: {
                command: './node_modules/.bin/jison -m js src/tpl/parser/parser.yy src/tpl/parser/parser.l'
            },
            move: {
                command: 'mv parser.js src/tpl/parser/'
            }
        }
    })

    grunt.loadNpmTasks('grunt-contrib-jshint')
    grunt.loadNpmTasks('grunt-contrib-qunit')
    grunt.loadNpmTasks('grunt-contrib-watch')
    grunt.loadNpmTasks('grunt-contrib-nodeunit')
    grunt.loadNpmTasks('grunt-contrib-uglify')
    grunt.loadNpmTasks('grunt-contrib-concat')
    grunt.loadNpmTasks('grunt-exec')

    grunt.registerTask('default', ['jshint', 'nodeunit', 'concat', 'qunit', 'uglify', 'watch:dev'])
    grunt.registerTask('build', ['jshint', 'nodeunit', 'concat', 'qunit', 'uglify'])
    grunt.registerTask('parser', ['exec'])

};