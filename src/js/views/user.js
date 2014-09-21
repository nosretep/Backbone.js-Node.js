define(['underscore', 'backbone', 'views/proto', 'text!templates/user.html'],
    function (_, Backbone, ProtoView, userViewTemplate) {
		return ProtoView.extend({
			getTitle: function() {
				return this.model.get('display_name');
			},
			className: 'user',
            template: _.template(userViewTemplate),
            render : function() {
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            }
        });
    }
);