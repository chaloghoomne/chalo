import React from 'react';
import { MdOutlineStar } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
const VisaCard = ({ image, city, country, price, rating }) => {

const navigate = useNavigate()

const handleRedirect = ()=>{
navigate("/visa-types")

}

  return (
    <div onClick={handleRedirect} className="max-w-xs  cursor-pointer mx-auto bg-white rounded-2xl  overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <div className="relative">
        <img className="w-full h-48 object-cover" src={image} alt={city} />
        <div className="absolute top-2 right-2 flex justify-center items-center bg-white text-sm text-gray-800 rounded-full px-2 py-1 shadow">
          {rating}<MdOutlineStar size={15} color="yellow" />
        </div>
      </div>
      <div className=" w-full">
        <h3 className="text-lg px-4 py-1 font-bold">{city}</h3>
        <p className="text-gray-500 py-2 px-4 mb-4">Lorem Ipsum is simply dummy text of the printing and...</p>
        <div style={{borderRadius:"0px 0px 16px 16px"}} className="flex items-center py-2 px-4 w-full bg-gray-300 justify-between">
          <div className='flex flex-col gap-1'>
          <span className="text-sm text-gray-700">{country}</span>
          <span className="text-lg font-semibold">${price}</span>
       </div>
        <button className="mt-4 bg-gradient-to-r from-[#3180CA] to-[#7AC7F9] text-white py-2 px-4 rounded-full shadow transition-colors duration-300">
          Apply
        </button>
         </div>
      </div>
    </div>
  );
};

export default VisaCard;
