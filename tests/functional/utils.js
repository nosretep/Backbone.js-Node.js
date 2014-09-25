define(['myPackage/tests/functional/configs', 
        'intern/dojo/node!leadfoot/helpers/pollUntil'], function (Configs, pollUntil) {
	
	function logout_login(runner) {
		return runner.remote
		.get(require.toUrl('http://' + Configs.host + '/logout'))
		.get(require.toUrl('https://facebook.com'))
		.clearCookies()
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
	}
	
	function logout(runner) {
		return runner.remote
		.get(require.toUrl('http://' + Configs.host + '/logout'))
		.get(require.toUrl('https://facebook.com'))
		.clearCookies()
	}
	
	function login(runner) {
		return runner.remote
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
	}
	
	return {
		logout : logout,
		login : login,
		logout_login: logout_login
	}
});