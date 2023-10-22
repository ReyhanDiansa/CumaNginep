import { setTokenCookie } from './HandleCookie';
import axios from 'axios';
import jwt from "jsonwebtoken";


export const UserLogin = async (userData) => {
  const dataUser = jwt.decode(userData);
  const data = {
    email:dataUser.email,
    nama_user:dataUser.name,
    linkFoto:dataUser.picture
  }
  try {
    await axios.post('http://localhost:8000/user/RegisterLoginCustomer', data)
    setTokenCookie(userData);
    return { data: userData }
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch data" };
  }
};