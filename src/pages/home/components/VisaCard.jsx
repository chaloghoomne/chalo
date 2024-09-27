import React, { useState, useEffect } from "react";
import { MdOutlineStar } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  getCountryId,
  getselectedCountry,
} from "../../../redux/actions/package-id-actions";
import ImagePlaceholder from "./ImagePlaceholder";

const VisaCard = ({ image, city, country, price, rating, description, id }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [finalValue, setFinalValue] = useState(30);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleRedirect = (id, name) => {
    dispatch(getselectedCountry(name));
    dispatch(getCountryId(id));
    navigate(`/visa-types/${id}`);
  };

  const handleseeMore = (value) => {
    setFinalValue(value);
  };

  useEffect(() => {
    const img = new Image();
    img.src = image;
    img.onload = () => setImageLoaded(true);
  }, [image]);

  return (
    <div className="max-w-[280px] items-start self-start min-w-[260px] cursor-pointer bg-white rounded-e-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <div className="relative ">
        <div className="relative w-full">
          {imageLoaded ? (
            <img
              className="w-full rounded-[24px] h-48 object-cover"
              src={image}
              alt={city}
            />
          ) : (
            <ImagePlaceholder />
          )}
          <div className="absolute inset-0 left-5 -z-10 w-[80%] rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 blur-md opacity-65"></div>
        </div>
        {/* <div className="absolute top-2 right-2 flex gap-2 justify-center items-center bg-black/20 text-sm text-white rounded-full px-2 py-1 shadow">
          <MdOutlineStar size={15} color="yellow" /> {rating}
        </div> */}
      </div>
      <div className="w-full">
        <h3 className="text-lg px-4 py-1 mt-2 poppins-seven font-bold">
          {country}
        </h3>
        <p className="text-gray-500 text-sm poppins-three min-h-14 max-h-14 overflow-auto py-2 px-4 mb-4">
          {description?.length < finalValue
            ? description
            : `${description?.slice(0, 50)}...`}
          {description?.length > finalValue ? (
            <span
              onClick={() => handleseeMore(10000)}
              className="text-blue-500 cursor-pointer"
            >
              see more
            </span>
          ) : (
            <span
              onClick={() => handleseeMore(30)}
              className="text-blue-500 cursor-pointer"
            >
              hide
            </span>
          )}
        </p>
        <div
          style={{ borderRadius: "0px 0px 16px 16px" }}
          className="flex items-center py-2 px-4 w-full bg-[#F7F7F780] justify-between"
        >
          <div className="flex flex-col gap-1">
            <span className="text-sm text-[#0C111F99]">{country}</span>
            <span className="text-md poppins-seven font-semibold">
              ₹{price}
            </span>
          </div>

          <button
            onClick={() => handleRedirect(id, country)}
            className="bg-gradient-to-r from-[#3180CA] to-[#7AC7F9] text-white py-2 px-6 rounded-full self-center text-xs shadow-lg poppins-five shadow-[#a4d3f3] transition-colors duration-300"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisaCard;
