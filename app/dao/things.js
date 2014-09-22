define([
    'mongodb',
    'jquery', 
    'underscore',
    'sanitizer'],

    function(
    	mongo,
        $, 
        _,
        sanitizer) {
	
		var BSON = mongo.BSONPure;

        function fixId(item) {
            item.id = item._id;
            delete item._id;
            return item;
        }
        
        function scrubContent(item) {
            item.title = sanitizer.sanitize(item.title);
            item.title = sanitizer.escape(item.title);
            return item;
        }

        return function(db) {
        
            function findById(id, user) {
                var deferred = $.Deferred();
                var _id = new BSON.ObjectID(id);
                var creator_id = new BSON.ObjectID(user.id);
                db.collection('things', function(err, collection) {
                    collection.findOne({'_id' : _id, 'creator_id' : creator_id }, function(err, item) {
                    	if (item) {
	                        scrubContent(item);
	                        fixId(item);
	                        deferred.resolve(item);
                    	} else if (err) {
                    		deferred.reject(err);
                    	} else {
                    		deferred.reject(/* new exception empty result */);
                    	}
                    });
                });
                return deferred.promise();
            }
            
            function findAllByUser(user) {
                var deferred = $.Deferred();
                db.collection('things', function(err, collection) {
                    collection.find({'creator_id' : new BSON.ObjectID(user.id)}).toArray(function(err, items) {
                        _.each(items, function(item) {
                            scrubContent(item);
                            fixId(item);
                        });
                        deferred.resolve(items);
                    });
                });
                return deferred.promise();
            }
            
            function add(thing, user) {
                var deferred = $.Deferred();
                thing.creator_id = new BSON.ObjectID(user.id);
                db.collection('things', function(err, collection) {
                    collection.insert(thing, { safe : true }, function(err, results) {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            var item = results[0];
                            scrubContent(item);
                            fixId(item);
                            deferred.resolve(item);
                        }
                    });
                });
                return deferred.promise();
            }
    
            function update(thing, user) {
                var deferred = $.Deferred();
                
                // get 'id' and delete it ...
                thing._id = new BSON.ObjectID(thing.id);
                delete thing.id; // make sure 'id' does not get added to thing ...
                
                // fix 'creator_id' to ensure it is a BSON.ObjectID
                thing.creator_id = new BSON.ObjectID(user.id);
                
                db.collection('things', function(err, collection) {
                    collection.update({'_id' : thing._id, 'creator_id' : thing.creator_id }, thing, {safe : true}, 
                    	function(err, results) {
                    		if (err) {
								deferred.reject(409, "Error updating resource");
                    		} else if (results === 0) {
								deferred.reject(404, "Resource not found");
							} else {
							    scrubContent(thing);
							    fixId(thing);
							    deferred.resolve(thing);
							}
                    	}
                    );
                });
                return deferred.promise();
            }

//          function delete(data) {
//              var id = data.id;
//              db.collection('things', function(err, collection) {
//                  collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
//                      if (err) {
//                          res.send({'error':'An error has occurred - ' + err});
//                      } else {
//                          console.log('' + result + ' document(s) deleted');
//                          res.send(req.body);
//                      }
//                  });
//              });
//          }
        
            return {
                findById : findById,
                findAllByUser : findAllByUser,
                add : add,
                update : update
            }      
        }
    
});