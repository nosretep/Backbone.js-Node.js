var requirejs = require('requirejs')
	jsdom = require("jsdom").jsdom;


jsdom.env({
	html : "<html><body></body></html>",
	done : function(errs, window) {
		global.window = window;
	}
});


requirejs.config({
    nodeRequire: require,
    baseUrl: './src/js',
    paths: {
        'models': 'models',
        'collections' : 'collections',
        'text': 'libs/text',
        'json': 'libs/json',
        'dao' : '../../dao'
    }
});

// Odd step needed to set Backbone.$ ...
requirejs([ 'jquery', 'backbone' ], function($, Backbone) {
	Backbone.$ = $;
});

requirejs([
    'http', 
    'express',
    'express-session',
    'body-parser',
    'cookie-parser',
    'express-error-handler',
    'optimist',
    'dao',
    'passport',
    'passport-facebook',
    'static-favicon',
    'jquery',
    'backbone',
    'models/user',
    'models/thing',
    'models/generic',
    'collections/thing_list',
    'views/layout',
    'views/home',
    'views/header',
    'views/footer',
    'views/thing',
    'views/thing_list',
    'views/thing_new',
    'views/thing_edit',
    'views/generic',
    'json!data/generic.json'], 

function(
    http,
    express,
    session,
    bodyParser,
    cookieParser,
    errorHandler,
    optimist,
    DAO,
    passport,
    passportFacebook,
    favicon,
    $,
    Backbone,
    User,
    Thing,
    Generic,
    ThingList,
    LayoutView,
    HomeView,
    HeaderView,
    FooterView,
    ThingView,
    ThingListView,
    ThingNewView,
    ThingEditView,
    GenericView,
    genericJSON) {

    var argv = optimist.argv;
    var config = argv['config'] || 'local';
    var dist = argv['dist'];
    var baseHtmlFile = (dist) ? 'dist/index.html' : 'src/index.html';
    
    var FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
    var FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
    var FacebookStrategy = passportFacebook.Strategy;

    passport.serializeUser(function(user, done) {
    	done(null, user);
	});

	passport.deserializeUser(function(obj, done) {
		done(null, obj);
	});
    
    var FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
    var FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
    var FacebookStrategy = passportFacebook.Strategy;

    passport.serializeUser(function(user, done) {
    	done(null, user);
	});

	passport.deserializeUser(function(obj, done) {
		done(null, obj);
	});
    
	passport.use(new FacebookStrategy(
		{
			clientID : FACEBOOK_APP_ID,
			clientSecret : FACEBOOK_APP_SECRET,
			callbackURL : 'http://localhost:' + process.env.PORT + '/auth/facebook/callback'
		}, 
		function(accessToken, refreshToken, profile, done) {
			process.nextTick(function() {
				return done(null, profile);
			});
		})
	);

    var server = express();

 // development only
    if ('development' == server.get('env') && !dist) {
        // Less configuration ...
        server.use(require('less-middleware')({
            src: __dirname + '/src/less',
            dest: __dirname + '/src/css',
            prefix: '/css',
            compress: true
//            ,
//            debug: true
        }));
        // Non pretty error handling when in development ...
        server.use(errorHandler());
    }

    // Configure server ...
    server.set('port', process.env.PORT);
    server.use(favicon());
    server.engine('.html', require('ejs').__express);
    server.set('views', __dirname + '/');

    server.use(function (req, res, next) {
    	req.isJSONRequest = false;
        if(/application\/json/.test(req.get('accept'))) {
        	req.isJSONRequest = true;
        }
        next();
    });

    server.use(bodyParser.urlencoded({
    	extended: true
	}));
    server.use(cookieParser());
    server.use(bodyParser.json());
    server.use(session({
		secret : 'tasty pudding snacks',
		resave : true,
		saveUninitialized : true
	}));
    
    server.use(passport.initialize());
    server.use(passport.session());

    // Make sure that environment specific data is available at route to 'js/env.json' ...
    server.get('/js/data/config.json', function(req, res) {
        res.sendFile('configs/' + config + '.json', { root: __dirname });
    });

    if (dist) {
    	
        // Applicable when 'dist=true' ...
        server.get('/all.min.js', function(req, res) {
            res.sendFile('dist/all.min.js', { root: __dirname });
        });

        // Applicable when 'dist=true' ...
        server.get('/all.min.css', function(req, res) {
            res.sendFile('dist/all.min.css', { root: __dirname });
        });    	
        
        server.use('/img', express.static(__dirname + '/dist/img'));
        server.use('/fonts', express.static(__dirname + '/dist/fonts'));
        
    } else {
    	
	    // Now make sure that static files are set (order important note 'js/env.json' above) ...
	    server.use('/js', express.static(__dirname + '/src/js'));
	    server.use('/css', express.static(__dirname + '/src/css'));
	    server.use('/img', express.static(__dirname + '/src/img'));
	    server.use('/fonts', express.static(__dirname + '/src/fonts'));
	    
    }
    
    function ensureAuthenticated(req, res, next) {
    	if (req.isAuthenticated()) { 
    		return next(); 
    	}
		res.redirect('/login')
	}

    server.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect : '/login' }), function(req, res) {
		res.redirect('/things');
	});
    
    server.get('/auth/facebook', passport.authenticate('facebook'));
    
    server.get('/', function(req, res) {
        var homeView = new HomeView();
    	res.render(baseHtmlFile, generatePageContentAndTitle(req, homeView));
    });
    
    server.get('/things', ensureAuthenticated, function(req, res) {
    	DAO.Things.findAll().then(function(data) {
    		var Things = new ThingList(data);
            var thingListView = new ThingListView({'collection': Things});
            res.render(baseHtmlFile, generatePageContentAndTitle(req, thingListView));
    	});
    });
    
    server.get('/things/new', function(req, res) {
        var thingNewView = new ThingNewView({'model': new Thing()});
        res.render(baseHtmlFile, generatePageContentAndTitle(req, thingNewView));
    });

    server.get('/things/:id', function(req, res) {
        var thingId = req.params.id;
    	DAO.Things.findById(thingId).then(function(data) {
    		var thing = new Thing(data);
            var thingView = new ThingView({'model': thing});
            res.render(baseHtmlFile, generatePageContentAndTitle(req, thingView));
    	});
    });
    
    server.get('/things/:id/edit', function(req, res) {
        var thingId = req.params.id;
    	DAO.Things.findById(thingId).then(function(data) {
    		var thing = new Thing(data);
            var thingEditView = new ThingEditView({'model': thing});
            res.render(baseHtmlFile, generatePageContentAndTitle(req, thingEditView));
    	});
    });

    server.get('/api/things', function(req, res) {
    	DAO.Things.findAll().then(function(data) {
    		var Things = new ThingList(data);
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(Things.sort().toJSON()));
    	});
    });
    
    server.get('/api/things/:id', function(req, res) {
        var thingId = req.params.id;
    	DAO.Things.findById(thingId).then(function(data) {
    		var thing = new Thing(data);
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(thing.toJSON()));
    	});
    });
    
    server.post('/api/things', function(req, res) {
        getJSONFromRequestBody(req).then(function(thingRaw) {
        	
            var thing = new Thing();
            	thing.set('title', thingRaw.title)
                thing.set('created', (new Date()).getTime());
                
            // TODO: rethink client/server validation for models ...
            if (thing.isValid()) {
            	
            	DAO.Things.add(thing.toJSON())
            		.then(function(data) {
	                	res.writeHead(200, {"Content-Type": "application/json"});
	                    res.end(JSON.stringify(thing));  
	            	})
	            	.fail(function(err) {
		            	res.writeHead(409, {"Content-Type": "application/json"});
		                res.end(JSON.stringify({"error":JSON.stringify(err)}));
	            	});
          	
            } else {
            	res.writeHead(409, {"Content-Type": "application/json"});
                res.end(JSON.stringify({"error":thing.validationError}));            	
            }

        });
    });
    
    server.put('/api/things/:id', function(req, res) {
        var id = req.params.id;

        getJSONFromRequestBody(req).then(function(thingRaw) {

            var thing = new Thing(thingRaw);

            // TODO: rethink client/server validation for models ...
            if (thing.isValid()) {
                
            	DAO.Things.update(thing.toJSON())
	        		.then(function(data) {
	                	res.writeHead(200, {"Content-Type": "application/json"});
	                    res.end(JSON.stringify(thing));  
	            	})
	            	.fail(function(err) {
		            	res.writeHead(409, {"Content-Type": "application/json"});
		                res.end(JSON.stringify({"error":JSON.stringify(err)}));
	            	});
                
            } else {
            	res.writeHead(409, {"Content-Type": "application/json"});
                res.end(JSON.stringify({"error":thing.validationError}));            	
            }
            
        });
    });
    
    server.get('/*', function(req, res) {
    	var path = req.params[0];
    	var pageDetails = genericJSON[path] || genericJSON['error_404'];
    	var generic = new Generic(pageDetails);
    	var genericView = new GenericView({
    		'model' : generic
    	});
    	res.render(baseHtmlFile, generatePageContentAndTitle(req, genericView));
    });
        
    http.createServer(server).listen(server.get('port'), function(){
        console.log('Express server listening on port ' + server.get('port'));
    }); 

    function generatePageContentAndTitle(req, view) {

        var loggedInUser = new User({ 'username' : 'Not logged in'});
        
        if (req.session.passport && req.session.passport.user) {
        	loggedInUser.set('username', req.session.passport.user.displayName);
        }

        var layoutView = new LayoutView();
            layoutView.render();

        var headerView = new HeaderView({'model' : loggedInUser});
            headerView.render();
            
        var footerView = new FooterView({'model' : loggedInUser});
        	footerView.render();

            layoutView.$el.find('header').append(headerView.$el);
            layoutView.$el.find('footer').append(footerView.$el);
            
            layoutView.setContent(view);
            
        return {
        	'content' : layoutView.$el.html(),
        	'title' : view.getTitle()
        }

    };

    function getJSONFromRequestBody(req) {
        
        var defer = $.Deferred();

        if (req.body) {
            defer.resolve(req.body);
        } else {
            var dataStr = '';
            req.addListener('data', function(chunk) {
                dataStr += chunk;
            });
            req.addListener('end', function() {
                defer.resolve(JSON.parse(dataStr));
            });
        }

        return defer.promise();
    };

    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
                 .toString(16)
                 .substring(1);
    };

    function guid() {
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
             s4() + '-' + s4() + s4() + s4();
    };

});