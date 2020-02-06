"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("ListAnswers", "deletedAt", {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("ListAnswers", "deletedAt");
  }
};
