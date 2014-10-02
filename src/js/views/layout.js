define([
        'jquery',
        'underscore', 
        'backbone',
        'views/proto',
        'text!templates/layout.html'],
        function ($, _, Backbone, ProtoView, layoutViewTemplate) {
            return ProtoView.extend({
                template: _.template(layoutViewTemplate),
                render : function() {
                    this.$el.html(this.template(this.model.toJSON()));
                    return this;
                },
                setContent: function(view) {
                    this.removeChildViews();
                    this.$el.find('div#content').html('').append(view.render().el);
                    this.addChildView(view);
                    
                    // FIXME: not a fan of this ...
                    if (typeof document !== 'undefined') {
                        document.title = view.getTitle();
                        this.$el.closest('html').find('title').html(view.getTitle());
                    }
                }
            });
        }
    );