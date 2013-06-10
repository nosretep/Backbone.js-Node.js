define(['underscore', 'backbone', 'text!templates/thing.html'],
    function (_, Backbone, thingViewTemplate) {
        var ThingView = Backbone.View.extend({
            template: _.template(thingViewTemplate),
            render : function() {
                this.$el.addClass('thing');
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            }
        });
        return ThingView;
    }
);