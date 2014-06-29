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

//api routing
app.post('/api/post/addbeacon/:id', api.addBeacon);
app.get('/api/get/beacon/:id', api.getTrayFromBeacon);
app.post('/api/post/beacon/:id/:body', api.addTrayToBeacon);
app.get('/api/get/searchfoods/:searchquery', api.searchFoods);
app.get('/api/get/searchrecipes/:searchquery', api.searchRecipes);
app.get('/api/get/food/:id', api.getFood);
app.get('/api/get/recipe/:id', api.getRecipe);


// redirect all others to the index (HTML5 history)
app.get('*', chef.home);


/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
