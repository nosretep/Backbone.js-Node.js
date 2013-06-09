var requirejs = require('requirejs');
 
requirejs.config({
    nodeRequire: require,
    baseUrl: './src/js',
    paths: {
        'models': 'models',
        'collections' : 'collections',
        'text': 'libs/text',
        'json': 'libs/json'
    },
    shim: {
        'jquery' : {
            exports: '$'  
        },
        'underscore' : {
            exports: '_'  
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    }
});

requirejs(['jquery', 'backbone'], function($, Backbone) { Backbone.$ = $; });

requirejs(['http', 
           'express',
           'backbone',
           'models/user',
           'collections/thing_list',
           'views/layout',
           'views/header',
           'views/thing',
           'views/thing_list'], 

function(http, express, Backbone, User, ThingList, LayoutView, HeaderView, ThingView, ThingListView) {

    // Preload some Things ...
    var Things = new ThingList([
        {'title' : 'Thing 1', 'id' : '26b8adcc-c390-b5bd-162a-8c245471f582'},
        {'title' : 'Thing 2', 'id' : '8f80bbfb-ccac-26d6-5055-5120f69fe80b'},
        {'title' : 'Thing 3', 'id' : 'dd543e76-2585-55ad-f4a5-afe77014d71c'}
    ]);

    // Fake a logged in user for the meantime ...
    var loggedInUser = new User({ 'username' : 'firstName lastName'});

    var server = express();

    server.configure('development', function(){
        /*
         * See http://dylantsblog.wordpress.com/2013/03/16/less-middleware-using-less-with-node-js/
         */
        server.use(require('less-middleware')({
            src: __dirname + '/less',
            dest: __dirname + '/css',
            prefix: '/css',
            compress: true
//            ,
//            debug: true
        }));
        
        /*
         * Keep development configure above the generic configure!
         * Look at 'troubleshooting' https://github.com/emberfeather/less.js-middleware (scroll to bottom)
         * Want to declare static paths after less-middleware.
         */
        
        /*
         * next line not needed because this folder is already static
         * server.use(express.static(__dirname + '/css'));
         */
        
        server.use(express.errorHandler());
    });

    // Configure server ...
    server.configure(function(){
        server.set('port', 8888);
        server.engine('.html', require('ejs').__express);
        server.set('views', __dirname + '/');

        server.use(function (req, res, next) {
            req.isJSONRequest = /json/.test(req.headers['accept']);
            next();
        });

        server.use(express.bodyParser());
    });

    // Make sure that environment specific data is available at route to 'js/env.json' ...
    server.get('/js/env.json', function(req, res) {
        res.sendfile('configs/env/local.json');
    });

    // Now make sure that static files are set (order important note 'js/env.json' above) ...
    server.configure(function(){
        server.use('/js', express.static(__dirname + '/src/js'));
        server.use('/css', express.static(__dirname + '/src/css'));
        server.use('/img', express.static(__dirname + '/src/img'));
    });
    
    server.get('/', function(req, res) {
        res.redirect('/things')
    });

    server.get('/things', function(req, res) {

        if (req.isJSONRequest) {

            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(Things.toJSON()));

        } else {

            var thingListView = new ThingListView({'collection': Things});

            res.render('src/index.html', {
                'content' : generatePageContent(thingListView)
            });
        }
    });

    server.get('/things/:id', function(req, res) {

        var thingId = req.params.id;
        var thing = Things.get(thingId);

        if (req.isJSONRequest) {
            
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(thing.toJSON()));

        } else {

            var thingView = new ThingView({'model': thing});
            
            res.render('src/index.html', {
                'content' : generatePageContent(thingView)
            });
        }
    });
    
    http.createServer(server).listen(server.get('port'), function(){
        console.log('Express server listening on port ' + server.get('port'));
    }); 

    function generatePageContent(view) {

        var layoutView = new LayoutView();
            layoutView.render();

        var headerView = new HeaderView({'model' : loggedInUser});
            headerView.render();

            layoutView.$el.find('header').append(headerView.$el);
            layoutView.setContent(view);
            
        return layoutView.$el.html()
    }

    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
                 .toString(16)
                 .substring(1);
    };

    function guid() {
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
             s4() + '-' + s4() + s4() + s4();
    }

});

