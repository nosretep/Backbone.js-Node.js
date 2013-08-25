var assert = require('assert'),
    webdriver = require('selenium-webdriver'),
    webdriverRemote = require('selenium-webdriver/remote'),
    test = require('selenium-webdriver/testing'),
    pathToSeleniumJar = 'test/bin/selenium-server-standalone-2.35.0.jar';

var server = new webdriverRemote.SeleniumServer(pathToSeleniumJar, {port: 4444});
	server.start();

var	client = new webdriver.Builder().
	usingServer(server.address()).
	withCapabilities(webdriver.Capabilities.firefox()).
	build();

// test.before(function(done) {
// // Add some helper commands
// 	client.addCommand('hasText', 
// 		function(selector, text, callback) {
// 			this.getText(selector, function(result) {
// 				expect(result.value).to.have.string(text);
// 				callback();
// 			});
// 		});
// 	done();
// });

test.after(function() {
	client.quit();
});

// Iterate through the tests ...
require('fs').readdirSync(__dirname + '/tests').forEach(function(file) {
	require('./tests/' + file)(test, client);
});