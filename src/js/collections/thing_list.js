define([
    "backbone",
    "models/thing"
], 
function (Backbone, Thing) {
    var ThingList = Backbone.Collection.extend({
        model: Thing,
        url: '/things'
    });
    return ThingList;
});