"use strict";
module.exports = (sequelize, DataTypes) => {
  const Device = sequelize.define(
    "Device",
    {
      sessionId: {
        type: DataTypes.STRING,
        isUnique: true
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {}
  );
  Device.associate = function(models) {
    // associations can be defined here
    Device.belongsToMany(models.Form, {
      through: "FormDevices",
      as: "Forms",
      foreignKey: "deviceId"
    });
  };
  return Device;
};
