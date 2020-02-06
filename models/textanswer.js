"use strict";
module.exports = (sequelize, DataTypes) => {
  const TextAnswer = sequelize.define(
    "TextAnswer",
    {
      answer: {
        type: DataTypes.TEXT,
        validate: {}
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
    {
      validate: {
        notEmptyTextRange() {
          console.log("Quesiton answer", this.answer);
          if (
            String(this.answer) != "" &&
            (this.answer < 5 || this.answer > 300)
          ) {
            throw new Error(
              "Invalid answer length at answer id " + this.questionId
            );
          }
        }
      },
      paranoid: true
    }
  );
  TextAnswer.associate = function(models) {
    // associations can be defined here
    TextAnswer.belongsTo(models.Question, { foreignKey: "questionId" });
  };
  return TextAnswer;
};
