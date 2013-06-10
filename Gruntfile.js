
module.exports = function(grunt) {

    var pkg = grunt.file.readJSON('package.json'); // grunt.config.data.pkg ...
    var config = grunt.option('config') || 'local'; // Run as >grunt -config {environment} ... // grunt.config.data.env ...

    // Custom task for creating folders and moving the index file ...
    grunt.registerTask('first', 'First task', function() {
        grunt.file.mkdir('temp');
        grunt.file.mkdir('dist');
        
        // Move the index file into the dist directory ...
        grunt.file.copy('src/index.html', 'dist/index.html');        
    });

    // Custom task for moving config specific JSON data from 'config/' to '/js/jsondata' ...
    grunt.registerTask('injectConfig', 'inject configs into jsondata', function() {
        // Simply copy the config file into the /temp/js ...
        grunt.file.copy('configs/' + config + '.json', 'temp/js/config.json');
    });

    // Custom task for cleanups ....
    grunt.registerTask('last', 'Last task', function() {
        grunt.file.delete('temp');
    });

    // The majority of the tasks are defined here ...
    grunt.initConfig({
        pkg: pkg,
        copy: {
            build: {
                files: [
                    { expand: true, cwd: 'src/', src: ['js/**'], dest: 'temp'}, 
                    { expand: true, cwd: 'src/', src: ['css/**'], dest: 'temp'}
                ]
            }
        },
        concat: {
            css: {
                src: 'temp/css/*.css',
                dest: 'temp/all.css'
            }
        },
        requirejs: {
            compile: {
                // !! You can drop your app.build.js config wholesale into 'options'
                options: {
                    baseUrl: './temp/js',
                    optimize: 'uglify',
                    mainConfigFile: 'temp/js/main.js',
                    name: 'libs/almond',
                    include: ['main'],
                    insertRequire: ['main'],
                    out: 'dist/all.min.js',
                    wrap: true
                }
            }
        },
        cssmin: {
            css: {
                src: "temp/all.css",
                dest: "dist/all.min.css"
            }
        },
        'string-replace': {
            replaceJs: {
                files: {
                    // TODO: I don't understand what the 'key' is for ...
                    'dist/all.min.js': 'dist/all.min.js'
                },
                options: {
                    replacements: [
                        {
                            pattern: /DOES THIS WORK\?/ig,
                            replacement: function (match, p1, offset, string) {
                                return 'YES THIS WORKS!';
                            }
                        }
                    ]
                }
            },
            replaceCssJsIncludes: {
                files: {
                    // TODO: I don't understand what the 'key' is for ...
                    'dist/index.html': 'dist/index.html'
                },
                options: {
                    replacements: [
                        {
                            pattern: /<!--<REPLACE_CSS>-->([^]*)<!--<\/REPLACE_CSS>-->/ig,
                            replacement: function (match, p1, offset, string) {
                                // TODO: figure a way to generate the returned string like <%= pkg.name %> in the properties above ...
                                return '<link rel="stylesheet" href="/all.min.css" />';
                            }
                        },
                        {
                            pattern: /<!--<REPLACE_JS>-->([^]*)<!--<\/REPLACE_JS>-->/ig,
                            replacement: function (match, p1, offset, string) {
                                // TODO: figure a way to generate the returned string like <%= pkg.name %> in the properties above ...
                                return '<script src="/all.min.js"></script>';
                            }
                        }
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-css');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('almond');

    grunt.registerTask('default', [
        
        // create the 'temp' and 'dist' directories, copy 'dev_index.html' to 'dist/index.html'
        'first', 
        
        // copy 'js' and 'css' directories to 'temp/js' and 'temp/css'
        'copy', 
        
        // based on '-env' argument, copy 'env/:env.json' file to 'temp/js/env.json'
        'injectConfig', 
        
        // wrap the entire 'js' codebase in almond.js, concat, minify, etc..., save as 'dist/all.min.js'
        'requirejs',
        
        // concat the 'temp/css' save as 'temp/all.css' 
        'concat', 
        
        // minify 'temp/all.css' save as 'dist/all.min.css'
        'cssmin', 
        
        // replace js/css includes on 'dist/index.html' with the prepared 'dist/all.min.css' and 'dist/all.min.js' includes
        'string-replace', 

        // delete 'temp' directory
        'last' 
    ]);



};