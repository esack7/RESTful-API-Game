'use strict';

const Game = require('../model/game');
const errorHandler = require('../lib/error-handler');
const debug = require('debug')('monsterHunt:route-game');
const bearerAuth = require('../lib/bearer-auth-middleware');
const jsonParser = require('body-parser').json();
const storage = require('../lib/storage');

// /move/north
// get the playerLoc
// see if they can move north
//   if they can, check to see if monster is north
// if they cannot, return error.



module.exports = function(router) {
  router.post('/api/game', bearerAuth, jsonParser, (req, res) => {
    debug('POST /api/game');

    // http POST (auth token) :5000/api/game mapName='map1'

    let mapName = req.body.mapName;
    storage.fetchOne('map1', mapName)
      .then(mapObj => {
        mapObj.userId = req.user._id;
        console.log(mapObj.playerLoc)
        // new Game(mapObj).save();
      })
      .then(game => {
        res.send(`New game started using ${mapName} file. Your game ID is... ${game._id}`);
      })
      .catch(err => {
        errorHandler(err, req, res);
      });
  });

  router.put('/api/game/:_id/move/:dir', bearerAuth, (req, res) => {
    debug('PUT /api/game/:_id/move/:dir');

    let direction = req.params.dir;
    if (direction !== 'north' || direction !== 'south' || direction !== 'east' || direction !== 'west') {
      errorHandler(new Error('Move direction must be north, south, east, or west'), req, res);
    }
    return Game.findById(req.params._id, { upsert:true, runValidators:true })
      .then(game => {
        let currentLoc = game.playerLoc;
        if (game.map[`${currentLoc}`].hasOwnProperty(`${direction}`)) {
          game.playerLoc = game[`${direction}`];
          return game.save();
        } else {
          errorHandler(new Error('Cannot move that direction'), req, res);
        }
      })
      .then(() => res.sendStatus(204))
      .catch(err => errorHandler(err, req, res));
  });


  // router.get('/api/game/:_id', bearerAuth, (req, res) => {
  //   debug('GET /api/game/:_id');
  //
  //   return Game.findById(req.params._id)
  //     .then(game => res.json(game))
  //     .catch(err => errorHandler(err, req, res));
  // });
  //
  // router.get('/api/game/', bearerAuth, (req, res) => {
  //   debug('GET /api/game/');
  //
  //   return Game.find()
  //     .then(game => res.json(game.map(game => game._id)))
  //     .catch(err => errorHandler(err, req, res));
  // });
  //
  // router.delete('/api/game/:_id', bearerAuth, (req, res) => {
  //   debug('DELETE /api/game/:_id');
  //
  //   return Game.findByIdAndRemove(req.params._id)
  //     .then(() => res.sendStatus(204))
  //     .catch(err => errorHandler(err, req, res));
  // });
};
