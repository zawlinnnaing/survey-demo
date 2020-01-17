"use strict";
module.exports = (sequelize, DataTypes) => {
  const TextQuestion = sequelize.define(
    "TextQuestion",
    {
      question: DataTypes.STRING,
      type: DataTypes.ENUM("short", "long"),
      required: DataTypes.BOOLEAN,
      formId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true
        }
      }
    },
    {}
  );
  TextQuestion.associate = function(models) {
    // associations can be defined here
    TextQuestion.hasMany(models.TextAnswer, {
      foreignKey: "questionId",
      onDelete: "cascade"
    });
    TextQuestion.belongsTo(models.Form, {
      foreignKey: "formId",
      onDelete: "cascade"
    });
  };
  return TextQuestion;
};
