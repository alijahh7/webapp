require('dotenv').config();const {Sequelize}=require("sequelize");

const db=process.env.PSQL_DB || 'mydb';
const user=process.env.PSQL_DB_USER;
const pass=process.env.PSQL_DB_PASS;
const port = process.env.PORT || 8080;

const sequelize = new Sequelize(db, user, pass,{
    dialect: 'postgres',
    logging: false
});

module.exports=sequelize;