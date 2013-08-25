var assert = require('assert'),
    webdriver = require('selenium-webdriver');

module.exports = 

	function(test, client) {

		test.describe('Thing test', function() {
			
			test.it('first element', function() {

				client.get('http://localhost:8888/things').then(function() {

					client.sleep(1000);

					var el1 = client.findElement(webdriver.By.css('li.thing:first-child'));

					el1.getText().then(function(value) {
						assert.equal(value, 'Thing 1');
					})

				});

			});

			test.it('second element', function() {

				client.get('http://localhost:8888/things').then(function() {

					client.sleep(1000);

					var el2 = client.findElement(webdriver.By.css('li.thing:nth-of-type(2)'));

					el2.getText().then(function(value) {
						assert.equal(value, 'Thing 2');
					});

				});

			});

			test.it('third element', function() {

				client.get('http://localhost:8888/things').then(function() {

					client.sleep(1000);

					var el3 = client.findElement(webdriver.By.css('li.thing:last-child'));

					el3.getText().then(function(value) {
						assert.equal(value, 'Thing 3');
					});

				});

			});

		});
	};