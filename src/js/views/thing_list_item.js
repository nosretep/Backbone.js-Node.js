define(['underscore', 'backbone', 'views/proto', 'text!templates/thing_list_item.html'],
    function (_, Backbone, ProtoView, thingListItemViewTemplate) {
		return ProtoView.extend({
            tagName: 'li',
            className: 'thing list-group-item',
            template: _.template(thingListItemViewTemplate),
            render : function() {
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            }
        });
    }
);