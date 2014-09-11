define(['underscore', 'backbone', 'views/proto', 'text!templates/benefits/shareable.html'],
    function (_, Backbone, ProtoView, shareableViewTemplate) {
        return ProtoView.extend({
            template: _.template(shareableViewTemplate),
            render : function() {
                this.$el.html(this.template());
                return this;
            }
        });
    }
);