module.exports = function(grunt) {

  grunt.initConfig({

    config: {
      build: 'dist'
    },

    less: {
      stylekit: {
        files: {
          '<%= config.build %>/stylekit.css': 'stylekit.less'
        },
        options: {
          modifyVars: {
            themeConfigFile: '"../../../../theme.config"'
          }
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
          'themes/**/*.overrides',
          'semantic/src/definitions/**/*.less',
          'semantic/src/themes/default/**/*.variables',
          'semantic/src/themes/default/**/*.overrides'
        ],
        tasks: ['build'],
        options: {
          spawn: false,
          livereload: 35732
        },
      }
    },

    connect: {
      server: {
        options: {
          port: 8080,
          livereload: 35732,
          base: ['./']
        }
      }
    },

    bless: {
      stylekit: {
        options: {},
        files: {
          'dist/stylekit.blessed.css': 'dist/stylekit.css',
          'dist/stylekit.min.blessed.css': 'dist/stylekit.min.css'
        }
      }
    },

    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        commit: true,
        commitFiles: ['-a'],
        pushTo: 'origin'
      }
    },

    copy: {
      assets: {
        expand: true,
        cwd: 'themes/evisions/assets',
        src: '**/*',
        dest: 'dist/assets'
      }
    },

    cssmin: {
      target: {
        files: {
          'dist/stylekit.min.css': ['dist/stylekit.css']
        }
      }
    }

  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('release', ['build', 'bump-commit']);

  grunt.registerTask('build', ['less', 'autoprefixer', 'cssmin', 'bless', 'copy:assets']);

  grunt.registerTask('default', ['build',  'connect', 'watch']);
};
