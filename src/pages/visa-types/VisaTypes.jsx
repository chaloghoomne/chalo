"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { fetchDataFromAPI } from "../../api-integration/fetchApi"
import { BASE_URL, NetworkConfig } from "../../api-integration/urlsVariable"
import Packages from "../packages/Packages"
import { useDispatch, useSelector } from "react-redux"
import { getVisaType } from "../../redux/actions/package-id-actions"
import { BsEmojiSmile } from "react-icons/bs"
import { FaCircleDot, FaPassport } from "react-icons/fa6"
import { MdTravelExplore, MdOutlineVerified } from "react-icons/md"
import { FaPlane, FaMapMarkedAlt } from "react-icons/fa"
import { calenderDate, returnCalenderDate } from "../../redux/actions/calender-date-action"
import { Helmet } from "react-helmet"
import { motion } from "framer-motion"

const VisaTypes = () => {
  const [selectedVisa, setSelectedVisa] = useState("Tourist")
  const [isLoading, setIsLoading] = useState(true)
  const selectedCountry = useSelector((state) => state.SelectedCountryReducer.selectedCountry)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [plans, setPlans] = useState()
  const [data, setData] = useState()
  const [data1, setData1] = useState()
  const [visatypes, setVisaTypes] = useState()
  const { id } = useParams()

  const { slug } = useParams() // Get slug from URL
  const [Id, setId] = useState(null)

  useEffect(() => {
    if (slug) {
      const extractedId = slug.split("-").pop()
      setId(extractedId)
    }
  }, [slug])

  useEffect(() => {
    const fetchData = async () => {
      if (!Id) return
      setIsLoading(true)
      try {
        const response = await fetchDataFromAPI("GET", `${BASE_URL}place/${Id}`)
        if (response.status === 503) {
          navigate("/503") // Redirect to Service Unavailable page
        }
        if (response) {
          setVisaTypes(response?.data?.tourTypes)
          setSelectedVisa(response?.data?.tourTypes[0]?._id)
          setData1(response.data)
          handleplans(response?.data?.tourTypes[0]?._id, response?.data?.tourTypes[0]?.name)
        }
      } catch (error) {
        navigate("/503")
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [Id, navigate])

  useEffect(() => {
    dispatch(returnCalenderDate(null))
    dispatch(calenderDate(null))
  }, [dispatch])

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await fetchDataFromAPI("GET", `${BASE_URL}${NetworkConfig.GET_HEADING_BY_ID}/VisaTypes`)
        if (response.status === 503) {
          navigate("/503") // Redirect to Service Unavailable page
        }
        if (response) {
          setData(response.data)
        }
      } catch (error) {
        navigate("/503")
        console.log(error)
      }
    }
    fetchProfileImage()
  }, [navigate])

  const handleplans = async (visaTypeId, name) => {
    setIsLoading(true)
    setSelectedVisa(visaTypeId)
    dispatch(getVisaType(name))
    try {
      const response = await fetchDataFromAPI("POST", `${BASE_URL}visa-category-by-package`, {
        package: Id,
        tourType: visaTypeId,
      })
      if (response.status === 503) {
        navigate("/503") // Redirect to Service Unavailable page
      }
      if (response) {
        setPlans(response.data)
      }
    } catch (error) {
      navigate("/503")
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Get a suitable icon based on visa type name
  const getVisaIcon = (name) => {
    const nameLower = name?.toLowerCase() || ""
    if (nameLower.includes("tourist")) return <MdTravelExplore size={28} />
    if (nameLower.includes("business")) return <FaPassport size={28} />
    if (nameLower.includes("student")) return <FaMapMarkedAlt size={28} />
    return <FaPlane size={28} />
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 bg-gradient-to-b from-white to-orange-50">
      <Helmet>
        <meta charSet="utf-8" />
        <title>{data1?.metaTitle || " "}</title>
        <meta name="description" content={data1?.metaDescription} />
        <meta name="keywords" content={data1?.metaKeywords} />
        <link rel="canonical" href="https://chaloghoomne.com/" />
      </Helmet>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full text-center mb-12"
      >
        <div className="inline-block px-4 py-1 bg-orange-100 text-orange-600 rounded-full mb-4">
          {selectedCountry} Visa Application
        </div>
        <h1 className="text-4xl md:text-5xl poppins-six font-bold mb-6 bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
          Your Gateway to {selectedCountry}
        </h1>
        {/* <p className="text-gray-700 poppins-four text-lg md:text-xl max-w-3xl mx-auto">{data1?.description}</p> */}
      </motion.div>

      {/* Process Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-wrap justify-center gap-4 mb-16 max-w-4xl"
      >
        {[
          { icon: <FaPassport size={24} />, text: "Choose Visa Type" },
          { icon: <MdOutlineVerified size={24} />, text: "Select Package" },
          { icon: <FaPlane size={24} />, text: "Apply & Travel" },
        ].map((step, index) => (
          <div key={index} className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-500 text-white">
              {step.icon}
            </div>
            <span className="ml-3 text-gray-700 font-medium">{step.text}</span>
            {index < 2 && <div className="hidden md:block mx-4 w-8 h-0.5 bg-orange-300"></div>}
          </div>
        ))}
      </motion.div>

      {/* Visa Types */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full max-w-5xl mb-12"
      >
        <h2 className="text-2xl font-bold text-center mb-8">Select Your Visa Type</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {isLoading && !visatypes
            ? // Loading skeleton for visa types
              Array(3)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="p-4 min-w-48 w-48 h-48 flex flex-col justify-center items-center border rounded-[30px] bg-gray-100 animate-pulse"
                  >
                    <div className="w-32 h-32 rounded-2xl bg-gray-200"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded mt-4"></div>
                  </div>
                ))
            : visatypes?.map((visa) => (
                <motion.div
                  key={visa?._id}
                  whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-4 relative min-w-48 w-48 h-48 flex flex-col justify-center items-center border rounded-[30px] shadow-md text-center cursor-pointer transition-all duration-300 ${
                    selectedVisa === visa?._id
                      ? "border-orange-500 bg-orange-50 shadow-orange-200"
                      : "border-gray-300 hover:border-orange-300 bg-white"
                  }`}
                  onClick={() => handleplans(visa?._id, visa?.name)}
                >
                  {selectedVisa === visa?._id && (
                    <div className="absolute top-3 right-3">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                        <FaCircleDot size={12} color="white" />
                      </div>
                    </div>
                  )}
                  <div className="relative">
                    <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                      {getVisaIcon(visa?.name)}
                    </div>
                    <img
                      src={visa?.image || "/placeholder.svg"}
                      alt={visa?.name}
                      className="max-w-32 max-h-32 min-w-32 min-h-32 rounded-2xl object-cover mt-3 border border-gray-100"
                    />
                  </div>
                  <p className="font-semibold my-2 text-gray-800">{visa?.name}</p>
                </motion.div>
              ))}
        </div>
      </motion.div>

      {/* Happy Travelers Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full max-w-4xl mb-12"
      >
        <div className="bg-gradient-to-r from-orange-100 to-orange-50 rounded-2xl p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="bg-white p-4 rounded-full">
              <BsEmojiSmile size={40} className="text-orange-500" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-orange-600 mb-2">100,000+ Happy Travelers</h3>
              <p className="text-gray-700 poppins-five">
                Chalo Ghoomne has brought joy to over 100,000 happy travellers! Join our community of explorers.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Packages Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="w-full max-w-5xl"
      >
        {isLoading ? (
          // Loading skeleton for packages
          <div className="w-full flex flex-col items-center">
            <div className="h-8 w-48 bg-gray-200 rounded mb-8 animate-pulse"></div>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array(4)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="h-64 bg-gray-100 rounded-xl animate-pulse"></div>
                ))}
            </div>
          </div>
        ) : plans?.length < 1 ? (
          <div className="text-center py-16 px-4">
            <div className="inline-block p-4 bg-orange-100 rounded-full mb-6">
              <MdTravelExplore size={40} className="text-orange-500" />
            </div>
            <p className="text-md text-orange-600 poppins-seven font-bold mb-2">COMING SOON</p>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">We're preparing something amazing!</h2>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              Our team is working on exciting new packages for this visa type. Check back soon or explore our other visa
              options.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Explore Other Visa Types
            </button>
          </div>
        ) : (
          <>
            
            <Packages plans={plans} />
          </>
        )}
      </motion.div>
    </div>
  )
}

export default VisaTypes

