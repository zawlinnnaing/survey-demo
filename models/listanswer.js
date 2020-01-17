"use strict";
module.exports = (sequelize, DataTypes) => {
  const ListAnswer = sequelize.define(
    "ListAnswer",
    {
      listQuestionId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {}
  );
  ListAnswer.associate = function(models) {
    // associations can be defined here
    ListAnswer.belongsTo(models.ListQuestion, {
      foreignKey: "listQuestionId",
      onDelete: "cascade"
    });
    ListAnswer.belongsToMany(models.ListItem, {
      through: "ListAnswerItems",
      as: "Items",
      foreignKey: "listAnswerId",
      onDelete: "cascade"
    });
  };
  return ListAnswer;
};
