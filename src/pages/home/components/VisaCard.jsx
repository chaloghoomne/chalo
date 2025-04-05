"use client"

import { useState, useEffect } from "react"
import { MdOutlineStar } from "react-icons/md"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { getCountryId, getselectedCountry } from "../../../redux/actions/package-id-actions"
import ImagePlaceholder from "./ImagePlaceholder"

const VisaCard = ({ image, city, country, price, rating, description, id, altImage }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [finalValue, setFinalValue] = useState(30)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const generateSlug = (title) =>
    title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "")

  const handleRedirect = (id, name) => {
    dispatch(getselectedCountry(name))
    dispatch(getCountryId(id))
    navigate(`/visa-types/${generateSlug(country)}-${id}`)
  }

  const handleseeMore = (value) => {
    setFinalValue(value)
  }

  useEffect(() => {
    const img = new Image()
    img.src = image
    img.onload = () => setImageLoaded(true)
  }, [image])

  return (
    <div
      className="w-full md:max-w-xl relative group bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-out hover:shadow-[0_20px_50px_rgba(8,112,184,0.15)]"
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      {/* Animated background blob - always visible on mobile without animation */}
      <div
        className={`absolute -z-10 w-full h-full bg-gradient-to-br from-blue-600/20 via-purple-500/20 to-blue-400/20 blur-2xl ${
          isMobile
            ? "opacity-30"
            : isHovered
              ? "scale-110 opacity-30 transition-all duration-700 ease-out"
              : "scale-100 opacity-0 transition-all duration-700 ease-out"
        }`}
      />

      <div onClick={() => handleRedirect(id, country)} className="relative overflow-hidden">
        {/* Image container with enhanced hover effects */}
        <div className="relative w-full overflow-hidden">
          {imageLoaded ? (
            <img
              className={`w-full rounded-t-2xl object-cover md:h-[220px] 2xl:h-[220px] max-h-[220px] ${
                isMobile
                  ? ""
                  : isHovered
                    ? "scale-105 filter saturate-[1.1] contrast-[1.05] transition-all duration-700 ease-out"
                    : "scale-100 transition-all duration-700 ease-out"
              }`}
              src={image || "/placeholder.svg"}
              alt={altImage || country}
            />
          ) : (
            <ImagePlaceholder />
          )}

          {/* Overlay gradient - always visible on mobile without animation */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent ${
              isMobile
                ? "opacity-70"
                : isHovered
                  ? "opacity-100 transition-all duration-500"
                  : "opacity-0 transition-all duration-500"
            }`}
          />

          {/* Country badge - always visible on mobile without animation */}
          <div
            className={`absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg ${
              isMobile
                ? "opacity-100"
                : isHovered
                  ? "translate-y-0 opacity-100 transform transition-all duration-500"
                  : "translate-y-4 opacity-0 transform transition-all duration-500"
            }`}
          >
            <span className="text-xs font-semibold text-blue-600">{country}</span>
          </div>

          {/* Rating badge - always visible on mobile without animation */}
          <div
            className={`absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-lg flex items-center gap-1 ${
              isMobile
                ? "opacity-100"
                : isHovered
                  ? "translate-y-0 opacity-100 scale-100 transform transition-all duration-500"
                  : "translate-y-4 opacity-0 scale-95 transform transition-all duration-500"
            }`}
          >
            <MdOutlineStar className="text-yellow-500" />
            <span className="text-xs font-semibold text-gray-800">{rating}</span>
          </div>
        </div>
      </div>

      {/* Card content with enhanced animations */}
      <div className="w-full p-4">
        <h3
          onClick={() => handleRedirect(id, country)}
          className={`text-lg poppins-seven font-bold ${
            isMobile
              ? "text-blue-600"
              : isHovered
                ? "text-blue-600 translate-x-1 transition-all duration-300"
                : "text-gray-800 transition-all duration-300"
          }`}
        >
          {country}
        </h3>

        {/* Price and apply button container */}
        <div className="flex items-center mt-3 w-full justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">Starting from</span>
            <span
              className={`text-lg poppins-seven font-bold ${
                isMobile
                  ? "text-blue-600"
                  : isHovered
                    ? "text-blue-600 transition-all duration-300"
                    : "text-gray-800 transition-all duration-300"
              }`}
            >
              ₹{price}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              handleRedirect(id, country)
            }}
            className={`relative overflow-hidden bg-gradient-to-r from-[#3180CA] to-[#7AC7F9] text-white py-2 px-6 rounded-full text-sm shadow-lg poppins-five ${
              isMobile
                ? "shadow-[0_8px_20px_-4px_rgba(49,128,202,0.5)] px-8"
                : isHovered
                  ? "shadow-[0_8px_20px_-4px_rgba(49,128,202,0.5)] px-8 transition-all duration-500"
                  : "transition-all duration-500"
            }`}
          >
            <span
              className={`relative z-10 ${isMobile ? "tracking-wider" : isHovered ? "tracking-wider transition-all duration-300" : "transition-all duration-300"}`}
            >
              Apply
            </span>

            {/* Button shine effect - disabled on mobile */}
            {!isMobile && (
              <span
                className={`absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/30 to-white/0 transform transition-transform duration-700 ${
                  isHovered ? "translate-x-full" : "-translate-x-full"
                }`}
              />
            )}
          </button>
        </div>

        {/* Bottom decorative line - always visible on mobile without animation */}
        <div
          className={`h-1 mt-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-500 ${
            isMobile
              ? "w-full opacity-100"
              : isHovered
                ? "w-full opacity-100 transition-all duration-500"
                : "w-0 opacity-0 transition-all duration-500"
          }`}
        />
      </div>
    </div>
  )
}

export default VisaCard

