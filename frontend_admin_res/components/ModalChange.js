import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/ModalChange.module.css";
import Select from "react-select";
import { useRouter } from "next/router";

let token = "";
let config = {};
const ModalChangeStatus = ({ statusPem, id, onClose }) => {
  const router = useRouter();
  const [status, setStatus] = useState("");
  
  const SelectOption = [
    { value: "baru", label: "Baru" },
    { value: "checkin", label: "CheckIn" },
    { value: "checkout", label: "CheckOut" },
  ];

  useEffect(() => {
    token = window.localStorage.getItem("token");
    config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, []);

  const customStylesSelect = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#024f795d" : "e8e8f0",
      color: state.isSelected ? "black" : "black",
      ":hover": {
        backgroundColor: state.isSelected ? "" : "#024f795d",
      },
    }),
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#FFF",
      overflow: "auto",
      border: state.isFocused ? "2px solid gray" : "",
      boxShadow: state.isFocused ? "none !important" : "none",
      outline: "none",
      ":hover": {
        border: "2px solid gray",
      },
    }),
    menu: (provided, state) => ({
      ...provided,
      maxHeight: "200px",
    }),
  };

  const handleSave = async () => {
    let data = {
      status: status,
      idPemesanan: id,
    };
    console.log(data);
    try {
      await axios.post(
        "http://localhost:8000/pemesanan/ChangeStatus",
        data,
        config
      );
      console.log("berhasil update");
      router.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const onCloseModalS = () => onClose();

  const getDefaultOption = () => {  
    return SelectOption.find((item) => item.value === statusPem);
  };
  

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <div className={styles.title_modal}>
          <p className={styles.message}>Ubah Status Pemesanan</p>
          <p onClick={onCloseModalS} className={styles.icon_close}>
            X
          </p>
        </div>
        <div className={styles.select_containerModal}>
          <Select
            defaultValue={getDefaultOption()}
            options={SelectOption}
            onChange={(e) => setStatus(e.value)}
            styles={customStylesSelect}
            placeholder="Update Status"
          />
        </div>
        <button className={styles.save_button} onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default ModalChangeStatus;
