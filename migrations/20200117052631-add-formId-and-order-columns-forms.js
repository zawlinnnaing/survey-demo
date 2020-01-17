"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn(
          "TextQuestions",
          "formId",
          {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: "Forms",
              key: "id"
            },
            onDelete: "cascade",
            onUpdate: "cascade"
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          "TextQuestions",
          "order",
          {
            type: Sequelize.INTEGER,
            allowNull: false
          },
          { transaction: t }
        )
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn("TextQuestions", "formId", {
          transaction: t
        }),
        queryInterface.removeColumn("TextQuestions", "order", { transaction: t })
      ]);
    });
  }
};
