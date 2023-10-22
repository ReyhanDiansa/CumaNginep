import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MdOutlineBedroomChild } from "react-icons/md";

const TypeCard = ({ title, description, price, foto, link, available }) => {
  return (  
    <div className="z-10 relative">
      <Link
        href={link}
        className="flex flex-col items-center bg-white border border-gray-200 rounded-lg drop-shadow-md md:flex-row md:max-w-lg hover:bg-gray-100 "
      >
        <Image
          className="object-cover w-full rounded-t-lg h-64 md:h-[10rem] md:w-48 md:rounded-none md:rounded-l-lg"
          src={`http://localhost:8000/foto_tipe/${foto}`}
          alt="type image"
          width={200}
          height={200}
        />
        <div className="flex flex-col justify-between p-4 ">
          <h5 className="mb-2 text-2xl font-bold   text-[#024f79]">{title}</h5>
          <p className="mb-3 font-normal text-gray-700 ">{description.length > 100 ? description.slice(0, 50) + "..." : description}</p>
          <p>
            Rp <span className="text-[#024f79] font-semibold">{price}</span>{" "}
            /Malam
          </p>
          <div className="bg-[#bedceb] flex gap-3 mt-3 items-center px-2 rounded-md">
            <MdOutlineBedroomChild />{" "}
            <div className="flex">{available} Room Available</div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default TypeCard;
