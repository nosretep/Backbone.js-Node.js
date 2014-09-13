/*
	this file is needed because 'lcov' only runs reports on 
	files that have been tested/loaded. 
	will determine a better solution in the future ...
*/
define([ 
        'intern!object'
        ,  		
        'config'
		,
		'views/header'
		,
		'views/footer'
		,
		'views/layout'
		,
		'views/proto'
		,
		'views/thing'
		,
		'views/thing_edit'
		,
		'views/thing_list'
		,
		'views/thing_list_item'
		,
		'views/thing_new'
		,
	    'views/generic'
		,
		'models/thing'
		,
		'models/user'
		,
		'models/generic'
		,
		'collections/thing_list'],
		
	function(registerSuite) {
		registerSuite({
			'name' : 'Catch all',
		});
	}
);