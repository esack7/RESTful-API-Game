'use strict';

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');


const User = mongoose.Schema({
  username: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  email: { type: String, require: true },
  findHash: { type: String, unique: true },
});

User.methods.generatePasswordHash = function(password) {

  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if(err) return reject(err);
      this.password = hash;
      resolve(this);
    });
  });
};

User.methods.comparePasswordHash = function(password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, valid) => {
      if(err) return reject(err);
      if(!valid) return reject(new Error('authorization failed, password did not match'));
      resolve(this);
    });
  });
};

User.methods.generateFindHash = function() {
  return new Promise((resolve, reject) => {
    let _generateFindHash = () => {
      this.findHash = crypto.randomBytes(32).toString('hex');
      this.save()
        .then(() => resolve(this.findHash))
        .catch(err => reject(err));
    };

    _generateFindHash();
  });
};

User.methods.generateToken = function() {
  return new Promise((resolve, reject) => {
    this.generateFindHash()
      .then(findhash => resolve(jwt.sign({ token: findhash }, process.env.APP_SECRET)))
      .catch(err => reject(err));
  });
};

module.exports = mongoose.model('user', User);
