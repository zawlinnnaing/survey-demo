"use strict";
const tables = [
  // "Admins",
  "FormDevices",
  "Forms",
  "ListAnswerItems",
  "ListItems",
  "Questions",
  "TextAnswers"
];
module.exports = {
  up: (queryInterface, Sequelize) => {
    let promises = tables.map(async table => {
      let tableObj = await queryInterface.describeTable(table);
      if (!Object.keys(tableObj).includes("deletedAt")) {
        return queryInterface.addColumn(table, "deletedAt", {
          type: Sequelize.DATE,
          allowNull: true
        });
      }
    });
    return Promise.all(promises);
  },

  down: (queryInterface, Sequelize) => {
    let promises = tables.map(async table => {
      let tableObj = await queryInterface.describeTable(table);
      if (Object.keys(tableObj).includes("deletedAt")) {
        return queryInterface.removeColumn(table, "deletedAt");
      }
    });
    return Promise.all(promises);
  }
};
