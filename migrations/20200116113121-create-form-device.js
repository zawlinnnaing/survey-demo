"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("FormDevices", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      formId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Forms",
          key: "id"
        },
        onUpdate: "cascade",
        onDelete: "cascade"
      },
      deviceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Devices",
          key: "id"
        },
        onUpdate: "cascade",
        onDelete: "cascade"
      },
      // formId: {
      //   type: Sequelize.INTEGER,
      //   primaryKey: true,
      //   allowNull: false
      // },
      // deviceId: {
      //   type: Sequelize.INTEGER,
      //   allowNull: false,
      //   primaryKey: true
      // },
      status: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("FormDevices");
  }
};
