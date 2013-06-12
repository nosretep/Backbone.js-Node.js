define(['underscore', 'backbone', 'text!templates/thing_list.html', 'views/thing_list_item'],
    function (_, Backbone, thingListViewTemplate, ThingListItemView) {
        var ThingListView = Backbone.View.extend({
            template: _.template(thingListViewTemplate),
            render : function() {
                this.$el.addClass('things');
                this.$el.html(this.template());
                this.collection.each(this.appendThing, this);
                return this;
            },
            appendThing: function(model, collection, options) {
                var thingListItemView = new ThingListItemView({
                    'model' : model
                });
                this.$el.find('ul.thing_list').append(thingListItemView.render().$el);
            }
        });
        return ThingListView;
    }
);