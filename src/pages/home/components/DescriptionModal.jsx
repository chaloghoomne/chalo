// src/components/DescriptionModal.js
import React from "react";
import Modal from "react-modal";
import { MdClose } from "react-icons/md";

Modal.setAppElement("#root");

const DescriptionModal = ({
  isOpen,
  onRequestClose,
  image,
  city,
  country,
  description,
  price,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="fixed inset-0  flex items-center justify-center p-4 bg-black bg-opacity-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white rounded-2xl relative max-w-md max-h-[500px] mt-14 mx-auto p-6 ">
        <button
          onClick={onRequestClose}
          className=" absolute right-3 top-1  text-black font-bold text-lg self-end items-end "
        >
          <MdClose size={30} />
        </button>
        <div className="relative">
          <img
            className="w-full h-48 object-cover mt-2 rounded-t-2xl"
            src={image}
            alt={city}
          />
        </div>
        <div className="w-full max-h-[200px] overflow-auto ">
          <h3 className="text-lg px-4 py-1 font-bold">{country}</h3>
          <p
            style={{ overflowWrap: "anywhere" }}
            className="text-gray-500 py-2 px-4 mb-4"
          >
            {description}
          </p>
          <div
            style={{ borderRadius: "0px 0px 16px 16px" }}
            className="flex items-center py-2 px-4 w-full bg-[#F7F7F780] justify-between"
          >
            <div className="flex flex-col gap-1">
              <span className="text-sm text-gray-700">{country}</span>
              <span className="text-lg font-semibold">${price}</span>
            </div>
            <button className="mt-4 bg-gradient-to-r from-[#3180CA] to-[#7AC7F9] text-white py-2 px-4 rounded-full shadow transition-colors duration-300">
              Apply
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DescriptionModal;
