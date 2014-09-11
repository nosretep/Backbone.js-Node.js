define(['underscore', 'backbone', 'views/proto', 'text!templates/footer.html'],
    function (_, Backbone, ProtoView, footerViewTemplate) {
        return ProtoView.extend({
            template: _.template(footerViewTemplate),
            render : function() {
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            }
        });
    }
);