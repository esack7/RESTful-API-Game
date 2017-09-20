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
        mapObj.map = JSON.stringify(mapObj.map);
        //console.log('CONSOLE-LOG: ', mapObj);
        return new Game(mapObj).save();
      })
      .then(game => {
        // console.log('CONSOLE-LOG: ', game);
        res.send(`New game started using ${mapName} file. Your game ID is... ${game._id}`);
      })
      .catch(err => {
        errorHandler(err, req, res);
      });
  });

  router.put('/api/game/:_id/move/:dir', bearerAuth, (req, res) => {
    debug('PUT /api/game/:_id/move/:dir');

    let direction = req.params.dir;

    return Game.findById(req.params._id)
      .then(game => {
        let mapTemp = JSON.parse(game.map);
        let currentLoc = game.playerLoc;
        let roomMessage;

        if (game.gameOver === false) {
          if (mapTemp[`${currentLoc}`].hasOwnProperty(`${direction}`)) {
            // console.log(mapTemp[`${currentLoc}`][`${direction}`])
            console.log('unmoved', game.playerLoc);
            game.playerLoc = mapTemp[`${currentLoc}`][`${direction}`];
            console.log('moved', game.playerLoc);
            game.save();
            roomMessage = mapTemp[`${game.playerLoc}`]['message'];
            res.send(roomMessage);
          } else if(game.playerLoc === game.monsterLoc) {
            errorHandler(new Error('You found the monster and he ate you! GAME OVER!'), req, res);
            game.gameOver = true;
            game.save();
          }
          else {
            errorHandler(new Error(`Cannot move in that direction. ${roomMessage}`), req, res);
          }
        } else {
          errorHandler(new Error('GAME OVER!  To start a new game POST to api/game/'), req, res);
        }
      })
      // .then(() => res.send(`'you moved good work'`))
      // .then(() => res.sendStatus(204))
      .catch(err => errorHandler(err, req, res));
  });

  router.put('/api/game/:_id/attack/:dir', bearerAuth, (req, res) => {
    debug('PUT /api/game/:_id/attack/:dir');

    let direction = req.params.dir;

    return Game.findById(req.params._id)
      .then(game => {
        let mapTemp = JSON.parse(game.map);
        let currentLoc = game.playerLoc;

        if (game.gameOver === false) {
          if (game.fireballs > 1) {
            console.log('number of fireballs', game.fireballs);
            if (mapTemp[`${currentLoc}`].hasOwnProperty(`${direction}`) && game.monsterLoc === mapTemp[`${currentLoc}`][`${direction}`]) {
              console.log('the room you are in', game.playerLoc);
              console.log('the room you are attacking', mapTemp[`${currentLoc}`][`${direction}`]);
              //game.fireballs--;
              game.gameOver = true;
              game.save();
              res.send('You killed the monster! YOU WIN!! GAME OVER!');
            } else if(mapTemp[`${currentLoc}`].hasOwnProperty(`${direction}`) && game.monsterLoc !== mapTemp[`${currentLoc}`][`${direction}`]) {
              //resource--
              console.log('the room you are in', game.playerLoc);
              console.log('the room you are attacking', mapTemp[`${currentLoc}`][`${direction}`]);
              game.fireballs--;
              game.save();
              console.log('number of fireballs after attack', game.fireballs);
              errorHandler(new Error(`You missed the monster!  You have ${game.fireballs} fireballs remaining!`), req, res);
            }
            else {
              errorHandler(new Error(`Cannot attack in that direction.`), req, res);
            }
          } else {
            errorHandler(new Error(`You are out of fireballs and cannot attack!  GAME OVER!`), req, res);
            game.gameOver = true;
            game.save();
          }
        } else {
          errorHandler(new Error('GAME OVER!  To start a new game POST to api/game/'), req, res);
        }
      })
      // .then(() => res.send(`'you moved good work'`))
      // .then(() => res.sendStatus(204))
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
