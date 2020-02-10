"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("FormAccessTokens", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true
      },
      token: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true
      },
      formId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Forms",
          key: "id"
        },
        onUpdate: "cascade"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("FormAccessTokens");
  }
};
