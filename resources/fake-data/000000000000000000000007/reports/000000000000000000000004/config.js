const places = require(global.paths.root + '/js/setup/hardcoded/places');
const other = require(global.paths.root + '/js/setup/hardcoded/other');

module.exports = {
	category1: 'personal_items',
	title: 'Picasso\'s famous brush',
	description: 'A brush is a tool with bristles, wire or other filaments, used for cleaning, grooming hair, make up, painting, surface finishing and for many other purposes. It is one of the most basic and versatile tools known to mankind, and the average household may contain several dozen varieties. It generally consists of a handle or block to which filaments are affixed either parallel- or perpendicular-wise, depending on the way the brush is to be gripped during use. The material of both the block and bristles or filaments is chosen to withstand hazards of its application, such as corrosive chemicals, heat or abrasion.',
	serialNo: '123-456-789',
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