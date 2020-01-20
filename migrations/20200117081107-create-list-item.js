"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("ListItems", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      itemName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      //Foreign key
      listQuestionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Questions",
          key: "id"
        },
        onDelete: "cascade",
        onUpdate: "cascade"
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
    return queryInterface.dropTable("ListItems");
  }
};
