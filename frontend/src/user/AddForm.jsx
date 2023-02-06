import React, { useState } from 'react';
import axios from 'axios';

const AddFormUser = () => {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [role, setRole] = useState(null);

  const handleChangeFoto = e => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('foto', file);
    
    let newData={
      nama_user:user,
      foto:formData,
      email:email,
      password:password,
      role:role,
    }
    try {
      const res = await axios.post('http://localhost:8000', newData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleChange} />
      <input type="file" onChange={handleChangeFoto} />
      <input type="file" onChange={handleChange} />
      <input type="file" onChange={handleChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default AddFormUser;
