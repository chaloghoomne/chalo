"use client"

import { useEffect, useState } from "react"
import { IoCalendarOutline } from "react-icons/io5"
import { LiaShippingFastSolid } from "react-icons/lia"
import { fetchDataFromAPI } from "../../api-integration/fetchApi"
import { BASE_URL } from "../../api-integration/urlsVariable"
import { toast } from "react-toastify"
import { FaEdit, FaEye, FaPassport, FaRegCreditCard, FaUserFriends } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { GrCheckboxSelected } from "react-icons/gr"
import { Helmet } from "react-helmet"
import { motion, AnimatePresence } from "framer-motion"
import { FaCalendarCheck, FaMoneyBillWave, FaRegClock } from "react-icons/fa6"
import ModalVisaRequest from "./ModalVisaRequest"
import PropTypes from "prop-types"

const EditVisaDetailsv3 = ({ visaIds }) => {
  const navigate = useNavigate()
  const [activeVisaId, setActiveVisaId] = useState("")
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
  const [totalPrice, setTotalPrice] = useState({
    totalAmount: 0,
    discount: 0,
    basePrice: 0,
  })

  // Set the active visa ID when component mounts or visaIds changes
  useEffect(() => {
    if (visaIds && visaIds.length > 0) {
      setActiveVisaId(visaIds[0])
      console.log(visaIds[0])
    }
  }, [visaIds])

  // Load Razorpay script
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
  console.log(visaIds)

  useEffect(() => {
    loadRazorpayScript()
  }, [])

  // Fetch travelers data
  useEffect(() => {
    if (!activeVisaId) return

    const fetchTravelersData = async () => {
      setIsLoading(true)
      try {
        const response = await fetchDataFromAPI("GET", `${BASE_URL}order-details-by-category/${activeVisaId}`)
        if (response) {
          setUsers(response.data)
        }
      } catch (error) {
        console.error("Error fetching order details:", error)
        toast.error("Failed to load travelers data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTravelersData()
  }, [activeVisaId, selectedUser])

  // Fetch visa order details
  useEffect(() => {
    if (!activeVisaId) return

    const fetchVisaOrderDetails = async () => {
      setIsLoading(true)
      try {
        const response = await fetchDataFromAPI("GET", `${BASE_URL}user-visa-order/${activeVisaId}`)
        if (response) {
          const visaOrderData = response?.data?.visaOrder
          setApplicationType(visaOrderData?.applicationType)
          setDiscount(visaOrderData?.discount)
          setFrom(visaOrderData?.from)

          try {
            const visaCategoryResponse = await fetchDataFromAPI(
              "GET",
              `${BASE_URL}visa-category/${visaOrderData?.visaCategory}`,
            )

            if (visaCategoryResponse) {
              const categoryData = visaCategoryResponse.data
              setInsurancePrice(categoryData?.insuranceAmount)
              setEntryType(categoryData?.entryType)
              setValidity(categoryData?.validity)
              setPeriod(categoryData?.period)
              setProcessingTime(categoryData?.processingTime)

              // Set prices based on application type
              if (visaOrderData?.applicationType === "normal") {
                setPrice(categoryData?.price)
                setChildPrice(categoryData?.childPrice)
              } else if (visaOrderData?.applicationType === "express") {
                setPrice(categoryData?.expressPrice)
                setChildPrice(categoryData?.childPrice)
              } else if (visaOrderData?.applicationType === "instant") {
                setPrice(categoryData?.instantPrice)
                setChildPrice(categoryData?.childPrice)
              }
            }
          } catch (error) {
            console.error("Error fetching visa category:", error)
            toast.error("Failed to load visa category details")
          }
        }
      } catch (error) {
        console.error("Error fetching visa order:", error)
        toast.error("Failed to load visa order details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchVisaOrderDetails()
  }, [activeVisaId])

  // Calculate total price
  const calculateTotalPrice = () => {
    let amount = 0
    users.forEach((item) => {
      if (item.ageGroup === "Child") {
        amount += Number(childPrice || 0)
      } else {
        amount += Number(price || 0)
      }
    })

    const basePrice = amount
    const discountAmount = discount || 0
    const insuranceAmount = insurance ? Number(insurancePrice || 0) : 0
    const totalAmount = basePrice + insuranceAmount - discountAmount

    return {
      totalAmount,
      discount: discountAmount,
      basePrice: basePrice,
    }
  }

  // Update total price when dependencies change
  useEffect(() => {
    setTotalPrice(calculateTotalPrice())
  }, [users, price, childPrice, discount, insurance, insurancePrice])

  // Handle payment
  const handlePayment = async () => {
    setIsPaymentLoading(true)

    try {
      const response = await fetchDataFromAPI("POST", `${BASE_URL}create-order`, { amount: totalPrice.totalAmount })

      if (response) {
        const options = {
          key: "rzp_live_7jIGrWcWtT3QMW",
          amount: response?.data?.amount,
          currency: response?.data?.currency,
          name: "Chaloghoomne.com",
          description: "Visa Payment",
          image: "https://your-logo-url.com",
          order_id: response?.data?.id,
          callback_url: "https://google.com",
          handler: (response) => {
            const razorpay_order_id = response.razorpay_order_id
            const razorpay_payment_id = response.razorpay_payment_id
            const razorpay_signature = response?.razorpay_signature

            const verifyPayment = async () => {
              try {
                const verificationResponse = await fetchDataFromAPI("POST", `${BASE_URL}verify-payment`, {
                  razorpay_order_id,
                  razorpay_payment_id,
                  razorpay_signature,
                })

                if (verificationResponse) {
                  try {
                    const visaOrderResponse = await fetchDataFromAPI(
                      "GET",
                      `${BASE_URL}user-visa-order/${activeVisaId}`,
                    )
                    if (visaOrderResponse) {
                      const calculatedPrice = calculateTotalPrice()

                      try {
                        const updateResponse = await fetchDataFromAPI(
                          "PUT",
                          `${BASE_URL}edit-visa-order/${activeVisaId}`,
                          {
                            ...visaOrderResponse.data,
                            user:localStorage.getItem(userId),
                            totalAmount: calculatedPrice.totalAmount,
                            insurance: insurance,
                            insurancePrice,
                            pricePerUser: price,
                            isSubmitted: true,
                          },
                        )

                        if (updateResponse) {
                          toast.success(`Payment successful! Your visa application has been submitted.`)
                          navigate(`/`)
                        }
                      } catch (error) {
                        console.error("Error updating visa order:", error)
                        toast.error("Payment was successful, but we couldn't update your order details")
                      }
                    }
                  } catch (error) {
                    console.error("Error fetching visa order for update:", error)
                    toast.error("Payment was successful, but we couldn't fetch your order details")
                  }
                }
              } catch (error) {
                console.error("Error verifying payment:", error)
                toast.error(`Payment verification failed. Please contact support.`)
              } finally {
                setIsPaymentLoading(false)
              }
            }

            verifyPayment()
          },
          prefill: {
            name: users[0]?.firstName ? `${users[0]?.firstName} ${users[0]?.lastName}` : "Traveler",
            email: "",
            contact: "",
          },
          theme: {
            color: "#3B82F6",
          },
          modal: {
            ondismiss: () => {
              setIsPaymentLoading(false)
              toast.info("Payment was cancelled")
            },
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

  // Handle view traveler details
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

  // Handle edit traveler details
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

  // Handle visa selection (when multiple visas are provided)
  const handleVisaSelection = (visaId) => {
    setActiveVisaId(visaId)
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

  // Format date
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

        {/* Visa Selection Tabs (only shown when multiple visas are provided) */}
        {visaIds && visaIds.length > 1 && (
          <motion.div variants={itemVariants} initial="hidden" animate="visible" className="mb-8">
            <div className="flex flex-wrap justify-center gap-3">
              {visaIds.map((visaId, index) => (
                <button
                  key={visaId}
                  onClick={() => handleVisaSelection(visaId)}
                  className={`px-5 py-2 rounded-full transition-all ${
                    activeVisaId === visaId
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50"
                  }`}
                >
                  Visa Plan {index + 1}
                </button>
              ))}
            </div>
          </motion.div>
        )}

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
            {isLoading ? (
              <div className="p-8 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : applicationType ? (
              <>
                <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-2 px-6 flex justify-between items-center">
                  <span className="font-medium">{entryType} Visa</span>
                  {(applicationType === "express" || applicationType === "instant") && (
                    <div className="flex items-center gap-2 bg-white text-blue-600 py-1 px-3 rounded-full text-sm font-medium">
                      <LiaShippingFastSolid size={18} />
                      <span className="capitalize">{applicationType}</span>
                    </div>
                  )}
                </div>

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
              </>
            ) : (
              <div className="p-8 text-center text-gray-500">No visa plan information available.</div>
            )}
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
                    {users.map((user, index) => (
                      <tr
                        key={user._id}
                        className={`border-b ${index % 2 === 0 ? "bg-blue-50" : "bg-white"} hover:bg-blue-100 transition-colors`}
                      >
                        <td className="py-3 px-4 font-medium">
                          {user.firstName} {user.lastName}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              user.ageGroup === "Child" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {user.ageGroup}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-medium">
                          ₹{user.ageGroup === "Child" ? childPrice : price}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() => handleView(user._id)}
                              className="p-2 bg-orange-100 text-orange-500 rounded-full hover:bg-orange-200 transition-colors"
                              aria-label="View traveler details"
                            >
                              <FaEye size={16} />
                            </button>
                            <button
                              onClick={() => handleEdit(user._id)}
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
                  <span className="font-medium">₹{totalPrice.basePrice}</span>
                </div>

                {discount && discount > 0 && (
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-medium text-green-600">-₹{discount}</span>
                  </div>
                )}

                {insurancePrice && insurancePrice > 0 && (
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
            disabled={isPaymentLoading || users.length === 0 || !activeVisaId}
            className={`group relative overflow-hidden rounded-full px-8 py-4 text-lg font-medium transition-all duration-300 ${
              isPaymentLoading || users.length === 0 || !activeVisaId
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



export default EditVisaDetailsv3
