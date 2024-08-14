import React, { useState } from "react";
import { FiPhone } from "react-icons/fi";
import { MdOutlineMail } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import EditProfile from "./EditProfile";

function ProfileCard({ user }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white shadow-md  relative justify-evenly rounded-lg p-4 flex items-center space-x-4 w-full  ">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <img
          src={
            user?.image ||
            "https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425_640.png"
          }
          alt="Avatar"
          className="w-24 h-24 rounded-lg border border-gray-300"
        />
      </div>

      {/* User Details */}
      <div className="flex-grow">
        <h2 className="text-2xl font-semibold">
          {user?.firstName} {user?.lastName}
        </h2>
        <div className="flex sm:flex-row flex-col  items-start sm:items-center space-x-2 mt-1">
          <span className="text-gray-500 flex justify-center items-center ">
            <MdOutlineMail size={22} color="#3180CA" />
            {user?.email}
          </span>
          <span className="text-gray-500 flex justify-center items-center">
            <FiPhone size={22} color="#3180CA" />
            {user?.phoneNumber}
          </span>
        </div>
      </div>

      {/* Passport Details */}
      {/* <div className="hidden md:flex flex-col md:flex-row items-center justify-evenly space-x-4 md:w-1/2">
        <div className="text-gray-600 text-center">
          <p className="font-semibold text-xl">Passport Number</p>
          <p className="font-semibold">{user?.passportNumber}</p>
        </div>
        <div className="text-gray-600 text-center">
          <p className="font-semibold text-xl">Passport Expiry</p>
          <p className="font-semibold">{user?.passportExpiry?.slice(0, 10)}</p>
        </div>
      </div> */}

      {/* Edit Button */}
      <div className="flex-shrink-0  right-3 top-2 absolute">
        <button
          onClick={() => setIsModalOpen(true)}
          className=" text-white rounded-full p-2 transition duration-300 ease-in-out"
        >
          <FaRegEdit size={22} color="#3180CA" />
        </button>
      </div>
      <EditProfile isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default ProfileCard;
