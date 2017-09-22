'use strict';

const Game = require('../model/game');
const errorHandler = require('../lib/error-handler');
const debug = require('debug')('monsterHunt:route-game');
const bearerAuth = require('../lib/bearer-auth-middleware');
const jsonParser = require('body-parser').json();
const storage = require('../lib/storage');

module.exports = function(router) {
  router.post('/api/game', bearerAuth, jsonParser, (req, res) => {
    debug('POST /api/game');

    let mapName = req.body.mapName;
    storage.fetchOne(`${mapName}`, mapName)
      .then(mapObj => {
        mapObj.userId = req.user._id;
        mapObj.map = JSON.stringify(mapObj.map);
        return new Game(mapObj).save();
      })
      .then(game => {
        let tempMap = JSON.parse(game.map);
        let tempMessage = tempMap[`${game.playerLoc}`]['message'];
        res.send(`New game started using ${mapName} file. \nYour game ID is ${game._id}. \n\n${tempMessage}`);
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
            game.playerLoc = mapTemp[`${currentLoc}`][`${direction}`];
            if (mapTemp[`${game.playerLoc}`].hasOwnProperty('fireballScrolls')) {
              game.fireballs += mapTemp[`${game.playerLoc}`]['fireballScrolls'];
              mapTemp[`${game.playerLoc}`]['fireballScrolls'] = 0;
              game.map = JSON.stringify(mapTemp);
            }
            game.save();
            roomMessage = mapTemp[`${game.playerLoc}`]['message'];
            res.send(roomMessage);
          } else if(game.playerLoc === game.monsterLoc) {
            errorHandler(new Error('You found the monster and he ate you! GAME OVER!'), req, res);
            game.gameOver = true;
            game.save();
          }
          else {
            roomMessage = mapTemp[`${game.playerLoc}`]['message'];
            errorHandler(new Error(`Cannot move in that direction. \n${roomMessage}`), req, res);
          }
        } else {
          errorHandler(new Error('GAME OVER!  To start a new game POST to api/game/'), req, res);
        }
      })
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
          if (game.fireballs >= 1) {
            if (mapTemp[`${currentLoc}`].hasOwnProperty(`${direction}`) && game.monsterLoc === mapTemp[`${currentLoc}`][`${direction}`]) {
              //game.fireballs--;
              game.gameOver = true;
              game.save();
              res.send('You killed the monster! YOU WIN!! GAME OVER!');
            } else if(mapTemp[`${currentLoc}`].hasOwnProperty(`${direction}`) && game.monsterLoc !== mapTemp[`${currentLoc}`][`${direction}`]) {
              //resource--
              game.fireballs--;
              game.save();
              res.send(`You missed the monster!  You have ${game.fireballs} fireballs remaining!`);
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
      .catch(err => errorHandler(err, req, res));
  });
};
