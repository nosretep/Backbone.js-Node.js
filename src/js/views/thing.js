define(['underscore', 'backbone', 'views/proto', 'text!templates/thing.html'],
    function (_, Backbone, ProtoView, thingViewTemplate) {
		return ProtoView.extend({
			getTitle: function() {
				return this.model.get('title');
			},
            template: _.template(thingViewTemplate),
            render : function() {
                this.$el.addClass('thing');
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            }
        });
    }
);