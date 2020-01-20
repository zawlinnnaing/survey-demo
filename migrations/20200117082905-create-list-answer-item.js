"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("ListAnswerItems", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
         
      // Foreign Keys
      listAnswerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "ListAnswers",
          key: "id"
        },
        onDelete: "cascade",
        onUpdate: "cascade"
      },
      listItemId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "ListItems",
          key: "id"
        },
        onDelete: "cascade",
        onUpdate: "cascade"
      },
      // End Foreign keys

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
    return queryInterface.dropTable("ListAnswerItems");
  }
};
