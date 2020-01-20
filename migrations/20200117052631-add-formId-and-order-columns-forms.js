"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn(
          "Questions",
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
          "Questions",
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
        queryInterface.removeColumn("Questions", "formId", {
          transaction: t
        }),
        queryInterface.removeColumn("Questions", "order", { transaction: t })
      ]);
    });
  }
};
