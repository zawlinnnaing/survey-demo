"use strict";
module.exports = (sequelize, DataTypes) => {
  const Device = sequelize.define(
    "Device",
    {
      sessionId: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        },
        isUnique: true
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      paranoid: true
    }
  );
  Device.associate = function(models) {
    // associations can be defined here
    Device.belongsToMany(models.Form, {
      through: "FormDevices",
      as: "Forms",
      foreignKey: "deviceId",
      otherKey: "formId"
      // hooks: true
    });
  };
  return Device;
};
