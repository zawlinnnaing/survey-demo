"use strict";
module.exports = (sequelize, DataTypes) => {
  const FormDevice = sequelize.define(
    "FormDevices",
    {
      status: DataTypes.STRING,
      formId: DataTypes.INTEGER,
      deviceId: DataTypes.INTEGER
    },
    {
      paranoid: true
    }
  );
  FormDevice.associate = function(models) {
    // associations can be defined here
  };
  return FormDevice;
};
