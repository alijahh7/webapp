const express = require('express');
const sequelize = require('../helpers/database');
const router = express.Router();


router.get('/', async (req,res)=>{
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    try {
        await sequelize.authenticate();
        if(!req.is()&&JSON.stringify(req.body) === '{}'){
            req.body=null;
            console.log("ConsoleLog: Empty Body");
        }
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

router.all('/healthz', (req,res)=>{ //other methods
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate;');
    res.status(405).json().send();
});

module.exports = router;