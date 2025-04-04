"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { IoCalendarOutline } from "react-icons/io5"
import ModalVisaRequest from "./ModalVisaRequest"
import { LiaShippingFastSolid } from "react-icons/lia"
import { coTraveler, PackageId } from "../../redux/actions/package-id-actions"
import { fetchDataFromAPI } from "../../api-integration/fetchApi"
import { BASE_URL } from "../../api-integration/urlsVariable"
import { toast } from "react-toastify"
import { FaEdit, FaEye, FaPassport, FaRegCreditCard, FaUserFriends } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { GrCheckboxSelected } from "react-icons/gr"
import { Helmet } from "react-helmet"
import { motion, AnimatePresence } from "framer-motion"
import { FaCalendarCheck, FaMoneyBillWave, FaRegClock } from "react-icons/fa6"

const EditVisaDetails = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const packageId = useSelector((state) => state.PackageIdReducer.packagedId)
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [isEdit, setIsEdit] = useState(false)
  const [price, setPrice] = useState(null)
  const [childPrice, setChildPrice] = useState(null)
  const [discount, setDiscount] = useState()
  const [applicationType, setApplicationType] = useState()
  const [insurance, setInsurance] = useState(true)
  const [insurancePrice, setInsurancePrice] = useState(null)
  const [from, setFrom] = useState()
  const [entryType, setEntryType] = useState()
  const [validity, setValidity] = useState()
  const [period, setPeriod] = useState()
  const [processingTime, setProcessingTime] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [isPaymentLoading, setIsPaymentLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await fetchDataFromAPI("GET", `${BASE_URL}order-details-by-category/${packageId}`)
        if (response) {
          setUsers(response.data)
        }
      } catch (error) {
        console.error("Error fetching order details:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [packageId, selectedUser])

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true) // Script is already loaded
        return
      }
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  useEffect(() => {
    loadRazorpayScript()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await fetchDataFromAPI("GET", `${BASE_URL}user-visa-order/${packageId}`)
        if (response) {
          setApplicationType(response?.data?.visaOrder?.applicationType)
          setDiscount(response?.data?.visaOrder?.discount)
          setFrom(response?.data?.visaOrder?.from)

          try {
            const responseData = await fetchDataFromAPI(
              "GET",
              `${BASE_URL}visa-category/${response?.data?.visaOrder?.visaCategory}`,
            )
            if (responseData) {
              setInsurancePrice(responseData?.data?.insuranceAmount)
              setEntryType(responseData?.data?.entryType)
              setValidity(responseData?.data?.validity)
              setPeriod(responseData?.data?.period)
              setProcessingTime(responseData?.data?.processingTime)

              if (response?.data?.visaOrder?.applicationType === "normal") {
                setPrice(responseData?.data?.price)
                setChildPrice(responseData?.data?.childPrice)
              } else if (response?.data?.visaOrder?.applicationType === "express") {
                setChildPrice(responseData?.data?.childPrice)
                setPrice(responseData?.data?.expressPrice)
              } else if (response?.data?.visaOrder?.applicationType === "instant") {
                setChildPrice(responseData?.data?.childPrice)
                setPrice(responseData?.data?.instantPrice)
              }
            }
          } catch (error) {
            console.error("Error fetching visa category:", error)
          }
        }
      } catch (error) {
        console.error("Error fetching visa order:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [packageId])

  const handlePayment = async () => {
    setIsPaymentLoading(true)
    try {
      const response = await fetchDataFromAPI("POST", `${BASE_URL}create-order`, { amount: price})

      if (response) {
        const options = {
          key: "rzp_live_7jIGrWcWtT3QMW",
          amount: response?.data?.amount,
          currency: response?.data?.currency,
          name: "Your Company Name",
          description: "Test Transaction",
          image: "https://your-logo-url.com",
          order_id: response?.data?.id,
          callback_url: "https://google.com",
          handler: (response) => {
            const razorpay_order_id = response.razorpay_payment_id
            const razorpay_payment_id = response.razorpay_payment_id
            const razorpay_signature = response?.razorpay_signature
            const verifyPayment = async () => {
              try {
                const responseData = await fetchDataFromAPI("POST", `${BASE_URL}verify-payment`, {
                  razorpay_order_id,
                  razorpay_payment_id,
                  razorpay_signature,
                })
                if (responseData) {
                  try {
                    const response = await fetchDataFromAPI("GET", `${BASE_URL}user-visa-order/${packageId}`)
                    if (response) {
                      const totalPrice = calculateTotalPrice()
                      try {
                        const responseData = await fetchDataFromAPI("PUT", `${BASE_URL}edit-visa-order/${packageId}`, {
                          ...response.data,
                          totalAmount: totalPrice.totalAmount,
                          gst: totalPrice.gst,
                          insurance: insurance,
                          insurancePrice,
                          pricePerUser: price,
                          isSubmitted: true,
                        })
                        if (responseData) {
                          toast.success(`Successfully Submitted`)
                          dispatch(coTraveler(null))
                          dispatch(PackageId(null))
                          navigate(`/`)
                        }
                      } catch (error) {
                        console.error("Error updating visa order:", error)
                        toast.error("Failed to update order details")
                      }
                    }
                  } catch (error) {
                    console.error("Error fetching visa order for update:", error)
                    toast.error("Failed to fetch order details")
                  }
                }
              } catch (error) {
                console.error("Error verifying payment:", error)
                toast.error(`Network Error! Please Try Again Later`)
              } finally {
                setIsPaymentLoading(false)
              }
            }
            verifyPayment()
          },
          prefill: {
            name: "Your Name",
            email: "your-email@example.com",
            contact: "1234567890",
          },
          theme: {
            color: "#F37254",
          },
        }

        const rzp = new window.Razorpay(options)
        rzp.open()
      }
    } catch (error) {
      console.error("Error creating payment order:", error)
      toast.error("Failed to initiate payment")
      setIsPaymentLoading(false)
    }
  }

  const handleView = async (id) => {
    try {
      const response = await fetchDataFromAPI("GET", `${BASE_URL}order-detail/${id}`)
      if (response) {
        setSelectedUser(response.data)
        setIsEdit(false)
      }
    } catch (error) {
      console.error("Error fetching user details:", error)
      toast.error("Failed to load traveler details")
    }
  }

  const handleEdit = async (id) => {
    try {
      const response = await fetchDataFromAPI("GET", `${BASE_URL}order-detail/${id}`)
      if (response) {
        setSelectedUser(response.data)
        setIsEdit(true)
      }
    } catch (error) {
      console.error("Error fetching user details for edit:", error)
      toast.error("Failed to load traveler details for editing")
    }
  }

  const calculateTotalPrice = () => {
    let amount = 0
    users.forEach((item) => {
      if (item.ageGroup === "Child") {
        amount += Number(childPrice)
      } else {
        amount += Number(price)
      }
    })

    const basePrice = amount
    const discountAmount = discount || 0
    const gstAmount = basePrice * 0.18
    const newnum = Number(insurancePrice)
    const insuranceAmount = isNaN(newnum) ? 0 : Number(insurancePrice)
    const totalAmount = basePrice + gstAmount + insuranceAmount

    return {
      totalAmount,
      discount: discountAmount,
      gst: gstAmount,
      basePrice: basePrice,
    }
  }

  const totalPrice = calculateTotalPrice()

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

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 pt-20 pb-16">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Chalo Ghoomne - Review Your Visa Application</title>
        <link rel="canonical" href="https://chaloghoomne.com/" />
      </Helmet>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 max-w-5xl">
        {/* Header Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Review Your Visa Application
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Please review all your information carefully before proceeding to payment
          </p>
        </motion.div>

        {/* Travel Date */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible" className="flex justify-center mb-8">
          <div className="bg-gradient-to-r from-orange-500 to-orange-400 text-white py-3 px-8 rounded-full shadow-lg flex items-center gap-3">
            <IoCalendarOutline size={24} />
            <span className="font-medium">Travel Date: {formatDate(from)}</span>
          </div>
        </motion.div>

        {/* Selected Plan Section */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mb-10">
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 mb-4 bg-blue-600 text-white py-3 px-6 rounded-xl shadow-md w-full max-w-3xl mx-auto"
          >
            <GrCheckboxSelected size={22} className="text-white filter invert" />
            <h2 className="text-lg font-semibold">Selected Plan</h2>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white border-2 border-blue-200 rounded-2xl shadow-lg overflow-hidden max-w-3xl mx-auto"
          >
            {applicationType && (
              <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-2 px-6 flex justify-between items-center">
                <span className="font-medium">{entryType} Visa</span>
                {(applicationType === "express" || applicationType === "instant") && (
                  <div className="flex items-center gap-2 bg-white text-blue-600 py-1 px-3 rounded-full text-sm font-medium">
                    <LiaShippingFastSolid size={18} />
                    <span className="capitalize">{applicationType}</span>
                  </div>
                )}
              </div>
            )}

            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between mb-6">
                <div className="flex items-center gap-3 mb-4 md:mb-0">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                    <FaPassport size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {period} Days {entryType}
                    </h3>
                    <p className="text-gray-500 text-sm">Visa Package</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                      <FaCalendarCheck size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Stay Period</p>
                      <p className="font-medium">{period} Days</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">
                      <FaRegClock size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Validity</p>
                      <p className="font-medium">{validity} Days</p>
                    </div>
                  </div>

                  {!(applicationType === "express" || applicationType === "instant") && (
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                        <FaRegClock size={16} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Processing</p>
                        <p className="font-medium">{processingTime} Business Days</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Travelers Information Section */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mb-10">
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 mb-4 bg-blue-600 text-white py-3 px-6 rounded-xl shadow-md w-full max-w-3xl mx-auto"
          >
            <FaUserFriends size={22} />
            <h2 className="text-lg font-semibold">Travelers Information</h2>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-3xl mx-auto"
          >
            {isLoading ? (
              <div className="p-8 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                      <th className="py-3 px-4 text-left">Traveler Name</th>
                      <th className="py-3 px-4 text-center">Age Group</th>
                      <th className="py-3 px-4 text-center">Price</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users?.map((user, index) => (
                      <tr
                        key={user?._id}
                        className={`border-b ${index % 2 === 0 ? "bg-blue-50" : "bg-white"} hover:bg-blue-100 transition-colors`}
                      >
                        <td className="py-3 px-4 font-medium">
                          {user?.firstName} {user?.lastName}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              user?.ageGroup === "Child" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {user?.ageGroup}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-medium">
                          ₹{user?.ageGroup === "Child" ? childPrice : price}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() => handleView(user?._id)}
                              className="p-2 bg-orange-100 text-orange-500 rounded-full hover:bg-orange-200 transition-colors"
                              aria-label="View traveler details"
                            >
                              <FaEye size={16} />
                            </button>
                            <button
                              onClick={() => handleEdit(user?._id)}
                              className="p-2 bg-blue-100 text-blue-500 rounded-full hover:bg-blue-200 transition-colors"
                              aria-label="Edit traveler details"
                            >
                              <FaEdit size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">No travelers found. Please add travelers to continue.</div>
            )}
          </motion.div>
        </motion.div>

        {/* Payment Details Section */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mb-10">
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 mb-4 bg-blue-600 text-white py-3 px-6 rounded-xl shadow-md w-full max-w-3xl mx-auto"
          >
            <FaMoneyBillWave size={22} />
            <h2 className="text-lg font-semibold">Payment Details</h2>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-3xl mx-auto"
          >
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-600">Base Price</span>
                  <span className="font-medium">₹{totalPrice?.basePrice}</span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-600">GST (18%)</span>
                  <span className="font-medium">₹{Math.floor(totalPrice.gst)}</span>
                </div>

                {insurancePrice > 0 && (
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="insurance-checkbox"
                        checked={insurance}
                        onChange={(e) => setInsurance(e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="insurance-checkbox" className="text-gray-600">
                        Travel Insurance
                      </label>
                    </div>
                    <span className="font-medium">{insurance ? `₹${insurancePrice}` : "₹0"}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold">Total Amount</span>
                  <span className="text-xl font-bold text-blue-600">₹{Math.floor(totalPrice.totalAmount)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Payment Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mt-8"
        >
          <button
            onClick={handlePayment}
            disabled={isPaymentLoading || users.length === 0}
            className={`group relative overflow-hidden rounded-full px-8 py-4 text-lg font-medium transition-all duration-300 ${
              isPaymentLoading || users.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-lg hover:shadow-xl hover:translate-y-[-2px]"
            }`}
          >
            <span className="relative z-10 flex items-center gap-3">
              {isPaymentLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FaRegCreditCard size={20} />
                  Make Payment
                </>
              )}
            </span>
          </button>
        </motion.div>
      </motion.div>

      {/* Modal for viewing/editing traveler details */}
      <AnimatePresence>
        {selectedUser && <ModalVisaRequest user={selectedUser} isEdit={isEdit} onClose={() => setSelectedUser(null)} />}
      </AnimatePresence>
    </div>
  )
}

export default EditVisaDetails

