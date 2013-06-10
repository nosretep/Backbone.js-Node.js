nodejs-requirejs-express-backbonejs
===================================

Reusing Backbone.js models/collections/views on the web client and server with Node.js, RequireJS, and Express

## Backbone.js, Node.js, RequireJS, and Express ...
http://backbonejs.org/

http://nodejs.org/

http://requirejs.org/

http://expressjs.com/


## Install libraries ...

```bash
npm install # looks to package.json ...
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