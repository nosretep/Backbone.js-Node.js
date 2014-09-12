define(["intern!object", "intern/chai!assert", "models/thing"],
	function (registerSuite, assert, Thing) {
	registerSuite({
		"name": "Thing model tests",
		"load": function () {
			assert.isNotNull(Thing);
		},
		"basic": function() {
			var title = "Thing title";
			var thing = new Thing({"title": title});
			assert.equal(thing.get('title'), title);
		}
	});
});