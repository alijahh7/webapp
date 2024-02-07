require('dotenv').config();
const express=require("express");
const sequelize = require('./helpers/database');
const userController = require('./controllers/userController');




const port = process.env.PORT || 8080;

const app=express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.use('/v1/user/', userController);

app.use((err, req, res, next) => {
    console.log("Body has a payload")
    return res.status(400).send();
    
}); //https://stackoverflow.com/questions/40142928/how-do-you-reject-an-invalid-json-body-using-express-or-body-parser

app.use((req,res,next)=>{
    if(!req.is()&&JSON.stringify(req.body) === '{}'){
        req.body=null;
        console.log("ConsoleLog: Empty Body");
    }
    next();
})


app.get('/healthz', async (req,res)=>{
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    try {
        await sequelize.authenticate();
     
        if(req.body||Object.keys(req.query).length > 0){  //true if it exists OR has query params
            console.log("BAD REQUEST: payload exists");
            res.status(400).end();
            
        }
        else{   //no payload
            res.status(200).json().send();
        console.log("Success - no payload");
        }
        
  
      } catch (error) {
        res.status(503).json().send();  
        console.error("Failed:", error);
      }
});


//Assignment 2:
//add auth route 1 - get
//add auth route 2 - put

//*********************/
app.all('/healthz', (req,res)=>{ //other methods
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate;');
    res.status(405).json().send();
});

app.all('*', (req,res)=>{ //other methods
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate;');
  res.status(404).json().send();
});
//Sequelize sync:

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

