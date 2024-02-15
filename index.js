require('dotenv').config();
const express=require("express");
const sequelize = require('./helpers/database');
const userController = require('./controllers/userController');
const healthzController = require('./controllers/healthzController');




const port = process.env.PORT || 8080;

const app=express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.use('/v1/user/', userController);
app.use('/healthz/', healthzController);

app.use((err, req, res, next) => {
    console.log("Body has a payload")
    return res.status(400).send();
    
}); //https://stackoverflow.com/questions/40142928/how-do-you-reject-an-invalid-json-body-using-express-or-body-parser

app.all('*', (req,res)=>{ //other methods
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate;');
  console.log("hi")
  res.status(404).json().send();
});

sequelize.sync()
  .then(() => {
    console.log('Sync success');
  })
  .catch((err) => {
    console.error('Error', err);
  });

app.listen(port,()=>{
    console.log(`Running on ${port}`);
});

module.exports = app;