const places = require(global.paths.root + '/state/hardcoded/places');
const other = require(global.paths.root + '/state/hardcoded/other');

module.exports = {
	category1: 'living_beings',
	category2: 'animals',
	category3: 'dog',
	title: 'My poodle dog',
	description: 'The poodle is a group of formal dog breeds, the Standard Poodle, Miniature Poodle and Toy Poodle. The origins of the poodles are still discussed with a dispute over whether the poodle descends from the old French Barbet breed or from Germany as a type of water dog.',
	serialNo: undefined,
	startEvent: {
		type: 'lost',
		date: '2017-07-15T17:06:53.784Z',
		details: other.startEvent.details,
		address: places[0].address,
		placeId: places[0].placeId,
		lat: places[0].lat,
		lng: places[0].lng
	}
};