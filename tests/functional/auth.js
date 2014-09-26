define([
    'myPackage/tests/functional/configs',
    'myPackage/tests/functional/utils',
    'intern!object',
    'intern/chai!assert',
    'intern/chai!expect',
    'intern/dojo/node!leadfoot/helpers/pollUntil'
], function (Configs, Utils, registerSuite, assert, expect, pollUntil) {
	
    registerSuite({
    	
    	'Unprotected page': function() {
    		
	        return Utils.logout(this)
	            .get(require.toUrl('http://' + Configs.host + '/about'))
	            .then(pollUntil('return window.location.href;', null, 5000, 100))
				.then(function (href) {
						assert.equal(href, 'http://' + Configs.host + '/about');
				    }, function (error) {
				    	assert.fail('failed to get window.location.href');
				    })
				.sleep(1000)
    	}
    	
    	,
    	
        'Protected page': function () {
	        return Utils.logout(this)
	            .get(require.toUrl('http://' + Configs.host + '/things'))
	            .then(pollUntil('return window.location.href;', null, 5000, 100))
				.then(function (href) {
						assert.equal(href, 'http://' + Configs.host + '/login');
				    }, function (error) {
				    	assert.fail('failed to get window.location.href');
				    })
				.sleep(1000)
	        
        }

    	,
    	
    	
    	'Login to Facebook': function() {
    		return Utils.logoutThenLogin(this)
    			.then(pollUntil('return window.location.href;', null, 5000, 100))
    			.then(function (href) {
    					expect(href).to.contain('http://' + Configs.host + '/things');
			    	}, function (error) {
			    		console.log(JSON.stringify(error));
			    		assert.fail('failed to get window.location.href');
			    	})
			    	.sleep(1000)
    	}
    	
    });
});