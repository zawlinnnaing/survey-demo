"use strict";
module.exports = (sequelize, DataTypes) => {
  const TextAnswer = sequelize.define(
    "TextAnswer",
    {
      answer: DataTypes.TEXT,
      questionId: DataTypes.INTEGER
    },
    {}
  );
  TextAnswer.associate = function(models) {
    // associations can be defined here
    TextAnswer.belongsTo(models.TextQuestion, { foreignKey: "questionId" });
  };
  return TextAnswer;
};
