"use strict";
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define(
    "Admin",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
        set(val) {
          try {
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(val, salt);
            console.log(hash);
            this.setDataValue("password", hash);
          } catch (error) {
            console.error(error);
          }
        }
      },
      accessToken: {
        type: DataTypes.STRING,
        allowNull: true
      },
      publicInstance: {
        type: DataTypes.VIRTUAL,
        get() {
          return {
            id: this.id,
            name: this.name,
            email: this.email,
            accessToken: this.accessToken
          };
        },
        set(val) {
          throw new Error("Trying to set virtual field");
        }
      }
    },
    {
      paranoid: true
    }
  );

  Admin.generateAccessToken = async (instance, t) => {
    try {
      let data = { id: instance.id };
      let token = jwt.sign(data, process.env.JWT_SECRET);
      instance.accessToken = token;
      console.log("signed token ", token);
      instance = t
        ? await instance.save({ transaction: t })
        : await instance.save();
      console.log("token saved to model ", instance.accessToken);
      return instance.accessToken;
    } catch (e) {
      throw e;
    }
  };

  Admin.findByCredentials = async (email, password) => {
    let instance = await Admin.findOne({
      where: {
        email: email
      }
    });
    if (!instance) throw new Error("Entity not found.");
    let isPasswordMatch = bcrypt.compareSync(password, instance.password);
    if (!isPasswordMatch) {
      throw new Error("Invalid Credentials");
    }
    return instance;
  };
  Admin.associate = function(models) {
    // associations can be defined here
  };

  return Admin;
};
