"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class News extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  News.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: `title cannot be empty` },
          notEmpty: { msg: `title cannot be empty` },
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: { msg: `content cannot be empty` },
          notEmpty: { msg: `content cannot be empty` },
        },
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: { msg: `images must be a valid URL` },
          notNull: { msg: `images cannot be empty` },
          notEmpty: { msg: `images cannot be empty` },
        },
      },
      campaign_start: DataTypes.DATE,
      campaign_end: DataTypes.DATE,
      is_highlight: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      last_updated_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: `last_updated_by cannot be empty` },
          notEmpty: { msg: `last_updated_by cannot be empty` },
        },
      },
      deletedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "News",
    }
  );
  return News;
};
