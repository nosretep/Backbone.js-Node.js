requirejs([
    'jquery',
    'underscore',
    'backbone',
    'config',
    'models/thing',
    'collections/thing_list',
    'views/layout',
    'views/thing',
    'views/thing_list',
    'views/thing_new',
    'views/thing_edit',
    'views/contact',
    'views/about',
    'views/benefits/seo',
    'views/benefits/bandwidth',
    'views/benefits/faster',
    'views/benefits/shareable'],
    function(
        $,
        _,
        Backbone,
        Config,
        Thing,
        ThingList,
        LayoutView,
        ThingView,
        ThingListView,
        ThingNewView,
        ThingEditView,
        ContactView,
        AboutView,
        SeoView,
        BandwidthView,
        FasterView,
        ShareableView) {

        window.App = {};

        var Things = new ThingList();
        
        // layoutView.updateContent called within router routes ...
        var layoutView = new LayoutView({
            'el' : $('body')[0]
        });

        // Create Router class ...
        var AppRouter = Backbone.Router.extend({
            routes: {
                'things': 'thingsIndex',
                'things/new': 'thingNew',
                'things/:id': 'thingShow',
                'things/:id/edit': 'thingEdit',
                'contact' : 'contactPage',
                'about' : 'aboutPage',
                'benefits/seo' : 'seoPage',
                'benefits/bandwidth' : 'bandwidthPage',
                'benefits/faster' : 'fasterPage',
                'benefits/shareable' : 'shareablePage'
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
            },
            contactPage: function() {
                var contactView = new ContactView();
                layoutView.setContent(contactView);            	
            },
            aboutPage: function() {
                var aboutView = new AboutView();
                layoutView.setContent(aboutView);            	
            },
            seoPage: function() {
                var seoView = new SeoView();
                layoutView.setContent(seoView);            	
            },
            bandwidthPage: function() {
                var bandwidthView = new BandwidthView();
                layoutView.setContent(bandwidthView);            	
            },
            fasterPage: function() {
                var fasterView = new FasterView();
                layoutView.setContent(fasterView);            	
            },
            shareablePage: function() {
                var shareableView = new ShareableView();
                layoutView.setContent(shareableView);            	
            }
        });

        // Instantiate router ...
        App.appRouter = new AppRouter();

        // If we're being served from 'file://' then pushState false ...
        Backbone.history.start({
            pushState: true,
            silent: false
        });

        // This code ensures that that app links go through the appRouter ...
        $('body').delegate('a.app_link', 'click', function(evt) {
            evt.preventDefault();
//            evt.stopPropagation();
            var $link = $(this);
            var href = $link.attr('href');
            App.appRouter.navigate(href, true);
        });
        
        // Back goes back ...
        $('body').delegate('a.back_link', 'click', function(evt) {
            evt.preventDefault();
//            evt.stopPropagation();
            window.history.go(-1);
        });

    });