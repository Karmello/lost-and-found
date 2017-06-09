var r = require(global.paths._requires);

module.exports = {
    type: {
        correctness: {
            type: 'incorrect',
            validator: function(type) {

                for (var i = 0; i < r.hardData.en.reportTypes.length; i++) {
                    if (r.hardData.en.reportTypes[0].value == type) {
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
                        var lat = place.geometry.location.lat.toString();
                        var lng = place.geometry.location.lng.toString();

                        cb(doc.placeId == place.place_id && doc.lat.toString().substring(0, lat.length) == lat && doc.lng.toString().substring(0, lng.length) == lng);

                    } else { cb(false); }
                });
            }
        }
    }
};