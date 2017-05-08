var item_categories = [
	{
		_id: 'electronics',
		label: {
			en: 'Electronics',
			pl: 'Elektronika'
		},
		subcategories: [
			{
				_id: 'smartphones',
				label: {
					en: 'Smartphones',
					pl: 'Smartfony'
				}
			},
			{
				_id: 'laptops',
				label: {
					en: 'Laptops',
					pl: 'Laptopy'
				}
			},
			{
				_id: 'pcs',
				label: {
					en: 'Pcs',
					pl: 'Pecety'
				}
			},
			{
				_id: 'tv',
				label: {
					en: 'Tv',
					pl: 'Tv'
				}
			},
			{
				_id: 'screens',
				label: {
					en: 'Screens',
					pl: 'Ekrany'
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
				_id: 'watches',
				label: {
					en: 'Watches',
					pl: 'Zegarki'
				}
			},
			{
				_id: 'bracelets',
				label: {
					en: 'Bracelets',
					pl: 'Bransoletki'
				}
			},
			{
				_id: 'earrings',
				label: {
					en: 'Earrings',
					pl: 'Kolczyki'
				}
			},
			{
				_id: 'necklaces',
				label: {
					en: 'Necklaces',
					pl: 'Naszyjniki'
				}
			},
			{
				_id: 'rings',
				label: {
					en: 'Rings',
					pl: 'Pierścienie'
				}
			}
		]
	},
	{
		_id: 'furniture',
		label: {
			en: 'Furniture',
			pl: 'Meble'
		},
		subcategories: [
			{
				_id: 'beds',
				label: {
					en: 'Beds',
					pl: 'Łóżka'
				}
			}
		]
	},
	{
		_id: 'real_estate',
		label: {
			en: 'Real estate',
			pl: 'Nieruchomość'
		},
		subcategories: [
			{
				_id: 'houses',
				label: {
					en: 'Houses',
					pl: 'Domy'
				}
			},
			{
				_id: 'apartments',
				label: {
					en: 'Apartments',
					pl: 'Mieszkania'
				}
			},
			{
				_id: 'land',
				label: {
					en: 'Land',
					pl: 'Grunt'
				}
			}
		]
	},
	{
		_id: 'art',
		label: {
			en: 'Art',
			pl: 'Sztuka'
		},
		subcategories: [
			{
				_id: 'painting',
				label: {
					en: 'Painting',
					pl: 'Malarstwo'
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
				_id: 'tshirts',
				label: {
					en: 'T-shirts',
					pl: 'Podkoszulki'
				}
			},
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
		_id: 'movies',
		label: {
			en: 'Movies',
			pl: 'Filmy'
		},
		subcategories: [
			{
				_id: 'dvd',
				label: {
					en: 'Dvd',
					pl: 'Dvd'
				}
			},
			{
				_id: 'blue-ray',
				label: {
					en: 'Blue-ray',
					pl: 'Blue-ray'
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

var report_types = [
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



use laf-dev

db.dropDatabase();
db.createCollection('counters');
db.createCollection('item_categories');
db.createCollection('deactivation_reasons');
db.createCollection('report_types');

db.counters.insert({"_id": "auctionId", "seq": 0 });
for (var i = 0; i < item_categories.length; ++i) { db.item_categories.insert(item_categories[i]); }
for (var i = 0; i < deactivation_reasons.length; ++i) { db.deactivation_reasons.insert(deactivation_reasons[i]); }
for (var i = 0; i < report_types.length; ++i) { db.report_types.insert(report_types[i]); }



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