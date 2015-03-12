module.exports = function(grunt) {

  grunt.initConfig({

    config: {
      build: 'dist'
    },

    less: {
      stylekit: {
        files: {
          '<%= config.build %>/stylekit.css': 'semantic/src/semantic.less'
        }
      }
    },

    autoprefixer: {
      no_dest: {
        src: '<%= config.build %>/stylekit.css' // globbing is also possible here
      },
    },

    watch: {
      semantic: {
        files: [
          'apps**/*.less',
          'apps/**/*.variables',
          'apps/**/*.overrides',
          'themes**/*.less',
          'themes/**/*.variables',
          'themes/**/*.overrides'
        ],
        tasks: ['less:stylekit', 'autoprefixer'],
        options: {
          spawn: false,
          livereload: true
        },
      }
    },

    connect: {
      server: {
        options: {
          port: 8080,
          livereload: true,
          base: ['public', 'dist', 'themes/default/assets']
        }
      }
    }

  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('build', ['less', 'autoprefixer']);

  grunt.registerTask('default', ['build',  'connect', 'watch']);
};