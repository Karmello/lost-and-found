const places = require(global.paths.root + '/state/hardcoded/places');
const other = require(global.paths.root + '/state/hardcoded/other');

module.exports = {
	category1: 'personal_items',
	title: 'A million dollars in cash',
	description: 'Dollar (often represented by the dollar sign $) is the name of more than twenty currencies, including (ordered by population) those of the United States, Canada, Australia, Taiwan, Hong Kong, Singapore, New Zealand, Liberia, Jamaica and Namibia. The U.S. dollar is the official currency of East Timor, Ecuador, El Salvador, Federated States of Micronesia, Marshall Islands, Palau, the Caribbean Netherlands, U.S. territories such as Puerto Rico, American Samoa and the United States Virgin Islands and for banknotes, Panama. Generally, one dollar is divided into one hundred cents.',
	serialNo: undefined,
	startEvent: {
		type: 'found',
		date: '2017-07-15T17:06:53.784Z',
		details: other.startEvent.details,
		address: places[0].address,
		placeId: places[0].placeId,
		lat: places[0].lat,
		lng: places[0].lng
	}
};