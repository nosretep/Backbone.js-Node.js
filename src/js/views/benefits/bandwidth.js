define(['underscore', 'backbone', 'views/proto', 'text!templates/benefits/bandwidth.html'],
    function (_, Backbone, ProtoView, bandwidthViewTemplate) {
        return ProtoView.extend({
            template: _.template(bandwidthViewTemplate),
            render : function() {
                this.$el.html(this.template());
                return this;
            }
        });
    }
);