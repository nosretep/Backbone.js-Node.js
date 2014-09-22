define([
    'jquery',
    'models/user',
    'models/generic',
    'views/layout',
    'views/header',
    'views/footer',
    'views/home',
    'views/generic',
    'json!data/generic.json',
    'routes/utils',
    'routes/things',
    'routes/users'
    ],
	function(
		$,
		User,
		Generic,
	    LayoutView,
	    HeaderView,
	    FooterView,
	    HomeView,
	    GenericView,
	    genericJSON,
	    routesUtils,
		routesThings,
		routesUsers) {

		return {
	    	index: function(req, res) {
	            var homeView = new HomeView();
	        	res.render(req.baseHtmlFile, routesUtils.generatePageContentAndTitle(req, homeView));
	        },
	        logout: function(req, res) {
	        	req.logout();
	        	res.redirect('/');
	        },
	    	catchAll: function(req, res) {
	        	var path = req.params[0];
	        	var pageDetails = genericJSON[path];
	        	if (pageDetails) {
		        	var generic = new Generic(pageDetails);
		        	var genericView = new GenericView({
		        		'model' : generic
		        	});
		        	res.render(req.baseHtmlFile, routesUtils.generatePageContentAndTitle(req, genericView));
	    		} else {
	    			routesUtils.handleErrorHtml(req, res, 404);
	    		}
	        },
			things: routesThings,
			users: routesUsers,
			utils: routesUtils
		}
	
});