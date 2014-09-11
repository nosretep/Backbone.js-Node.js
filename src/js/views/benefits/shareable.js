define(['underscore', 'backbone', 'views/proto', 'text!templates/benefits/shareable.html'],
    function (_, Backbone, ProtoView, shareableViewTemplate) {
        return ProtoView.extend({
        	title: 'Benefits : Shareable',
            template: _.template(shareableViewTemplate),
            render : function() {
                this.$el.html(this.template());
                return this;
            }
        });
    }
);