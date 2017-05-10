// Data

var item_categories = [
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
			en: 'An opinion',
			pl: 'Opinia'
		}
	},
	{
		index: 1,
		label: {
			en: 'Improvement suggestion',
			pl: 'Propozycja ulepszenia'
		}
	},
	{
		index: 2,
		label: {
			en: 'Bug',
			pl: 'Błąd'
		}
	},
	{
		index: 3,
		label: {
			en: 'Other',
			pl: 'Inny'
		}
	}
];



// Collections

use laf-dev

db.dropDatabase();
db.createCollection('counters');
//db.item_categories.drop();
db.createCollection('item_categories');
db.createCollection('deactivation_reasons');
db.createCollection('contact_types');

db.counters.insert({"_id": "auctionId", "seq": 0 });
for (var i = 0; i < item_categories.length; ++i) { db.item_categories.insert(item_categories[i]); }
for (var i = 0; i < deactivation_reasons.length; ++i) { db.deactivation_reasons.insert(deactivation_reasons[i]); }
for (var i = 0; i < contact_types.length; ++i) { db.contact_types.insert(contact_types[i]); }



// Users

use admin
db.dropUser('Karmello');

db.createUser(
  {
    user: "Karmello",
    pwd: "wantpeanutbutter",
    roles: [{ role: "root", db: "admin" }]
  }
);

use laf-dev
db.dropUser('Karmello');

db.createUser(
  {
    user: "Karmello",
    pwd: "wantpeanutbutter",
    roles: [{ role: "readWrite", db: "laf-dev" }]
  }
);

use laf-test
db.dropUser('Karmello');

db.createUser(
  {
    user: "Karmello",
    pwd: "wantpeanutbutter",
    roles: [{ role: "readWrite", db: "laf-test" }]
  }
);