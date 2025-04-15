"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { fetchDataFromAPI } from "../../api-integration/fetchApi"
import { BASE_URL, NetworkConfig } from "../../api-integration/urlsVariable"
import { toast } from "react-toastify"
import {  FaCalendarAlt, FaHourglassHalf, FaClock } from "react-icons/fa"
import { FaCircleDot } from "react-icons/fa6";

import { FaArrowRight, FaCheck } from "react-icons/fa6"
import { Helmet } from "react-helmet"
import { motion, AnimatePresence } from "framer-motion"

const Packages = ({ plans }) => {
  const navigate = useNavigate()
  const [selected, setSelected] = useState("")
  const [data, setData] = useState()
  const [heading, setHeading] = useState()
  const [state, setState] = useState()
  const [filteredData, setFilteredData] = useState()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProfileImage = async () => {
      setIsLoading(true)
      try {
        const response = await fetchDataFromAPI("GET", `${BASE_URL}${NetworkConfig.GET_HEADING_BY_ID}/Recommendations`)
        if (response) {
          setData(response.data)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfileImage()
  }, [])

  useEffect(() => {
    if (!Array.isArray(plans)) return // Prevent errors if plans is undefined

    const sortedPlans = [...plans]

    if (state === "Recent") {
      sortedPlans.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    } else if (state === "Priced") {
      sortedPlans.sort((a, b) => a.price - b.price)
    }

    setFilteredData(sortedPlans)
  }, [plans, state])

  console.log(filteredData)

  const handleselect = (id, heading) => {
    setSelected(id)
    setHeading(heading)
  }

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "")
  }

  const handleRedirect = () => {
    if (!selected || !heading) {
      toast.error("First select the Package")
      return
    }

    const slug = generateSlug(heading) // Generate slug safely
    navigate(`/visa-details/${slug}-${selected}`)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <div className="flex flex-col items-center justify-center md:px-0 px-5 pt-12 pb-16 relative">
      <Helmet>
        <meta charSet="utf-8" />
        <link rel="canonical" href="https://chaloghoomne.com/" />
      </Helmet>

      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-blue-50 rounded-full opacity-50 -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-orange-50 rounded-full opacity-50 translate-x-1/4 translate-y-1/4 blur-3xl"></div>

      {/* Header section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <span className="inline-block px-4 py-1 bg-orange-100 text-orange-600 rounded-full mb-2 font-medium">
          RECOMMENDATIONS
        </span>
        <h2 className="text-3xl md:text-4xl font-bold poppins-five bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          {data?.heading || "Choose Your Perfect Package"}
        </h2>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
          Select the visa package that best suits your travel needs and requirements
        </p>
      </motion.div>

      {/* Filter buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-wrap justify-center gap-4 mb-8"
      >
        <button
          onClick={() => setState("Recent")}
          className={`px-5 py-2.5 rounded-full flex items-center gap-2 transition-all duration-300 ${
            state === "Recent"
              ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg shadow-blue-200"
              : "bg-white border border-blue-200 text-blue-600 hover:border-blue-400"
          }`}
        >
          <FaClock className={state === "Recent" ? "text-white" : "text-blue-500"} />
          <span>Most Recent</span>
          {state === "Recent" && <FaCheck size={12} className="ml-1" />}
        </button>
        <button
          onClick={() => setState("Priced")}
          className={`px-5 py-2.5 rounded-full flex items-center gap-2 transition-all duration-300 ${
            state === "Priced"
              ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg shadow-blue-200"
              : "bg-white border border-blue-200 text-blue-600 hover:border-blue-400"
          }`}
        >
          <span>Least Priced</span>
          {state === "Priced" && <FaCheck size={12} className="ml-1" />}
        </button>
      </motion.div>

      {/* Package cards */}
      <AnimatePresence>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6 w-full max-w-5xl"
        >
          {isLoading ? (
            // Loading skeletons
            Array(3)
              .fill(0)
              .map((_, index) => (
                <div key={`skeleton-${index}`} className="border rounded-[25px] border-gray-200 p-8 animate-pulse">
                  <div className="flex justify-between w-full">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="w-full flex flex-wrap gap-4 mt-6">
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))
          ) : filteredData?.length > 0 ? (
            filteredData.map((option, index) => (
              <motion.div
                key={option?._id || index}
                variants={itemVariants}
                onClick={() => handleselect(option?._id, option?.visaTypeHeading)}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1)" }}
                className={`border relative md:mx-auto rounded-[25px] md:w-[90%] p-6 md:p-8 cursor-pointer transition-all duration-300 overflow-hidden ${
                  selected === option?._id
                    ? "border-blue-500 bg-blue-50/30 shadow-md shadow-blue-100"
                    : "border-gray-200 hover:border-blue-300 bg-white"
                }`}
              >
                {/* Selection indicator */}
                <div className="absolute left-6 top-1/2 transform -translate-y-1/2 h-full flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      selected === option?._id ? "bg-blue-500" : "border-2 border-gray-300"
                    }`}
                  >
                    {selected === option?._id && <FaCheck size={10} className="text-white" />}
                  </div>
                </div>

                {/* Package type badge */}
                {option.type && (
                  <div className="absolute right-0 top-0">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-1.5 rounded-bl-2xl rounded-tr-[25px] font-medium text-sm shadow-sm">
                      {option?.type}
                    </div>
                  </div>
                )}

                {/* Main content with left padding for selection indicator */}
                <div className="pl-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-2 mb-4">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800">{option?.visaTypeHeading}</h3>
                    <div className="flex items-center">
                      <span className="text-lg md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                        ₹{option?.price}
                      </span>
                      {selected === option?._id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-3 bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-medium"
                        >
                          Selected
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-0 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                        <FaCalendarAlt size={14} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Stay Period</p>
                        <p className="text-sm font-semibold">{option?.period} Days</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                        <FaCheck size={14} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Validity</p>
                        <p className="text-sm font-semibold">{option?.validity} Days</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                        <FaHourglassHalf size={14} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Entry Type</p>
                        <p className="text-sm font-semibold">{option?.entryType}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                        <FaHourglassHalf size={14} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Processing Time</p>
                        <p className="text-sm font-semibold">{option?.processingTime} Business Days</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                <FaCircleDot size={24} className="text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">No Packages Available</h3>
              <p className="text-gray-600">Please check back later or try different filters</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Continue button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-12 relative z-10"
      >
        <button
          onClick={handleRedirect}
          disabled={!selected}
          className={`group relative overflow-hidden rounded-full px-10 py-4 text-lg font-medium transition-all duration-300 ${
            selected
              ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-xl shadow-blue-200/50 hover:shadow-2xl hover:shadow-blue-300/50 hover:translate-y-[-3px]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <span className="relative z-10 flex items-center gap-3">
            Continue to Details
            <FaArrowRight
              className={`transition-transform duration-300 ${selected ? "group-hover:translate-x-2" : ""}`}
            />
          </span>
          {selected && (
            <>
              <span className="absolute inset-0 z-0 bg-gradient-to-r from-blue-700 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="absolute -inset-3 z-0 bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></span>
            </>
          )}
        </button>
        {!selected && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-sm text-gray-500 mt-3 flex items-center justify-center gap-2"
          >
            <FaCircleDot size={10} className="text-blue-400" />
            Please select a package to continue
          </motion.p>
        )}
      </motion.div>
    </div>
  )
}

export default Packages

