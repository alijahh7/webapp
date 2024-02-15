const req = require('supertest');
const app = require('../index');
const { sequelize } = require('../helpers/database');
const supertest = require('supertest');
const Chance = require('chance');

const chance = new Chance(); //https://chancejs.com/index.htmls

const userDetails = {
  first_name: chance.first(),
  last_name: chance.last(),
  password: chance.string({ length: 8 }),
  username: chance.email()
};

const updatedDetails = 
    {
        first_name: 'newFirst',            
    }

//POST
describe('Testing POST /v1/user and validating using GET /v1/user/self', ()=>{

    it("creating user in postgres, returns all details of created user, except password", async ()=>{
        
        const res = await supertest(app)
        .post("/v1/user").send(userDetails).expect(201);
          });


        it("checking if new user exists in db using GET", async()=>{  
        const getResponse = await supertest(app).get("/v1/user/self").set('Authorization', 'Basic '+Buffer(`${userDetails.username}:${userDetails.password}`).toString("base64")).expect(200)
       
        expect(getResponse.body.first_name).toBe(userDetails.first_name);
        
    });

});

//PUT
describe('Testing PUT /v1/user/self and validating using GET /v1/user/self', ()=>{

  it("updating user in postgres, returns all details of created user, except password", async ()=>{
      const res = await supertest(app)
      .put("/v1/user/self").set('Authorization', 'Basic '+Buffer(`${userDetails.username}:${userDetails.password}`).toString("base64")).send(updatedDetails).expect(204);
        });
       

      it("checking if new user exists in db using GET", async()=>{  
      const getResponse = await supertest(app).get("/v1/user/self").set('Authorization', 'Basic '+Buffer(`${userDetails.username}:${userDetails.password}`).toString("base64")).expect(200)
     
      expect(getResponse.body.first_name).toBe(updatedDetails.first_name);
      
  });

})