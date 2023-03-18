import React, { useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import md5 from "md5";
import Image from "next/image";


const fetcher = (url) => fetch(url).then((res) => res.json());

const UpdateUser = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, error, mutate } = useSWR(
    `http://localhost:8000/user/findOne/${id}`,
    fetcher
  );
  console.log(data);
  const [nama_user, setNama] = useState(data.data.nama_user);
  const [foto, setFoto] = useState(data.data.foto);
  const [email, setEmail] = useState(data.data.email);
  const [password, setPassword] = useState(data.data.password);
  const [role, setRole] = useState(data.data.role);
  const [filePreview, setFilePreview] = useState(data.data.foto ? `/foto_user/${data.data.foto}` : null);
  //   const [formData, setFormData] = useState({});
  //   const { nama_user, email, role } = data.data;
  console.log(foto);
  
  if (error) return <div>Failed to load user data.</div>;
  if (!data) return <div>Loading...</div>;

  const saveFile = (e) => {
    const selectedFile = e.target.files[0];
    setFoto(selectedFile);
    setFilePreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();      
      formData.append("nama_user", nama_user);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", role);
      formData.append("foto", foto);
      
    
    

    // Append the form data

    try {
      await fetch(`http://localhost:8000/user/${id}`, {
        method: "PUT",
        body: formData,
      });
      router.push("/user");
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <div>
      <h1>Edit User</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="nama_user">Name</label>
        <input
          type="text"
          id="nama_user"
          name="nama_user"
          onChange={(e) => setNama(e.target.value)}
          defaultValue={nama_user}
        />

        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          defaultValue={email}
        />

        <label htmlFor="password">Password</label>
        <input
          type="text"
          id="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          defaultValue={md5(password)}
        />

        <label htmlFor="role">Role</label>
        <select
          id="role"
          name="role"
          onChange={(e) => setRole(e.target.value)}
          defaultValue={role}
        >
          <option value=""></option>

          <option value="admin">Admin</option>
          <option value="resepsionis">Resepsionis</option>
        </select>

        <label htmlFor="foto">Foto</label>
      
      <input type="file" id="foto" name="foto" onChange={saveFile} />

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default UpdateUser;
