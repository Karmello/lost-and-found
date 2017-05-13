// Data

var report_categories = [
	{
		_id: 'electronics',
		label: {
			en: 'Electronics',
			pl: 'Elektronika'
		},
		subcategories: [
			{
				_id: 'smartphone',
				label: {
					en: 'Smartphone',
					pl: 'Smartfon'
				}
			},
			{
				_id: 'laptop',
				label: {
					en: 'Laptop',
					pl: 'Laptop'
				}
			}
		]
	},
	{
		_id: 'jewelry',
		label: {
			en: 'Jewelry',
			pl: 'Biżuteria'
		},
		subcategories: [
			{
				_id: 'watch',
				label: {
					en: 'Watch',
					pl: 'Zegarek'
				}
			},
			{
				_id: 'bracelet',
				label: {
					en: 'Bracelet',
					pl: 'Bransoletka'
				}
			},
			{
				_id: 'necklace',
				label: {
					en: 'Necklace',
					pl: 'Naszyjnik'
				}
			}
		]
	},
	{
		_id: 'clothing',
		label: {
			en: 'Clothing',
			pl: 'Odzież'
		},
		subcategories: [
			{
				_id: 'shoes',
				label: {
					en: 'Shoes',
					pl: 'Buty'
				}
			}
		]
	},
	{
		_id: 'individual',
		label: {
			en: 'Individual',
			pl: 'Osobnik'
		},
		subcategories: [
			{
				_id: 'human',
				label: {
					en: 'Human',
					pl: 'Człowiek'
				}
			},
			{
				_id: 'animal',
				label: {
					en: 'Animal',
					pl: 'Zwierzę'
				}
			}
		]
	}
];

var deactivation_reasons = [
	{
		index: 0,
		label: {
			en: 'Don\'t need your services anymore',
			pl: 'Nie potrzebuję korzystać z serwisu'
		}
	},
	{
		index: 1,
		label: {
			en: 'I\'m switching to different app',
			pl: 'Rezygnuję na rzecz innej apki'
		}
	},
	{
		index: 2,
		label: {
			en: 'Poor performance',
			pl: 'Aplikacja jest mało wydajna'
		}
	},
	{
		index: 3,
		label: {
			en: 'Other reason',
			pl: 'Inny powód'
		}
	}
];

var contact_types = [
	{
		index: 0,
		label: {
			en: 'Question',
			pl: 'Pytanie'
		}
	},
	{
		index: 1,
		label: {
			en: 'An opinion',
			pl: 'Opinia'
		}
	},
	{
		index: 2,
		label: {
			en: 'Improvement suggestion',
			pl: 'Propozycja ulepszenia'
		}
	},
	{
		index: 3,
		label: {
			en: 'Bug',
			pl: 'Błąd'
		}
	},
	{
		index: 4,
		label: {
			en: 'Other',
			pl: 'Inny'
		}
	}
];



// Collections

use laf-dev

//db.dropDatabase();
//db.createCollection('counters');
//db.createCollection('report_categories');
//db.createCollection('deactivation_reasons');
db.contact_types.drop();
db.createCollection('contact_types');

//db.counters.insert({"_id": "id", "seq": 0 });
//for (var i = 0; i < report_categories.length; ++i) { db.report_categories.insert(report_categories[i]); }
//for (var i = 0; i < deactivation_reasons.length; ++i) { db.deactivation_reasons.insert(deactivation_reasons[i]); }
for (var i = 0; i < contact_types.length; ++i) { db.contact_types.insert(contact_types[i]); }



// Users

// use admin
// db.dropUser('Karmello');

// db.createUser(
//   {
//     user: "Karmello",
//     pwd: "wantpeanutbutter",
//     roles: [{ role: "root", db: "admin" }]
//   }
// );

// use laf-dev
// db.dropUser('Karmello');

// db.createUser(
//   {
//     user: "Karmello",
//     pwd: "wantpeanutbutter",
//     roles: [{ role: "readWrite", db: "laf-dev" }]
//   }
// );

// use laf-test
// db.dropUser('Karmello');

// db.createUser(
//   {
//     user: "Karmello",
//     pwd: "wantpeanutbutter",
//     roles: [{ role: "readWrite", db: "laf-test" }]
//   }
// );