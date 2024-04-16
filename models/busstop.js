"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BusStop extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BusStop.init(
    {
      id: DataTypes.INTEGER,
      stop_id: {
        primaryKey: true,
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: `stop_id cannot be empty`,
          },
          notEmpty: {
            msg: `stop_id cannot be empty`,
          },
        },
      },
      stop_name: {
        primaryKey: true,
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: `stop_name cannot be empty`,
          },
          notEmpty: {
            msg: `stop_name cannot be empty`,
          },
        },
      },
      coordinates: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: `coordinates cannot be empty`,
          },
          notEmpty: {
            msg: `coordinates cannot be empty`,
          },
        },
      },
      bus_stop_type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: `bus_stop_type cannot be empty`,
          },
          notEmpty: {
            msg: `bus_stop_type cannot be empty`,
          },
        },
      },
      shelter_type: DataTypes.STRING,
      district: DataTypes.STRING,
      city: DataTypes.STRING,
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          notNull: {
            msg: `latitude cannot be empty`,
          },
          notEmpty: {
            msg: `latitude cannot be empty`,
          },
        },
      },
      longitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          notNull: {
            msg: `longitude cannot be empty`,
          },
          notEmpty: {
            msg: `longitude cannot be empty`,
          },
        },
      },
      route_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: `route_count cannot be empty`,
          },
          notEmpty: {
            msg: `route_count cannot be empty`,
          },
        },
      },
      routes: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: `routes cannot be empty`,
          },
          notEmpty: {
            msg: `routes cannot be empty`,
          },
        },
      },
      operational_routes: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: `operational_routes cannot be empty`,
          },
          notEmpty: {
            msg: `operational_routes cannot be empty`,
          },
        },
      },
      corridor_service: DataTypes.STRING,
      marker_type: DataTypes.STRING,
      is_operating: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
          notNull: {
            msg: `bus_stop_status cannot be empty`,
          },
        },
      },
      deletedAt: DataTypes.DATE,
      condition: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "BusStop",
    }
  );
  return BusStop;
};
