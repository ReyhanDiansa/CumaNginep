'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.renameColumn('kamars', 'tipeKamarId', 'id_tipe_kamar');
    await queryInterface.createTable('kamars', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nomor_kamar: {
        type: Sequelize.INTEGER
      },
      id_tipe_kamar: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:"tipe_kamars",
          key:"id"
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('kamars');
  }
  
};