"use strict";
module.exports = (sequelize, DataTypes) => {
  const FormDevices= sequelize.define(
    "FormDevices",
    {
      status: DataTypes.STRING,
      formId: DataTypes.INTEGER,
      deviceId: DataTypes.INTEGER
    },
    {}
  );
  FormDevices.associate = function(models) {
    // associations can be defined here
  };
  return FormDevices;
};
