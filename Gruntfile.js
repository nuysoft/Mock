'use strict';
module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: ['Gruntfile.js', 'package.json', 'src/**/*.js', 'test/**/*.js'], // 
            options: {
                jshintrc: '.jshintrc'
            }
        },
        qunit: {
            files: ['test/**/*.html']
        },
        nodeunit: {
            all: ['test/mock-node.js','test/mock4tpl-node.js']
        },
        watch: {
            dev: {
                files: ['<%= jshint.files %>', 'test/**/*.*'],
                tasks: ['jshint', 'nodeunit']
            },
            build: {
                files: ['<%= jshint.files %>', 'test/**/*.*'],
                tasks: ['jshint', 'nodeunit']
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            src: {
                expand: true,
                cwd: 'src/',
                src: ['**/*.js', '!**/*-min.js'],
                dest: 'build/',
                ext: '-min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['jshint', 'nodeunit', 'watch:dev']);
    grunt.registerTask('build', ['jshint', 'nodeunit', 'uglify']);
};