"use strict";
module.exports = (sequelize, DataTypes) => {
  const ListAnswerItem = sequelize.define(
    "ListAnswerItem",
    {
      listAnswerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1
        }
      },
      listItemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1
        }
      }
    },
    {}
  );
  ListAnswerItem.associate = function(models) {
    // associations can be defined here
  };
  return ListAnswerItem;
};
