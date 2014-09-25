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
    		var runner = this;
//    		return Utils.logout_login(runner)
    		return this.remote
			.get(require.toUrl('http://' + Configs.host + '/logout'))
			.get(require.toUrl('http://' + Configs.host + '/auth/facebook'))
				.findById('email')
					.click()
					.type(Configs.fb.username)
					.end()
				.findById('pass')
					.click()
					.type(Configs.fb.password)
					.end()
				.findByCssSelector('#login_form input[type=submit]')
					.click()
					.end()
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