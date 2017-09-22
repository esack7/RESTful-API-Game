'use strict';

const User = require('../../model/user');
const faker = require('faker');

const mocks = module.exports = {};
mocks.user = {};

mocks.user.createOne = function() {
  this.result = {};
  this.result.password = faker.internet.password();

  let user = new User({
    username: faker.internet.userName(),
    email: faker.internet.email(),
  });

  return user.generatePasswordHash(this.result.password)
    .then(user => {
      this.result.user = user;
      return user.save();
    })
    .then(user => user.generateToken())
    .then(token => {
      this.result.token = token;
      return this.result;
    });
};

mocks.user.removeAll = function() {
  return Promise.all([
    User.remove(),
  ]);
};
