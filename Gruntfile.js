module.exports = function (grunt) {

    function run(cmd, msg){
      console.log('Running: '+cmd);
      shell.exec(cmd, {silent:false});
     }

    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    
    var semver = require('semver');
    var shell = require('shelljs');

    var configFile = 'package.json';

    var pkg =  grunt.file.readJSON(configFile);

    // Project configuration.
    grunt.initConfig({
        // make a zipfile
        clean: ['output', 'dist'],
        compress: {
          main: {
            options: {
              mode: 'tgz',
              archive: 'output/'+pkg.name+'-'+pkg.version+'.jar'
            },
            files: [
              // Need to exclude grunt-* modules
              {expand: true, cwd: 'dist', src: ['**/*'], dest: '/'}
            ]
          }
        }
    });

  grunt.registerTask('buildSwagger', 'Build Version', function() {
      run('npm run-script build');
  });

  grunt.registerTask('build', ['clean', 'buildSwagger', 'compress']);

};
