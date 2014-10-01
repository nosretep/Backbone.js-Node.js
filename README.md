Backbone.js-Node.js
===================================

Prototype one page web app, with RESTful API server, that also renders HTML at the client.

http://nodejs.org/

http://expressjs.com/

http://requirejs.org/

http://backbonejs.org/

http://www.mongodb.org/



## Install libraries ...

```bash
npm install # looks to package.json ...
```


## Mandatory configs
```bash
export HOST= # for example localhost:8888
export PORT= # for example 8888
export FACEBOOK_APP_ID= # app requires Facebook connect
export FACEBOOK_APP_SECRET= # app requires Facebook connect
export DB_DOMAIN= # mongodb domain/ip
export DB_PORT= # mongodb port
export DB_USERNAME= # mongodb username
export DB_PASSWORD= # mongodb password
```

## Run server with 'local' configuration ...

```bash
node server.js --config local # serving different /config/{config}.json file as /js/config.json ...
```

## Compress and minify and wrap up for deployment or distribution ...

```bash
grunt -config local # packaging /config/{config}.json file as /js/config.json ...
```

## Run server for testing distribution files (after grunt) ...

```bash
node server.js --dist true
```
