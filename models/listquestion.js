"use strict";
let listQuestionTypes = require("../config/app").listQuestionsTypes;
module.exports = (sequelize, DataTypes) => {
  const ListQuestion = sequelize.define(
    "ListQuestion",
    {
      question: {
        type: DataTypes.STRING,
        allowNull: false
      },
      required: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM(listQuestionTypes),
        validate: {
          isIn: [listQuestionTypes]
        }
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: true,
          isInt: true
        }
      },
      formId: DataTypes.INTEGER
    },
    {}
  );
  ListQuestion.associate = function(models) {
    // associations can be defined here
    ListQuestion.belongsTo(models.Form, {
      foreignKey: "formId",
      onDelete: "cascade"
    });
    ListQuestion.hasMany(models.ListItem, {
      foreignKey: "listQuestionId",
      as: "Items",
      onDelete: "cascade"
    });
    ListQuestion.hasMany(models.ListAnswer, {
      foreignKey: "listQuestionId",
      as: "Answers",
      onDelete: "cascade"
    });
  };
  return ListQuestion;
};
