buster.spec.expose();

describe('Thing view test', function(run) {
    require(['views/thing', 'models/thing'], function(ThingView, Thing) {
        run(function() {

            var thing =  new Thing({'id':'thingId','title':'thing title'});

            var thingView = new ThingView({
                'model': thing
            });

            thingView.render();

            it('should have "div.thing" as the root element', function() {
                assert.match(thingView.el, {
                    tagName: 'div',
                    className: 'thing'
                })
            });

            it('should have "span.thing_title" containing the thing title', function() {
                assert.match(thingView.$('span.thing_title')[0], {
                    innerText: thing.get('title')
                })
            });

            it('should have link to "edit" page', function() {
                assert.match(thingView.$('a')[0], {
                    href: '/things/' + thing.get('id') + '/edit'
                })
            });

        });
    });
});