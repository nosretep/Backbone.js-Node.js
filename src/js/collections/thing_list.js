define([
    "backbone",
    "models/thing"
], 
function (Backbone, Thing) {
    var ThingList = Backbone.Collection.extend({
        model: Thing,
        url: '/api/things',
        comparator: function(model) {
            return -(new Date(model.get('created')).getTime());
        }
    });
    return ThingList;
});