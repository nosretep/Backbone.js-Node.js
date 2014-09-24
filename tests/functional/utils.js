define(['intern/dojo/Deferred', 'intern/dojo/node!leadfoot/helpers/pollUntil'], function (Deferred, pollUntil) {

	
	function logout_login(runner) {
		return runner.remote
		.setPageLoadTimeout(5000)
        .setFindTimeout(5000)
		.get(require.toUrl('http://localhost:8888/logout'))
		.then(pollUntil('return ((window.location.href !== "http://localhost:8888/logout") && window.document && (document.getElementsByClassName("home_content").length > 0) && (document.readyState === "complete"));', 5000))
		.setPageLoadTimeout(5000)
        .setFindTimeout(5000)
		.get(require.toUrl('http://localhost:8888/auth/facebook'))
		.then(pollUntil('return ((window.location.href.indexOf("facebook.com") > 0) && window.document && (window.document.getElementById("login_form") != null) && (document.readyState === "complete"));', 5000))
			.findById('email')
				.click()
				.type(process.env.TEST_FB_USERNAME)
				.end()
			.findById('pass')
				.click()
				.type(process.env.TEST_FB_PASSWORD)
				.end()
			.findByCssSelector('#login_form input[type=submit]')
				.click()
				.end()
	}
	
	function logout(runner) {
		return runner.remote
		.setPageLoadTimeout(5000)
        .setFindTimeout(5000)
		.get(require.toUrl('http://localhost:8888/logout'))
		.then(pollUntil('return ((window.location.href !== "http://localhost:8888/logout") && window.document && (document.getElementsByClassName("home_content").length > 0) && (document.readyState === "complete"));', 5000))
	}
	
	function login(runner) {
		
		return runner.remote
		.setPageLoadTimeout(5000)
        .setFindTimeout(5000)
		.get(require.toUrl('http://localhost:8888/auth/facebook'))
		.then(pollUntil('return ((window.location.href.indexOf("facebook.com") > 0) && window.document && (window.document.getElementById("login_form") != null) && (document.readyState === "complete"));', 5000))
			.findById('email')
				.click()
				.type(process.env.TEST_FB_USERNAME)
				.end()
			.findById('pass')
				.click()
				.type(process.env.TEST_FB_PASSWORD)
				.end()
			.findByCssSelector('#login_form input[type=submit]')
				.click()
				.end()
	}
	
	return {
		logout : logout,
		login : login,
		logout_login: logout_login
	}
});