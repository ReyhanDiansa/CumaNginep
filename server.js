const express = require(`express`);
const path = require("path");
const app = express();
const PORT = 8000;
const cors = require(`cors`);
app.use(cors());

var bodyParser = require("body-parser");
const moment = require("moment");
const moment2 = require("moment-timezone");

app.use(bodyParser.json());
// penggunaan body-parser untuk ekstrak data request dari body
app.use(bodyParser.urlencoded({ extended: true }));

const userRoute = require(`./routes/user_routes`);
const tipeRoute = require(`./routes/tipe_kamar_routes`);
const roomRoute = require(`./routes/kamar_routes`);
const pemesananRoute = require(`./routes/pemesanan_routes`);
app.use(`/tipe`, tipeRoute);
app.use(`/user`, userRoute);
app.use(`/kamar`, roomRoute);
app.use(`/pemesanan`, pemesananRoute);
app.use(express.static(__dirname));
app.use(express.static("foto_tipe_kamar"));
app.use(express.static("foto_user"));
app.use(
  "/foto_user",
  express.static(path.join(__dirname, "/path/to/foto_user"))
);

const Op = require(`sequelize`).Op;
// const date = require(`date-and-time`);
const Sequelize = require("sequelize");
const sequelize = new Sequelize("hotel_ukk", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

async function checkAndUpdateStatus() {
  let date = moment();
  let now = date.format("YYYY-MM-DD");

  // const date2 = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });
  // console.log(date2);
  const updateIn = `UPDATE pemesanans SET status_pemesanan = "checkin" WHERE tgl_check_in = '${now}' `;
  sequelize.query(updateIn, (error, results) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log("status update");
  });

  const updateOut = `UPDATE pemesanans SET status_pemesanan = "checkout" WHERE tgl_check_out = '${now}' `;
  sequelize.query(updateOut, (error, results) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log("status update");
  });
}

const now = moment().tz("Asia/Jakarta");
const timeString = now.format("h:mm A");
if (timeString === "12:00 PM") {
  setInterval(checkAndUpdateStatus, 20000);
}

app.listen(PORT, () => {
  console.log(`Server of School's Library runs on port
${PORT}`);
});
