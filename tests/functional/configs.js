define(function() {
	return {
		host : process.env.HOST,
		fb : {
			username : process.env.TEST_FB_USERNAME,
			password : process.env.TEST_FB_PASSWORD
		}
	}
});