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
    
    var file = pkg.name+'-'+pkg.version+'.jar';

    // Project configuration.
    grunt.initConfig({
        // make a zipfile
        clean: ['output', 'dist'],
        compress: {
          main: {
            options: {
              mode: 'zip',
              archive: 'output/'+file
            },
            files: [
              // Need to exclude grunt-* modules
              {expand: true, cwd: 'dist', src: ['**/*'], dest: '/'}
            ]
          }
        }
    });
    
    grunt.registerTask('publish', function () {

        var auth = 'autodeploy:biquaif7wi';
        var groupId = 'com/mondiamedia/services/'

        if (pkg.version.indexOf('SNAPSHOT') === -1) {
            grunt.log.ok('Release ' + pkg.version);
   
            var nexus = 'http://nexus.hh.arvm.de:8086/nexus/content/repositories/releases/'
            run('curl -T output/' + file + ' -u ' + auth + ' '+ nexus + groupId + pkg.name + '/' + pkg.version + '/' + file);
    
        } else {
            grunt.log.ok('Snapshot-Release ' + pkg.version);

            
            var nexus = 'http://nexus.hh.arvm.de:8086/nexus/content/repositories/snapshots/'
            run('curl -T output/' + file + ' -u ' + auth + ' '+ nexus + groupId + pkg.name + '/' + pkg.version + '/' + file);
        }

    });
    

  grunt.registerTask('buildSwagger', 'Build Version', function() {
      run('npm run-script build');
  });

  grunt.registerTask('build', ['clean', 'buildSwagger', 'compress', 'publish']);

};
