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
      stylekit: {
        files: [
          'apps**/*.less',
          'apps/**/*.variables',
          'apps/**/*.overrides',
          'themes**/*.less',
          'themes/**/*.variables',
          'themes/**/*.overrides'
        ],
        tasks: ['build'],
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
    },

    bless: {
      stylekit: {
        options: {},
        files: {
          'dist/blessed/stylekit.css': 'dist/stylekit.css'
        }
      }
    }

  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('build', ['less', 'autoprefixer', 'bless']);

  grunt.registerTask('default', ['build',  'connect', 'watch']);
};