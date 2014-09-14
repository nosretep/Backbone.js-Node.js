var jsdom = require('jsdom').jsdom;
jsdom.env({
	html : '<html><body></body></html>',
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
        'text': 'libs/text',
        'json': 'libs/json',
        'tests': '../../tests'
    }
});

//Odd step needed to set Backbone.$ ...
requirejs([ 'jquery', 'backbone' ], function($, Backbone) {
	Backbone.$ = $;
});

define([ 'tests/catch_all', 'tests/collections/thing_list',
		'tests/models/thing', 'tests/views/thing' ]);