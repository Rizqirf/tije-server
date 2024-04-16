"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    const fs = require("fs");
    const path = require("path");
    const busStopGeojson = fs.readFileSync(
      path.resolve(__dirname, "../data/Halte & Bus Stop.geojson"),
      "utf8"
    );
    const data = JSON.parse(busStopGeojson);

    await queryInterface.bulkInsert(
      "BusStops",
      data.features.map((e) => {
        return {
          stop_id: e.properties["Stop ID"],
          stop_name: e.properties["Nama Perhentian"],
          coordinates: e.properties["Koordinat"],
          bus_stop_type: e.properties["Tipe Perhentian Bus"],
          shelter_type: e.properties["Tipe Halte"],
          district: e.properties["Kecamatan"],
          city: e.properties["Kota"],
          latitude: e.geometry.coordinates[1],
          longitude: e.geometry.coordinates[0],
          route_count: e.properties["Jumlah Rute"],
          routes: e.properties["Rute yang Melewati"],
          operational_routes: e.properties["Rute Operasi yang Melewati"],
          corridor_service: e.properties["Koridor - Pelayanan"],
          marker_type: e.properties["Tipe Penanda"],
          is_operating:
            e.properties["Status Operasi Bus Stop/Halte"] === "Operasi"
              ? true
              : false,
          condition: e.properties["Kondisi"],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }),
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("BusStops", null, {});
  },
};
