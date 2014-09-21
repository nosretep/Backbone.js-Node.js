define([
    'jquery', 
    'underscore',
    'sanitizer'],

    function(
        $, 
        _,
        sanitizer) {  

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
        
            function findById(id) {
                var deferred = $.Deferred();
                db.collection('things', function(err, collection) {
                    collection.findOne({'_id' : new BSON.ObjectID(id) }, function(err, item) {
                        scrubContent(item);
                        fixId(item);
                        deferred.resolve(item);
                    });
                });
                return deferred.promise();
            }
            
            function findAll() {
                var deferred = $.Deferred();
                db.collection('things', function(err, collection) {
                    collection.find().toArray(function(err, items) {
                        _.each(items, function(item) {
                            scrubContent(item);
                            fixId(item);
                        });
                        deferred.resolve(items);
                    });
                });
                return deferred.promise();
            }
            
            function add(data) {
                var deferred = $.Deferred();
                db.collection('things', function(err, collection) {
                    collection.insert(data, { safe : true }, function(err, results) {
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
    
            function update(data) {
                var deferred = $.Deferred();
                var id = data.id;
                delete data.id;
                db.collection('things', function(err, collection) {
                    collection.update({'_id' : new BSON.ObjectID(id)}, data, {safe : true}, function(err, results) {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            scrubContent(data);
                            data.id = id;
                            deferred.resolve(data);
                        }
                    });
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
                findAll : findAll,
                add : add,
                update : update
            }      
        }
    
});