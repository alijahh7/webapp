const bcrypt = require('bcrypt');
const bAuth = require('basic-auth'); //https://github.com/jshttp/basic-auth#readme
const User = require('../models/UserModel');

const authenticateUser = async (req,res)=>{
    //console.log("from auth User")
    var credentials=bAuth(req);
    var validUser=await check(credentials.name, credentials.pass, res);
    //console.log("Creds:", credentials)
    if(!credentials || !validUser){
        console.log("INVALID USER")
        return false;
    }
    else if(validUser){
        console.log("VALID USER")
        var name=credentials.name;
    //console.log(name);
        return name;
    }
    return false;
    
};

const check = async (username,password, res) => {
    try{
        const currentUser = await User.findOne(
            {
                where: {username:username}
            });
        //console.log("Current user from CHECK: ",currentUser.dataValues);
       
        if(!currentUser){
            res.status(401).send();
            return false;
        }
       
        const passwordStatus = await bcrypt.compare(password,currentUser.dataValues.password);
        console.log("Password Match Status:", passwordStatus)
        if(passwordStatus){
            console.log("Passwords Match!")
            
            return true;
        }
        else{
            console.log("Passwords DONT Match")
            return false;
        }
        
    }
    catch(error){
        res.status(500).send();
        return false;
    }


};

module.exports=authenticateUser;