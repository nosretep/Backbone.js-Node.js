define([
    'intern!object',
    'intern/chai!assert',
    'intern/chai!expect',
    'intern/dojo/node!leadfoot/helpers/pollUntil'
], function (registerSuite, assert, expect, pollUntil) {

	function logout(runner) {
		return runner.remote
		.setPageLoadTimeout(3000)
        .setFindTimeout(3000)
		.get(require.toUrl('http://localhost:8888/logout'))
		.end();
	};
	
	function login(runner) {		
		return runner.remote
		.setPageLoadTimeout(3000)
        .setFindTimeout(3000)
		.get(require.toUrl('http://localhost:8888/auth/facebook'))
			  .findById('email')
			  .click()
			  .type('one_wbmbzja_testerson@tfbnw.net')
			  .end()
			.findById('pass')
			  .click()
			  .type('p4ssw0rd')
			  .end()
			.findByCssSelector('#login_form input[type=submit]')
			  .click()
			  .end();
	};
	
    registerSuite({
    	
    	'Login to Facebook': function() {
    		return logout(this)
    			.then(login(this))
    			.then(pollUntil('return window.location.href;', 1000))
    			.then(function (href) {
    				expect(href).to.contain('http://localhost:8888/things')
			    	}, function (error) {
			    		// element was not found
			    	});
    	}
    
    	,
    	
    	'Unprotected page': function() {
	        return logout(this)
				.setPageLoadTimeout(3000)
		        .setFindTimeout(3000)
	            .get(require.toUrl('http://localhost:8888/about'))
	            .then(pollUntil('return window.location.href;', 1000))
				.then(function (href) {
						assert.equal(href, 'http://localhost:8888/about');
				    }, function (error) {
				        // element was not found
				    });
    	}
    	
    	,
    	
        'Protected page': function () {
	        return logout(this)
				.setPageLoadTimeout(3000)
		        .setFindTimeout(3000)
	            .get(require.toUrl('http://localhost:8888/things'))
	            .then(pollUntil('return window.location.href;', 1000))
				.then(function (href) {
						assert.equal(href, 'http://localhost:8888/login');
				    }, function (error) {
				        // element was not found
				    });
        }

    });
});


//.findByCssSelector('.thing:last-child')
//.moveMouseTo()
//.getVisibleText()
//.then(function (text) {
//    assert.strictEqual(text, 'Thing 3',
//        'Adding a comment should display the comment. Showed instead ' + text)
//})
//.findByCssSelector('a')
//.click()
//.then(pollUntil('return document.title;', 5000))
//.then(function (title) {
//        assert.equal(title, 'Thing 3');
//    }, function (error) {
//        // element was not found
//    })

//}