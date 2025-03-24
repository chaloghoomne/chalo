import React, { useState, useEffect } from "react";
import { MdOutlineStar } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  getCountryId,
  getselectedCountry,
} from "../../../redux/actions/package-id-actions";
import ImagePlaceholder from "./ImagePlaceholder";

const VisaCard = ({ image, city, country, price, rating, description, id, altImage }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [finalValue, setFinalValue] = useState(30);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const generateSlug = (title) => 
    title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

  const handleRedirect = (id, name) => {
    dispatch(getselectedCountry(name));
    dispatch(getCountryId(id));
    navigate(`/visa-types/${generateSlug(country)}-${id}`);
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
    <div 
      className="w-full md:max-w-xl items-start self-start cursor-pointer bg-white rounded-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-500 ease-out hover:shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div onClick={() => handleRedirect(id, country)} className="relative group">
        <div className="relative w-full overflow-hidden">
          {imageLoaded ? (
            <img
              className={`w-full rounded-t-2xl object-cover md:h-[200px] 2xl:h-[200px] max-h-[200px] transition-all duration-700 ease-out ${
                isHovered ? 'scale-110 brightness-[1.02]' : 'scale-100'
              }`}
              src={image}
              alt={altImage || country}
            />
          ) : (
            <ImagePlaceholder />
          )}
          {/* Animated gradient background */}
          <div 
            className={`absolute inset-0 left-5 -z-10 w-[80%] rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 blur-md transition-all duration-500 ${
              isHovered ? 'opacity-85 scale-105' : 'opacity-65 scale-100'
            }`}
          />
          {/* Overlay gradient */}
          <div 
            className={`absolute inset-0 bg-gradient-to-t from-black/30 to-transparent transition-opacity duration-500 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>
      </div>
      <div className="w-full transform transition-transform duration-500">
        <h3
          onClick={() => handleRedirect(id, country)}
          className={`text-lg px-4 py-1 mt-2 poppins-seven font-bold transition-all duration-300 ${
            isHovered ? 'text-blue-600 translate-x-1' : ''
          }`}
        >
          {country}
        </h3>
        <div
          style={{ borderRadius: "0px 0px 16px 16px" }}
          className={`flex items-center py-2 px-4 w-full justify-between transition-all duration-500 ${
            isHovered ? 'bg-[#F7F7F7FF]' : 'bg-[#F7F7F780]'
          }`}
        >
          <div className="flex flex-col gap-1">
            <span className="text-sm text-[#0C111F99]">{rating}</span>
            <span className={`text-md poppins-seven font-semibold transition-all duration-300 ${
              isHovered ? 'text-blue-600 translate-x-1' : ''
            }`}>
              ₹{price}
            </span>
          </div>

          <button
            onClick={() => handleRedirect(id, country)}
            className={`bg-gradient-to-r from-[#3180CA] to-[#7AC7F9] text-white py-2 px-6 rounded-full self-center text-xs shadow-lg poppins-five transition-all duration-500 ${
              isHovered 
                ? 'shadow-[0_8px_16px_-4px_rgba(49,128,202,0.5)] translate-x-1 px-8' 
                : 'shadow-[#a4d3f3]'
            }`}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisaCard;