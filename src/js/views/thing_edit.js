define(['underscore', 'backbone', 'text!templates/thing_edit.html'],
    function (_, Backbone, thingEditViewTemplate) {
        var ThingEditView = Backbone.View.extend({
            template: _.template(thingEditViewTemplate),
            render : function() {
                this.$el.addClass('thing_edit');
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            },
            events : {
                'click button.update' : 'updateThing'
            },
            updateThing : function(e) {
                e.preventDefault();
                e.stopPropagation();

                var title = this.$el.find('input').val();
                this.model.set('title', title);
                this.model.save().done(function() {
                    App.appRouter.navigate('/things', true);
                });
            }
        });
        return ThingEditView;
    }
);