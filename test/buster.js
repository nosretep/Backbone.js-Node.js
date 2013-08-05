var config = module.exports;
config['browser-all'] = {
  //autoRun: false,
  environment: 'browser',
  rootPath: '..',
  sources: [
    'src/js/**/*.js',
    'src/js/**/*.json',
    'src/js/**/*.html'
  ],
  tests: ['test/tests/**/*.js'],
  libs: [
      'src/js/libs/require.js',
      'test/requirejs-config.js'
  ],
  extensions: [require('buster-amd')]
};