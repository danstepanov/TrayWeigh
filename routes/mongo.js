var db;

exports.loadDB = function (database) {
	db = database;
};

exports.addBeacon = function(params, callback) {
	var beacons = db.collection('beacons');

	beacons.insert(params, callback);
};

exports.addTrayToBeacon = function(params, callback) {
	var beacons = db.collection('beacons');

	var criteria = {
		beacon_id: params.beacon_id
	},
		options = {
			safe: true,
			upsert: true
	},
		update = {
			tray: params.tray
	};

	beacons.update(criteria, { '$set' : update} , options, callback);
}

exports.getTrayFromBeacon= function(beaconID, callback) {
	var beacons = db.collection('beacons');
	console.log(beaconID);
	beacons.findOne(beaconID, function(err, result) {
		if(err){
			console.error(err);
		}
		else {
			console.log(result);
			callback(result);
		}
	});
};