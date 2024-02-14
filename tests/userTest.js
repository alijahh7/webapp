const req = require('supertest');
const app = require('../index');
const { sequelize } = require('../helpers/database');

beforeAll(async () =>{
    sequelize.sync()
  .then(() => {
    console.log('Sync success');
  })
  .catch((err) => {
    console.error('Error', err);
  });
})