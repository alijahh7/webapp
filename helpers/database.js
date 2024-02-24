require('dotenv').config();const {Sequelize}=require("sequelize");

const db=process.env.PSQL_DB;
const user=process.env.PSQL_DB_USER;
const pass=process.env.PSQL_DB_PASS;
const host = process.env.PSQL_DB_HOST;
const port = process.env.PORT || 8080;

const sequelize = new Sequelize(db, user, pass,{
    dialect: 'postgres',
    host: host,
    logging: false
});



module.exports=sequelize;