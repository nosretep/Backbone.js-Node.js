var config = module.exports;
config['browser-all'] = {
    environment: 'browser',
    rootPath: '..',
    sources: [
        'src/js/**/*.js',
        'src/js/**/*.json',
        'src/js/**/*.html'
    ],
    tests: ['test/tests/**/*.js', 'test/catch_all.js'],
    libs: [
        'src/js/libs/require.js',
        'test/requirejs-config.js'
    ],
    extensions: [ 
        require('buster-amd')
        , 
        require('buster-coverage')
    ]
    ,
    'buster-coverage': {
        isModulePattern: false,
        format: 'lcov',
        outputDirectory: 'test/ci-reports',
        combinedResultsOnly: true,
        coverageExclusions: [
            'js/libs/', 
            'js/data/config.json',
            'js/templates/'
        ]
    }
};