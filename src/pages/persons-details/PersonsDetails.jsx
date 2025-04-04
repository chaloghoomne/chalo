"use client"

import { useEffect, useState } from "react"
import { IoMdCalendar } from "react-icons/io"
import { MdOutlinePersonAdd } from "react-icons/md"
import { IoDocumentsSharp } from "react-icons/io5"
import { RxPerson } from "react-icons/rx"
import { fetchDataFromAPI } from "../../api-integration/fetchApi"
import { BASE_URL } from "../../api-integration/urlsVariable"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { coTraveler } from "../../redux/actions/package-id-actions"
import { toast } from "react-toastify"
import ImageUpload from "../upload-image/ImageUpload"
import { Helmet } from "react-helmet"
import { login } from "../../redux/actions/login-actions"
import { RiVerifiedBadgeFill } from "react-icons/ri"
import axios from "axios"
import { FaPassport, FaCalendarAlt, FaEnvelope, FaPhone, FaUser, FaUserFriends } from "react-icons/fa"
import { MdFamilyRestroom } from "react-icons/md"

const PersonDetails = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const buttonShow = useSelector((state) => state.ShowButtonReducer.buttonShow)
  const countryId = useSelector((state) => state.CountryIdReducer.countryId)
  const childId = useSelector((state) => state.ChildSHowIdReducer.childId)
  const [showCoTravler, setShowCoTravler] = useState()
  const [childData, setChildData] = useState()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    fatherName: "",
    motherName: "",
    gender: "",
    ageGroup: "",
    email: "",
    passportNumber: "",
    dob: "",
    passportIssueDate: "",
    passportValidTill: "",
  })
  const [phone, setPhone] = useState("")
  const [phoneOtp, setPhoneOtp] = useState("")
  const [activeStep, setActiveStep] = useState(1)
  const [otpSentToPhone, setOtpSentToPhone] = useState(false)
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleFields = (e) => {
    const value = e.target.value
    const name = e.target.name
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  useEffect(() => {
    const fetchShowCoTraveler = async () => {
      try {
        const response = await fetchDataFromAPI("GET", `${BASE_URL}place/${countryId}`)

        if (response) {
          setShowCoTravler(response?.data?.showCoTraveller)
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchShowCoTraveler()
  }, [])

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await fetchDataFromAPI("GET", `${BASE_URL}visa-category/${childId}`)
        if (response) {
          setChildData(response.data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchProfileImage()
  }, [childId])

  const [importantPoints, setImportantPoints] = useState([])
  const [packageData, setPackageData] = useState({})
  const selectedDate = useSelector((state) => state.CalenderReducer.visaDate)
  const travlersCount = useSelector((state) => state.NumberOfTravelerReducer.travlersCount)
  const cotravlerId = useSelector((state) => state.CotravelerIdReducer.cotravlerId)
  const packageId = useSelector((state) => state.PackageIdReducer.packagedId)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchDataFromAPI("GET", `${BASE_URL}user-visa-order/${packageId}`)
        if (response) {
          setPackageData(response?.data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  const handlefurtherTravler = () => {}

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await fetchDataFromAPI("GET", `${BASE_URL}notes-by-package/${countryId}`)
        if (response) {
          const filtered = response?.data?.filter((item) => item.type === "Personal Details")

          setImportantPoints(filtered)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchProfileImage()
  }, [])

  useEffect(() => {
    if (formData.dob && formData.passportIssueDate) {
      calculatePassportValidity(formData.dob, formData.passportIssueDate)
    }
  }, [formData.dob, formData.passportIssueDate])

  

//   const calculatePassportValidity = (dob, issueDate) => {
//     const dobDate = new Date(dob)
//     const issueDateObj = new Date(issueDate)
//     const currentDate = new Date()

//     // Assuming passport is valid for 10 years from issue date
//     const validityPeriod = 10 * 365 * 24 * 60 * 60 * 1000 // 10 years in milliseconds
//     const validityDate = new Date(issueDateObj)

//     if (validityDate < dobDate) {
//       toast.error("Passport expiry date is earlier than date of birth.")
//       return ""
//     }

//     if (validityDate < currentDate) {
//       toast.error("Passport has expired.")
//       return ""
//     }

//     if(validityDate < issueDateObj) {

//       toast.error("Validity Can't be Less than Issue Date")

//   }
// }

  const sendPhoneOtp = async () => {
    if (!validatePhoneNumber(phone)) {
      return toast.error("Please enter a valid phone number.")
    }

    setIsLoading(true)
    try {
      const response = await axios.post(`${BASE_URL}send-mobile-otp`, {
        phoneNumber: phone,
        firstName: formData.firstName,
        lastName: formData.lastName,
      })

      if (response.data.success) {
        setOtpSentToPhone(true)
        toast.success("OTP sent to your phone.")
      } else {
        toast.error(response.data.message || "Failed to send OTP.")
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error sending OTP")
    } finally {
      setIsLoading(false)
    }
  }

  const verifyPhoneOtp = async (otp) => {
    setIsLoading(true)
    try {
      const response = await axios.post(`${BASE_URL}user-verify-number`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        dob: formData.dob,
        email: formData.email,
        phoneNumber: phone,
        otp,
      })

      if (!response.data.success) {
        throw new Error(response.data.message || "Invalid OTP")
      }

      const { token } = response.data

      localStorage.setItem("token", token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

      setPhoneVerified(true)
      dispatch(login(true)) // Login state update
      toast.success("Phone number verified. You are now logged in!")
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error verifying OTP")
    } finally {
      setIsLoading(false)
    }
  }

  const isLoggedIn = useSelector((state) => state.login?.isLogin ?? false)

  const handlePhoneOtp = (e) => {
    const otp = e.target.value
    setPhoneOtp(otp)
    if (otp.length === 6) {
      verifyPhoneOtp(otp)
    }
  }

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\d{10}$/
    const right = phoneRegex.test(phone)
    return right
  }

  const calculatePassportValidity = (dob, issueDate) => {
      const dobDate = new Date(dob);
      const issueDateObj = new Date(issueDate);
      const currentDate = new Date();
  
      // Assuming passport is valid for 10 years from issue date
      const validityPeriod = 10 * 365 * 24 * 60 * 60 * 1000; // 10 years in milliseconds
      const validityDate = new Date(issueDateObj.getTime() + validityPeriod);
  
      if (validityDate < dobDate) {
        toast.error("Passport expiry date is earlier than date of birth.");
        return "";
      }
  
      if (validityDate < currentDate) {
        toast.error("Passport has expired.");
        return "";
      }
  
      setFormData((prevData) => ({
        ...prevData,
        passportValidTill: validityDate.toISOString().slice(0, 10),
      }));
  
      return validityDate.toISOString().slice(0, 10); // Format: YYYY-MM-DD
    };

  const validatePassportDetails = () => {
      const { passportNumber, passportIssueDate, dob } = formData;
  
      // Regex pattern for passport number validation
      // This example assumes passport numbers are alphanumeric and between 6 and 9 characters
      const passportNumberRegex = /^[A-Z0-9]{6,9}$/;
  
      // Passport number validation
      if (!passportNumberRegex.test(passportNumber)) {
        toast.error("Invalid passport number.");
        return false;
      }
  
      // Calculate and set passportValidTill date
      const passportValidTillDate = calculatePassportValidity(
        dob,
        passportIssueDate
      );
      if (!passportValidTillDate) {
        return false;
      }
  
      setFormData((prevData) => ({
        ...prevData,
        passportValidTill: passportValidTillDate,
      }));
  
      return true;
    };
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    if (!validatePassportDetails()) {
      toast.error(`All Fields are Required`)
      setIsLoading(false)
      return
    }

    if (packageData?.orderDetails === travlersCount) {
      try {
        const token = localStorage.getItem("token")
        const response = await fetchDataFromAPI("PUT", `${BASE_URL}edit-order-details/${cotravlerId}`,
          { ...formData, detailsFulfilled: true },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        console.log(response)
        if (response) {
          navigate("/edit-visa-request")
        }
      } catch (error) {
        console.log(error)
        toast.error("Network error! Try again Later")
      }
    } else {
      try {
        const response = await fetchDataFromAPI("PUT", `${BASE_URL}edit-order-details/${cotravlerId}`, {
          ...formData,
          detailsFulfilled: true,
        })
        if (response) {
          try {
            const response = await fetchDataFromAPI("POST", `${BASE_URL}add-order-details`, { visaOrder: packageId })
            if (response) {
              dispatch(coTraveler(response?.data?._id))
            }
          } catch (error) {
            console.log(error)
          }
        }
      } catch (error) {
        toast.error("Network error! Try again Later")
      }
      window.location.href = "/persons-details"
    }
    setIsLoading(false)
  }

  const nextStep = () => {
    setActiveStep(activeStep + 1)
    window.scrollTo(0, 0)
  }

  const prevStep = () => {
    setActiveStep(activeStep - 1)
    window.scrollTo(0, 0)
  }

  return (
    <div className="flex flex-col lg:flex-row px-3 justify-center items-center pt-20 min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Chalo Ghoomne - Traveler Information</title>
        <link rel="canonical" href="https://chaloghoomne.com/" />
      </Helmet>
      <div className="lg:w-full flex h-full rounded-lg border-gray-300 mx-auto container py-2 bg-white justify-center items-center w-[90%] shadow-lg">
        <div className="bg-white pt-8 px-3 sm:px-10 rounded-lg w-full">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <div className={`flex flex-col items-center ${activeStep >= 1 ? "text-blue-600" : "text-gray-400"}`}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${activeStep >= 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                >
                  1
                </div>
                <span className="text-xs mt-1">Travel Info</span>
              </div>
              <div className={`h-1 flex-1 mx-2 ${activeStep >= 2 ? "bg-blue-600" : "bg-gray-200"}`}></div>
              <div className={`flex flex-col items-center ${activeStep >= 2 ? "text-blue-600" : "text-gray-400"}`}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${activeStep >= 2 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                >
                  2
                </div>
                <span className="text-xs mt-1">Personal Info</span>
              </div>
              <div className={`h-1 flex-1 mx-2 ${activeStep >= 3 ? "bg-blue-600" : "bg-gray-200"}`}></div>
              <div className={`flex flex-col items-center ${activeStep >= 3 ? "text-blue-600" : "text-gray-400"}`}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${activeStep >= 3 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                >
                  3
                </div>
                <span className="text-xs mt-1">Documents</span>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="flex flex-col justify-between items-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 px-8 rounded-full shadow-md transform hover:scale-105 transition-transform duration-300">
              <span className="text-xl font-bold">
                Travel Date:{" "}
                {new Date(packageData?.visaOrder?.from).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <h1 className="text-xl font-semibold mt-4 text-center text-blue-600 bg-blue-50 py-2 px-6 rounded-full">
              {`Traveler Information: Applicant #${packageData?.orderDetails || 1} of ${travlersCount || 1}`}
            </h1>
          </div>

          <form onSubmit={handleSubmit}>
            {activeStep === 1 && (
              <>
                {/* Travel Information */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100 mb-6 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-500 py-3 px-5">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <IoMdCalendar size={24} /> Travel Information
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-6 relative">
                      <div className="flex flex-col gap-2 flex-1">
                        <label className="font-medium text-gray-700 flex items-center gap-1">
                          <FaCalendarAlt className="text-blue-500" /> Travel Date
                        </label>
                        <input
                          type="date"
                          className="p-3 border border-gray-300 rounded-lg bg-gray-50"
                          defaultValue={packageData?.visaOrder?.from?.slice(0, 10)}
                          disabled
                        />
                      </div>
                      <div className="hidden md:block absolute left-1/2 -bottom-5 transform -translate-x-1/2 -translate-y-1/2 z-10">
                        {/* <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <FaUserFriends size={28} className="text-blue-600" />
                        </div> */}
                      </div>
                      <div className="flex flex-col gap-2 flex-1">
                        <label className="font-medium text-gray-700 flex items-center gap-1">
                          <FaCalendarAlt className="text-blue-500" /> Return Date
                        </label>
                        <input
                          type="date"
                          className="p-3 border border-gray-300 rounded-lg bg-gray-50"
                          defaultValue={packageData?.visaOrder?.to?.slice(0, 10)}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="mt-8 flex justify-end">
                      <button
                        type="button"
                        onClick={nextStep}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg flex items-center gap-2 transition-all duration-300"
                      >
                        Continue <span className="text-xl">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeStep === 2 && (
              <>
                {/* Personal Information */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100 mb-6 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-500 py-3 px-5">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <MdOutlinePersonAdd size={24} /> Personal Information
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className=" text-sm font-medium text-gray-700 flex items-center gap-1">
                          <FaUser className="text-blue-500" /> First Name
                        </label>
                        <input
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleFields}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="Enter first name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className=" text-sm font-medium text-gray-700 flex items-center gap-1">
                          <FaUser className="text-blue-500" /> Last Name
                        </label>
                        <input
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleFields}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="Enter last name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className=" text-sm font-medium text-gray-700 flex items-center gap-1">
                          <MdFamilyRestroom className="text-blue-500" /> Father's Name
                        </label>
                        <input
                          name="fatherName"
                          required
                          value={formData.fatherName}
                          onChange={handleFields}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="Enter father's name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className=" text-sm font-medium text-gray-700 flex items-center gap-1">
                          <MdFamilyRestroom className="text-blue-500" /> Mother's Name
                        </label>
                        <input
                          name="motherName"
                          required
                          value={formData.motherName}
                          onChange={handleFields}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="Enter mother's name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className=" text-sm font-medium text-gray-700 flex items-center gap-1">
                          <FaUser className="text-blue-500" /> Gender
                        </label>
                        <select
                          name="gender"
                          required
                          value={formData.gender}
                          onChange={handleFields}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className=" text-sm font-medium text-gray-700 flex items-center gap-1">
                          <FaUser className="text-blue-500" /> Age Group
                        </label>
                        <select
                          name="ageGroup"
                          required
                          value={formData.ageGroup}
                          onChange={handleFields}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        >
                          <option value="">Select Age Group</option>
                          {childData?.childPrice > 0 && <option value="Child">Under 18</option>}
                          <option value="Adult">18 and Over</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className=" text-sm font-medium text-gray-700 flex items-center gap-1">
                          <FaEnvelope className="text-blue-500" /> Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          placeholder="Enter email address"
                          value={formData.email}
                          onChange={handleFields}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className=" text-sm font-medium text-gray-700 flex items-center gap-1">
                          <FaPhone className="text-blue-500" /> Phone Number
                        </label>
                        <div className="flex gap-2">
                          <div className="flex">
                            <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg">
                              +91
                            </span>
                            <input
                              type="text"
                              value={phone}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "")
                                if (value.length <= 10) {
                                  setPhone(value)
                                } else {
                                  toast.error("Phone number cannot exceed 10 digits")
                                }
                              }}
                              placeholder="Enter phone number"
                              className="flex-1 p-3 border border-gray-300 rounded-r-lg rounded-l-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                              maxLength={10}
                            />
                          </div>
                          {!phoneVerified && (
                            <button
                              type="button"
                              onClick={sendPhoneOtp}
                              disabled={isLoading || phone.length !== 10}
                              className={`${phone.length === 10 ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"} text-white py-2 px-4 rounded-lg transition-all`}
                            >
                              {isLoading ? "Sending..." : otpSentToPhone ? "Resend OTP" : "Send OTP"}
                            </button>
                          )}
                        </div>
                        {phone && phone.length < 10 && (
                          <p className="text-amber-600 text-sm mt-1">Please enter a 10-digit phone number</p>
                        )}
                        {otpSentToPhone && !phoneVerified && (
                          <div className="mt-2">
                            <input
                              type="text"
                              value={phoneOtp}
                              onChange={handlePhoneOtp}
                              placeholder="Enter OTP"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                              maxLength={6}
                            />
                          </div>
                        )}
                        {phoneVerified && (
                          <p className="text-green-600 flex items-center gap-1 mt-1">
                            <RiVerifiedBadgeFill size={18} /> Phone number verified
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-8 flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-lg flex items-center gap-2 transition-all duration-300"
                      >
                        <span className="text-xl">←</span> Back
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-2 px-6 rounded-lg flex items-center gap-2 transition-all duration-300"
                        disabled={!phoneVerified}
                      >
                        Continue <span className="text-xl">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeStep === 3 && (
              <>
                {/* Passport Information */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100 mb-6 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-500 py-3 px-5">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <FaPassport size={24} /> Passport Information
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className=" text-sm font-medium text-gray-700 flex items-center gap-1">
                          <FaPassport className="text-blue-500" /> Passport Number
                        </label>
                        <input
                          name="passportNumber"
                          required
                          value={formData.passportNumber}
                          onChange={handleFields}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="Enter passport number"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className=" text-sm font-medium text-gray-700 flex items-center gap-1">
                          <FaCalendarAlt className="text-blue-500" /> Date of Birth
                        </label>
                        <input
                          type="date"
                          name="dob"
                          required
                          max={new Date().toISOString().split("T")[0]}
                          value={formData.dob}
                          onChange={handleFields}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className=" text-sm font-medium text-gray-700 flex items-center gap-1">
                          <FaCalendarAlt className="text-blue-500" /> Passport Issued On
                        </label>
                        <input
                          type="date"
                          name="passportIssueDate"
                          required
                          value={formData.passportIssueDate}
                          onChange={handleFields}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className=" text-sm font-medium text-gray-700 flex items-center gap-1">
                          <FaCalendarAlt className="text-blue-500" /> Passport Valid Till
                        </label>
                        <input
                          type="date"
                          name="passportValidTill"
                          required
                          value={formData.passportValidTill}
                          onChange={handleFields}
                          className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                          
                        />
                        {formData.passportValidTill && (
                          <p className="text-xs text-gray-500 mt-1">Please Enter The Valid Date</p>
                        )}
                      </div>
                    </div>

                    {/* Document Upload Section */}
                    <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                      <h3 className="text-lg font-medium text-blue-700 mb-4 flex items-center gap-2">
                        <IoDocumentsSharp /> Upload Required Documents
                      </h3>
                      <ImageUpload />
                    </div>

                    {/* Co-Traveller Section */}
                    {showCoTravler && (
                      <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                        <h3 className="text-lg font-medium text-blue-700 mb-4 flex items-center gap-2">
                          <FaUserFriends /> Co-Traveller Information
                        </h3>
                        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
                          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                            <RxPerson size={48} className="text-orange-500" />
                          </div>
                          <p className="text-lg font-medium mb-4 text-center">
                            Would you like to add another traveller to your journey?
                          </p>
                          <p className="text-sm text-gray-500 mb-6 text-center">
                            Adding co-travellers helps us prepare all visa documents together
                          </p>
                          <button
                            type="button"
                            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 px-6 rounded-lg transition-all duration-300 flex items-center gap-2"
                          >
                            <FaUserFriends /> Add Co-Traveller
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="mt-8 flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-lg flex items-center gap-2 transition-all duration-300"
                      >
                        <span className="text-xl">←</span> Back
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 px-8 rounded-full shadow-md transition-all duration-300 flex items-center gap-2 text-lg font-medium"
                      >
                        {isLoading
                          ? "Processing..."
                          : packageData?.orderDetails === travlersCount
                            ? "Proceed to Checkout"
                            : `Add Traveler ${packageData?.orderDetails + 1}/${travlersCount}`}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </form>

          {/* Important Notes Section */}
          {importantPoints?.length > 0 && (
            <div className="bg-white rounded-xl shadow-md border border-gray-100 mb-6 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-orange-400 py-3 px-5">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <IoDocumentsSharp size={24} /> Important Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {importantPoints.map((item, index) => (
                    <div key={index} className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                      <h3 className="text-lg font-medium text-orange-700 mb-2 flex items-center gap-2">
                        {item?.image && <img src={item?.image || "/placeholder.svg"} className="w-6 h-6" alt="" />}
                        {item?.heading}
                      </h3>
                      <p className="text-gray-700">{item?.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PersonDetails

