const { request, response } = require("express");
const express = require("express");
const app = express();

const roomModel = require(`../models/index`).kamar;
const tipeModel = require(`../models/index`).tipe_kamar;
const Op = require(`sequelize`).Op;
const moment = require("moment");

const Sequelize = require("sequelize");
const sequelize = new Sequelize("hotel_ukk", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//mendaptkan semua data dalam tabel
exports.getAllRoom = async (request, response) => {
  const result = await sequelize.query(
    "SELECT kamars.id,kamars.nomor_kamar,tipe_kamars.nama_tipe_kamar FROM kamars JOIN tipe_kamars ON tipe_kamars.id = kamars.id_tipe_kamar ORDER BY kamars.id DESC"
  );

  console.log(result);
  if (result[0].length === 0) {
    return response.status(400).json({
      success: false,
      message: "nothing kamar to show",
    });
  }
  return response.json({
    success: true,
    data: result[0],
    message: `Room have been loaded`,
  });
};

//mendaptkan salah satu data dalam tabel (where clause)
exports.findRoom = async (request, response) => {
  let nomor_kamar = request.params.nomor_kamar;


  const result = await sequelize.query(
    `SELECT kamars.id,kamars.nomor_kamar,tipe_kamars.nama_tipe_kamar FROM kamars JOIN tipe_kamars ON tipe_kamars.id = kamars.id_tipe_kamar where kamars.nomor_kamar= ${nomor_kamar} ORDER BY kamars.id DESC `
  );

  if (result[0].length === 0) {
    return response.status(400).json({
      success: false,
      message: "nothing kamar to show",
    });
  }

  return response.json({
    success: true,
    data: result[0],
    message: `Room have been loaded`,
  });
};

exports.findRoomById = async (request, response) => {
  let idRoom = request.params.id;


  const result = await sequelize.query(
    `SELECT kamars.id,kamars.nomor_kamar,kamars.id_tipe_kamar, tipe_kamars.nama_tipe_kamar FROM kamars JOIN tipe_kamars ON tipe_kamars.id = kamars.id_tipe_kamar where kamars.id = ${idRoom} ORDER BY kamars.id ASC `
  );

  if (result[0].length === 0) {
    return response.status(400).json({
      success: false,
      message: "nothing kamar to show",
    });
  }

  return response.json({
    success: true,
    data: result[0],
    message: `Room have been loaded`,
  });
};


//menambah data
exports.addRoom = async (request, response) => {
  let nama_tipe_kamar = request.body.nama_tipe_kamar;
  let tipeId = await tipeModel.findOne({
    where: {
      [Op.and]: [{ nama_tipe_kamar: { [Op.substring]: nama_tipe_kamar } }],
    },
  });
  console.log(tipeId);

  if (tipeId === null) {
    return response.status(400).json({
      success: false,
      message: `Tipe kamar yang anda inputkan tidak ada`,
    });
  } else {
    let newRoom = {
      nomor_kamar: request.body.nomor_kamar,
      id_tipe_kamar: tipeId.id,
    };

    if (newRoom.nomor_kamar === "" || nama_tipe_kamar === "") {
      return response.status(400).json({
        success: false,
        message: `Mohon diisi semua`,
      });
    }

    let kamars = await roomModel.findAll({
      where: {
        [Op.and]: [
          { nomor_kamar: newRoom.nomor_kamar },
          { id_tipe_kamar: newRoom.id_tipe_kamar },
        ],
      },
      attributes: ["id", "nomor_kamar", "id_tipe_kamar"],
    });
    if (kamars.length > 0) {
      return response.status(400).json({
        success: false,
        message: `Kamar yang anda inputkan sudah ada`,
      });
    }
    roomModel
      .create(newRoom)
      .then((result) => {
        return response.json({
          success: true,
          data: result,
          message: `New Room has been inserted`,
        });
      })
      .catch((error) => {
        return response.status(400).json({
          success: false,
          message: error.message,
        });
      });
  }
};

//mengupdate salah satu data
exports.updateRoom = async (request, response) => {
  let nama_tipe_kamar = request.body.nama_tipe_kamar;
  let tipeId = await tipeModel.findOne({
    where: {
      [Op.and]: [{ nama_tipe_kamar: { [Op.substring]: nama_tipe_kamar } }],
    },
  });
  console.log(nama_tipe_kamar);

  if (tipeId === null) {
    return response.status(400).json({
      success: false,
      message: `Tipe kamar yang anda inputkan tidak ada`,
    });
  } else {
    let newRoom = {
      nomor_kamar: request.body.nomor_kamar,
      id_tipe_kamar: tipeId.id,
    };
    if (newRoom.nomor_kamar === "" || nama_tipe_kamar === "") {
      return response.status(400).json({
        success: false,
        message:
          "Harus diisi semua kalau tidak ingin merubah, isi dengan value sebelumnya",
      });
    }

    let idRoom = request.params.id;
    let getId = await roomModel.findAll({
      where: {
        [Op.and]: [{ id: idRoom }],
      },
      attributes: ["id", "nomor_kamar", "id_tipe_kamar"],
    });
    if (getId.length === 0) {
      return response.status(400).json({
        success: false,
        message: "Kamar dengan id tersebut tidak ada",
      });
    }

    let kamars = await roomModel.findAll({
      where: {
        [Op.and]: [
          { id: { [Op.ne]: idRoom } },
          {
            [Op.or]: [
              { nomor_kamar: newRoom.nomor_kamar },
            ],
          },
        ],
      },
      attributes: ["id", "nomor_kamar", "id_tipe_kamar"],
    });
    if (kamars.length > 0) {
      return response.status(400).json({
        success: false,
        message: `Kamar yang anda inputkan sudah ada`,
      });
    }

    roomModel
      .update(newRoom, { where: { id: idRoom } })
      .then((result) => {
        return response.json({
          success: true,
          message: `Data room has been update`,
        });
      })
      .catch((error) => {
        return response.status(400).json({
          success: false,
          message: error.message,
        });
      });
  }
};

//mengahapus salah satu data
exports.deleteRoom = async (request, response) => {
  let idRoom = request.params.id;

  const room = await roomModel.findAll({
    where: { [Op.and]: [{ id: idRoom }] },
    attributes: ["id", "nomor_kamar", "id_tipe_kamar", "createdAt", "updatedAt"],
  });
  

  if (room.length === 0) {
    return response.json({
      success: false,
      message: `Tidak ada kamar dengan id tersebut`,
    });
  }

  roomModel
    .destroy({ where: { id: idRoom } })
    .then((result) => {
      return response.json({
        success: true,
        message: `room data has ben deleted`,
      });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};

exports.availableRoom = async (request, response) => {
  const tgl_akses_satu = new Date(request.body.tgl_akses_satu);
  const tgl_akses_dua = new Date(request.body.tgl_akses_dua);
  let tgl1 = moment(tgl_akses_satu).format("YYYY-MM-DD");
  let tgl2 = moment(tgl_akses_dua).format("YYYY-MM-DD");

  const result = await sequelize.query(
    `SELECT tipe_kamars.nama_tipe_kamar, kamars.nomor_kamar FROM kamars LEFT JOIN tipe_kamars ON kamars.id_tipe_kamar = tipe_kamars.id LEFT JOIN detail_pemesanans ON detail_pemesanans.id_kamar = kamars.id WHERE kamars.id NOT IN (SELECT id_kamar from detail_pemesanans WHERE tgl_akses BETWEEN '${tgl1}' AND '${tgl2}') GROUP BY kamars.nomor_kamar`
  );

  if (result[0].length === 0) {
    return response.json({
      success: false,
      message: `Tidak ada kamar yang tersedia di antara tanggal itu`,
    });
  }

  return response.json({
    success: true,
    sisa_kamar: result[0].length,
    data: result[0],
    message: `Room have been loaded`,
  });
};

exports.availableRoomSingleDate = async (request, response) => {
  const tgl_akses = new Date(request.params.tgl_akses);

  let tgl = moment(tgl_akses).format("YYYY-MM-DD");

  const result = await sequelize.query(
    `SELECT  kamars.nomor_kamar FROM kamars LEFT JOIN tipe_kamars ON kamars.id_tipe_kamar = tipe_kamars.id LEFT JOIN detail_pemesanans ON detail_pemesanans.id_kamar = kamars.id WHERE kamars.id NOT IN (SELECT id_kamar from detail_pemesanans WHERE tgl_akses = '${tgl}') GROUP BY kamars.nomor_kamar`
  );

  if (result[0].length === 0) {
    return response.json({
      success: false,
      message: `Tidak ada kamar yang tersedia di tanggal itu`,
    });
  }

  const data=[]
  for(let i =0; i < result[0].length; i++){
    data.push(result[0][i].nomor_kamar)
  }
  return response.json({
    success: true,
    data: data,
    message: `Room have been loaded`,
  });
};

exports.availableRoomWithType = async (request,response)=>{
  const nama_tipe = request.body.nama_tipe
  const tgl_akses_satu = new Date(request.body.check_in);
  const tgl_akses_dua = new Date(request.body.check_out);

  let tgl1 = moment(tgl_akses_satu).format("YYYY-MM-DD");
  let tgl2 = moment(tgl_akses_dua).format("YYYY-MM-DD");

  const result = await sequelize.query(
    `SELECT tipe.nama_tipe_kamar, kamar.nomor_kamar
      FROM kamars  as kamar JOIN tipe_kamars as tipe ON kamar.id_tipe_kamar = tipe.id
      WHERE tipe.nama_tipe_kamar='${nama_tipe}' AND kamar.id NOT IN ( SELECT id_kamar FROM detail_pemesanans as dp join pemesanans as p ON p.id = dp.id_pemesanan WHERE p.status_pemesanan != 'checkout' AND dp.tgl_akses BETWEEN "${tgl1}" AND "${tgl2}" ) GROUP BY kamar.id ORDER BY kamar.id DESC `
  );

  

  if (result[0].length === 0) {
    return response.json({
      success: false,
      data: `nothing type room available`,
      sisa_kamar: 0
    });
  }

  return response.json({
    success: true,
    sisa_kamar: result[0].length,
    data: result[0],
    message: `Room have been loaded`
  });
}

exports.getRoomLength = async (request, response) =>{
  try {
    let room = await roomModel.count();
    return response.json({
      success:true,
      jumlah_kamar:room
    })
  }
  catch(error){
    console.log(error);
    return response.json({
      success:false,
      message:error
    })
  }
}