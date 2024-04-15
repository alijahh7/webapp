const req = require('supertest');
const {app} = require('../index');
const server = require('../server')
const sequelize = require('../helpers/database');
const supertest = require('supertest');
require('dotenv').config();
const {Sequelize}=require("sequelize");
const User = require('../models/UserModel');
environment='test';

const db=process.env.PSQL_DB || 'mydb';
const user=process.env.PSQL_DB_USER;
const pass=process.env.PSQL_DB_PASS;
const port = process.env.PORT || 8080;

// const sequelize = new Sequelize(db, user, pass,{
//     dialect: 'postgres',
//     logging: false
// });


beforeAll(async () => {
 
  await sequelize.sync({ force: true }).then(console.log("Synced"));
});

afterAll(async () => {
  //await deleteUserByUsername(userDetails.username);
  server.close();
});


const Chance = require('chance');

const chance = new Chance(); //https://chancejs.com/index.htmls

const userDetails = {
  // first_name: chance.first(),
  // last_name: chance.last(),
  // password: chance.string({ length: 8 }),
  // username: chance.email()
  first_name: "first",
  last_name: "last",
  password: "abcde",
  username: "first1@last.com"
};

const updatedDetails = 
    {
        first_name: 'newFirst',            
    }
    // sequelize.sync()
    // .then(() => {
    //   console.log('Sync success at TEST');
    // })
    // .catch((err) => {
    //   console.error('Error', err);
    // });
    
//POST
describe('Testing POST /v2/user and validating using GET /v2/user/self', ()=>{

    it("creating user in postgres, returns all details of created user, except password", async ()=>{
        
        const res = await supertest(app)
        .post("/v2/user").send(userDetails).expect(201);

        const currentUser = await User.findOne(
          {
              where: {username:userDetails.username}
          }); 
          currentUser.verificationStatus=true;
          await currentUser.save();
          });
        
          
       // 
        //  


        it("checking if new user exists in db using GET", async()=>{  
        const getResponse = await supertest(app).get("/v2/user/self").set('Authorization', 'Basic '+Buffer(`${userDetails.username}:${userDetails.password}`).toString("base64")).expect(200)
       
        expect(getResponse.body.first_name).toBe(userDetails.first_name);
        expect(getResponse.body.last_name).toBe(userDetails.last_name);
        expect(getResponse.body.username).toBe(userDetails.username);

    });

});

//PUT
describe('Testing PUT /v2/user/self and validating using GET /v2/user/self', ()=>{

  it("updating user in postgres, returns all details of created user, except password", async ()=>{
      const res = await supertest(app)
      .put("/v2/user/self").set('Authorization', 'Basic '+Buffer(`${userDetails.username}:${userDetails.password}`).toString("base64")).send(updatedDetails).expect(204);
        });
       

      it("checking if new user exists in db using GET", async()=>{  
      const getResponse = await supertest(app).get("/v2/user/self").set('Authorization', 'Basic '+Buffer(`${userDetails.username}:${userDetails.password}`).toString("base64")).expect(200)
     
      expect(getResponse.body.first_name).toBe(updatedDetails.first_name);
      
  });

})
