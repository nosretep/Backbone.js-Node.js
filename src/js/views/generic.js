define(['underscore', 'backbone', 'views/proto'],
    function (_, Backbone, ProtoView) {
        return ProtoView.extend({
            getTitle: function() {
                return this.model.get('title');
            },
            render : function() {
                this.$el.html(this.model.get('content'));
                return this;
            }
        });
    }
);