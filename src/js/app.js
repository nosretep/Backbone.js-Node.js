requirejs([
    'jquery',
    'underscore',
    'backbone',
    'config',
    'models/thing',
    'models/generic',
    'models/user',
    'collections/thing_list',
    'views/layout',
    'views/home',
    'views/thing',
    'views/thing_list',
    'views/thing_new',
    'views/thing_edit',
    'views/generic',
    'views/user',
    'json!data/generic.json'],
    function(
        $,
        _,
        Backbone,
        Config,
        Thing,
        Generic,
        User,
        ThingList,
        LayoutView,
        HomeView,
        ThingView,
        ThingListView,
        ThingNewView,
        ThingEditView,
        GenericView,
        UserView,
        genericJSON) {
	
        window.App = {};

        var Things = new ThingList();
        
        // layoutView.updateContent called within router routes ...
        var layoutView = new LayoutView({
            'el' : $('body')[0]
        });

        // Create Router class ...
        var AppRouter = Backbone.Router.extend({
            routes: {
            	'': 'homePage',
                'things': 'thingsIndex',
                'things/new': 'thingNew',
                'things/:id': 'thingShow',
                'things/:id/edit': 'thingEdit',
                'users/:id' : 'userShow',
                '*path' : 'genericPage'
            },
            homePage: function() {
                var homeView = new HomeView();
                layoutView.setContent(homeView);
            },
            genericPage: function(path) {
            	var pageDetails = genericJSON[path] || genericJSON['error_404'];
            	var generic = new Generic(pageDetails);
                var genericView = new GenericView({
                    'model': generic
                });
                layoutView.setContent(genericView);
            },
            userShow: function(id) {
                (new User({'id' : id}))
                .fetch({
                    'success': function(model) {
                        var userView = new UserView({
                            'model': model
                        });
                        layoutView.setContent(userView);
                    }
                });
            },
            thingsIndex: function() {
                Things.fetch({
                    'success': function(collection) {
                        var thingListView = new ThingListView({
                            'collection': collection
                        });
                        layoutView.setContent(thingListView);
                    }
                })
            },
            thingShow: function(id) {
                (new Thing({'id' : id}))
                    .fetch({
                        'success': function(model) {
                            var thingView = new ThingView({
                                'model': model
                            });
                            layoutView.setContent(thingView);
                        }
                    });
            },
            thingNew: function() {
                var thingNewView = new ThingNewView({
                    'model' : new Thing()
                });
                layoutView.setContent(thingNewView);
            },
            thingEdit: function(id) {
                (new Thing({'id' : id}))
                    .fetch({
                        'success': function(model) {
                            var thingEditView = new ThingEditView({
                                'model': model
                            });
                            layoutView.setContent(thingEditView);
                        }
                    });
            }
        });

        // Instantiate router ...
        App.appRouter = new AppRouter();

        // If we're being served from 'file://' then pushState false ...
        Backbone.history.start({
            pushState: true,
            silent: false 	// this means that the router will route to mapped method
            				// important for setting up events within view.
        });

        // This code ensures that that app links go through the appRouter ...
        $('body').delegate('a.app_link', 'click', function(evt) {
            evt.preventDefault();
            var href = this.getAttribute('href');
            App.appRouter.navigate(href, true);
        });
        
        // Back goes back ...
        $('body').delegate('a.back_link', 'click', function(evt) {
            evt.preventDefault();
            window.history.go(-1);
        });
        
        $(document).ajaxError(function (e, xhr, options) {
        	// This should clear everything up, 
        	if (xhr.status === 401) {
        		// TODO:
            	// - loggedInUser object
            	// - views that show logged in user features should listen to loggedInUser object 
            	// - add a modal to let user log back in
        		window.location.href = '/';
        	}
		});

    });