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
import Image from "next/image";
import styles from "../../../../styles/User.module.css"
import ReverseMd5 from "reverse-md5";

let token = "";
let config = {};
const GetUser = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [error, setError] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [idUser, setIdUser] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [detail, setDetail] = useState([]);
  const pageSize = 10; 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);


let rev = ReverseMd5({
  lettersUpper: false,
  lettersLower: true,
  numbers: true,
  special: false,
  whitespace: true,
  maxLen: 12,
});
  const handleConfirm = async () => {
    try {
      const getData = await axios.delete(
        `http://localhost:8000/user/${idUser}`,
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
    setIdUser(id);
    setShowConfirmation(true);
  };

  const handleClose = () => {
    setIsShow(false);
  };

  const getData = async () => {
    try {
      const item = await axios.get("http://localhost:8000/user/findAllExcCustomer", config);
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
      const fetchData = await axios.get(
        `http://localhost:8000/user/findOne/${id}`,
        config
      );
      setDetail(fetchData.data.data);
      console.log(detail);
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
            <h4>User Detail</h4>
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
                  Object.entries(detail).map(([key, value]) =>
                    key === "foto" ? (
                      <tr key={key}>
                        <td>
                          <span>{key}</span>
                        </td>
                        <td>
                          {" "}
                          <Image
                            src={`http://localhost:8000/foto_user/${value}`}
                            alt="user foto"
                            width={200}
                            height={200}
                            style={{aspectRatio:"3/2", objectFit:"contain"}}
                          />
                        </td>
                      </tr>
                    ) : (
                      key === "password" ? (
                        <tr key={key}>
                        <td>
                          <span>{key}</span>
                        </td>
                        <td>: {rev(value).str}</td>
                      </tr>
                      ):(
                      <tr key={key}>
                        <td>
                          <span>{key}</span>
                        </td>
                        <td>: {value}</td>
                      </tr>
                      )
                    )
                  )}
              </tbody>
            </table>
          </div>
        </Modal>
      </div>
      <h1>User List</h1>
      <Button
        variant="outlined"
        onClick={() => router.push("/admin/user/AddUser")}
        sx={{
          marginTop: "2rem",
          color: "#024f79",
          borderColor: "#024f79",
          "&:hover": {
            color: "#024f79",
            borderColor: "#024f79",
            backgroundColor: "#024f7911",
          },
        }}
      >
        Add User
      </Button>
      {showConfirmation && (
        <ConfirmationDialog
          message="Are you sure you want to delete this item?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
      {loading ? (
        <div style={{ marginLeft: "35vw", marginTop: "5rem" }}>
          {error ? <div>{errorMessage}</div> : <SyncLoader color="#024f79" />}
        </div>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ marginTop: "1rem" }}>
            <Table sx={{ minWidth: 1130 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  {/* <StyledTableCell>No</StyledTableCell> */}
                  <StyledTableCell align="center">Name</StyledTableCell>
                  <StyledTableCell align="center">Email</StyledTableCell>
                  <StyledTableCell align="center">Detail</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data &&
                  currentData.map((item, index) => (
                    <StyledTableRow key={index}>
                      {/* <StyledTableCell component="th" scope="row">
                        {index + 1}
                      </StyledTableCell> */}
                      <StyledTableCell align="center">
                        {item.nama_user}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {item.email}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Button onClick={() => openModalDetail(item.id)}>
                          Lihat Detail
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
                          <Link href={`/admin/user/UpdateUser/${item.id}`}>
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

export default withAuth(GetUser);
