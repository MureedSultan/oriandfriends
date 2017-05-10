module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    var options = {
        config: {
            src: './grunt/*.js'
        },
        paths: {
            public: './public'
        },
        pkg: grunt.file.readJSON('package.json')
    };

    var configs = require('load-grunt-configs')(grunt, options);

    // Project configuration.
    grunt.initConfig(configs);

    // load npm tasks
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-postcss');

    // define default task
    grunt.registerTask('default', [
      'sass',
      'postcss',
      'watch'
    ]);
};
