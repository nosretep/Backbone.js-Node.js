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
		RoutesThings,
		RoutesUsers) {

	return function(baseHtmlFile) {
		
		function getBaseHtmlFile() {
			return baseHtmlFile;
		}
		
	    function getSessionUser(req) {
	    	if (req.session.passport && req.session.passport.user) {
	    		return req.session.passport.user;
	    	}
	    	return null;
	    }
	    
	    function generatePageContentAndTitle(req, view) {

	        var loggedInUser = new User(getSessionUser(req));

	        var layoutView = new LayoutView({'model' : loggedInUser});
	            layoutView.render();

	        var headerView = new HeaderView({'model' : loggedInUser});
	            headerView.render();
	            
	        var footerView = new FooterView({'model' : loggedInUser});
	        	footerView.render();

	            layoutView.$el.find('header').append(headerView.$el);
	            layoutView.$el.find('footer').append(footerView.$el);
	            
	            layoutView.setContent(view);
	            
	        return {
	        	'content' : layoutView.$el.html(),
	        	'title' : view.getTitle()
	        }

	    };

	    function getJSONFromRequestBody(req) {
	        var defer = $.Deferred();
	        if (req.body) {
	            defer.resolve(req.body);
	        } else {
	            var dataStr = '';
	            req.addListener('data', function(chunk) {
	                dataStr += chunk;
	            });
	            req.addListener('end', function() {
	                defer.resolve(JSON.parse(dataStr));
	            });
	        }
	        return defer.promise();
	    };
	    
	    var routeMethods = {
    		getBaseHtmlFile : function() { return getBaseHtmlFile() },
    		getSessionUser : getSessionUser,
    		generatePageContentAndTitle : generatePageContentAndTitle,
    		getJSONFromRequestBody : getJSONFromRequestBody
	    }
		
		return {
	    	index: function(req, res) {
	            var homeView = new HomeView();
	        	res.render(getBaseHtmlFile(), generatePageContentAndTitle(req, homeView));
	        },
	        logout: function(req, res) {
	        	req.logout();
	        	res.redirect('/');
	        },
	    	catchAll: function(req, res) {
	        	var path = req.params[0];
	        	var pageDetails = genericJSON[path] || genericJSON['error_404'];
	        	var generic = new Generic(pageDetails);
	        	var genericView = new GenericView({
	        		'model' : generic
	        	});
	        	res.render(getBaseHtmlFile(), generatePageContentAndTitle(req, genericView));
	        },
			things: new RoutesThings(routeMethods),
			users: new RoutesUsers(routeMethods)
		}
	}
	
});