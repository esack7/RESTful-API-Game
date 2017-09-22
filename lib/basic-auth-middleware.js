'use strict';

const debug = require('debug')('restfulgame:basic-auth-middlware');
const errorHandler = require('./error-handler');

module.exports = function(req, res, next) {
  debug('basic auth');

  let authHeaders = req.headers.authorization;
  if(!authHeaders) return errorHandler(new Error('authorization failed, auth headers required'), req, res);

  let base64Str = authHeaders.split('Basic ')[1];
  if(!base64Str) return errorHandler(new Error('authorization failed, username:password required'), req, res);

  let [username, password] = Buffer.from(base64Str, 'base64').toString().split(':');

  req.user = { username, password };

  if(!req.user.username) return errorHandler(new Error('authorization failed, username required'), req, res);
  if(!req.user.password) return errorHandler(new Error('authorization failed, password required'), req, res);

  next();
};
