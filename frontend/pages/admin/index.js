import Drawer from "../../components/Drawer";
import React, { useState, useEffect } from "react";
import styles from "../../styles/Home.module.css";
import { BsCurrencyDollar } from "react-icons/bs";
import { BiUser } from "react-icons/bi";
import { MdMeetingRoom } from "react-icons/md";
import { FaBed } from "react-icons/fa";
import axios from "axios";

let token = "";
let config = {};
const index = () => {
  const [dataUser, setDataUser] = useState([]);
  const [dataRoom, setDataRoom] = useState([]);
  const [dataType, setDataType] = useState([]);
  const [today, setToday] = useState([]);
  const [InMonth, setInMonth] = useState([]);

  const getDataUser = async () => {
    try {
      const item = await axios.get("http://localhost:8000/user/getAll", config);
      console.log(item);
      setDataUser(item.data.data);
    } catch (er) {
      console.log(er);
    }
  };

  const getDataRoom = async () => {
    try {
      const item = await axios.get(
        "http://localhost:8000/kamar/getAll",
        config
      );
      console.log(item);
      setDataRoom(item.data.data);
    } catch (er) {
      console.log(er);
    }
  };

  const getDataType = async () => {
    try {
      const item = await axios.get("http://localhost:8000/tipe/getAll", config);
      console.log(item);
      setDataType(item.data.data);
    } catch (er) {
      console.log(er);
    }
  };

  const getIncomeToday = async () => {
    try {
      const item = await axios.get(
        "http://localhost:8000/pemesanan/Today",
        config
      );
      setToday(item.data.data);
    } catch (er) {
      console.log(er);
    }
  };

  const getIncomeMonth = async () => {
    try {
      const item = await axios.get(
        "http://localhost:8000/pemesanan/Month",
        config
      );
      console.log(item);
      setInMonth(item.data.data);
    } catch (er) {
      console.log(er);
    }
  };

  useEffect(() => {
    token = window.localStorage.getItem("token");
    config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    getDataUser();
    getDataRoom();
    getDataType();
    getIncomeToday();
    getIncomeMonth();
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <div>
        <Drawer />
      </div>
      <div>
        <div className={styles.income}>
          {today?.total === "0" || today?.total === undefined ? (
            <div className={styles.today}>
              <div className={styles.today_title}>
                <h4>Pemasukan Hari ini</h4>
              </div>
              <div className={styles.today_info}>
                <div className={styles.today_icon}>
                  <BsCurrencyDollar />
                </div>
                <h1>Rp 0</h1>
              </div>
            </div>
          ) : (
            <div className={styles.today}>
              <div className={styles.today_title}>
                <h4>Pemasukan Hari ini</h4>
              </div>
              <div className={styles.today_info}>
                <div className={styles.today_icon}>
                  <BsCurrencyDollar />
                </div>
                <h1>Rp {today.total === "0" ? "0" : today.total}</h1>
              </div>
            </div>
          )}
          {InMonth?.total === "0" || InMonth?.total === undefined ? (
            <div className={styles.today}>
              <div className={styles.today_title}>
                <h4>Pemasukan Bulan ini</h4>
              </div>
              <div className={styles.today_info}>
                <div className={styles.today_icon}>
                  <BsCurrencyDollar />
                </div>
                <h1>Rp 0</h1>
              </div>
            </div>
          ) : (
            <div className={styles.today}>
              <div className={styles.today_title}>
                <h4>Pemasukan Bulan ini</h4>
              </div>
              <div className={styles.today_info}>
                <div className={styles.today_icon}>
                  <BsCurrencyDollar />
                </div>
                <h1>Rp {InMonth.total === "0" ? "0" : InMonth.total}</h1>
              </div>
            </div>
          )}
        </div>
        <div className={styles.info_jumlah}>
          <div className={styles.user_info}>
            <div className={styles.user_title}>
              <h4>User</h4>
            </div>
            <div className={styles.user_detail}>
              <div className={styles.user_icon}>
                <BiUser />
              </div>
              <h2>{dataUser.length}</h2>
            </div>
          </div>
          <div className={styles.user_info}>
            <div className={styles.user_title}>
              <h4>Room</h4>
            </div>
            <div className={styles.user_detail}>
              <div className={styles.user_icon}>
                <MdMeetingRoom />
              </div>
              <h2>{dataRoom.length}</h2>
            </div>
          </div>
          <div className={styles.user_info}>
            <div className={styles.user_title}>
              <h4>Room Type</h4>
            </div>
            <div className={styles.user_detail}>
              <div className={styles.type_icon}>
                <FaBed />
              </div>
              <h2>{dataType.length}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;
