/*
    All other views extend from this view.
*/
define([
    'underscore', 
    'backbone'],
    function (_, Backbone) {
        return Backbone.View.extend({
            addBindings: function(args) {},
            removeBindings: function() {},
            setInitValues: function(args) {},
            initialize: function(args) {
                this.childViews = [];
                this.setInitValues(args);
                this.addBindings(args);
            },
            addChildView: function(view) {
                this.childViews.push(view);
            },
            removeChildViews: function() {
                _.each(this.childViews, function(view) {
                    view.remove();
                });
                this.childViews = [];
            },
            remove: function() {
                this.removeBindings();
                this.removeChildViews();
                this.$el.remove();
                this.stopListening();
                return this;
            }
        });
    }
);