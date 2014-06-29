var mongo = require('./mongo'),
	OAuth = require('oauth'),
	_ = require('underscore'),
	jsSHA = require('jssha'),
	request = require('request'),
	qs = require('querystring'),
	crypto = require('crypto');

exports.setDb = function(dbUrl) {
	var db = require('mongoskin').db(dbUrl, {
		w: 1
	});
	mongo.loadDB(db);
};

exports.addBeacon = function(req,res) {
	params = {
		beacon_id: req.params.id,
		org:"hackathon"
	};

	mongo.addBeacon(params, function() {
		console.log("hello");
	});
};

// exports.searchFoods = function(req,res) {
// 	console.log(req.params.searchquery);

// 	// var oauth = new OAuth.OAuth(
// 	// 	'request_token',
// 	// 	'access_token'
// 	// );

// 	var request = {
// 		"oauth_consumer_key":"571b27a2df6b489f8c36a23ae077b6ad" + "&",
// 		"oauth_signature_method":"HMAC-SHA1" + "&",
// 		"oauth_timestamp":(new Date().getTime()/1000)  + "&",
// 		"oauth_nonce": (Math.floor(Math.random()*1000))  + "&",
// 		"oauth_version":"1.0" + "&",
// 		"method":"foods.search"
// 	};

// 	var param_string = "";

// 	for(var param in request) {
// 		param_string += param + "=" +  request[param];
// 	}

// 	console.log(param_string);
// };

exports.addTrayToBeacon = function(req, res) {
	var tray = JSON.parse(req.params.body);
	// {
	// 	name:"neverland",
	// 	id:5,
	// 	calories: 512,
	// 	sodium: 4,
	// 	carbs: 100,
	// 	protein: 20,
	// 	fats: 5,
	// 	sugars: 30,
	// 	serving: 500
	// };
	var params = {
		beacon_id: req.params.id,
		tray: tray
	};
	mongo.addTrayToBeacon(params,function(){
		console.log('added tray');
	});
};

exports.getTrayFromBeacon = function(req,res) {
	console.log(req.params.id);
	mongo.getTrayFromBeacon({
		beacon_id: req.params.id
	}, function(result){
		console.log('got beacon');
		res.json(result)
	});
};

