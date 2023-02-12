import React, { useState } from "react";
import axios from "axios";
import "../../index.module.css";

const index = () => {
  const [nama_user, setNama] = useState("");
  const [foto, setFoto] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const saveFile = (e) => {
    setFoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append the form data
    formData.append("nama_user", nama_user);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);
    formData.append("foto", foto);

    try {
      const res = await axios.post("http://localhost:8000/user", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
    
    <form onSubmit={handleSubmit}>
      Nama:
      <input type="text" onChange={(e) => setNama(e.target.value)} />
      Email:
      <input type="text" onChange={(e) => setEmail(e.target.value)} />
      Password:
      <input type="text" onChange={(e) => setPassword(e.target.value)} />
      Role:
      <select onChange={(e) => setRole(e.target.value)}>
        <option value=""></option>
        <option value="admin">Admin</option>
        <option value="resepsionis">Resepsionis</option>
      </select>
      Foto:
      <input type="file" onChange={saveFile} />
      <button type="submit">Kirim</button>
    </form>
    <div className="bg-indigo-500 text-white text-center p-5">
      <h1 className="text-3xl font-medium">Welcome to Next.js with Tailwind CSS</h1>
    </div>
    </>
  );
};

export default index;
