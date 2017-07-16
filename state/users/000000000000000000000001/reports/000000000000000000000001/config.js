const places = require(global.paths.root + '/state/hardcoded/places');
const other = require(global.paths.root + '/state/hardcoded/other');

module.exports = {
	category1: 'electronics',
	title: 'Windows 7 original dvd rom',
	description: 'Windows 7 (codenamed Vienna, formerly Blackcomb) is a personal computer operating system developed by Microsoft. It is a part of the Windows NT family of operating systems. Windows 7 was released to manufacturing on July 22, 2009, and became generally available on October 22, 2009, less than three years after the release of its predecessor, Windows Vista. Windows 7\'s server counterpart, Windows Server 2008 R2, was released at the same time.',
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