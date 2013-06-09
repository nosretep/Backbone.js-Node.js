define(['underscore', 'json!config.json'],
function(_, configJSON) {    

    var config = {}; 

    _.extend(config, configJSON);

    return config;
});