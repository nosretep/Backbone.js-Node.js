define(['underscore', 'backbone', 'text!templates/thing_list_item.html'],
    function (_, Backbone, thingListItemViewTemplate) {
        var ThingListItemView = Backbone.View.extend({
            tagName: 'li',
            template: _.template(thingListItemViewTemplate),
            render : function() {
                this.$el.addClass('thing');
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            }
        });
        return ThingListItemView;
    }
);