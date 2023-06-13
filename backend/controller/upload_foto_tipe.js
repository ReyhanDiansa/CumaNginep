const multer = require(`multer`)
const path = require(`path`)
const express = require(`express`)
const app = express()
const fs = require(`fs`)
const randomstring = require("randomstring");
const tipeModel = require(`../models/index`).tipe_kamar;

const bodyParser = require('body-parser');
const { generate } = require("randomstring")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './foto_tipe_kamar';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, path.join(__dirname, `../foto_tipe_kamar`), function (err, sucess) {
            if (err) {
                throw err;
            }
        });
    },

    
    filename: (req, file, cb) => {
      const getFilenames = () => {
        return tipeModel.findAll().then((tipe) => {
          return tipe.map((t) => t.foto);
        });
      };
    
      const random = randomstring.generate(7);
      const extension = path.extname(file.originalname);
      const filename = path.basename(file.originalname, extension);
    
      getFilenames().then((filenames) => {
        let newFilename = `${filename}_${random}${extension}`;
        while (filenames.includes(newFilename)) {
          newFilename = `${filename}_${randomstring.generate(7)}${extension}`;
        }
        cb(null, newFilename);
      });
    }
    
      
})



const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const acceptedType = [`image/jpg`, `image/jpeg`, `image/png`]
        if (!acceptedType.includes(file.mimetype)) {
            cb(null, false)
            return cb(`Invalid file type(${file.mimetype})`)
        }

        const filesize = req.headers[`content-length`]
        const maxSize = (1 * 1024 * 1024)
        if (filesize > maxSize) {
            cb(null, false)
            return cb(`File size is too large`)
        }
        cb(null, true)
    }
})

module.exports = upload