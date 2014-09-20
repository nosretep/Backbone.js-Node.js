define([
    "backbone",
    "models/thing"
], 
function (Backbone, Thing) {
    var ThingList = Backbone.Collection.extend({
        model: Thing,
        url: '/api/things',
        comparator: function(model) {
            return -(model.get('created'));
        }
    });
    return ThingList;
});