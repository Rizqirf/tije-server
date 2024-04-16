"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("BusStops", {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      stop_id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      stop_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      coordinates: {
        type: Sequelize.STRING,
      },
      bus_stop_type: {
        type: Sequelize.STRING,
      },
      shelter_type: {
        type: Sequelize.STRING,
      },
      district: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      latitude: {
        type: Sequelize.FLOAT,
      },
      longitude: {
        type: Sequelize.FLOAT,
      },
      route_count: {
        type: Sequelize.INTEGER,
      },
      routes: {
        type: Sequelize.STRING,
      },
      operational_routes: {
        type: Sequelize.STRING,
      },
      corridor_service: {
        type: Sequelize.STRING,
      },
      marker_type: {
        type: Sequelize.STRING,
      },
      is_operating: {
        type: Sequelize.BOOLEAN,
      },
      condition: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("BusStops");
  },
};
