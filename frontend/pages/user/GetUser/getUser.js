import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const GetUser = () => {
  const { data, error, mutate } = useSWR(
    "http://localhost:8000/user/getAll",
    fetcher
  );

  const router = useRouter()

  if (error) return <div>Failed to load user data.</div>;
  if (!data) return <div>Loading...</div>;

  const deleteUser =  (id) => {
    try {
       fetch(`http://localhost:8000/user/${id}`, {
         method: "DELETE"
       });
    
       router.push("/")
      
    } catch (error) {
      console.log(error);
    }
    
  };

  return (
    <div>
      <h1>User List</h1>
      <ul>
        {data.data.map((user) => (
          <li key={user.id}>
            <Link href={`/user/Detail/${user.id}`}>{user.nama_user}</Link>
            
            <button  onClick={() => deleteUser(user.id)}>Delete</button>
            
          </li>
        ))}
      </ul>
      <br />
      <Link href="/user/AddUser">Add User</Link>
    </div>
  );
};

export default GetUser;
