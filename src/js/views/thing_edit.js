define(['underscore', 'backbone', 'views/proto', 'text!templates/thing_edit.html'],
    function (_, Backbone, ProtoView, thingEditViewTemplate) {
        return ProtoView.extend({
            title: 'Thing edit',
            className: 'thing_edit',
            template: _.template(thingEditViewTemplate),
            render : function() {
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
                
                if (this.model.isValid()) {
                    this.model.save()
                        .then(function() {
                            App.appRouter.navigate('/things', true);
                        })
                        .fail(function(xhr, status, message) {
                            if (xhr.status === 404) {
                                alert(xhr.statusText);
                            }
                        });
                } else {
                    alert(this.model.validationError);
                }
            }
        });
    }
);