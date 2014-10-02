define([
    'routes/utils',
    'dao/dao',
    'models/user',
    'views/user'], 
    function(
        routesUtils,
        DAO,
        User,
        UserView) {
        
        function userGetHtml(req, res) {
            var userId = req.params.id;
            DAO.users.findById(userId).then(function(data) {
                var user = new User(data);
                var userView = new UserView({'model': user});
                res.render(req.baseHtmlFile, routesUtils.generatePageContentAndTitle(req, userView));
            });
        }

        function userGetJson(req, res) {
            var userId = req.params.id;
            DAO.users.findById(userId).then(function(data) {
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
        };        
    
});