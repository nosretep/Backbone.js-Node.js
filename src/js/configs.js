define(['underscore', 'json!env.json'],
function(_, envDataJSON) {    

    var data = {}; 

    _.extend(data, envDataJSON);

    return data;
});