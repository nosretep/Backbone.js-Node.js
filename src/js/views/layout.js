define(['underscore', 'backbone', 'text!templates/layout.html'],
    function (_, Backbone, layoutViewTemplate) {
        var LayoutView = Backbone.View.extend({
            template: _.template(layoutViewTemplate),
            render : function() {
                this.$el.html(this.template());
                return this;
            },
            updateContent: function(view) {
                if (this.currentView) {
                    this.currentView.remove();
                    this.currentView.unbind();
                };
                this.currentView = view;
                this.currentView.render();
                this.$el.find('div#content').html('').append(this.currentView.el);
            }
        });
        return LayoutView;
    }
);