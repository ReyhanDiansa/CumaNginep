import Drawer from "../../../../components/Drawer";
import React, { useState, useEffect } from "react";
import styles from "../../../../styles/Note.module.css";
import Image from "next/image";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import axios from "axios";
import moment from "moment";

const Note = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log(id);
  const [data, setData] = useState([]);
  const [night, setNight] = useState("");
  const downloadAsPdf = () => {
    if (typeof window !== "undefined") {
      const element = document.getElementById("note_container");
      const opt = {
        margin: 0,
        filename: "note.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 4 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
      import("html2pdf.js").then((module) => {
        module.default().set(opt).from(element).save();
      });
    }
  };

  let token = "";
  let config = {};

  const GetOneTransaction = async () => {
    try {
      console.log("ini" + id);
      const fetchData = await axios.post(
        `http://localhost:8000/pemesanan/findOne`,
        { id: id },
        config
      );
      console.log(fetchData.data.data);
      setData(fetchData.data.data);
     
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    token = window.localStorage.getItem("token");
    config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    if (id !== undefined) {
      GetOneTransaction();
    }
  }, [id]);

  useEffect(() => {
    if (data.tgl_check_in && data.tgl_check_out) {
      const startDate = moment(data.tgl_check_in);
      const endDate = moment(data.tgl_check_out);
      const duration = moment.duration(endDate.diff(startDate));
      const nights = Math.ceil(duration.asMilliseconds() / (1000 * 60 * 60 * 24));
      setNight(nights);
    }
  }, [data]);

  return (
    <>
      <div>
        <Button
          variant="outlined"
          onClick={downloadAsPdf}
          sx={{
            margin: "2rem 10rem",
            color: "#024f79",
            borderColor: "#024f79",
            "&:hover": {
              color: "#024f79",
              borderColor: "#024f79",
              backgroundColor: "#024f7911",
            },
          }}
        >
          Download
        </Button>
      </div>
      <div className={styles.note_wrapper}>
        <div className={styles.note_container} id="note_container">
          <div className={styles.note}>
            <div className={styles.note_title}>
              <div className={styles.title_info}>
                <div className={styles.logo}>
                  <Image
                    src="/logo_white.png"
                    width={200}
                    height={70}
                    alt="CumaNginep Logo"
                  />
                </div>
                <div>
                  <div className={styles.tgl_pesan}>
                    <h5>{data.nomor_pemesanan}</h5>
                  </div>
                  <div className={styles.tgl_akses}>
                    <div className={styles.checkin}>
                      <h3>Tgl Check In:</h3>
                      <p>{data.tgl_check_in}</p>
                    </div>
                    <div className={styles.checkout}>
                      <h3>Tgl Check Out:</h3>
                      <p>{data.tgl_check_out}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.note_body}>
              <div className={styles.header_body}>
                <div className={styles.kepada}>
                  <h3>Kepada / a.n:</h3>
                  <h1>{data.nama_pemesanan}</h1>
                  <h4>{data.email_pemesanan}</h4>
                </div>
                <div className={styles.invoice_title}>
                  <h1>Invoice</h1>
                  <h2>Hotel & Resto</h2>
                </div>
              </div>
              <div className={styles.invoice_body}>
                <h1 className={styles.layanan_title}>Layanan Hotel</h1>
                <table>
                  <thead>
                    <tr>
                      <th>Deskripsi</th>
                      <th>Nomor Kamar</th>
                      <th>Waktu (Malam)</th>
                      <th>Harga /Malam</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{data.nama_tipe_kamar}</td>
                      <td>{data.nomor_kamar}</td>
                      <td>{night}</td>
                      <td>{data.harga_tipe_kamar}</td>
                      <td>{data.harga}</td>
                    </tr>
                  </tbody>
                </table>
                <h1 className={styles.layanan_title}>Layanan Lain</h1>
                <table className={styles.table2}>
                  <thead>
                    <tr>
                      <th>Deskripsi</th>
                      <th>Jumlah</th>
                      <th>Harga Satuan</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                  </tbody>
                </table>
                <div className={styles.bayar}>
                  <div>
                    <div className={styles.bayar_info}>
                      <h4>Jumlah:</h4>
                      <h4>Rp {data.harga}</h4>
                    </div>
                    <div className={styles.bayar_info}>
                      <h4>Diskon:</h4>
                      <h4>-</h4>
                    </div>
                    <h2>
                      Total Bayar: <span>Rp {data.harga}</span>
                    </h2>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.thanks}>
              <h2>Terima Kasih Telah Menginap di CumaNginep</h2>
              <hr />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const index = () => {
  return (
    <div style={{ display: "flex" }}>
      <div>
        <Drawer />
      </div>
      <div>{Note()}</div>
    </div>
  );
};

export default index;
