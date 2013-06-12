define(['underscore', 'backbone', 'text!templates/thing_new.html'],
    function (_, Backbone, thingNewViewTemplate) {
        var ThingNewView = Backbone.View.extend({
            template: _.template(thingNewViewTemplate),
            render : function() {
                this.$el.addClass('thing_new');
                this.$el.html(this.template(this.model.toJSON()));
                return this;
            },
            events : {
                'click button.create' : 'createThing'
            },
            createThing : function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                var title = this.$el.find('input').val();

                this.model.set('title', title);
                this.model.save().done(function() {
                    App.appRouter.navigate('/things', true);
                });
            }
        });
        return ThingNewView;
    }
);