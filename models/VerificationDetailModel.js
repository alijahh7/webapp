const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../helpers/database');

const VerificationDetail = sequelize.define('VerificationDetail',{
    token:{
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
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
    time_created: {
       type: DataTypes.DATE,
      allowNull: true,
      readOnly: true,
      defaultValue: DataTypes.NOW,
    },
    expiry:{
        type: DataTypes.DATE,
        allowNull: false,
    },
    
    },{
        timestamps: false,
    });

    module.exports=VerificationDetail;