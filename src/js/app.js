requirejs([
    'jquery',
    'underscore',
    'backbone',
    'config',
    'models/thing',
    'collections/thing_list',
    'views/layout',
    'views/thing',
    'views/thing_list'],
    function($, _, Backbone, Config, Thing, ThingList, LayoutView, ThingView, ThingListView) {

        window.App = {};

        var Things = new ThingList();
        
        // layoutView.updateContent called within router routes ...
        var layoutView = new LayoutView({
            'el' : $('body')[0]
        });

        // Create Router class ...
        var AppRouter = Backbone.Router.extend({
            routes: {
                'things': 'things',
                'things/:id': 'thing'
            },
            things: function() {
                Things.fetch({
                    'success': function(collection) {
                        var thingListView = new ThingListView({
                            'collection': collection
                        });
                        layoutView.setContent(thingListView);
                    }
                })
            },
            thing: function(id) {
                (new Thing({'id' : id}))
                    .fetch({
                        'success': function(model) {
                            var thingView = new ThingView({
                                'model': model
                            });
                            layoutView.setContent(thingView);
                        }
                    });
            }
        });

        // Instantiate router ...
        App.appRouter = new AppRouter();

        // If we're being served from 'file://' then pushState false ...
        Backbone.history.start({
            pushState: true, //!Utils.isFilePath()
            silent: true
        });

        // This code ensures that that app links go through the appRouter ...
        $('body').delegate('a.app_link', 'click', function(evt) {
            evt.preventDefault();
            evt.stopPropagation();
            var $link = $(this);
            var href = $link.attr('href');
            App.appRouter.navigate(href, true);
        });
        
        // Back goes back ...
        $('body').delegate('a.back_link', 'click', function(evt) {
            evt.preventDefault();
            evt.stopPropagation();
            window.history.go(-1);
        });

    });