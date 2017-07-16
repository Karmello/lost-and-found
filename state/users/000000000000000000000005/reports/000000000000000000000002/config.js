const places = require(global.paths.root + '/state/hardcoded/places');
const other = require(global.paths.root + '/state/hardcoded/other');

module.exports = {
	category1: 'personal_items',
	title: 'Nike soccer ball',
	description: 'A football, soccer ball, or association football ball is the ball used in the sport of association football. The name of the ball varies according to whether the sport is called "football", "soccer", or "association football". The ball\'s spherical shape, as well as its size, weight, and material composition, are specified by Law 2 of the Laws of the Game maintained by the International Football Association Board. Additional, more stringent, standards are specified by FIFA and subordinate governing bodies for the balls used in the competitions they sanction.',
	serialNo: '123-456-789',
	startEvent: {
		type: 'lost',
		date: '2015-02-10T17:06:53.784Z',
		details: other.startEvent.details,
		address: places[0].address,
		placeId: places[0].placeId,
		lat: places[0].lat,
		lng: places[0].lng
	}
};