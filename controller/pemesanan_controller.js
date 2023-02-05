const pemesananModel = require(`../models/index`).pemesanan;
const detailsOfPemesananModel = require(`../models/index`).detail_pemesanan;
const userModel = require(`../models/index`).user;
const roomModel = require(`../models/index`).kamar;

const Op = require(`sequelize`).Op;
// const date = require(`date-and-time`);
const Sequelize = require("sequelize");
const sequelize = new Sequelize("hotel_ukk", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

//tambah data
exports.addPemesanan = async (request, response) => {
  let nomor_kamar = request.body.nomor_kamar;
  let room = await roomModel.findOne({
    where: {
      [Op.and]: [{ nomor_kamar: { [Op.substring]: nomor_kamar } }],
    },
    attributes: [
      "id",
      "nomor_kamar",
      "id_tipe_kamar",
      "createdAt",
      "updatedAt",
    ],
  });

  let nama_user = request.body.nama_user;
  let userId = await userModel.findOne({
    where: {
      [Op.and]: [{ nama_user: { [Op.substring]: nama_user } }],
    },
  });

  if (room === null) {
    return response.json({
      success: false,
      message: `Kamar yang anda inputkan tidak ada`,
    });
  } else if (userId === null) {
    return response.json({
      success: false,
      message: `User yang anda inputkan tidak ada`,
    });
  } else {
    let newData = {
      nomor_pemesanan: request.body.nomor_pemesanan,
      nama_pemesanan: request.body.nama_pemesanan,
      email_pemesanan: request.body.email_pemesanan,
      tgl_pemesanan: request.body.tanggal_pemesanan,
      tgl_check_in: request.body.check_in,
      tgl_check_out: request.body.check_out,
      nama_tamu: request.body.nama_tamu,
      jumlah_kamar: request.body.jumlah_kamar,
      id_tipe_kamar: room.id_tipe_kamar,
      status_pemesanan: request.body.status,
      id_user: userId.id,
    };

    let roomCheck = await sequelize.query(
      `SELECT * FROM detail_pemesanans WHERE id_kamar = ${room.id} AND tgl_akses= "${request.body.check_in}" ;`
    );

    if (roomCheck[0].length === 0) {
      pemesananModel
        .create(newData)
        .then((result) => {
          let pemesananID = result.id;
          let detailsOfPemesanan = request.body.details_of_pemesanan;

          for (let i = 0; i < detailsOfPemesanan.length; i++) {
            detailsOfPemesanan[i].id_pemesanan = pemesananID;
          }

          let newDetail = {
            id_pemesanan: pemesananID,
            id_kamar: room.id,
            tgl_akses: result.tgl_check_in,
            harga: detailsOfPemesanan[0].harga,
          };

          detailsOfPemesananModel
            .create(newDetail)
            .then((result) => {
              return response.json({
                success: true,
                message: `New transaction has been inserted`,
              });
            })
            .catch((error) => {
              return response.json({
                success: false,
                message: error.message,
              });
            });
        })
        .catch((error) => {
          return response.json({
            success: false,
            message: error.message,
          });
        });
    } else {
      return response.json({
        success: false,
        message: `Kamar yang anda pesan sudah di booking`,
      });
    }
  }
};

//update data
exports.updatePemesanan = async (request, response) => {
  let nomor_kamar = request.body.nomor_kamar;
  let room = await roomModel.findOne({
    where: {
      [Op.and]: [{ nomor_kamar: { [Op.substring]: nomor_kamar } }],
    },
    attributes: [
      "id",
      "nomor_kamar",
      "id_tipe_kamar",
      "createdAt",
      "updatedAt",
    ],
  });

  let nama_user = request.body.nama_user;
  let userId = await userModel.findOne({
    where: {
      [Op.and]: [{ nama_user: { [Op.substring]: nama_user } }],
    },
  });

  let newData = {
    nomor_pemesanan: request.body.nomor_pemesanan,
    nama_pemesanan: request.body.nama_pemesanan,
    email_pemesanan: request.body.email_pemesanan,
    tgl_pemesanan: request.body.tanggal_pemesanan,
    tgl_check_in: request.body.check_in,
    tgl_check_out: request.body.check_out,
    nama_tamu: request.body.nama_tamu,
    jumlah_kamar: request.body.jumlah_kamar,
    id_tipe_kamar: room.id_tipe_kamar,
    status_pemesanan: request.body.status,
    id_user: userId.id,
  };

  let pemesananID = request.params.id;

  pemesananModel
    .update(newData, { where: { id: pemesananID } })
    .then(async (result) => {
      await detailsOfPemesananModel.destroy({
        where: { id_pemesanan: pemesananID },
      });

      let detailsOfPemesanan = request.body.details_of_pemesanan;

      for (let i = 0; i < detailsOfPemesanan.length; i++) {
        detailsOfPemesanan[i].id_pemesanan = pemesananID;
      }

      let newDetail = {
        id_pemesanan: pemesananID,
        id_kamar: room.id,
        tgl_akses: detailsOfPemesanan[0].tgl_akses,
        harga: detailsOfPemesanan[0].harga,
      };

      detailsOfPemesananModel
        .create(newDetail)
        .then((result) => {
          return response.json({
            success: true,
            message: ` transaction has been update`,
          });
        })
        .catch((error) => {
          return response.json({
            success: false,
            message: error.message,
          });
        });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};

//delete data
exports.deletePemesanan = async (request, response) => {
  let pemesananID = request.params.id;

  detailsOfPemesananModel
    .destroy({
      where: { id_pemesanan: pemesananID },
    })
    .then((result) => {
      pemesananModel
        .destroy({ where: { id: pemesananID } })
        .then((result) => {
          return response.json({
            success: true,
            message: `Transaction has been deleted`,
          });
        })
        .catch((error) => {
          return response.json({
            success: false,
            message: error.message,
          });
        });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};

//mendapatkan semua data 
exports.getAllPemesanan = async (request, response) => {
  const result = await sequelize.query(
    "SELECT pemesanans.id, pemesanans.nama_pemesanan,pemesanans.email_pemesanan,pemesanans.tgl_pemesanan,pemesanans.tgl_check_in,pemesanans.tgl_check_out,pemesanans.nama_tamu,pemesanans.jumlah_kamar,pemesanans.status_pemesanan, users.nama_user, tipe_kamars.nama_tipe_kamar, kamars.nomor_kamar FROM pemesanans JOIN tipe_kamars ON tipe_kamars.id = pemesanans.id_tipe_kamar JOIN users ON users.id=pemesanans.id_user JOIN detail_pemesanans ON detail_pemesanans.id_pemesanan=pemesanans.id JOIN kamars ON kamars.id=detail_pemesanans.id_kamar"
  );

  response.json({
    success: true,
    data: result[0],
    message: `All Transaction have been loaded`,
  });
};

//mendapatkan salah satu data 
exports.find = async (request, response) => {
  let memberID = request.params.id;

  const result = await sequelize.query(
    `SELECT pemesanans.id, pemesanans.nama_pemesanan,pemesanans.email_pemesanan,pemesanans.tgl_pemesanan,pemesanans.tgl_check_in,pemesanans.tgl_check_out,pemesanans.nama_tamu,pemesanans.jumlah_kamar,pemesanans.status_pemesanan, users.nama_user, tipe_kamars.nama_tipe_kamar, kamars.nomor_kamar FROM pemesanans JOIN tipe_kamars ON tipe_kamars.id = pemesanans.id_tipe_kamar JOIN users ON users.id=pemesanans.id_user JOIN detail_pemesanans ON detail_pemesanans.id_pemesanan=pemesanans.id JOIN kamars ON kamars.id=detail_pemesanans.id_kamar WHERE pemesanans.id=${memberID}`
  );

  return response.json({
    success: true,
    data: result[0],
    message: `Transaction have been loaded`,
  });
};
