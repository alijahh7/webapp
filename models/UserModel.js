const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../helpers/database');

//https://sequelize.org/docs/v6/core-concepts/model-basics/
const User = sequelize.define('User',{
id:{
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
    readOnly: true,
},
first_name:{
    type: DataTypes.STRING,
    allowNull: false,
},
last_name:{
    type: DataTypes.STRING,
    allowNull: false,
},
username:{
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate:
    {
        isEmail: true,
    },
},
password:{
    type: DataTypes.STRING,
    allowNull: false,
    writeOnly: true,
},
account_created:{
    type: DataTypes.DATE,
    allowNull: true,
    readOnly: true,
    defaultValue: DataTypes.NOW,
},
account_updated:{
    type: DataTypes.DATE,
    allowNull: true,
    readOnly: true,
    defaultValue: DataTypes.NOW,
}},{
    timestamps: false,
});

module.exports=User;