define([
    'myPackage/tests/functional/configs',
    'myPackage/tests/functional/utils',
    'intern!object',
    'intern/chai!assert',
    'intern/chai!expect',
    'intern/dojo/node!leadfoot/helpers/pollUntil'
], function (Configs, Utils, registerSuite, assert, expect, pollUntil) {
	
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