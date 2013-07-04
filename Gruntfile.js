/* global module:false */
module.exports = function(grunt) {
	grunt.initConfig({
		connect: {
			all: {
				options: {
					base: 'test',
					port: 9999
				}
			}
		},
		clean: {
			all: ["./bin"]
		},
		copy: {
			chrome: {
				files: [{
						cwd: 'extensions/chrome',
						src: '**',
						dest: 'bin/chrome/',
						expand: true
					}, {
						cwd: 'core',
						src: '**/*',
						dest: 'bin/chrome/core',
						expand: true
					}, {
						cwd: 'lib',
						src: '**',
						dest: 'bin/chrome/lib',
						expand: true
					}
				]
			},
			firefox: {
				files: [{
						cwd: 'extensions/firefox',
						src: '**',
						dest: 'bin/firefox/',
						expand: true
					}, {
						cwd: 'core',
						src: '**/*',
						dest: 'bin/firefox/data/core',
						expand: true
					}, {
						cwd: 'lib',
						src: '**',
						dest: 'bin/firefox/data/lib',
						expand: true
					}
				]
			}
		},
		watch: {
			chrome: {
				files: ['extensions/chrome/**', 'core/**'],
				tasks: ['copy:chrome']
			},
			firefox: {
				files: ['extensions/firefox/**', 'core/**'],
				tasks: ['copy:firefox']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('dev', ['clean', 'copy', 'connect', 'watch']);
	grunt.registerTask('chrome', ['copy:chrome', 'connect', 'watch:chrome']);
	grunt.registerTask('firefox', ['copy:firefox', 'connect', 'watch:firefox']);
};