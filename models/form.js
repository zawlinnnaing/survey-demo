"use strict";
module.exports = (sequelize, DataTypes) => {
  const Form = sequelize.define(
    "Form",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          isLength: {
            min: 4,
            max: 300
          }
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          isLength: {
            min: 0,
            max: 600
          }
        }
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      paranoid: true
    }
  );
  Form.associate = function(models) {
    // associations can be defined here
    Form.belongsToMany(models.Device, {
      through: "FormDevices",
      as: "Devices",
      foreignKey: "formId",
      otherKey: "deviceId"
      // hooks: true
    });
    Form.hasMany(models.Question, {
      foreignKey: "formId",
      as: "questions"
    });
  };
  return Form;
};
