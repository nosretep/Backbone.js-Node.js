define(['views/thing', 'models/thing'], function(ThingView, Thing) {

    buster.testCase('Thing view', {

        setUp : function() {
            this.thing =  new Thing({'id':'thingId','title':'thing title'});

            this.thingView = new ThingView({
                'model': this.thing
            });

            this.thingView.render();
        }
        ,
        
        "should have div.thing as the root element" : function() {
            assert.match(this.thingView.el, {
                tagName: 'div',
                className: 'thing'
            })
        }
        ,

        "should have span.thing_title containing the thing title" : function() {
            assert.match(this.thingView.$('span.thing_title')[0], {
                innerHTML: this.thing.get('title')
            })
        }
        ,

        "should have link to edit page" : function() {
            assert.match(this.thingView.$('a')[0], {
                href: '/things/' + this.thing.get('id') + '/edit'
            })
        }
    })
});