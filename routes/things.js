define([
	'dao/dao',
	'models/thing',
	'collections/thing_list',
	'views/thing',
	'views/thing_list',
	'views/thing_new',
	'views/thing_edit'], 
	function(
		DAO,
		Thing,
		ThingList,
		ThingView,
	    ThingListView,
	    ThingNewView,
	    ThingEditView) {
	
    return function(routeMethods) {
    	
        function thingsIndexHtml(req, res) {
        	DAO.Things.findAll().then(function(data) {
        		var Things = new ThingList(data);
                var thingListView = new ThingListView({'collection': Things});
                res.render(routeMethods.getBaseHtmlFile(), routeMethods.generatePageContentAndTitle(req, thingListView));
        	});
        }
        
        function thingNewHtml(req, res) {
            var thingNewView = new ThingNewView({'model': new Thing()});
            res.render(routeMethods.getBaseHtmlFile(), routeMethods.generatePageContentAndTitle(req, thingNewView));
        }

        function thingGetHtml(req, res) {
            var thingId = req.params.id;
        	DAO.Things.findById(thingId).then(function(data) {
        		var thing = new Thing(data);
                var thingView = new ThingView({'model': thing});
                res.render(routeMethods.getBaseHtmlFile(), routeMethods.generatePageContentAndTitle(req, thingView));
        	});
        }
        
        function thingUpdateHtml(req, res) {
            var thingId = req.params.id;
        	DAO.Things.findById(thingId).then(function(data) {
        		var thing = new Thing(data);
                var thingEditView = new ThingEditView({'model': thing});
                res.render(routeMethods.getBaseHtmlFile(), routeMethods.generatePageContentAndTitle(req, thingEditView));
        	});
        }
        
        function thingsIndexJson(req, res) {
        	DAO.Things.findAll().then(function(data) {
        		var Things = new ThingList(data);
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify(Things.sort().toJSON()));
        	});
        }
        
        function thingGetJson(req, res) {
            var thingId = req.params.id;
        	DAO.Things.findById(thingId).then(function(data) {
        		var thing = new Thing(data);
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify(thing.toJSON()));
        	});
        }
        
        function thingNewJson(req, res) {
        	
            routeMethods.getJSONFromRequestBody(req).then(function(thingRaw) {
            	
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
        }
        
        function thingUpdateJson(req, res) {
            var id = req.params.id;

            routeMethods.getJSONFromRequestBody(req).then(function(thingRaw) {

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
    }
	
});