import React from "react";
import styles from "../styles/ConfirmationDialog.module.css";

const ConfirmationDialog = ({ message, onConfirm,onReject, onCancel }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button className={styles.confirmButton} onClick={onConfirm}>
            Terima
          </button>
          <button className={styles.rejectButton} onClick={onReject}>
            Tolak
          </button>
          <button className={styles.cancelButton} onClick={onCancel}>
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;