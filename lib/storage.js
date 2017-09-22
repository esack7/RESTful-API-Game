'use strict';

const debug = require('debug')('http:storage');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'), {suffix: 'Prom'});
// const errorHandler = require('../lib/error-handler');

const storage = module.exports = {};


storage.fetchOne = function(mapFile) {
  debug('#storage.fetchOne');
  return new Promise((resolve, reject) => {
    // if(!mapFile) return reject(new Error('Cannot get item; mapFile name required'));

    return fs.readFileProm(`${__dirname}/../data/maps/${mapFile}.json`)
      .then(buff => resolve(JSON.parse(buff.toString())))
      .catch(err => {
        return reject(new Error('This file does not exist'));
      });
  });
};
