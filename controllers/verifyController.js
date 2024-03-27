const express = require('express');
const sequelize = require('../helpers/database');
const router = express.Router();
const {logger} = require('../logger/logger');
const User = require('../models/UserModel');
const VerificationDetail = require('../models/VerificationDetailModel');

router.get('/', async (req,res)=>{
    try{
        const {token} = req.query;
        if(!token){
            console.log("Token is required");
            return res.status(400).send("Invalid Request");
            //TOKEN IS REQUIRED -> return Unallowed/Unauthorized/Bad Request
        }
        const userVerifDetails= await VerificationDetail.findOne({ where: {token: token}});
        if(!userVerifDetails){
            return res.status(400).send("Token Does Not Exist");
        }
        //if current timestamp is before userVerifDetails.expiry then ->
        const currentTime = new Date().getTime();
        if(currentTime<userVerifDetails.expiry){
            console.log("Current Time:", currentTime);
            console.log("Expiry:", userVerifDetails.expiry);
            const currentUser = await User.findOne({where: {username: userVerifDetails.username}});
            currentUser.verificationStatus=true;
            await currentUser.save();
            return res.status(200).json().send("User Verified Successfully");  
        }
        else{
            return res.status(400).send("Verification Link has expired!");
        }


    }catch (error) {
        console.error("Failed with Error:", error);
        res.status(503).json().send();  
        
      }
});

module.exports = router;