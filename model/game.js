'use strict';

const mongoose = require('mongoose');

const Game = mongoose.Schema({
  playerLoc: { type: String, required: true },
  monsterLoc: { type: String, required: true },
  fireballs: { type: Number, required: true },
  gameOver: { type: Boolean, required: true },
  map: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' }}, { timestamps: true });

module.exports = mongoose.model('game', Game);
