"use strict";

let listQuestionTypes = require("../config/app").listQuestionsTypes;
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("ListQuestions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      question: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM(listQuestionTypes),
        allowNull: false
      },
      required: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      // Foreign Key
      formId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Forms",
          key: "id"
        },
        onDelete: "cascade",
        onUpdate: "cascade"
      },
      // End foreign key

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
    return queryInterface.dropTable("ListQuestions");
  }
};
