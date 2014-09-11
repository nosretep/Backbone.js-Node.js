define(['underscore', 'backbone', 'views/proto', 'text!templates/header.html'],
    function (_, Backbone, ProtoView, headerViewTemplate) {
		return ProtoView.extend({
            template: _.template(headerViewTemplate),
            render : function() {
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            }
        });
    }
);