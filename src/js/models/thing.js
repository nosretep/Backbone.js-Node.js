define(['backbone'], 
    function(Backbone) {
        var Thing = Backbone.Model.extend({
				validate: function(attrs, options) {
					var title = attrs.title;
					if (typeof title === 'undefined' || title.length === 0 || title === '') {
						return 'Thing must have a title';
					}
				},
	            urlRoot: '/api/things',
	            fullName: function() {
	            	return this.get('firstName') + " " + this.get('lastName');
	            }
	        }
        );
        return Thing;
    }
);