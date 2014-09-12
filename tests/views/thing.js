define(['intern!object', 'intern/chai!assert', 'views/thing', 'models/thing'],
	function (registerSuite, assert, ThingView, Thing) {
	registerSuite({
		'name': 'Thing view tests',
		'load': function () {
			assert.isNotNull(ThingView);
			assert.isNotNull(Thing);
		},
		'title': function() {
			
			var title = 'Thing title';
            var thing = new Thing({'id' : '123', 'title': title});

            var thingView = new ThingView({
                'model': thing
            });
            
            assert.equal(thingView.getTitle(), title);
		},
		'render': function() {
			var title = 'Thing title';
			var id = '123';
			
            var thing = new Thing({'id' : id, 'title': title});

            var thingView = new ThingView({
                'model': thing
            });
            
            // Render the view ...
            thingView.render();
            
            // Correct title ...
            assert.equal(thingView.$el.find('span.thing_title').html(), title);
            
            // Correct css class ...
            assert.isTrue(thingView.$el.hasClass('thing'));
            
            // Correct href to edit ...
            var editHref = thingView.$el.find('a.app_link').attr('href');
            assert.equal(editHref, '/things/' + id + '/edit');
		}
	});
});