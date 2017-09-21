'use strict';
const debug = require('debug')('restfulgame:index');

require('dotenv').config();
require('./lib/server').start();
