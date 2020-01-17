"use strict";
module.exports = (sequelize, DataTypes) => {
  const ListAnswerItem = sequelize.define(
    "ListAnswerItem",
    {
      listAnswerId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      listItemId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {}
  );
  ListAnswerItem.associate = function(models) {
    // associations can be defined here
  };
  return ListAnswerItem;
};
