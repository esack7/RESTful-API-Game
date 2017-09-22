// const faker = require('faker');
const mocks = require('../lib/mocks');
const superagent = require('superagent');
const server = require('../../lib/server');
require('jest');

describe('testing auth middeware', function() {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(mocks.user.removeAll);
  describe('creating user without password', () => {
    test('user sign up w/o password should return 401', () => {
      return superagent.post(':4444/api/signup')
        .type('application/json')
        .send('{"username": "Isaac","email": "isaac@isaac.net"}')
        .catch(err => {
          expect(err.status).toBe(400);
        });
    });
  });
  describe('signin without headers', () => {
    test('user signin w/o headers should return 401', () => {
      return superagent.get(':4444/api/signin')
        .catch(err => {
          expect(err.status).toBe(401);
        });
    });
  });
  describe('signin w/o basic auth', () => {
    test('user signin w/o headers should return 401', () => {
      return superagent.get(':4444/api/signin')
        .set('Authorization', '')
        .catch(err => {
          expect(err.status).toBe(401);
        });
    });
  });
});
