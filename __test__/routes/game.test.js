'use strict';

const faker = require('faker');
const mocks = require('../lib/mocks');
const User = require('../../model/user');
const superagent = require('superagent');
const server = require('../../lib/server');
require('jest');

describe('testing game routes', function() {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(mocks.user.removeAll);

  describe('POST to api/game', function() {
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
});
