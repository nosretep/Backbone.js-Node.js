define(['backbone'], 
    function(Backbone) {
        var User = Backbone.Model.extend({
	            urlRoot: '/users'
	        }
        );
        return User;
    }
);