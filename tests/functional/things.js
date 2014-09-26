define([
    'myPackage/tests/functional/configs',
    'myPackage/tests/functional/utils',
    'intern!object',
    'intern/chai!assert',
    'intern/dojo/node!leadfoot/helpers/pollUntil',
    'intern/dojo/request/node'
], function (Configs, Utils, registerSuite, assert, pollUntil, xhr) {
	
    registerSuite({
    	
    	'teardown': function() {
    		return Utils.logout(this);
    	}
    	,

    	'setup': function() {
    		return Utils.login(this);
    	}
    	,
    	
    	'Add new thing': function() {
    		
    		var title = 'title ' + (new Date()).toString();
    		return this.remote
    			.sleep(1000)
    			.findByCssSelector('a.new_thing')
	    			.click()
	    			.end()
	    		.sleep(1000)
	    		.findByCssSelector('input[name="title"]')
	    			.click()
	    			.type(title)
	    			.end()
	    		.sleep(1000)
    			.findByCssSelector('button.create')
	    			.click()
	    			.end()
	    		.sleep(1000)
    			.findByCssSelector('li.thing.list-group-item')
					.getVisibleText()
				    .then(function (text) {
				        assert.strictEqual(text, title,
				            'Newly created thing should have correct title');
				    });
	    		
    	},
    	
    	'Edit existing thing': function() {
    		
    		var title1 = 'title1 ' + (new Date()).toString();
    		var title2 = 'title2 ' + (new Date()).toString();
    		
    		this.remote.getCookies().then(function(cookies) {
        		xhr.post(require.toUrl('http://' + Configs.host + '/api/things'), {
        			headers: {
        				'Content-Type': 'application/json',
        				'Cookie': Utils.cookieQuerystring(cookies)
        			},
        			data: JSON.stringify({
        				title: title1
        			})
        		})
    		});

    		return this.remote.get('http://' + Configs.host + '/things')
    			.findByCssSelector('li.thing.list-group-item:first-child')
					.getVisibleText()
				    .then(function (text) {
				        assert.strictEqual(text, title1,
				            'Newly created thing should have correct title');
				    })
				.end()
				.sleep(1000)
				.findByCssSelector('li.thing.list-group-item:first-child a')
				    .click()
				    .end()
				.sleep(1000)
				.findByCssSelector('div.thing span.thing_title')
					.getVisibleText()
					.then(function(text) {
				        assert.strictEqual(text, title1,
			            'Newly created thing should have correct title');						
					})
				.end()
				.findByCssSelector('div.thing a.edit_thing')
					.click()
					.end()
				.sleep(1000)
				.findByCssSelector('div.thing_edit input[name="title"]')
					.getProperty('value')
					.then(function(text) {
				        assert.strictEqual(text, title1,
			            'Newly created thing should have correct title');
					})
					.click()
					.clearValue()
					.type(title2)
					.end()
	    		.sleep(1000)
    			.findByCssSelector('button.update')
	    			.click()
	    			.end()
	    		.sleep(1000)
    			.findByCssSelector('li.thing.list-group-item')
					.getVisibleText()
				    .then(function (text) {
				        assert.strictEqual(text, title2,
				            'Newly created thing should have correct title');
				    });
    		
    	}

    });
});


//.end()
//.then(function() {
//	
//	
//	var miniInner = (function() {
//		
//		var myTime = (new Date()).getTime();
//		console.log(myTime);
//			return function() {
//			  console.log(myTime);
//		      if (((new Date()).getTime() - myTime) > 10000) {
//		        return true;
//		      } else {
//		        return null;
//		      }
//			}
//	    })();
//	
//	return pollUntil(miniInner, null, 20000, 2000).call(this)
//})



//.then(pollUntil('return window.location.href === "http://localhost:8888/things/new";' 5000));
//.findByCssSelector('li.list-group-item:first a.app_link')
//	.getVisibleText()
//    .then(function (text) {
//        assert.strictEqual(text, title,
//            'Newly created thing should have correct title');
//    });