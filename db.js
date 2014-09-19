define([
	'mongodb', 
	'jquery', 
	'underscore'],

	function(mongo, $, _) {    

		var Server = mongo.Server,
	    	Db = mongo.Db,
	    	BSON = mongo.BSONPure;
		
		var server = new Server('127.0.0.1', 27017, {}),
		var db = new Db('thingdb', server, {safe:true});
	
		db.open(function(err, db) {
			if (!err) {
				console.log("Connected to 'thingdb' database");
				db.collection('things', {strict : true}, function(err, collection) {
					
				});
			} else {
				console.log(err.message);
			}
		});

		function _idToId(item) {
			item.id = item._id;
			delete item._id;
			return item;
		}
	
		return {
			Things: {
				findById : function(id) {
					var deferred = $.Deferred();
					db.collection('things', function(err, collection) {
						collection.findOne({'_id' : new BSON.ObjectID(id) }, function(err, item) {
							_idToId(item);
							deferred.resolve(item);
						});
					});
					return deferred.promise();
				}
				,
				findAll : function() {
					var deferred = $.Deferred();
					db.collection('things', function(err, collection) {
						collection.find().toArray(function(err, items) {
							_.each(items, function(item) {
								_idToId(item);
							});
							deferred.resolve(items);
						});
					});
					return deferred.promise();
				}
				,
				add : function(data) {
					var deferred = $.Deferred();
					db.collection('things', function(err, collection) {
						collection.insert(data, { safe : true }, function(err, results) {
							if (err) {
								deferred.reject(err);
							} else {
								var item = results[0];
								_idToId(item);
								deferred.resolve(item);
							}
						});
					});
					return deferred.promise();
				}
				,
				update : function(data) {
					var deferred = $.Deferred();
					var id = data.id;
					delete data.id;
					db.collection('things', function(err, collection) {
						collection.update({'_id' : new BSON.ObjectID(id)}, data, {safe : true}, function(err, results) {
							if (err) {
								deferred.reject(err);
							} else {
								data.id = id;
								deferred.resolve(data);
							}
						});
					});
					return deferred.promise();
				}
	// ,
	// delete: function(data) {
	// var id = data.id;
	//			    db.collection('things', function(err, collection) {
	//			        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
	//			            if (err) {
	//			                res.send({'error':'An error has occurred - ' + err});
	//			            } else {
	//			                console.log('' + result + ' document(s) deleted');
	//			                res.send(req.body);
	//			            }
	//			        });
	//			    });
	//			}
			}		
		}
	
});