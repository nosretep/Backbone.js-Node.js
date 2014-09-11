define(['underscore', 'backbone', 'views/proto', 'text!templates/benefits/seo.html'],
    function (_, Backbone, ProtoView, seoViewTemplate) {
        return ProtoView.extend({
        	title: 'Benefits : SEO',
            template: _.template(seoViewTemplate),
            render : function() {
                this.$el.html(this.template());
                return this;
            }
        });
    }
);