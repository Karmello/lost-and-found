
let tasks = {
  c: require(global.paths.root + '/js/setup/tasks/c'),
  d: require(global.paths.root + '/js/setup/tasks/d')
};

module.exports = (req, res) => {

  let NODE_ENV = process.env.NODE_ENV;
  process.env.NODE_ENV = 'setup';

  tasks[req.query.task](req, res, (status, body) => {
    process.env.NODE_ENV = NODE_ENV;
    res.status(status).send(body);
  });
};