"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("News", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      content: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      image: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      campaign_start: {
        type: Sequelize.DATE,
      },
      campaign_end: {
        type: Sequelize.DATE,
      },
      is_highlight: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      is_active: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      last_updated_by: {
        allowNull: false,
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("News");
  },
};
