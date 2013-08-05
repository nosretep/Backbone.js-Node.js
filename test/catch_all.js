/*
	this file is needed because 'buster-coverage' only runs reports on 
	files that have been tested/loaded. will determine a better solution in the future ...
*/
// TODO: Need to account for 'main.js', 'fixes.js', and 'app.js' (all ommited below) ...
// 			- Pull most of the code from 'app.js' into other classes in order to bette test it ...
define(
	[
		'config'
		,
		'views/header'
		,
		'views/layout'
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
		'models/thing'
		,
		'models/user'
		,
		'collections/thing_list'
	]
	,
	function(
		Config
		,
		HeaderView
		,
		LayoutView
		,
		ThingView
		,
		ThingEditView
		,
		ThingListView
		,
		ThingListItemView
		,
		ThingNewView
		,
		Thing
		,
		User
		,
		ThingList
	) { }
);