define([
    'myPackage/tests/functional/utils',
    'intern!object',
    'intern/chai!assert',
    'intern/chai!expect',
    'intern/dojo/node!leadfoot/helpers/pollUntil',
    'intern/dojo/Deferred'
], function (Utils, registerSuite, assert, expect, pollUntil, Deferred) {
	
    registerSuite({
    	
    	'Login to Facebook': function() {
    		var runner = this;
    		return Utils.logout_login(runner)
    			.then(pollUntil('return window.location.href;', 1000))
    			.then(function (href) {
    					expect(href).to.contain('http://localhost:8888/things');
			    	}, function (error) {
			    		console.log(JSON.stringify(error));
			    		assert.fail('failed to get window.location.href');
			    	})
    	}
    
    	,
    	
    	'Unprotected page': function() {
	        return Utils.logout(this)
	            .get(require.toUrl('http://localhost:8888/about'))
	            .then(pollUntil('return window.location.href;', 1000))
				.then(function (href) {
						assert.equal(href, 'http://localhost:8888/about');
				    }, function (error) {
				    	assert.fail('failed to get window.location.href');
				    });
    	}
    	
    	,
    	
        'Protected page': function () {
	        return Utils.logout(this)
	            .get(require.toUrl('http://localhost:8888/things'))
	            .then(pollUntil('return window.location.href;', 1000))
				.then(function (href) {
						assert.equal(href, 'http://localhost:8888/login');
				    }, function (error) {
				    	assert.fail('failed to get window.location.href');
				    });
        }

    });
});