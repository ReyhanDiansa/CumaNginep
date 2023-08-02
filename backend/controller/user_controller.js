const { request, response } = require("express");
const express = require("express");
const app = express();

const md5 = require("md5");

const userModel = require(`../models/index`).user;
const Op = require(`sequelize`).Op;

const path = require(`path`);
const fs = require(`fs`);

const upload = require(`./upload_foto_user`).single(`foto`);

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const jsonwebtoken = require("jsonwebtoken");
const SECRET_KEY = "secretcode";

exports.login = async (request, response) => {
  try {
    const params = {
      email: request.body.email,
      password: md5(request.body.password),
    };

    const findUser = await userModel.findOne({ where: params });
    if (findUser == null) {
      return response.status(400).json({
        message: "email or password doesn't match"
      });
    }
    console.log(findUser);
    //generate jwt token
    let tokenPayLoad = {
      id_user: findUser.id_user,
      email: findUser.email,
      role: findUser.role,
      nama_user: findUser.nama_user,
    };
    tokenPayLoad = JSON.stringify(tokenPayLoad);
    let token = await jsonwebtoken.sign(tokenPayLoad, SECRET_KEY);

    return response.status(200).json({
      message: "Success login",
      data: {
        token: token,
        id_user: findUser.id_user,
        nama_user: findUser.nama_user,
        email: findUser.email,
        role: findUser.role,
      },
    });
  } catch (error) {
    console.log(error);
    return response.status(400).json({
      message: error,
    });
  }
};

//mendaptkan semua data dalam tabel
exports.getAllUser = async (request, response) => {
  let user = await userModel.findAll();
  if (user.length === 0) {
    return response.status(400).json({
      success: false,
      message: "nothing user to show",
    });
  } else {
    return response.json({
      success: true,
      data: user,
      message: `All User have been loaded`,
    });
  }
};

//mendaptkan salah satu data dalam tabel (where clause)
exports.findUser = async (request, response) => {
  let id = request.params.id;
  if (!id) {
    return response.status.json({
      success: false,
      message: "masukkan id user di url",
    });
  } else {
    let user = await userModel.findOne({
      where: {
        [Op.and]: [{ id: id }],
      },
    });

    if (!user) {
      return response.status(400).json({
        success: false,
        message: "nothing user to show",
      });
    } else {
      return response.json({
        success: true,
        data: user,
        message: `User have been loaded`,
      });
    }
  }
};

//menambah data
exports.addUser = (request, response) => {
  upload(request, response, async (error) => {
    if (error) {
      return response.status(400).json({ message: error });
    }
    if (!request.file) {
      return response.status(400).json({ message: `harap mengupload foto dan pastikan semua sudah terisi` });
    }

    
    let newUser = {
      nama_user: request.body.nama_user,
      foto: request.file.filename,
      email: request.body.email,
      password: md5(request.body.password),
      role: request.body.role,
    };

    let user = await userModel.findAll({
      where: {
        [Op.or]: [{ nama_user: newUser.nama_user }, { email: newUser.email }],
      },
    });

    if (
      newUser.nama_user === "" ||
      newUser.email === "" ||
      newUser.password === "" ||
      newUser.role === ""
    ) {
      //karena gagal hapus foto yang masuk
      const oldFotoUser = newUser.foto;
      const patchFoto = path.join(__dirname, `../foto_user`, oldFotoUser);
      if (fs.existsSync(patchFoto)) {
        fs.unlink(patchFoto, (error) => console.log(error));
      }

      return response.status(400).json({
        success: false,
        message: "Harus diisi semua",
      });
    } else {
      //nama dan email tidak boleh sama
      if (user.length > 0) {
        //karena gagal hapus foto yang masuk
        const oldFotoUser = newUser.foto;
        const patchFoto = path.join(__dirname, `../foto_user`, oldFotoUser);
        if (fs.existsSync(patchFoto)) {
          fs.unlink(patchFoto, (error) => console.log(error));
        }
        return response.status(400).json({
          success: false,
          message: "Cari nama atau email lain",
        });
      } else {
        console.log(newUser);
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
            return response.status(400).json({
              success: false,
              message: error.message,
            });
          });
      }
    }
  });
};

