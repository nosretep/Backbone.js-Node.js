define(['models/thing'], function(Thing) {

    buster.testCase('Thing model', {
    
        "should have setter and getter" : function() {
            var thing = new Thing();
                thing.set('test_name', 'test_value');
            expect(thing.get('test_name')).toEqual('test_value');
        }
    })
});