const { request, response } = require("express");
const express = require("express");
const app = express();

const md5=require("md5")


const userModel = require(`../models/index`).user;
const Op = require(`sequelize`).Op;

const path = require(`path`);
const fs = require(`fs`);

const upload = require(`./upload_foto_user`).single(`foto`);

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//mendaptkan semua data dalam tabel
exports.getAllUser = async (request, response) => {
  let user = await userModel.findAll();
  return response.json({
    success: true,
    data: user,
    message: `All User have been loaded`,
  });
};

//mendaptkan salah satu data dalam tabel (where clause)
exports.findUser = async (request, response) => {
  let nama = request.body.nama;
  let email = request.body.email;
  
  let user = await userModel.findOne({
    where: {
      [Op.or]: [
        { nama_user: { [Op.substring]: nama } },
        { email: { [Op.substring]: email } }
      ],
    },
  });
  return response.json({
    success: true,
    data: user,
    message: `User have been loaded`,
  });
};

//menambah data
exports.addUser = (request, response) => {
  upload(request, response, async (error) => {
    if (error) {
      return response.json({ message: error });
    }

    if (!request.file) {
      return response.json({ message: `Nothing to upload` });
    }

    let newUser = {
      nama_user: request.body.nama_user,
      foto: request.file.filename,
      email: request.body.email,
      password: md5(request.body.password),
      role: request.body.role
    };

    userModel
      .create(newUser)
      .then((result) => {
        return response.json({
          success: true,
          data: result,
          message: `New User has been inserted`,
        });
      })
      .catch((error) => {
        return response.json({
          success: false,
          message: error.message,
        });
      });
  });
};

//mengupdate salah satu data
exports.updateUser = (request, response) => {
  upload(request, response, async (error) => {
    if (error) {
      return response.json({ message: error });
    }

    let idUser = request.params.id;

    let dataUser = {
        nama_user: request.body.nama_user,
        foto: request.file.filename,
        email: request.body.email,
        password: md5(request.body.password),
        role: request.body.role
    };

    if (request.file) {
      const selectedUser = await userModel.findOne({
        where: { id: idUser },
      });

      const oldFotoUser = selectedUser.foto;

      const patchFoto = path.join(__dirname, `../foto_user`, oldFotoUser);

      if (fs.existsSync(patchFoto)) {
        fs.unlink(patchFoto, (error) => console.log(error));
      }
      dataUser.foto = request.file.filename;
    }

    userModel
      .update(dataUser, { where: { id: idUser } })
      .then((result) => {
        return response.json({
          success: true,
          message: `Data user has been update`,
        });
      })
      .catch((error) => {
        return response.json({
          success: false,
          message: error.message,
        });
      });
  });
};

//mengahapus salah satu data
exports.deleteUser = async (request, response) => {
  let idUser = request.params.id;

  const user = await userModel.findOne({ wher: { id: idUser } });

  const oldFotoUser = user.foto;

  const patchFoto = path.join(__dirname, `../foto_user`, oldFotoUser);

  if (fs.existsSync(patchFoto)) {
    fs.unlink(patchFoto, (error) => console.log(error));
  }

  userModel
    .destroy({ where: { id: idUser } })

    .then((result) => {
      return response.json({
        success: true,
        message: `data user has ben delete where id_user :` + idUser,
      });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};