var fixedEncodeURIComponent = function(str) {
  return encodeURIComponent(str).replace(/[!'()]/g, escape).replace(/\*/g, "%2A");
}

var processSearch = function (query,url, method) {
  var now = new Date();
  var seconds = Math.floor(now.getTime() / 1000);
  var nonce = Math.random().toString(36).replace(/[^a-z]/, '').substr(2) + query; 
  var getParams = qs.stringify({
    'format':'json',  
    'method':method,
    'oauth_consumer_key':"571b27a2df6b489f8c36a23ae077b6ad",
    'oauth_nonce': nonce, 
    'oauth_signature_method':'HMAC-SHA1',
    'oauth_timestamp':seconds,
    'oauth_version':'1.0',
    'search_expression':query
  });
  var encUrl = fixedEncodeURIComponent (url);
  var encGetParams = fixedEncodeURIComponent(getParams);
  var getBaseSign = 'GET' + '&' + encUrl + '&' + encGetParams;
  var rfcGetSignature = generateHmac(getBaseSign, '4ea80f61e94241208aab70723ce5169c&'); 
  var getBaseRfc = rfcGetSignature.replace(/ /g, '%20');
  var getBaseRfc = getBaseRfc.replace(/\+/g, '%2B'); 
  getParams +='&'; 
  getParams += 'oauth_signature=';
  getParams += getBaseRfc;
  return getParams;
};

var processId = function (id,url,method) {
  var now = new Date();
  var seconds = Math.floor(now.getTime() / 1000);
  var nonce = Math.random().toString(36).replace(/[^a-z]/, '').substr(2) + id; 
  var getParams = qs.stringify({
  	'food_id':id,
    'format':'json',  
    'method':method,
    'oauth_consumer_key':"571b27a2df6b489f8c36a23ae077b6ad",
    'oauth_nonce': nonce, 
    'oauth_signature_method':'HMAC-SHA1',
    'oauth_timestamp':seconds,
    'oauth_version':'1.0'
  });
  var encUrl = fixedEncodeURIComponent (url);
  var encGetParams = fixedEncodeURIComponent(getParams);
  var getBaseSign = 'GET' + '&' + encUrl + '&' + encGetParams;
  var rfcGetSignature = generateHmac(getBaseSign, '4ea80f61e94241208aab70723ce5169c&'); 
  var getBaseRfc = rfcGetSignature.replace(/ /g, '%20');
  var getBaseRfc = getBaseRfc.replace(/\+/g, '%2B'); 
  getParams +='&'; 
  getParams += 'oauth_signature=';
  getParams += getBaseRfc;
  return getParams;
};

var processRecipe = function (id,url,method) {
  var now = new Date();
  var seconds = Math.floor(now.getTime() / 1000);
  var nonce = Math.random().toString(36).replace(/[^a-z]/, '').substr(2) + id; 
  var getParams = qs.stringify({
    'format':'json',  
    'method':method,
    'oauth_consumer_key':"571b27a2df6b489f8c36a23ae077b6ad",
    'oauth_nonce': nonce, 
    'oauth_signature_method':'HMAC-SHA1',
    'oauth_timestamp':seconds,
    'oauth_version':'1.0',
  	'recipe_id':id
  });
  var encUrl = fixedEncodeURIComponent (url);
  var encGetParams = fixedEncodeURIComponent(getParams);
  var getBaseSign = 'GET' + '&' + encUrl + '&' + encGetParams;
  var rfcGetSignature = generateHmac(getBaseSign, '4ea80f61e94241208aab70723ce5169c&'); 
  var getBaseRfc = rfcGetSignature.replace(/ /g, '%20');
  var getBaseRfc = getBaseRfc.replace(/\+/g, '%2B'); 
  getParams +='&'; 
  getParams += 'oauth_signature=';
  getParams += getBaseRfc;
  return getParams;
};


var generateHmac = function (data, consumerKey, algorithm, encoding) {
  encoding = "base64";
  algorithm = "sha1";
  return crypto.createHmac(algorithm, consumerKey).update(data).digest(encoding);
};

exports.searchFoods = function(req, res) {
	var url = "http://platform.fatsecret.com/rest/server.api?"

	url += processSearch(req.params.searchquery,"http://platform.fatsecret.com/rest/server.api", "foods.search");

	request.get(url, function(error, response, body) {
		if(error) {
			console.log(error);
		}
		var foods = [];
		body = JSON.parse(body);
		// console.log(body.foods);
		if(body.foods && body.foods.food){
			for(var i in body.foods.food){
				var element = body.foods.food[i];
				foods.push({
					id: element.food_id,
					name:element.food_name
				});
			}
		}

		res.json({
			foods: foods
		});
	});
};

exports.getRecipe = function(req,res) {
	var url = "http://platform.fatsecret.com/rest/server.api?"

	url += processRecipe(req.params.id,"http://platform.fatsecret.com/rest/server.api", "recipe.get");

	request.get(url, function(error, response, body) {
		if(error) {
			console.log(error);
		}

		// console.log(JSON.parse(body));
		body = JSON.parse(body);

		var recipe = {};

		recipe.id = body.recipe.recipe_id;
		recipe.name = body.recipe.recipe_name;
		recipe.servings = body.recipe.number_of_servings;
		var serving = body.recipe.serving_sizes.serving;
		if(!serving.calories) {
			serving = serving[0];
		}
		recipe.serving_size = serving.serving_size;
		recipe.calories = serving.calories;
		recipe.fat = serving.fat;
		recipe.carbohydrates = serving.carbohydrate;
		recipe.sodium = serving.sodium;
		recipe.protein = serving.protein;
		recipe.sugars = serving.sugar;

		console.log(recipe);
	});
}

exports.getFood = function(req,res){
	console.log(req.params.id);

	var url = "http://platform.fatsecret.com/rest/server.api?"

	url += processId(req.params.id,"http://platform.fatsecret.com/rest/server.api", "food.get");
	console.log(url);
	request.get(url, function(error, response, body) {
		if(error) {
			console.log(error);
		}

		var food = {};
		body = JSON.parse(body);
		food.id = body.food.food_id;
		food.name = body.food.food_name;

		var serving = body.food.servings.serving;

		if(!serving.calories) {
			serving = serving[0];
		}

		food.serving_size = serving.metric_serving_amount;	
		food.serving_unit = serving.metric_serving_unit;
		food.protein = serving.protein;
		food.calories = serving.calories;
		food.carbs = serving.carbohydrate;
		food.sugars = serving.sugar;
		food.fat = serving.fat; 

	});
};

exports.searchRecipes = function(req, res) {
	var url = "http://platform.fatsecret.com/rest/server.api?"

	url += processSearch(req.params.searchquery,"http://platform.fatsecret.com/rest/server.api", "recipes.search");

	request.get(url, function(error, response, body) {
		if(error) {
			console.log(error);
		}
		var recipes = [];
		body = JSON.parse(body);
		// console.log(body.recipes);
		if(body.recipes && body.recipes.recipe){
			for(var i in body.recipes.recipe){
				var element = body.recipes.recipe[i];
				recipes.push({
					id: element.recipe_id,
					name:element.recipe_name
				});
			}
		}
		res.json({
			recipes: recipes
		});
	});
};
