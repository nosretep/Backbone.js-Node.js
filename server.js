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

// Odd step needed to set Backbone.$ ...
requirejs(['jquery', 'backbone'], function($, Backbone) { Backbone.$ = $; });

requirejs([
    'http', 
    'express',
    'optimist',
    'jquery',
    'backbone',
    'models/user',
    'models/thing',
    'collections/thing_list',
    'views/layout',
    'views/header',
    'views/thing',
    'views/thing_list',
    'views/thing_new',
    'views/thing_edit'], 

function(
    http,
    express,
    optimist,
    $,
    Backbone,
    User,
    Thing,
    ThingList,
    LayoutView,
    HeaderView,
    ThingView,
    ThingListView,
    ThingNewView,
    ThingEditView) {

    var argv = optimist.argv;
    var config = argv['config'] || 'local';
    var baseHtmlFile = (argv['dist']) ? 'dist/index.html' : 'src/index.html';

    // Preload some Things ...
    var Things = new ThingList([
        {'title' : 'Thing 1', 'id' : '26b8adcc-c390-b5bd-162a-8c245471f582'},
        {'title' : 'Thing 2', 'id' : '8f80bbfb-ccac-26d6-5055-5120f69fe80b'},
        {'title' : 'Thing 3', 'id' : 'dd543e76-2585-55ad-f4a5-afe77014d71c'}
    ]);

    // Fake a logged in user for the meantime ...
    var loggedInUser = new User({ 'username' : 'firstName lastName'});

    var server = express();

    // Develpment mode configuration ... 
    // export NODE_ENV=development | production | arbitrary ...
    server.configure('development', function(){
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
    server.get('/js/data/config.json', function(req, res) {
        res.sendfile('configs/' + config + '.json');
    });

    // Now make sure that static files are set (order important note 'js/env.json' above) ...
    server.configure(function(){
        server.use('/js', express.static(__dirname + '/src/js'));
        server.use('/css', express.static(__dirname + '/src/css'));
    });
    
    server.get('/', function(req, res) {
        res.redirect('/things')
    });

    // I'm not sure if I recommend this (as html) ...
    server.get('/things', function(req, res) {

        if (req.isJSONRequest) {

            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(Things.toJSON()));

        } else {

            var thingListView = new ThingListView({'collection': Things});

            res.render(baseHtmlFile, {
                'content' : generatePageContent(thingListView)
            });
        }
    });

    // I'm not sure if I recommend this (as html) ...
    server.get('/things/new', function(req, res) {
        var thingNewView = new ThingNewView({'model': new Thing()});
        
        res.render(baseHtmlFile, {
            'content' : generatePageContent(thingNewView)
        });
    });

    // I'm not sure if I recommend this (as html) ...
    server.get('/things/:id', function(req, res) {

        var thingId = req.params.id;
        var thing = Things.get(thingId);

        if (req.isJSONRequest) {
            
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(thing.toJSON()));

        } else {

            var thingView = new ThingView({'model': thing});
            
            res.render(baseHtmlFile, {
                'content' : generatePageContent(thingView)
            });
        }
    });

    // I'm not sure if I recommend this (as html) ...
    server.get('/things/:id/edit', function(req, res) {
        var id = req.params.id;

        var thingEditView = new ThingEditView({'model': Things.get(id)});
        
        res.render(baseHtmlFile, {
            'content' : generatePageContent(thingEditView)
        });
    });

    server.post('/things', function(req, res) {
        getJSONFromRequestBody(req).then(function(thingRaw) {

            var thing = Things.create(thingRaw);
                thing.set('id', guid());

            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(thing));
        });
    });

    server.put('/things/:id', function(req, res) {
        var id = req.params.id;

        getJSONFromRequestBody(req).then(function(thingRaw) {

            var thing = Things.get(id);
            var title = thingRaw.title;

            thing.set('title', title);

            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(thing));
        });
    });

    // Applicable when 'dist=true' ...
    server.get('/all.min.js', function(req, res) {
        res.sendfile('dist/all.min.js');
    });

    // Applicable when 'dist=true' ...
    server.get('/all.min.css', function(req, res) {
        res.sendfile('dist/all.min.css');
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

