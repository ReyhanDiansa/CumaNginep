import React, { useEffect, useState } from "react";
import axios from "axios";


export default  function Dashboard() {
    const [data, setData] = useState([])
    const getData = async () => {
        try{
            const res = await axios.get("http://localhost:8000/kamar/getAll");
            console.log(res.data)
            setData(res.data)
        }catch (err) {
            console.log(err);
        }
    }

    useEffect(()=>{
        getData();
    },[])
    return (
        <div>
            <div>dashboard</div>
            <div>
               {data.map((element)=>(
               <p>{element.nomor_kamar}</p>
                ))}

            </div>
        </div>
    )
};