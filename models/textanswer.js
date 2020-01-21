"use strict";
module.exports = (sequelize, DataTypes) => {
  const TextAnswer = sequelize.define(
    "TextAnswer",
    {
      answer: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
          isLength: {
            min: 5,
            max: 500
          }
        }
      },
      questionId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        validate: {
          isInt: true,
          min: 1,
          notNull: true
        }
      }
    },
    {}
  );
  TextAnswer.associate = function(models) {
    // associations can be defined here
    TextAnswer.belongsTo(models.Question, { foreignKey: "questionId" });
  };
  return TextAnswer;
};
