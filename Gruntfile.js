'use strict';

module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
   
    jshint: {
      gruntfile: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'Gruntfile.js'
      },
      src: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'src/perfect-scrollbar.js'
      }
    }
  });

  // These plugins provide necessary tasks.

  grunt.loadNpmTasks('grunt-contrib-jshint');

};
