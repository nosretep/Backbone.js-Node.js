define([
    'routes/utils',
	'dao/dao',
	'models/user',
	'views/user'], 
	function(
		RoutesUtils,
		DAO,
		User,
		UserView) {
    	
        function userGetHtml(req, res) {
            var userId = req.params.id;
        	DAO.Users.findById(userId).then(function(data) {
        		var user = new User(data);
                var userView = new UserView({'model': user});
                res.render(req.baseHtmlFile, RoutesUtils.generatePageContentAndTitle(req, userView));
        	});
        }

        function userGetJson(req, res) {
            var userId = req.params.id;
        	DAO.Users.findById(userId).then(function(data) {
        		var user = new User(data);
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify(user.toJSON()));
        	});
        }
    	
        return {
        	html : {
            	get : userGetHtml
        	},
        	json : {
            	get : userGetJson
        	}
        }    	
	
});