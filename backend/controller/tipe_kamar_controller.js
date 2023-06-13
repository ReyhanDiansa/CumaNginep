const { request, response } = require("express");
const express = require("express");
const app = express();

const tipeModel = require(`../models/index`).tipe_kamar;
const Op = require(`sequelize`).Op;

const path = require(`path`);
const fs = require(`fs`);

const upload = require(`./upload_foto_tipe`).single(`foto`);

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const Sequelize = require("sequelize");
const sequelize = new Sequelize("hotel_ukk", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

//mendaptkan semua data dalam tabel
exports.getAllType = async (request, response) => {
  let tipe = await tipeModel.findAll();
  if (tipe.length === 0) {
    return response.status(400).json({
      success: false,
      message: "nothing Tipe Room to show",
    });
  }
  return response.json({
    success: true,
    data: tipe,
    message: `All room have been loaded`,
  });
};

//mendaptkan salah satu data dalam tabel (where clause)
exports.findType = async (request, response) => {
  let name = request.body.nama_tipe_kamar;

  let tipe = await tipeModel.findOne({
    where: {
      [Op.and]: [{ nama_tipe_kamar: { [Op.substring]: name } }],
    },
  });
  if (tipe.length === 0) {
    return response.json({
      success: false,
      message: "nothing tipe Room to show",
    });
  }

  return response.json({
    success: true,
    data: tipe,
    message: `Tipe Room have been loaded`,
  });
};

exports.findTypeById = async (request, response) => {
  let id = request.params.idTipe;

  let tipe = await tipeModel.findOne({
    where: {
     id:id
    },
  });
  
  if (!tipe) {
    return response.status(400).json({
      success: false,
      message: "nothing tipe Room to show",
    });
  }

  return response.json({
    success: true,
    data: tipe,
    message: `Tipe Room have been loaded`,
  });
};

//menambah data
exports.addType = (request, response) => {
  upload(request, response, async (error) => {
    if (error) {
      return response.status(400).json({ message: error });
    }
    
    if (!request.file) {
      return response.status(400).json({ message: `Nothing to upload` });
    }

    console.log("p");
    let newType = {
      nama_tipe_kamar: request.body.nama_tipe_kamar,
      harga: request.body.harga,
      deskripsi: request.body.deskripsi,
      foto: request.file.filename
    };

    console.log(newType);

    if (
      newType.nama_tipe_kamar === "" ||
      newType.harga === "" ||
      newType.deskripsi === ""
    ) {
        const oldFotoUser = newType.foto;
        const patchFoto = path.join(__dirname, `../foto_tipe_kamar`, oldFotoUser);
        if (fs.existsSync(patchFoto)) {
          fs.unlink(patchFoto, (error) => console.log(error));
        }
        return response.status(400).json({
          success: true,
          message: "Harus diisi semua",
        });
    }

    let tipe = await tipeModel.findAll({
      where: {
        [Op.and]: [{ nama_tipe_kamar: newType.nama_tipe_kamar }],
      },
    });

    if (tipe.length > 0) {
      //karena gagal hapus foto yang masuk
      const oldFotoUser = newType.foto;
        const patchFoto = path.join(__dirname, `../foto_tipe_kamar`, oldFotoUser);
        if (fs.existsSync(patchFoto)) {
          fs.unlink(patchFoto, (error) => console.log(error));
        }
      return response.status(400).json({
        success: false,
        message: "Nama tipe kamar yang anda inputkan sudah ada",
      });
    }
    tipeModel
      .create(newType)
      .then((result) => {
        return response.json({
          success: true,
          data: result,
          message: `New Type Room has been inserted`,
        });
      })
      .catch((error) => {
        return response.status(400).json({
          success: false,
          message: error.message,
        });
      });
  });
};

//mengupdate salah satu data
exports.updateType = (request, response) => {
  upload(request, response, async (error) => {
    if (error) {
      return response.status(400).json({ message: error });
    }

    let idType = request.params.id;

    let getId = await tipeModel.findAll({
      where: {
        [Op.and]: [{ id: idType }],
      },
    });

    if (getId.length === 0) {
      return response.status(400).json({
        success: false,
        message: "Type dengan id tersebut tidak ada",
      });
    }

    let dataType = {
      nama_tipe_kamar: request.body.nama_tipe_kamar,
      harga: request.body.harga,
      deskripsi: request.body.deskripsi
    };

    if (request.file) {
      const selectedUser = await tipeModel.findOne({
        where: { id: idType },
      });

      const oldFotoUser = selectedUser.foto;

      const patchFoto = path.join(__dirname, `../foto_tipe_kamar`, oldFotoUser);

      if (fs.existsSync(patchFoto)) {
        fs.unlink(patchFoto, (error) => console.log(error));
      }
      dataType.foto = request.file.filename;
    }

    if (
      dataType.nama_tipe_kamar === "" ||
      dataType.harga === "" ||
      dataType.deskripsi === "" 
    ) {
      return response.status(400).json({
        success: false,
        message:
          "Harus diisi semua kalau tidak ingin merubah, isi dengan value sebelumnya",
      });
    }


    let kamars = await tipeModel.findAll({
      where: {
        [Op.and]: [
          { id: { [Op.ne]: idType } },
          {
            [Op.and]: [
              { nama_tipe_kamar: dataType.nama_tipe_kamar },
            ],
          },
        ],
      },
      attributes: ["id", "nama_tipe_kamar", "harga", "deskripsi", "foto"],
    });
    if (kamars.length > 0) {
      return response.status(400).json({
        success: false,
        message: `Tipe Kamar yang anda inputkan sudah ada`,
      });
    }

    tipeModel
      .update(dataType, { where: { id: idType } })
      .then((result) => {
        return response.json({
          success: true,
          message: `Data room type has been update`,
        });
      })
      .catch((error) => {
        return response.status(400).json({
          success: false,
          message: error.message,
        });
      });
  });
};

//mengahapus salah satu data
exports.deleteType = async (request, response) => {
  let idType = request.params.id;

  let getId = await tipeModel.findAll({
    where: {
      [Op.and]: [{ id: idType }],
    },
  });

  if (!getId) {
    return response.status(400).json({
      success: false,
      message: "Tipe dengan id tersebut tidak ada",
    });
  }

  const tipe = await tipeModel.findOne({ where: { id: idType } });

  const oldFotoUser = tipe.foto;

  const patchFoto = path.join(__dirname, `../foto_tipe_kamar`, oldFotoUser);

  if (fs.existsSync(patchFoto)) {
    fs.unlink(patchFoto, (error) => console.log(error));
  }


  tipeModel
    .destroy({ where: { id: idType } })
    .then((result) => {
      return response.json({
        success: true,
        message: `data room type has ben delete`,
      });
    })
    .catch((error) => {
      return response.status(400).json({
        success: false,
        message: error.message,
      });
    });
};

exports.getAvailable = async (request,response)=>{
  let check_in=request.body.check_in
  let check_out=request.body.check_out

  const result = await sequelize.query(
    `SELECT tipe_kamars.nama_tipe_kamar FROM kamars LEFT JOIN tipe_kamars ON kamars.id_tipe_kamar = tipe_kamars.id LEFT JOIN detail_pemesanans ON detail_pemesanans.id_kamar = kamars.id WHERE tipe_kamars.id NOT IN (SELECT id_tipe_kamar from pemesanans JOIN detail_pemesanans on detail_pemesanans.id_pemesanan=pemesanans.id WHERE tgl_akses BETWEEN '${check_in}' AND '${check_out}') GROUP BY tipe_kamars.nama_tipe_kamar ORDER BY tipe_kamars.id DESC`
  );
  
  if (result[0].length === 0) {
    return response.json({
      success: false,
      data: `nothing type room available`,
    });
  }
  response.json({
    success: true,
    data: result[0],
    message: `All Transaction have been loaded`,
  });
}