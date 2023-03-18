import React, { useState } from "react";
import useSWR from 'swr';
import { useRouter } from 'next/router';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const Index = () => {
  const [nama_user, setNama] = useState("");
  const [foto, setFoto] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const router = useRouter()

  const saveFile = (e) => {
    setFoto(e.target.files[0]);
  };

  const { data, error, mutate } = useSWR('http://localhost:8000/user', fetcher);

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
      await fetch("http://localhost:8000/user", {
        method: 'POST',
        body: formData,
      });
      
      // Update the data after successful form submission
      mutate();
      router.push('/user')
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
    </>
  );
};

export default Index;
