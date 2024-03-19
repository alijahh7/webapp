const express = require('express');
const sequelize = require('../helpers/database');
const router = express.Router();
const {logger} = require('../logger/logger');

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
            logger.log({
                level: 'warn',
                httpRequest: {
                    httpMethod: "GET"
                },
                message: "Payload exists in request at /healthz",
                label: "Status"
            });
            res.status(400).end();
            
        }
        else{   //no payload
            logger.log({
                level: 'info',
                httpRequest: {
                    httpMethod: "GET"
                },
                message: "Service Available at /healthz",
                label: "Status"
            });
            res.status(200).json().send();
        console.log("Success - no payload");
        }
        
  
      } catch (error) {
        logger.log({
            level: 'error',
            httpRequest: {
                httpMethod: "GET"
            },
            message: "Service Unavailable at /healthz",
            label: "Status"
        });
        res.status(503).json().send();  
        console.error("Failed:", error);
      }
});

router.all('/', (req,res)=>{ //other methods
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate;');
    logger.log({
        level: 'info',
        httpRequest: {
            httpMethod: `${req.method}`
        },
        message: "Method Unvailable at /healthz",
        label: "Status"
    });
    res.status(405).json().send();
});

module.exports = router;