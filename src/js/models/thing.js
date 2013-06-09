define(['backbone'], 
    function(Backbone) {
        var Thing = Backbone.Model.extend({
	            urlRoot: '/things'
	        }
        );
        return Thing;
    }
);