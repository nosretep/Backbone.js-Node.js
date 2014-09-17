define(['underscore', 'backbone', 'views/proto', 'text!templates/thing_list.html', 'views/thing_list_item'],
    function (_, Backbone, ProtoView, thingListViewTemplate, ThingListItemView) {
		return ProtoView.extend({
			title: 'Thing list',
			className: 'things',
            template: _.template(thingListViewTemplate),
            render : function() {
                this.$el.html(this.template());
                this.collection.each(this.appendThing, this);
                return this;
            },
            appendThing: function(model, collection, options) {
                var thingListItemView = new ThingListItemView({
                    'model' : model
                });
                
                this.addChildView(thingListItemView);
                
                this.$el.find('ul.thing_list').append(thingListItemView.render().$el);
            }
        });
    }
);