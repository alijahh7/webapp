const bcrypt = require('bcrypt');
const sequelize = require('../helpers/database');
const User = require('../models/UserModel');
const bAuth = require('basic-auth'); //https://github.com/jshttp/basic-auth#readme
const authenticateUser = require('../middleware/auth');
const express = require('express');
const passwordHasher = require('../helpers/passwordHashing');
const {validateName}=require('../helpers/validators');



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
            return res.status(400).json().end();  
        }

        const hashedPwd = await passwordHasher(password);
        //console.log("validator:",validateName(req.body.first_name))
        if(!validateName(req.body.first_name)||!validateName(req.body.last_name)){
            console.log("invalid name");
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
        res.status(201);
        res.send(responseBody);
        }
        
    }
    catch(error){
        console.log("POST failed", error);
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
        }
        if(usernameIfExists){
            console.log("User has been authenticated")
            const currentUser = await User.findOne(
                {
                    where: {username:usernameIfExists}
                }); 
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
            res.send(responseBody);
            
        }
        else{
            res.status(401).end();
        }
    }
    catch{
        res.status(400).end();
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
                res.status(401).end();
            }
            else if(Object.keys(req.body).length===0){
                console.log("Empty Body");
                res.status(400).end();
            }
            Object.keys(req.body).forEach(key => {
                if(!allowedFields.includes(key)){
                    console.log("Unallowed fields included in body!")
                    validRequest=false;
                    res.status(400).end();
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