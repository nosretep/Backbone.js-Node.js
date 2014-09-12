var jsdom = require("jsdom").jsdom;
jsdom.env({
	html : "<html><body></body></html>",
	done : function(errs, window) {
		global.window = window;
	}
});

requirejs.config({
    baseUrl: './src/js',
    paths: {
        'models': 'models',
        'collections' : 'collections',
        'views' : 'views',
        
        'jquery' : 'libs/jquery',
        'underscore' : 'libs/underscore',
        'backbone' : 'libs/backbone',
        'bootstrap' : 'libs/bootstrap',

        'text': 'libs/text',
        'json': 'libs/json',
        'tests': '../../tests'
    }
,
    shim: {
        'jquery' : {
            exports: '$'  
        }
    	,
        'underscore' : {
            exports: '_'  
        }
        ,
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
        ,
        'bootstrap': {
        	deps: ['jquery']
        }
    }
});

define([
	"tests/collections/thing_list",
	"tests/models/thing"
]);