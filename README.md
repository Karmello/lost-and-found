## Technologies
* [AngularJs](https://angularjs.org) | [ui-router](https://github.com/angular-ui/ui-router) | [Restangular](https://github.com/mgonto/restangular)
* [Bootstrap 3](http://getbootstrap.com/docs/3.3) | [Sass](https://sass-lang.com)
* [Google Maps](https://developers.google.com/maps)
* [Gulp](https://gulpjs.com)
* [Karma](https://karma-runner.github.io)
* [NodeJs](https://nodejs.org) | [Express](https://expressjs.com)
* [MongoDB](https://www.mongodb.com) | [mongoose](http://mongoosejs.com)
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) | [bcrypt](https://www.npmjs.com/package/bcrypt-nodejs)
* [AWS SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/index.html)
## Local setup
* make sure you have `Node.js` and `MongoDB` installed on your system
* `git clone` repo and `npm install` from root
* create `mongod` instance
* `mongo localhost:27017/laf-dev < db/recreate.js` to create and populate db with static data
* `nodemon ./server/server.js --watch ./server` to start backend server
* `gulp compile` to compile and open app ui
* `node mockup/setup/run.js -[c|d] -[User|Report|Comment]` to create or delete fake db data for a given model
## [ConEmu](https://conemu.github.io)
* `run recreate-db` from root to create and populate db with static data
* `run app` to start up the project
* `run setup -[c|d] -[User|Report|Comment]` to create or delete fake db data for a given model
* see `run.cmd` file
## Other links
* [Videos](https://tinyurl.com/y8br2p60)
