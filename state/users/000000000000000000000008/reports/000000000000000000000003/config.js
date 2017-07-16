const places = require(global.paths.root + '/state/hardcoded/places');
const other = require(global.paths.root + '/state/hardcoded/other');

module.exports = {
	category1: 'personal_items',
	title: 'An apple an apple an apple',
	description: 'The apple tree (Malus pumila, commonly and erroneously called Malus domestica) is a deciduous tree in the rose family best known for its sweet, pomaceous fruit, the apple. It is cultivated worldwide as a fruit tree, and is the most widely grown species in the genus Malus. The tree originated in Central Asia, where its wild ancestor, Malus sieversii, is still found today. Apples have been grown for thousands of years in Asia and Europe, and were brought to North America by European colonists. Apples have religious and mythological significance in many cultures, including Norse, Greek and European Christian traditions.',
	serialNo: '123-456-789',
	startEvent: {
		type: 'lost',
		date: '2014-10-11T17:06:53.784Z',
		details: other.startEvent.details,
		address: places[0].address,
		placeId: places[0].placeId,
		lat: places[0].lat,
		lng: places[0].lng
	}
};