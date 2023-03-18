const pemesananModel = require(`../models/index`).pemesanan;
const detailsOfPemesananModel = require(`../models/index`).detail_pemesanan;
const userModel = require(`../models/index`).user;
const roomModel = require(`../models/index`).kamar;
const { request } = require("express");
const moment = require("moment");
const randomstring = require("randomstring");

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
    let date = moment();
    let tgl_pemesanan = date.format("DD-MM-YYYY");
    const random = randomstring.generate(7);
    let nomorPem = `${tgl_pemesanan}_${random}`;
    console.log(tgl_pemesanan);

    let newData = {
      nomor_pemesanan: nomorPem,
      nama_pemesanan: request.body.nama_pemesanan,
      email_pemesanan: request.body.email_pemesanan,
      tgl_pemesanan: tgl_pemesanan,
      tgl_check_in: request.body.check_in,
      tgl_check_out: request.body.check_out,
      nama_tamu: request.body.nama_tamu,
      jumlah_kamar: 1,
      id_tipe_kamar: room.id_tipe_kamar,
      status_pemesanan: request.body.status,
      id_user: userId.id,
    };

    for (const [key, value] of Object.entries(newData)) {
      if (!value || value === "") {
        console.log(`Error: ${key} is empty`);
        // Handle the error here, for example by sending an error response
        return response
          .status(400)
          .json({ error: `${key} kosong mohon di isi` });
      }
    }

    let roomCheck = await sequelize.query(
      `SELECT * FROM detail_pemesanans WHERE id_kamar = ${room.id} AND tgl_akses BETWEEN '${newData.tgl_check_in}' AND '${newData.tgl_check_out}'`
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

          let tgl1 = new Date(request.body.check_in);
          let tgl2 = new Date(request.body.check_out);
          let checkIn = moment(tgl1).format("YYYY-MM-DD");
          let checkOut = moment(tgl2).format("YYYY-MM-DD");

          // check if the dates are valid
          if (
            !moment(checkIn, "YYYY-MM-DD").isValid() ||
            !moment(checkOut, "YYYY-MM-DD").isValid()
          ) {
            return response
              .status(400)
              .send({ message: "Invalid date format" });
          }

          let success = true;
          let message = "";

          for (
            let m = moment(checkIn, "YYYY-MM-DD");
            m.isBefore(checkOut);
            m.add(1, "days")
          ) {
            let date = m.format("YYYY-MM-DD");
            let newDetail = {
              id_pemesanan: pemesananID,
              id_kamar: room.id,
              tgl_akses: date,
              harga: detailsOfPemesanan[0].harga,
            };
            detailsOfPemesananModel.create(newDetail).catch((error) => {
              success = false;
              message = error.message;
            });
          }

          if (success) {
            return response.json({
              success: true,
              message: `New transactions have been inserted`,
            });
          } else {
            return response.json({
              success: false,
              message: message,
            });
          }
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

  for (const [key, value] of Object.entries(newData)) {
    if (!value || value === "") {
      console.log(`Error: ${key} is empty`);
      // Handle the error here, for example by sending an error response
      return response
        .status(400)
        .json({
          error: `${key} kosong Harus diisi kalau tidak ingin merubah, isi dengan value sebelumnya`,
        });
    }
  }

  let pemesananID = request.params.id;
  let getId = await pemesananModel.findAll({
    where: {
      [Op.and]: [{ id: pemesananID }],
    },
  });
  if (getId.length === 0) {
    return response.json({
      success: false,
      message: "Transaksi dengan id tersebut tidak ada",
    });
  }
  let roomCheck = await sequelize.query(
    `SELECT * FROM detail_pemesanans WHERE id_kamar = ${room.id} AND id_pemesanan != ${pemesananID} AND tgl_akses BETWEEN '${newData.tgl_check_in}' AND '${newData.tgl_check_out}" ;`
  );

  if (roomCheck[0].length > 0) {
    return response.json({
      success: false,
      message: `Kamar yang anda pesan sudah di booking`,
    });
  }

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

      let tgl1 = new Date(request.body.check_in);
      let tgl2 = new Date(request.body.check_out);
      let checkIn = moment(tgl1).format("YYYY-MM-DD");
      let checkOut = moment(tgl2).format("YYYY-MM-DD");

      // check if the dates are valid
      if (
        !moment(checkIn, "YYYY-MM-DD").isValid() ||
        !moment(checkOut, "YYYY-MM-DD").isValid()
      ) {
        return response.status(400).send({ message: "Invalid date format" });
      }

      let success = true;
      let message = "";

      for (
        let m = moment(checkIn, "YYYY-MM-DD");
        m.isBefore(checkOut);
        m.add(1, "days")
      ) {
        let date = m.format("YYYY-MM-DD");
        let newDetail = {
          id_pemesanan: pemesananID,
          id_kamar: room.id,
          tgl_akses: date,
          harga: detailsOfPemesanan[0].harga,
        };
        detailsOfPemesananModel.create(newDetail).catch((error) => {
          success = false;
          message = error.message;
        });
      }

      if (success) {
        return response.json({
          success: true,
          message: `New transactions have been inserted`,
        });
      } else {
        return response.json({
          success: false,
          message: message,
        });
      }
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
  let getId = await pemesananModel.findAll({
    where: {
      [Op.and]: [{ id: pemesananID }],
    },
  });
  if (getId.length === 0) {
    return response.json({
      success: false,
      message: "Transaksi dengan id tersebut tidak ada",
    });
  }

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
  if (result[0].length === 0) {
    return response.json({
      success: false,
      message: "nothing transaksi to show",
    });
  }

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

  if (result[0].length === 0) {
    return response.json({
      success: false,
      message: "nothing transaction to show",
    });
  }

  return response.json({
    success: true,
    data: result[0],
    message: `Transaction have been loaded`,
  });
};