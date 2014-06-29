/**
 * Module dependencies
 */

var express = require('express'),
  http = require('http'),
  path = require('path'),
  chef = require('./routes/index'),
  api = require('./routes/api'),
  engines = require('consolidate'),
  config = require('./config');


var app = module.exports = express();

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));
app.engine('html', engines.mustache);
app.set('view engine', 'html');
// development only
api.setDb(config.db);


/**
 * Routes
 */

//webapp routing
app.get('/', chef.home);

// api.searchFoods();

//api routing
app.get('/api/post/addbeacon/:id', api.addBeacon);
app.get('/api/get/beacon/:id', api.getTrayFromBeacon);
app.get('/api/post/beacon/:id', api.addTrayToBeacon);
app.get('/api/get/searchfoods/:searchquery', api.searchFoods);

// redirect all others to the index (HTML5 history)
app.get('*', chef.home);


/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
