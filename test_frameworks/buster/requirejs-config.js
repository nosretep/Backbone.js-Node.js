requirejs.config({
    // Can't use 'baseUrl' because it confuses the paths to the test files ...
    // baseUrl: './js',
    paths: {
        'models'                : 'src/js/models',
        'collections'           : 'src/js/collections',
        'views'                 : 'src/js/views',
        'config'                : 'src/js/config',
        'data'                  : 'src/js/data',
        'templates'             : 'src/js/templates',
        
        'jquery'                : 'src/js/libs/jquery',
        'underscore'            : 'src/js/libs/underscore',
        'backbone'              : 'src/js/libs/backbone',

        'text'                  : 'src/js/libs/text',
        'json'                  : 'src/js/libs/json'
    },
    shim: {
        'jquery' : {
            exports: '$'  
        },
        'underscore' : {
            exports: '_'  
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    }
});