"use strict";
module.exports = (sequelize, DataTypes) => {
  const ListItem = sequelize.define(
    "ListItem",
    {
      itemName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          isLength: {
            min: 0,
            max: 200
          }
        }
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true
        }
      },
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
  ListItem.associate = function(models) {
    // associations can be defined here
    ListItem.belongsTo(models.Question, {
      foreignKey: "listQuestionId"
    });
    ListItem.belongsToMany(models.ListAnswer, {
      foreignKey: "listItemId",
      through: "ListAnswerItem",
      as: "Answers"
    });
  };
  return ListItem;
};
