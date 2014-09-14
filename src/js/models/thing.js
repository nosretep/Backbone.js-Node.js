define(['backbone'], 
    function(Backbone) {
        var Thing = Backbone.Model.extend({
	            urlRoot: '/api/things',
	            fullName: function() {
	            	return this.get('firstName') + " " + this.get('lastName');
	            }
	        }
        );
        return Thing;
    }
);