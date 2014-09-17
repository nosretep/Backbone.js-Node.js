define(['underscore', 'backbone', 'views/proto', 'text!templates/thing_new.html'],
    function (_, Backbone, ProtoView, thingNewViewTemplate) {
		return ProtoView.extend({
			title: 'Thing new',
			className: 'thing_new',
            template: _.template(thingNewViewTemplate),
            render : function() {
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            },
            events : {
                'click button.create' : 'createThing'
            },
            createThing : function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                var title = this.$el.find('input').val();

                var title = this.$el.find('input').val();
                this.model.set('title', title);
                
                if (this.model.isValid()) {
	                this.model.save().done(function() {
	                    App.appRouter.navigate('/things', true);
	                });
                } else {
                	alert(this.model.validationError);
                };
            }
        });
    }
);