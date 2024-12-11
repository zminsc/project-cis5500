const { expect } = require('@jest/globals');
const supertest = require('supertest');
const app = require('../server');

test('GET /', async () => {
  await supertest(app).get('/')
    .expect(200)
    .then((res) => {
      expect(res.text).toEqual("Hello, world!");
    });
});