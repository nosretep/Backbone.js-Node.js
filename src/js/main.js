requirejs.config({
    deps: [ 'fixes', 'app' ],
    baseUrl: '/js',
    paths: {
        'models': 'models',
        'collections' : 'collections',
        'views' : 'views',
        
        'jquery' : 'libs/jquery',
        'underscore' : 'libs/underscore',
        'backbone' : 'libs/backbone',
        'bootstrap' : 'libs/bootstrap',

        'text': 'libs/text',
        'json': 'libs/json'
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
        },
        'bootstrap': {
            deps: ['jquery']
        }
    }
});