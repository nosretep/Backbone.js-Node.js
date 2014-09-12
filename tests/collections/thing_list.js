define(["intern!object", "intern/chai!assert", "collections/thing_list"],
	function (registerSuite, assert, ThingList) {
	registerSuite({
		"load": function () {
			assert.isNotNull(ThingList);
		},
		"sort": function() {
			var Things = new ThingList();
			
			Things.add({'title':'number one', 'created': new Date('January 1, 2005') });
			Things.add({'title':'number two', 'created': new Date('January 1, 2001') });
			Things.add({'title':'number three', 'created': new Date('January 1, 2004') });
			
			Things.sort();
			
			// at( 0 )
			assert.equal(Things.at(0).get('title'), 'number one');
			
			// at( 2 )
			assert.equal(Things.at(2).get('title'), 'number two');
			
			// at( 1 )
			assert.equal(Things.at(1).get('title'), 'number three');
		}
	});
});