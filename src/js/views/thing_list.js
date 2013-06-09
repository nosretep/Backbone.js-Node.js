define(['backbone', 'views/thing_list_item'],
    function (Backbone, ThingListItemView) {
        var ThingListView = Backbone.View.extend({
            tag: 'ul',
            render : function() {
                this.collection.each(this.appendThing, this);
                return this;
            },
            appendThing: function(model, collection, options) {
                var thingListItemView = new ThingListItemView({
                    'model' : model
                });
                this.$el.append(thingListItemView.render().$el);
            }
        });
        return ThingListView;
    }
);