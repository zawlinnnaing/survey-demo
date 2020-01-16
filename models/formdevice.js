"use strict";
module.exports = (sequelize, DataTypes) => {
  const FormDevice = sequelize.define(
    "FormDevice",
    {
      status: DataTypes.STRING,
      formId: DataTypes.INTEGER,
      deviceId: DataTypes.INTEGER
    },
    {}
  );
  FormDevice.associate = function(models) {
    // associations can be defined here
  };
  return FormDevice;
};
