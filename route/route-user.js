'use strict';

const jsonParser = require('body-parser').json();
const debug = require('debug')('restfulgame:route-user');
const errorHandler = require('../lib/error-handler');
const basicAuth = require('../lib/basic-auth-middleware');
const User = require('../model/user');

module.exports = function(router) {
  router.post('/api/signup', jsonParser, (req, res) => {
    debug('POST /api/signup');

    let pw = req.body.password;
    delete req.body.password;
    let user = new User(req.body);
    user.generatePasswordHash(pw)
      .then(user => user.save())
      .then(user => user.generateToken())
      .then(token => res.status(201).send(token))
      .catch(err => errorHandler(err, req, res));
  });

  router.get('/api/signin', basicAuth, (req, res) => {
    debug('GET /api/signin');
    
    return User.findOne({ username: req.user.username })
      .then(user => user.comparePasswordHash(req.user.password))
      .then(user => user.generateToken())
      .then(token => res.send(token))
      .catch(err => errorHandler(err, req, res));
  });
};
