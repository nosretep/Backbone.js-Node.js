define(['underscore', 'backbone', 'views/proto', 'text!templates/about.html'],
    function (_, Backbone, ProtoView, aboutViewTemplate) {
        return ProtoView.extend({
            template: _.template(aboutViewTemplate),
            render : function() {
                this.$el.html(this.template());
                return this;
            }
        });
    }
);