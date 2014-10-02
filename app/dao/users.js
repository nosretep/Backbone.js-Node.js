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

        return function(db) {
            
            function findById(id) {
                var deferred = $.Deferred();
                db.collection('users', function(err, collection) {
                    collection.findOne({'_id' : new BSON.ObjectID(id) }, function(err, item) {
                        fixId(item);
                        deferred.resolve(item);
                    });
                });
                return deferred.promise();
            }
            
            function findByExtIdAndProvider(ext_id, provider) {
                var deferred = $.Deferred();
                db.collection('users', function(err, collection) {
                    collection.findOne({'ext_id' : ext_id, 'provider' : provider }, function(err, item) {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            if (item) {
                                fixId(item);
                                deferred.resolve(item);
                            } else {
                                deferred.reject();
                            }
                        }
                    });
                });
                return deferred.promise();
            }
            
            function create(data) {
                var deferred = $.Deferred();
                db.collection('users', function(err, collection) {
                    collection.insert(data, { safe : true }, function(err, results) {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            var item = results[0];
                            fixId(item);
                            deferred.resolve(item);
                        }
                    });
                });
                return deferred.promise();
            }
            
            function findOrCreate(data) {
                var deferred = $.Deferred();
                
                var _user = {
                    ext_id : data.id,
                    provider : data.provider,
                    display_name : data.displayName,
                };
                
                findByExtIdAndProvider(_user.ext_id, _user.provider)
                    .then(function(data) {
                        deferred.resolve(data);
                    })
                    .fail(function(err) {
                        create(_user).then(function(data) {
                            deferred.resolve(data);
                        });
                    });
                
                return deferred.promise();
            }
    
            return {
                findOrCreate : findOrCreate,
                findById : findById
            };
            
        };
        
});