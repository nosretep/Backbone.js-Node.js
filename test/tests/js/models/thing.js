define(['models/thing'], function(Thing) {

    buster.testCase('Thing model', {
    
        "should have setter and getter" : function() {
            var thing = new Thing();
                thing.set('firstName', 'Joe');
            expect(thing.get('firstName')).toEqual('Fail');
        }
        ,

        "should get fullName" : function() {
        	var thing = new Thing();
        		thing.set({'firstName' : 'Bob', 'lastName' : 'Jones'});
        	expect(thing.fullName()).toEqual('Bob Jones');
        }
    })
});