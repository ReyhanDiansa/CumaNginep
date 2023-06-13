import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import withAuth from "../../../withAuth";
import { SyncLoader } from "react-spinners";
import axios from "axios";
import ConfirmationDialog from "../../../../components/PopUpConfirm";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Modal from "react-modal";
import { AiOutlineClose } from "react-icons/ai";
import styles from "../../../../styles/User.module.css";



let token = "";
let config = {};
const GetTransaction = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [error, setError] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [idRoom, setIdRoom] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [detail, setDetail] = useState([]);
  const [check, setCheck] = useState([]);
  const pageSize = 2; 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handleConfirm = async () => {
    try {
      const getData = await axios.delete(
        `http://localhost:8000/pemesanan/${idRoom}`,
        config
      );
      setShowConfirmation(false);
    } catch (error) {
      setIsShow(true);
      setErrorMessage(error.response.data.message);
      setError(true);
    }
  };

  const handleCancel = async () => {
    setShowConfirmation(false);
  };

  const handleClick = (id) => {
    setIdRoom(id);
    setShowConfirmation(true);
  };

  const handleClose = () => {
    setIsShow(false);
  };

  const getData = async () => {
    try {
      const item = await axios.get(
        "http://localhost:8000/pemesanan/getAll",
        config
      );
      console.log(item);
      const totalItems = item.data.data.length;
      const totalPages = Math.ceil(totalItems / pageSize);
      setTotalPages(totalPages);
      setData(item.data.data);
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    } catch (er) {
      setIsShow(true);
      setErrorMessage(er.response.data.message);
      setError(true);

      console.log(er);
    }
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = data.slice(startIndex, endIndex);
  const tgl_akses = new Date(Date.now()).toISOString().slice(0, 10);

  console.log(check);
  useEffect(() => {
    token = window.localStorage.getItem("token");
    config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    getData();
  }, [showConfirmation]);

  const router = useRouter();

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#024f79",
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  const openModalDetail = async (id) => {
    try {
      const fetchData = await axios.post(
        `http://localhost:8000/pemesanan/findOne`,
        { id: id },
        config
      );
      console.log(fetchData.data.data);
      setDetail(fetchData.data.data);
      setOpenModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(detail);
  }, [detail]);

  const customStyles = {
    content: {
      top: "20%",
      left: "35%",
      right: "auto",
      bottom: "auto",
      padding: "1rem",
      width: "40%",
    },
  };

  function closeModal() {
    setOpenModal(false);
  }

  const RenderPageButtons = () => {
    const pageButtons = [];
  
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);
  
    if (startPage === 2) {
      pageButtons.push(
        <button key={1} onClick={() => handlePageChange(1)}
        style={{padding:"1rem",backgroundColor:"#024f79",color:"#fff",border:"none",borderRadius:"5px",marginLeft:"5px",cursor:"pointer"}}
        >
          1
        </button>
      );
    } else if (startPage > 2) {
      pageButtons.push(
        <button key={1} onClick={() => handlePageChange(1)}
        style={{padding:"1rem",backgroundColor:"#024f79",color:"#fff",border:"none",borderRadius:"5px",marginLeft:"5px",cursor:"pointer"}}
        >
          1
        </button>
      );
      pageButtons.push(<span style={{paddingTop:"10px",paddingLeft:"2px"}} key="dots1" >...</span>);
    }
  
    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          disabled={i === currentPage}
          style={{padding:"1rem",backgroundColor:"#024f79",color:"#fff",border:"none",borderRadius:"5px",marginLeft:"5px",cursor:"pointer",opacity: i === currentPage ? 0.5 : 1, pointerEvents: i === currentPage ? 'none' : 'auto'}}
        >
          {i}
        </button>
      );
    }
  
    if (endPage === totalPages - 1) {
      pageButtons.push(
        <button key={totalPages} onClick={() => handlePageChange(totalPages)}
        style={{padding:"1rem",backgroundColor:"#024f79",color:"#fff",border:"none",borderRadius:"5px",marginLeft:"5px",cursor:"pointer"}}
        >
          {totalPages}
        </button>
      );
    } else if (endPage < totalPages - 1) {
      pageButtons.push(<span style={{paddingTop:"10px",paddingLeft:"2px"}} key="dots2">...</span>);
      pageButtons.push(
        <button key={totalPages} onClick={() => handlePageChange(totalPages)}
        style={{padding:"1rem",backgroundColor:"#024f79",color:"#fff",border:"none",borderRadius:"5px",marginLeft:"5px",cursor:"pointer"}}
        >
          {totalPages}
        </button>
      );
    }
  
    return pageButtons;
  };

  return (
    <div>
      <Snackbar open={isShow} autoHideDuration={6000} onClose={handleClose}>
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleClose}
          severity="error"
        >
          {errorMessage}
        </MuiAlert>
      </Snackbar>
      <div className="popup">
        <Modal
          isOpen={openModal}
          // onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
          bodyOpenClassName=".popup"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            <h4>Transaction Detail</h4>
            <div
              style={{ cursor: "pointer", fontSize: "x-large" }}
              onClick={closeModal}
            >
              <AiOutlineClose />
            </div>
          </div>
          <div className={styles.detail_spec}>
            <table>
              <tbody>
                {detail &&
                  Object.entries(detail).map(([key, value]) => (
                    <tr key={key}>
                      <td>
                        <span>{key}</span>
                      </td>
                      <td>: {value}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Modal>
      </div>
      <h1>Transaction List</h1>
      {showConfirmation && (
        <ConfirmationDialog
          message="Are you sure you want to delete this item?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
      {loading ? (
        <div style={{ marginLeft: "35vw", marginTop: "5rem" }}>
          {error ? <div>{errorMessage}</div> : <SyncLoader color="#00058a" />}
        </div>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ marginTop: "1rem" }}>
            <Table sx={{ minWidth: 1200 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">nama_tamu</StyledTableCell>
                  <StyledTableCell align="center">nomor_kamar</StyledTableCell>

                  <StyledTableCell align="center">status</StyledTableCell>
                  <StyledTableCell align="center">tgl akses</StyledTableCell>
                  <StyledTableCell align="center">Detail</StyledTableCell>
                  <StyledTableCell align="center">
                    Nota Transaksi
                  </StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data &&
                  currentData.map((item, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell align="center">
                        {item.nama_tamu}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {item.nomor_kamar}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {item.status_pemesanan}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {item.tgl_check_in + " s/d " + item.tgl_check_out}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        <Button onClick={() => openModalDetail(item.id)}>
                          Lihat Detail
                        </Button>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Button
                          onClick={() =>
                            router.push(
                              `/admin/transaction/NotaTransaksi/${item.id}`
                            )
                          }
                        >
                          Lihat Nota
                        </Button>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Button
                          variant="outlined"
                          // style={{ margin: "0 0.5rem" }}
                          sx={{
                            margin: "0 0.5rem",
                            color: "#024f79",
                            borderColor: "#024f79",
                            "&:hover": {
                              color: "#024f79",
                              borderColor: "#024f79",
                              backgroundColor: "#024f7911",
                            },
                          }}
                        >
                          <Link href={`/admin/transaction/EditTransaction/${item.id}`}>
                            edit
                          </Link>
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleClick(item.id)}
                        >
                          hapus
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <br/>
      <div style={{display:"flex",justifyContent:"end"}}>
        <RenderPageButtons/>
      </div>
        </>
      )}
      <br />
    </div>
  );
};

export default withAuth(GetTransaction);
