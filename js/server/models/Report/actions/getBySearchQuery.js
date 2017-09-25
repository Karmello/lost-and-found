const cm = require(global.paths.server + '/cm');

module.exports = (...args) => {

  let action = new cm.prototypes.Action(args);
  let query = {};

  if (action.req.query.userId) { query.userId = action.req.query.userId; }
  if (action.req.query.title) { query.title = { '$regex': action.req.query.title, '$options': 'i' }; }
  if (action.req.query.filter && action.req.query.filter != 'all') { query['startEvent.type'] = action.req.query.filter; }

  for (let i = 1; i <= 3; i++) {
    let category = 'category' + i;
    if (action.req.query[category]) { query[category] = action.req.query[category]; }
  }

  let tasks = [];
  let limit = Number(action.req.query.limit) || cm.Report.config.get.max;

  tasks.push(cm.Report.count(query));
  tasks.push(cm.Report.find(query).skip(Number(action.req.query.skip)).limit(limit).sort(action.req.query.sort).exec());

  cm.libs.Promise.all(tasks).then((data) => {

    action.end(200, {
      meta: { count: data[0] },
      collection: data[1]
    });

  }, (err) => { action.end(400, err); });
};