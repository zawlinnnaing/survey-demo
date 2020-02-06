"use strict";
module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define(
    "Question",
    {
      question: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: true
        }
      },
      type: DataTypes.ENUM("short", "long", "checkbox", "dropdown", "radio"),
      required: DataTypes.BOOLEAN,
      formId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
          min: 1
        }
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true
        }
      }
    },
    {
      paranoid: true
    }
  );
  Question.associate = function(models) {
    // associations can be defined here
    Question.hasMany(models.TextAnswer, {
      foreignKey: "questionId",
      as: "answers"
    });
    Question.hasMany(models.ListItem, {
      foreignKey: "listQuestionId",
      as: "listItems"
    });

    Question.hasMany(models.ListAnswer, {
      foreignKey: "listQuestionId",
      as: {
        singular: "listAnswer",
        plural: "listAnswers"
      }
    });
    Question.belongsTo(models.Form, {
      as: "form",
      foreignKey: "formId"
    });
  };
  return Question;
};
