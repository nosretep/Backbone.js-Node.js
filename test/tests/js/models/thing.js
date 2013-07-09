buster.spec.expose();

describe('Thing model test', function(run) {
    require(['models/thing'], function(Thing) {
        run(function() {
            it('should load', function() {
                var thing = new Thing();
                	thing.set('test_name', 'test_value');
                	
                // expect(thing.get('test_name')).toEqual('test_value');
                expect(thing.get('test_name')).toEqual('TRYING TO FAIL');
            });
        });
    });
});