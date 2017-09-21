'use strict';

const faker = require('faker');
const mocks = require('../lib/mocks');
const User = require('../../model/user');
const superagent = require('superagent');
const server = require('../../lib/server');
require('jest');

describe('testing game routes', function() {
  // beforeAll(server.stop);
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(mocks.user.removeAll);
  describe('POST to api/game', () => {
    describe('valid request', () => {
      beforeAll( () => {
        return mocks.user.createOne()
          .then(userData => {
            return superagent.post(':4444/api/game')
              .type('application/json')
              .set('Authorization', `Bearer ${userData.token}`)
              .send('{"mapName": "map1"}')
              .then(res => this.res = res);
          });
      });
      test('should return a status of 200', () => {
        expect(this.res.status).toBe(200);
      });
      test('text response should contain the file name', () => {
        let txt = this.res.text.split('.');
        let file = JSON.parse(this.res.request._data);
        expect(txt[0]).toBe(`New game started using ${file.mapName} file`);
      });
    });
    describe('invalid POST to api/game', () => {
      test('should return a status of 404', () => {
        return mocks.user.createOne()
          .then(userData => {
            return superagent.post(':4444/api/game')
              .type('application/json')
              .set('Authorization', `Bearer ${userData.token}`)
              .send('{"mapName": "doesNotExist"}')
              .catch(err => {
                expect(err.status).toBe(404);
              });
          });
      });
      test('should return an Error message', () => {
        return mocks.user.createOne()
          .then(userData => {
            return superagent.post(':4444/api/game')
              .type('application/json')
              .set('Authorization', `Bearer ${userData.token}`)
              .send('{"mapName": "doesNotExist"}')
              .catch(err => {
                // console.log(err.response.text);
                expect(err.response.text).toBe('Error: This file does not exist');
              });
          });
      });
    });
  });
  // describe('PUT to /api/game/:_id/move/:dir', () => {
  //   describe('valid requests', () => {
  //     // beforeAll( () => {
  //     //   return mocks.user.createOne()
  //     //     .then(userData => {
  //     //       return superagent.post(':4444/api/game')
  //     //         .type('application/json')
  //     //         .set('Authorization', `Bearer ${userData.token}`)
  //     //         .send('{"mapName": "map1"}')
  //     //         .then(res => this.res = res);
  //     //     });
  //     // });
  //     // test('', () => {
  //     //   console.log(res);
  //     //
  //     // });
  //   });
  //   describe('invalid requests', () => {
  //
  //   });
  // });
  // describe('PUT to /api/game/:_id/attack/:dir', () => {
  //   describe('valid requests', () => {
  //
  //   });
  //   describe('invalid requests', () => {
  //
  //   });
  // });
});
