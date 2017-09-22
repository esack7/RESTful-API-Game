'use strict';

const mocks = require('../lib/mocks');
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
      test('not including mapFile, should return a status of 404', () => {
        return mocks.user.createOne()
          .then(userData => {
            return superagent.post(':4444/api/game')
              .type('application/json')
              .set('Authorization', `Bearer ${userData.token}`)
              // .send('{"mapName": "doesNotExist"}')
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
  describe('PUT to /api/game/:_id/move/:dir', () => {
    describe('valid requests', () => {
      beforeEach( () => {
        return mocks.user.createOne()
          .then((userData) => {
            this.userData = userData;
            return superagent.post(':4444/api/game')
              .type('application/json')
              .set('Authorization', `Bearer ${this.userData.token}`)
              .send('{"mapName": "map1"}')
              .then(res => this.res = res);
          });
      });
      test('Should return 200 response status', () => {
        let _id = this.res.text.split('.')[1].split(' ')[5];
        return superagent.put(`:4444/api/game/${_id}/move/north`)
          .set('Authorization', `Bearer ${this.userData.token}`)
          .then(res => {
            expect(res.status).toBe(200);
          });
      });
      test('Should give text response with room options', () => {
        let _id = this.res.text.split('.')[1].split(' ')[5];
        return superagent.put(`:4444/api/game/${_id}/move/north`)
          .set('Authorization', `Bearer ${this.userData.token}`)
          .then(res => {
            expect(res.text).toBe('You hear nothing. Your options are to move north or south.');
          });
      });
    });
    describe('invalid requests', () => {
      beforeEach( () => {
        return mocks.user.createOne()
          .then((userData) => {
            this.userData = userData;
            return superagent.post(':4444/api/game')
              .type('application/json')
              .set('Authorization', `Bearer ${this.userData.token}`)
              .send('{"mapName": "map1"}')
              .then(res => this.res = res);
          });
      });
      test('Requesting a map file that doesnt exist', () => {
        let _id = this.res.text.split('.')[1].split(' ')[5];
        return superagent.put(`:4444/api/game/${_id}/move/north`)
          .set('Authorization', `Bearer ${this.userData.token}`)
          .send('{"mapName": "map1"}')
          .catch(err => {
            expect(err.status).toBe(404);
          });
      });
      test('An unauthorized call should return status 401', () => {
        let _id = this.res.text.split('.')[1].split(' ')[5];
        return superagent.put(`:4444/api/game/${_id}/move/north`)
          .set('Authorization', `Bearer 99999999999999999`)
          .catch(err => {
            expect(err.status).toBe(401);
          });
      });
      test('A put without auth headers should return 401', () => {
        let _id = this.res.text.split('.')[1].split(' ')[5];
        return superagent.put(`:4444/api/game/${_id}/move/north`)
          .catch(err => {
            expect(err.status).toBe(401);
          });
      });
      test('Should return 406 for a direction that isn\'t available', () => {
        let _id = this.res.text.split('.')[1].split(' ')[5];
        return superagent.put(`:4444/api/game/${_id}/move/west`)
          .set('Authorization', `Bearer ${this.userData.token}`)
          .catch(err => {
            expect(err.status).toBe(406);
          });
      });
    });
  });
  describe('PUT to /api/game/:_id/attack/:dir', () => {
    describe('valid requests', () => {
      beforeEach( () => {
        return mocks.user.createOne()
          .then((userData) => {
            this.userData = userData;
            return superagent.post(':4444/api/game')
              .type('application/json')
              .set('Authorization', `Bearer ${this.userData.token}`)
              .send('{"mapName": "map1"}')
              .then(res => this.res = res);
          });
      });
      test('Should return 200 response status', () => {
        let _id = this.res.text.split('.')[1].split(' ')[5];
        return superagent.put(`:4444/api/game/${_id}/attack/north`)
          .set('Authorization', `Bearer ${this.userData.token}`)
          .then(res => {
            expect(res.status).toBe(200);
          });
      });
    });
    describe('invalid requests', () => {
      beforeEach( () => {
        return mocks.user.createOne()
          .then((userData) => {
            this.userData = userData;
            return superagent.post(':4444/api/game')
              .type('application/json')
              .set('Authorization', `Bearer ${this.userData.token}`)
              .send('{"mapName": "map1"}')
              .then(res => this.res = res);
          });
      });
      test('406 error?', () => {
        let _id = this.res.text.split('.')[1].split(' ')[5];
        return superagent.put(`:4444/api/game/${_id}/attack/west`)
          .set('Authorization', `Bearer ${this.userData.token}`)
          .catch((err) => {
            expect(err.status).toEqual(406);
          });
      });
    });
  });
});
