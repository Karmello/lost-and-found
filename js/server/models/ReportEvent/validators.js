const cm = require(global.paths.server + '/cm');

module.exports = {
	type: {
		correctness: function(type) {

	        for (let i = 0; i < cm.hardData.en.reportTypes.length; i++) {
	            if (cm.hardData.en.reportTypes[i].value == type) { return true; }
	        }

	        return false;
		}
	},
	address: {
		correctness: function(address, cb) {

            let doc = this;
            let googleMapsClient = cm.libs.googleMaps.createClient({ keys: process.env.GOOGLE_MAPS_API_KEY });

            googleMapsClient.geocode({ 'address': address }, function(err, res) {

                if (!err && res.json.status === 'OK') {

                    let place = res.json.results[0];
                    let lat = place.geometry.location.lat;
                    let lng = place.geometry.location.lng;

                    cb(doc.placeId == place.place_id && doc.lat.toFixed(7) == lat.toFixed(7) && doc.lng.toFixed(7) == lng.toFixed(7));

                } else { cb(false); }
            });
		}
	}
};