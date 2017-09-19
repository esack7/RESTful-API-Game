'use strict';

const Game = require('../model/game');
const errorHandler = require('../lib/error-handler');
const debug = require('debug')('monsterHunt:route-game');
const bearerAuth = require('../lib/bearer-auth-middleware');


// /move/north
// get the playerLoc
// see if they can move north
//   if they can, check to see if monster is north
// if they cannot, return error.



module.exports = function(router) {
  router.post('/api/game', bearerAuth, (req, res) => {
    debug('POST /api/game');

    // http POST (auth token) :5000/api/game name='my fancy game' desc='it be dabomb'

    req.body.userId = req.user._id;

    return new Game(req.body).save()
      .then(game => res.status(201).json(game))
      .catch(err => {
        // console.log(err);
        errorHandler(err, req, res);
      });
  });

  router.get('/api/game/:_id', bearerAuth, (req, res) => {
    debug('GET /api/game/:_id');

    return Game.findById(req.params._id)
      .then(game => res.json(game))
      .catch(err => errorHandler(err, req, res));
  });

  router.get('/api/game/', bearerAuth, (req, res) => {
    debug('GET /api/game/');

    return Game.find()
      .then(game => res.json(game.map(game => game._id)))
      .catch(err => errorHandler(err, req, res));
  });

  router.put('/api/game/:_id', bearerAuth, (req, res) => {
    debug('PUT /api/game/:_id');

    return Game.findByIdAndUpdate(req.params._id, req.body, { upsert:true, runValidators:true })
      .then(() => res.sendStatus(204))
      .catch(err => errorHandler(err, req, res));
  });

  router.delete('/api/game/:_id', bearerAuth, (req, res) => {
    debug('DELETE /api/game/:_id');

    return Game.findByIdAndRemove(req.params._id)
      .then(() => res.sendStatus(204))
      .catch(err => errorHandler(err, req, res));
  });
};
