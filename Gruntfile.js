'use strict';

module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('perfect-scrollbar.jquery.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    clean: {
      files: ['min']
    },
    // Task configuration.
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      min: {
        files: {
          'min/perfect-scrollbar.min.js': ['src/perfect-scrollbar.js']
        }
      }
    },
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
    },
    csslint: {
      strict: {
        options: {
          csslintrc: '.csslintrc',
          'import': 2
        },
        src: ['src/perfect-scrollbar.css']
      }
    },
    cssmin: {
      options: {
        banner: '<%= banner %>'
      },
      minify: {
        expand: true,
        cwd: 'src/',
        src: ['perfect-scrollbar.css'],
        dest: 'min/',
        ext: '.min.css'
      }
    },
    bump: {
      options: {
        files: ['package.json', 'bower.json', 'perfect-scrollbar.jquery.json'],
        updateConfigs: ['pkg'],
        commit: false,
        createTag: false,
        push: false
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-bump');

  grunt.registerTask('default', 'List commands', function () {
    grunt.log.writeln("");

    grunt.log.writeln("Run 'grunt lint' to lint the source files");
    grunt.log.writeln("Run 'grunt build' to minify the source files");
  });

  grunt.registerTask('lint', ['jshint', 'csslint']);
  grunt.registerTask('build', ['clean', 'uglify', 'cssmin']);
  grunt.registerTask('travis', ['lint']);
  grunt.registerTask('release', 'Release a new version', function (arg) {
    var bumpType = arg ? ':' + arg : '';
    grunt.task.run(['lint', 'bump' + bumpType, 'build']);
  });

};
