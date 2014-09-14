define([
    'intern!object',
    'intern/chai!assert',
    'intern/dojo/node!leadfoot/helpers/pollUntil'
], function (registerSuite, assert, pollUntil) {

    registerSuite({
        'a test': function () {
        return this.remote
            .get(require.toUrl('http://localhost:8888/things'))
            .then(pollUntil('return window.ready;', 1000))
			.then(function (bool) {
			        assert.isTrue(bool);
			    }, function (error) {
			        // element was not found
			    })
			.findByCssSelector('.thing:last-child')
			.moveMouseTo()
            .getVisibleText()
            .then(function (text) {
                assert.strictEqual(text, 'Thing 3',
                    'Adding a comment should display the comment. Showed instead ' + text)
            })
            .findByCssSelector('a')
            .click()
            .then(pollUntil('return document.title;', 5000))
			.then(function (title) {
			        assert.equal(title, 'Thing 3');
			    }, function (error) {
			        // element was not found
			    })

        }
    });
});