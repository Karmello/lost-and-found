var r = require(global.paths._requires);

module.exports = {
    type: {
        correctness: {
            type: 'incorrect',
            validator: function(type) {

                for (var i = 0; i < r.hardData.en.reportTypes.length; i++) {
                    if (r.hardData.en.reportTypes[i].value == type) {
                        return true;
                    }
                }

                return false;
            }
        }
    },
    details: {
        length: {
            type: 'wrong_length',
            limits: {
                min: global.app.get('REPORT_EVENT_DETAILS_MIN_LENGTH'),
                max: global.app.get('REPORT_EVENT_DETAILS_MAX_LENGTH')
            },
            validator: function(details) {

                if (details.length >= global.app.get('REPORT_EVENT_DETAILS_MIN_LENGTH') && details.length <= global.app.get('REPORT_EVENT_DETAILS_MAX_LENGTH')) {
                    return true;

                } else { return false; }
            }
        }
    },
    location: {
        correctness: {
            type: 'incorrect',
            validator: function(address, cb) {

                var doc = this;
                var googleMapsClient = r.googleMaps.createClient({ keys: process.env.GOOGLE_MAPS_API_KEY });

                googleMapsClient.geocode({ 'address': address }, function(err, res) {

                    if (!err && res.json.status === 'OK') {

                        var place = res.json.results[0];
                        var lat = place.geometry.location.lat;
                        var lng = place.geometry.location.lng;

                        cb(doc.placeId == place.place_id && doc.lat.toFixed(7) == lat.toFixed(7) && doc.lng.toFixed(7) == lng.toFixed(7));

                    } else { cb(false); }
                });
            }
        }
    }
};