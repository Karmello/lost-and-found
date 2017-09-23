// Data

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
			en: 'Opinion',
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
			en: 'Cooperation offer',
			pl: 'Propozycja współpracy'
		}
	},
	{
		index: 5,
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
db.createCollection('deactivation_reasons');
db.createCollection('contact_types');

db.counters.insert({"_id": "id", "seq": 0 });
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