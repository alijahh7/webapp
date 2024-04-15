require('dotenv').config();
const express=require("express");
const sequelize = require('./helpers/database');
const verifyController = require('./controllers/verifyController');
const userController = require('./controllers/userController');
const healthzController = require('./controllers/healthzController');

const {logger} = require('./logger/logger');
//empty
const app=express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.use('/v2/user/', userController);
app.use('/healthz/', healthzController);
app.use('/verify/', verifyController);

app.use((err, req, res, next) => {
    console.log("Body has a payload")
    return res.status(400).send();
    
}) //https://stackoverflow.com/questions/40142928/how-do-you-reject-an-invalid-json-body-using-express-or-body-parser

app.all('*', (req,res)=>{ //other methods
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate;');
  logger.log({
    level: 'warn',
    httpRequest: {
        httpMethod: `${req.method}`
    },
    message: "Method Not Found",
    label: "Invalid Method"
});
  res.status(404).json().send();
});

sequelize.sync()
  .then(() => {
    console.log('Sync success');
  })
  .catch((err) => {
    console.error('Error', err);
  });

module.exports = {app, sequelize};
