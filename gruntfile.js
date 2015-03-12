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
          base: ['public', 'dist', 'themes/evisions/assets']
        }
      }
    },

    bless: {
      stylekit: {
        options: {},
        files: {
          'dist/stylekit.blessed.css': 'dist/stylekit.css'
        }
      }
    },

    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        commit: true,
        commitFiles: ['-a'],
        pushTo: 'origin master'
      }
    },

    copy: {
      assets: {
        expand: true,
        cwd: 'themes/evisions/assets',
        src: '**/*',
        dest: 'dist/assets'
      }
    }

  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('release', ['build', 'bump']);

  grunt.registerTask('build', ['less', 'autoprefixer', 'bless', 'copy:assets']);

  grunt.registerTask('default', ['build',  'connect', 'watch']);
};