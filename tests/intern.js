define({
	
	loader: {
		packages: [ 
			{ name: 'myPackage', location: '.' },
			{ name: 'jquery', location: './node_modules/jquery'},
			{ name: 'underscore', location: './node_modules/underscore' },
			{ name: 'backbone', location: './node_modules/backbone' }
		]
	},
	
	suites: [ 'myPackage/tests/all' ],
	
	useLoader: {
	  'host-node': 'requirejs'
	},

	reporters: [ 'console', 'lcovhtml', 'cobertura' ],
	
	excludeInstrumentation: /^(configs|dist|html-report|node_modules|test|tests|src\/js\/libs)\//
});