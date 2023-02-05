'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pemesanan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.detail_pemesanan, {
        foreignKey : 'id_pemesanan', as: 'details_of_pemesanan'
      })
      this.belongsTo(models.user);
      this.belongsTo(models.tipe_kamar);
    }
    }
  
  pemesanan.init({
    nomor_pemesanan: DataTypes.INTEGER,
    nama_pemesanan: DataTypes.STRING,
    email_pemesanan: DataTypes.STRING,
    tgl_pemesanan: DataTypes.DATE,
    tgl_check_in: DataTypes.DATE,
    tgl_check_out: DataTypes.DATE,
    nama_tamu: DataTypes.STRING,
    jumlah_kamar: DataTypes.INTEGER,
    id_tipe_kamar: DataTypes.INTEGER,
    status_pemesanan: DataTypes.ENUM('baru', 'checkin', 'checkout'),
    id_user: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'pemesanan',
  });
  return pemesanan;
}
