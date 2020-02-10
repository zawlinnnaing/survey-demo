"use strict";
const uuid = require("uuid/v1");

module.exports = (sequelize, DataTypes) => {
  const FormAccessToken = sequelize.define(
    "FormAccessToken",
    {
      token: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true
      },
      answered: {
        type: DataTypes.BOOLEAN
      },
      formId: {
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

  FormAccessToken.generateTokens = async (form, count) => {
    const t = await sequelize.transaction();
    try {
      for (let i = 0; i < count; i++) {
        let token = uuid();
        await form.createAccessToken(
          {
            token,
            answered: false
          },
          {
            transaction: t
          }
        );
      }
      await t.commit();
      return form.getAccessTokens({
        order: [["createdAt", "DESC"]],
        attributes: ["id", "token", "answered"],
        limit: count
      });
    } catch (e) {
      await t.rollback();
      throw e;
    }
  };
  FormAccessToken.associate = function(models) {
    // associations can be defined here
    FormAccessToken.belongsTo(models.Form, {
      as: "Form",
      foreignKey: "formId"
    });
  };
  return FormAccessToken;
};
