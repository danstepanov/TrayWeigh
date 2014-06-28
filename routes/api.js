var mongo = require('./mongo'),
	OAuth = require('oauth'),
	_ = require('underscore'),
	jsSHA = require('jssha');

exports.setDb = function(dbUrl) {
	var db = require('mongoskin').db(dbUrl, {
		w: 1
	});
	mongo.loadDB(db);
};

exports.addBeacon = function(req,res) {
	console.log("beaconid: " + req.params.id);
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
	var tray = {
		calories: 512,
		sodium: 4,
		carbohydrates: 100
	};
	var params = {
		beacon_id: req.params.id,
		tray: tray
	};
	mongo.addTrayToBeacon(params,function(){
		console.log('added tray');
	});
};

exports.getTrayFromBeacon = function(req,res) {
	mongo.getTrayFromBeacon({
		beacon_id: req.params.id
	}, function(){
		console.log('got beacon');
	});
};

exports.searchFoods = function(req, res) {
	var norm_params = [
		{oauth_consumer_key:"foo"},
		{oauth_signature_method: "HMAC-SHA1"},
		{oauth_timestamp: (new Date().getTime())},
		{oauth_nonce: Math.random() * 1000},
		{oauth_version: "1.0"},
		{method: "foods.autocomplete"},
		{expression: "chicken"}
	];

	var norm_params = [
		{
			key: "oauth_consumer_key",
			value: "foo"
		},
		{
			key: "oauth_signature_method",
			value: "HMAC-SHA1"
		},
		{
			key: "oauth_timestamp",
			value: (new Date().getTime())
		},
		{
			key: "oauth_nonce",
			value: Math.random() * 1000
		},
		{
			key: "oauth_version",
			value: "1.0"
		},
		{
			key: "method",
			value: "foods.autocomplete"
		},
		{
			key: "expression",
			value: "chicken"
		}
	];

	var sorted_norms = _.sortBy(norm_params, "key");

	var param_string = "";

	for(var i in sorted_norms) {
		param_string += sorted_norms[i].key + "=" + sorted_norms[i].value;

		if(i == sorted_norms.length - 1) {
			continue;
		}

		param_string += "&";
	};

	console.log(param_string);

	param_string = "POST&" + escape("http://platform.fatsecret.com/rest/server.api") + "&" + escape(param_string);
	console.log(param_string);
	
}
