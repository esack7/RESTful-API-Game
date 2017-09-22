'use strict';

const debug = require('debug')('restfulgame:error-handler');

module.exports = function(err, req, res) {
  debug(`#error-handler: ${ err.message }`);

  let msg = err.message.toLowerCase();

  switch(true) {
  case msg.includes('authorization failed'): return res.status(401).send(`${ err.name }: ${ err.message }`);
  case msg.includes('validation failed'): return res.status(400).send(`${ err.name }: ${ err.message }`);
  case msg.includes('data and salt arguments required'): return res.status(400).send(`${ err.name }: You did not provide a password`);
  case msg.includes('file does not exist'): return res.status(404).send(`${ err.name }: ${ err.message }`);
  case msg.includes('that direction'): return res.status(406).send(`${ err.name }: ${ err.message }`);
  default: return res.status(500).send(`${ err.name }: ${ err.message }`);
  }
};
