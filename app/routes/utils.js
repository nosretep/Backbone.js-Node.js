define([
    'jquery',
    'models/user',
    'views/layout',
    'views/header',
    'views/footer'
    ],
	function(
		$,
		User,
	    LayoutView,
	    HeaderView,
	    FooterView) {

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
    
    return {
		getSessionUser : getSessionUser,
		generatePageContentAndTitle : generatePageContentAndTitle,
		getJSONFromRequestBody : getJSONFromRequestBody
    }

});