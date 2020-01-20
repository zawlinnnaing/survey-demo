"use strict";
module.exports = (sequelize, DataTypes) => {
  const Form = sequelize.define(
    "Form",
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {}
  );
  Form.associate = function(models) {
    // associations can be defined here
    Form.belongsToMany(models.Device, {
      through: "FormDevices",
      as: "Devices",
      foreignKey: "formId",
      otherKey: "deviceId",
      onDelete: "cascade",
      hooks: true
    });
    Form.hasMany(models.Question, {
      foreignKey: "formId",
      as: "questions",
      onDelete: "cascade"
    });
  };
  return Form;
};
