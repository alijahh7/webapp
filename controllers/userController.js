const bcrypt = require('bcrypt');
const sequelize = require('../helpers/database');
const User = require('../models/UserModel');
const bAuth = require('basic-auth'); //https://github.com/jshttp/basic-auth#readme
const authenticateUser = require('../middleware/auth');
const express = require('express');
const passwordHasher = require('../helpers/passwordHashing');
const {validateName}=require('../helpers/validators');
const {logger} = require('../logger/logger');
const { publishToPubSub } = require('../pubsub');



const router = express.Router();


router.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    next();
  });

//CREATE A USER - public route
router.post('/', async (req,res)=>{
   
    try{
        const {first_name, last_name, username, password } = req.body;

        const existingUser = await User.findOne({
            where: {
              username: username,
            },
          });
          
        if(existingUser){
            console.log(username);
            console.log("User already exists");
            logger.log({
                level: 'error',
                httpRequest: {
                    httpMethod: `${req.method}`
                },
                message: "User Already Exists",
                label: "User Create"
            });
            return res.status(400).json().end();  
        }

        const hashedPwd = await passwordHasher(password);
        //console.log("validator:",validateName(req.body.first_name))
        if(!validateName(req.body.first_name)||!validateName(req.body.last_name)){
            console.log("invalid name");
            logger.log({
                level: 'error',
                httpRequest: {
                    httpMethod: `${req.method}`
                },
                message: "User Creation Failed - Invalid Name",
                label: "User Create"
            });
            return res.status(400).send("Enter a valid first name and last name");
        }
       else{
            const newUser = new User({first_name,last_name,username, password:hashedPwd});
            await newUser.save();
            responseBody = {
            id:newUser.id,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            username: newUser.username,
            account_created: newUser.account_created,
            account_updated: newUser.account_updated
            }
        console.log("User created!");
        logger.log({
            level: 'info',
            httpRequest: {
                httpMethod: `${req.method}`
            },
            message: `New User Created: ${username} `,
            label: "User Create"
        });
        if(environment!='test'){
        console.log("publishing");    
        publishToPubSub(JSON.stringify(responseBody)); 
        }
        else{
            console.log("NOT PUBLISHING MESSAGE")
        }
        res.status(201);
        res.send(responseBody);
        }
        
    }
    catch(error){
        console.log("POST failed", error);
        logger.log({
            level: 'error',
            httpRequest: {
                httpMethod: `${req.method}`
            },
            message: "POST Failed",
            label: "User Create"
        });
        res.status(400).send();
    }
});

//GET USER INFO - authenticated route// 

//authenticate user here
router.get('/self', async (req,res)=>{
   
    var usernameIfExists=null;
    try{
        usernameIfExists=await authenticateUser(req,res);
        // console.log("debug",usernameIfExists)
        if(Object.keys(req.body).length>0){
        console.log("Non empty Body");
        res.status(400).end();
        logger.log({
            level: 'error',
            httpRequest: {
                httpMethod: `${req.method}`
            },
            message: "Request Has a Body",
            label: "User Read"
        });
        }
        if(usernameIfExists){
            console.log("User has been authenticated")
            const currentUser = await User.findOne(
                {
                    where: {username:usernameIfExists}
                }); 
            console.log("CURRENT verif",currentUser.verificationStatus);    
            if(!currentUser.verificationStatus) {
                logger.log({
                    level: 'warn',
                    httpRequest: {
                        httpMethod: `${req.method}`
                    },
                    message: `Unverified User `,
                    label: "User Read"
                });
                return res.status(403).send("Please verify your email before using the application!");
            }   
            console.log("GET IS HERE!")
            const responseBody = {
                id:currentUser.id,
                first_name: currentUser.first_name,
                last_name: currentUser.last_name,
                username: currentUser.username,
                account_created: currentUser.account_created,
                account_updated: currentUser.account_updated
            }
            //console.log("From authUser if ",currentUser)
            res.status(200);
            logger.log({
                level: 'info',
                httpRequest: {
                    httpMethod: `${req.method}`
                },
                message: "User Information Retrieved",
                label: "User Read"
            });
            res.send(responseBody);
            
        }
        else{
            res.status(401).end();
            logger.log({
                level: 'error',
                httpRequest: {
                    httpMethod: `${req.method}`
                },
                message: "Unauthorized User",
                label: "User Read"
            });
        }
    }
    catch{
        res.status(400).end();
        logger.log({
            level: 'error',
            httpRequest: {
                httpMethod: `${req.method}`
            },
            message: "GET Failed",
            label: "User Read"
        });
    }
});

//EDIT USER
router.put('/self', async (req,res)=>{
   
    try{
        var usernameIfExists=await authenticateUser(req,res);
        var validRequest;
        const allowedFields = ['first_name', 'last_name', 'password'];
            //checking for unallowed fields:
            if(!usernameIfExists){
                console.log("Unauthorized User");
                logger.log({
                    level: 'error',
                    httpRequest: {
                        httpMethod: `${req.method}`
                    },
                    message: "Unauthorized User",
                    label: "User Update"
                });
                res.status(401).end();
            }
            else if(usernameIfExists){
                const currentUser = await User.findOne(
                    {
                        where: {username:usernameIfExists}
                    }); 
                if(!currentUser.verificationStatus) {
                    logger.log({
                        level: 'warn',
                        httpRequest: {
                            httpMethod: `${req.method}`
                        },
                        message: `Unverified User`,
                        label: "User Update"
                    });
                    return res.status(403).send("Please verify your email before using the application!");
                }   
            }
            if(Object.keys(req.body).length===0){
                console.log("Empty Body");
                logger.log({
                    level: 'error',
                    httpRequest: {
                        httpMethod: `${req.method}`
                    },
                    message: "No Body",
                    label: "User Update"
                });
                res.status(400).end();
            }
            Object.keys(req.body).forEach(key => {
                if(!allowedFields.includes(key)){
                    console.log("Unallowed fields included in body!")
                    validRequest=false;
                    res.status(400).end();
                    logger.log({
                        level: 'error',
                        httpRequest: {
                            httpMethod: `${req.method}`
                        },
                        message: "Trying to Update Unallowed Fields",
                        label: "User Update"
                    });
                }
                else{
                    console.log("All fields are valid! Ready to proceed further!")
                    validRequest=true;
                }
            })
        if(usernameIfExists&&validRequest){
            console.log(Object.keys(req.body).length)
            console.log("Valid Request + Username exists")
           
            const currentUser = await User.findOne(
                {
                    where: {username:usernameIfExists}
                }); 



            const { first_name, last_name, password } = req.body;

            const hashedPwd = password ? await passwordHasher(password) : undefined;
            if((first_name&&!validateName(req.body.first_name))||(last_name&&!validateName(req.body.last_name))){
                console.log("invalid name");
                return res.status(400).send("Enter a valid first name and last name");
            }   

            const updatedFields = {
                first_name: first_name?? currentUser.first_name,
                last_name: last_name ??currentUser.last_name,
                password : hashedPwd ?? currentUser.password,
                account_updated: sequelize.literal('CURRENT_TIMESTAMP')
            }
            await User.update(updatedFields, {
                where: { id: currentUser.id },
              });
            console.log("Account created field:",currentUser.account_created)
            console.log("Account updated field:",currentUser.account_updated)
            logger.log({
                level: 'info',
                httpRequest: {
                    httpMethod: `${req.method}`
                },
                message: "User Updated",
                label: "User Update"
            });
            res.status(204);
            //res.send();
           res.send();
            
        }
        
    }
    catch(error){
        console.log(error);
        res.status(400).end();
    }
});

module.exports = router;