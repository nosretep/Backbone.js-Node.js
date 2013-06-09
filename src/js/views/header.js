define(['underscore', 'backbone', 'text!templates/header.html'],
    function (_, Backbone, headerViewTemplate) {
        var HeaderView = Backbone.View.extend({
            template: _.template(headerViewTemplate),
            render : function() {
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            }
        });
        return HeaderView;
    }
);