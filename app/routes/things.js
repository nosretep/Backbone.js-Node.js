define([
    'routes/utils',
	'dao/dao',
	'models/thing',
	'collections/thing_list',
	'views/thing',
	'views/thing_list',
	'views/thing_new',
	'views/thing_edit'], 
	function(
		routesUtils,
		dao,
		Thing,
		ThingList,
		ThingView,
	    ThingListView,
	    ThingNewView,
	    ThingEditView) {

    function thingsIndexHtml(req, res) {
    	var user = routesUtils.getSessionUser(req);
    	dao.things.findAllByUser(user).then(function(data) {
    		var Things = new ThingList(data);
            var thingListView = new ThingListView({'collection': Things});
            res.render(req.baseHtmlFile, routesUtils.generatePageContentAndTitle(req, thingListView));
    	});
    }

    function thingGetHtml(req, res) {
        var thingId = req.params.id;
        var user = routesUtils.getSessionUser(req);
    	dao.things.findById(thingId, user)
	    	.then(function(data) {
	    		var thing = new Thing(data);
	            var thingView = new ThingView({'model': thing});
	            res.render(req.baseHtmlFile, routesUtils.generatePageContentAndTitle(req, thingView));
	    	})
	    	.fail(function() {
	    		// Give them a 403 always ...
	            routesUtils.handleErrorHtml(req, res, 403);
	    	});
    }
    
    function thingNewHtml(req, res) {
        var thingNewView = new ThingNewView({'model': new Thing()});
        res.render(req.baseHtmlFile, routesUtils.generatePageContentAndTitle(req, thingNewView));
    }

    function thingUpdateHtml(req, res) {
        var thingId = req.params.id;
    	dao.things.findById(thingId).then(function(data) {
    		var thing = new Thing(data);
            var thingEditView = new ThingEditView({'model': thing});
            res.render(req.baseHtmlFile, routesUtils.generatePageContentAndTitle(req, thingEditView));
    	});
    }
    
    function thingsIndexJson(req, res) {
    	var user = routesUtils.getSessionUser(req);
    	dao.things.findAllByUser(user).then(function(data) {
    		var Things = new ThingList(data);
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(Things.sort().toJSON()));
    	});
    }
    
    function thingGetJson(req, res) {
        var thingId = req.params.id;
        var user = routesUtils.getSessionUser(req);
    	dao.things.findById(thingId, user)
	    	.then(function(data) {
	    		var thing = new Thing(data);
	            res.writeHead(200, {"Content-Type": "application/json"});
	            res.end(JSON.stringify(thing.toJSON()));
	    	})
	    	.fail(function() {
	    		routesUtils.handleErrorJson(req, res, 403, "Unauthorized request");
	    	});
    }
    
    function thingNewJson(req, res) {
    	
        routesUtils.getJSONFromRequestBody(req).then(function(thingRaw) {
        	
            var thing = new Thing();
            	thing.set('title', thingRaw.title)
                thing.set('created', (new Date()).getTime());
                
            // TODO: rethink client/server validation for models ...
            if (thing.isValid()) {
            	var user = routesUtils.getSessionUser(req);
            	dao.things.add(thing.toJSON(), user.toJSON())
            		.then(function(data) {
	                	res.writeHead(200, {"Content-Type": "application/json"});
	                    res.end(JSON.stringify(thing));  
	            	})
	            	.fail(function(err) {
		                routesUtils.handleErrorJson(req, res, 409, JSON.stringify(err));
	            	});
          	
            } else {
            	routesUtils.handleErrorJson(req, res, 409, thing.validationError);
            }

        });
    }
    
    function thingUpdateJson(req, res) {
        var id = req.params.id;

        routesUtils.getJSONFromRequestBody(req).then(function(thingRaw) {
            var thing = new Thing(thingRaw);
            // TODO: rethink client/server validation for models ...
            if (thing.isValid()) {
            	var user = routesUtils.getSessionUser(req);
            	dao.things.update(thing.toJSON(), user.toJSON())
	        		.then(function(data) {
	                	res.writeHead(200, {"Content-Type": "application/json"});
	                    res.end(JSON.stringify(thing));  
	            	})
	            	.fail(function(err) {
	            		routesUtils.handleErrorJson(req, res, 409, JSON.stringify(err));
	            	});
                
            } else {
            	routesUtils.handleErrorJson(req, res, 409, thing.validationError);           	
            }
            
        });
    }
	
    return {
    	html : {
        	index : thingsIndexHtml,
        	get : thingGetHtml,
        	create : thingNewHtml,
        	update : thingUpdateHtml
    	},
    	json : {
        	index : thingsIndexJson,
        	get : thingGetJson,
        	create : thingNewJson,
        	update : thingUpdateJson        		
    	}
    }    	
	
});