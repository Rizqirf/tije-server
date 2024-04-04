"use strict";
const { Model } = require("sequelize");
const { passHass } = require("../helpers");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: `email cannot be empty`,
          },
          notEmpty: {
            msg: `email cannot be empty`,
          },
          isEmail: {
            msg: `invalid email format`,
          },
        },
        unique: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isPhoneNumber: function (value) {
            if (value && !/^\+\d{10,13}$/.test(value)) {
              throw new Error("invalid phone number");
            }
          },
        },
      },
      name: {
        type: DataTypes.STRING,
      },
      avatar: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
          notNull: {
            msg: `is_verified cannot be empty`,
          },
          notEmpty: {
            msg: `is_verified cannot be empty`,
          },
        },
      },
      user_token: {
        type: DataTypes.STRING,
      },
      token_expiration: {
        type: DataTypes.DATE,
      },
    },

    {
      sequelize,
      modelName: "User",
      indexes: [
        {
          unique: true,
          fields: ["email"],
        },
      ],
    }
  );

  User.beforeCreate((instance) => {
    if (instance.email) instance.email = instance.email.toLowerCase();
    if (instance.password) instance.password = passHass(instance.password);
  });

  // User.afterCreate((instance) => {
  //   console.log("User created");
  // });

  // User.beforeUpdate((instance) => {
  //   if (instance.changed("email")) {
  //   }
  // });
  return User;
};