//mengupdate salah satu data
exports.updateUser = (request, response) => {
  upload(request, response, async (error) => {
    if (error) {
      return response.status(400).json({ message: error });
    }

    let idUser = request.params.id;

    let getId = await userModel.findAll({
      where: {
        [Op.and]: [{ id: idUser }],
      },
    });

    if (getId.length === 0) {
      return response.status(400).json({
        success: false,
        message: "User dengan id tersebut tidak ada",
      });
    }

    let dataUser = {
      nama_user: request.body.nama_user,
      email: request.body.email,
      password: md5(request.body.password),
      role: request.body.role,
      foto:getId.foto
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

    if (
      dataUser.nama_user === "" ||
      dataUser.email === "" ||
      dataUser.password === "" ||
      dataUser.role === ""
    ) {
      return response.status(400).json({
        success: false,
        message:
          "Harus diisi semua kalau tidak ingin merubah isi dengan value sebelumnya",
      });
    }

    let user = await userModel.findAll({
      where: {
        [Op.and]: [
          { id: { [Op.ne]: idUser } },
          {
            [Op.or]: [
              { nama_user: dataUser.nama_user },
              { email: dataUser.email },
            ],
          },
        ],
      },
    });

    if (user.length > 0) {
      return response.status(400).json({
        success: false,
        message: "Cari nama atau email lain",
      });
    }

    userModel
      .update(dataUser, { where: { id: idUser } })
      .then((result) => {
        return response.json({
          success: true,
          message: `Data user has been updated`,
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
exports.deleteUser = async (request, response) => {
  let idUser = request.params.id;

  let getId = await userModel.findAll({
    where: {
      [Op.and]: [{ id: idUser }],
    },
  });

  if (getId.length === 0) {
    return response.status(400).json({
      success: false,
      message: "User dengan id tersebut tidak ada",
    });
  }

  const user = await userModel.findOne({ where: { id: idUser } });

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
      return response.status(400).json({
        success: false,
        message: error.message,
      });
    });
};

exports.findAllCustomer = async (request, response) =>{
  let user = await userModel.findAll({where:{role:"customer"}});
  if (user.length === 0) {
    return response.status(400).json({
      success: false,
      message: "nothing user to show",
    });
  } else {
    return response.json({
      success: true,
      data: user,
      message: `All User have been loaded`,
    });
}
}

exports.findAllExcCustomer = async (request, response) =>{
  let user = await userModel.findAll({where: {
    [Op.not]: [{ role:"customer"  }],
  }});
  if (user.length === 0) {
    return response.status(400).json({
      success: false,
      message: "nothing user to show",
    });
  } else {
    return response.json({
      success: true,
      data: user,
      message: `All User have been loaded`,
    });
}
}

exports.RegisterCustomer = (request, response) => {
  upload(request, response, async (error) => {
    if (error) {
      return response.status(400).json({ message: error });
    }
    if (!request.file) {
      return response.status(400).json({ message: `harap mengupload foto dan pastikan semua sudah terisi` });
    }

    
    let newUser = {
      nama_user: request.body.nama_user,
      foto: request.file.filename,
      email: request.body.email,
      password: md5(request.body.password),
      role: "customer",
    };

    let user = await userModel.findAll({
      where: {
        [Op.or]: [{ nama_user: newUser.nama_user }, { email: newUser.email }],
      },
    });

    if (
      newUser.nama_user === "" ||
      newUser.email === "" ||
      newUser.password === "" 
    ) {
      //karena gagal hapus foto yang masuk
      const oldFotoUser = newUser.foto;
      const patchFoto = path.join(__dirname, `../foto_user`, oldFotoUser);
      if (fs.existsSync(patchFoto)) {
        fs.unlink(patchFoto, (error) => console.log(error));
      }

      return response.status(400).json({
        success: false,
        message: "Harus diisi semua",
      });
    } else {
      //nama dan email tidak boleh sama
      if (user.length > 0) {
        //karena gagal hapus foto yang masuk
        const oldFotoUser = newUser.foto;
        const patchFoto = path.join(__dirname, `../foto_user`, oldFotoUser);
        if (fs.existsSync(patchFoto)) {
          fs.unlink(patchFoto, (error) => console.log(error));
        }
        return response.status(400).json({
          success: false,
          message: "Cari nama atau email lain",
        });
      } else {
        console.log(newUser);
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
            return response.status(400).json({
              success: false,
              message: error.message,
            });
          });
      }
    }
  });
};