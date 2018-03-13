/* eslint no-undef: 0 */

load('db/contactTypes.js');
load('db/deactivationReasons.js');

const contact_types = db.getCollection('contact_types');
contact_types.remove({});
contact_types.insert(contactTypes);

const deactivation_reasons = db.getCollection('deactivation_reasons');
deactivation_reasons.remove({});
deactivation_reasons.insert(deactivationReasons);