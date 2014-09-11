define(['underscore', 'backbone', 'views/proto', 'text!templates/contact.html'],
    function (_, Backbone, ProtoView, contactViewTemplate) {
        return ProtoView.extend({
        	title: 'Contact',
            template: _.template(contactViewTemplate),
            render : function() {
                this.$el.html(this.template());
                return this;
            }
        });
    }
);