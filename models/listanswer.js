"use strict";
module.exports = (sequelize, DataTypes) => {
  const ListAnswer = sequelize.define(
    "ListAnswer",
    {
      listQuestionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
          min: 1
        }
      }
    },
    {
      paranoid: true
    }
  );
  ListAnswer.associate = function(models) {
    // associations can be defined here
    ListAnswer.belongsTo(models.Question, {
      foreignKey: "listQuestionId",
      as: "Question"
    });
    ListAnswer.belongsToMany(models.ListItem, {
      through: "ListAnswerItems",
      as: "Items",
      foreignKey: "listAnswerId"
    });
  };
  return ListAnswer;
};
