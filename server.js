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
        'dao' : '../../dao',
        'routes' : '../../routes'
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
    'dao/dao',
    'routes/routes',
    'passport',
    'passport-facebook',
    'serve-favicon',
    'models/user'], 

function(
    http,
    express,
    session,
    bodyParser,
    cookieParser,
    errorHandler,
    optimist,
    DAO,
    Routes,
    passport,
    passportFacebook,
    favicon,
    User) {

    var argv = optimist.argv;
    var config = argv['config'] || 'local';
    var dist = argv['dist'];
    var baseHtmlFile = (dist) ? 'dist/index.html' : 'src/index.html';
    var routes = new Routes(baseHtmlFile);

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
			// FIXME: PORT means something different on heroku than on localhost, fix that ambiguity in some way ...
			callbackURL : 'http://' + (process.env.HOST || ('localhost' + ':' + process.env.PORT)) + '/auth/facebook/callback'
		}, 
		function(accessToken, refreshToken, profile, done) {
			process.nextTick(function() {
				DAO.Users.findOrCreate(profile).then(function(data) {
					var user = new User(data);
					return done(null, user);					
				});
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
        
        server.use(favicon(__dirname + '/dist/favicon.ico'));
        
    } else {
    	
	    // Now make sure that static files are set (order important note 'js/env.json' above) ...
	    server.use('/js', express.static(__dirname + '/src/js'));
	    server.use('/css', express.static(__dirname + '/src/css'));
	    server.use('/img', express.static(__dirname + '/src/img'));
	    server.use('/fonts', express.static(__dirname + '/src/fonts'));
	    server.use(favicon(__dirname + '/src/favicon.ico'));
	    
    }
    
    function ensureAuthenticated(req, res, next) {
    	if (req.isAuthenticated()) { 
    		return next(); 
    	}
    	if (!req.isJSONRequest) {
    		res.redirect('/login')
    	} else {
            res.writeHead(401, {"Content-Type": "application/json"});
            res.end(JSON.stringify({'error' : 'User not authenticated'}));
    	}
	}

    server.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect : '/login' }), function(req, res) {
		res.redirect('/things');
	});
    
    server.get('/auth/facebook', passport.authenticate('facebook'));
    server.get('/', routes.index);
    server.get('/users/:id', ensureAuthenticated, routes.users.html.get);
    server.get('/api/users/:id', ensureAuthenticated, routes.users.json.get);
    server.get('/things', ensureAuthenticated, routes.things.html.index);
    server.get('/things/new', ensureAuthenticated, routes.things.html.create);
    server.get('/things/:id', ensureAuthenticated, routes.things.html.get);
    server.get('/things/:id/edit', ensureAuthenticated, routes.things.html.update);
    server.get('/api/things', ensureAuthenticated, routes.things.json.index);
    server.get('/api/things/:id', ensureAuthenticated, routes.things.json.get);
    server.post('/api/things', ensureAuthenticated, routes.things.json.create);
    server.put('/api/things/:id', ensureAuthenticated, routes.things.json.update);
    server.get('/logout', routes.logout);
    server.get('/*', routes.catchAll);
        
    http.createServer(server).listen(server.get('port'), function(){
        console.log('Express server listening on port ' + server.get('port'));
    }); 

});