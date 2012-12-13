/* global module:false */
module.exports = function(grunt) {
	grunt.initConfig({
		server: {
			base: '.',
			port: 9999
		},
		clean: {
			all: ["./bin"]
		},

		copy: {
			firefox: {
				files: {
					'./bin/firefox/': './extensions/firefox/**',
					'./bin/firefox/data/core/': ['./core/**'],
					'./bin/firefox/data/lib/jquery/': ['./lib/**']
				}
			},
			opera: {
				files: {
					'./bin/opera/': './extensions/opera/**',
					'./bin/opera/core/': ['./core/**'],
					'./bin/opera/lib/jquery/': ['./lib/**']
				}
			},
			chrome: {
				files: {
					
				}
			}
		}
	});

	grunt.registerTask('forever', 'Runs grunt forever', function() {
		this.async();
	});

	grunt.registerTask('run-firefox', 'Runs Firefox in the extension development mode', function() {
		console.log(process.env.addonSDK);
	});

	grunt.loadNpmTasks('grunt-contrib');
};