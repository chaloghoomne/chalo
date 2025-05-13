"use client"

import { useState, useEffect, Component } from "react"
import { FaFileUpload, FaArrowLeft, FaCreditCard, FaSpinner, FaExclamationTriangle, FaSync } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { fetchDataFromAPI } from "../../api-integration/fetchApi"
import { BASE_URL } from "../../api-integration/urlsVariable"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Button } from "react-aria-components"
import EditVisaDetailsv3 from "../edit-visa-requests/EditVisaDetailsv3"

// Error Boundary Component
class PaymentErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    console.error("Payment error boundary caught an error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center mb-4">
            <FaExclamationTriangle className="text-red-500 mr-2" size={24} />
            <h3 className="text-lg font-medium text-red-700">Payment Processing Error</h3>
          </div>
          <p className="text-gray-700 mb-4">
            We encountered an issue while processing your payment. This does not mean you were charged.
          </p>
          <p className="text-sm text-gray-600 mb-6">
            Please try again or contact our support team if the problem persists.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

const CheckoutForm = ({ onClose, totalPrice, cartItems }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentInitializing, setPaymentInitializing] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [paymentError, setPaymentError] = useState(null)
  const [verificationAttempts, setVerificationAttempts] = useState(0)
  const [paymentData, setPaymentData] = useState(null)
  const defaultForm = {
    // Personal Information
    firstName: "",
    lastName: "",
    gender: "",
    ageGroup: "",
    fatherName: "",
    motherName: "",
    dateOfBirth: "",
    email: "",
    phoneNumber: "",

    // Passport Information
    passportNumber: "",
    passportIssueDate: "",
    passportExpiryDate: "",

    // Travel Dates
    departureDate: "",
    returnDate: "",
  }

  const navigate = useNavigate()

  // Store documents separately for each country
  const [countryData, setCountryData] = useState({})
  const [countryDocuments, setCountryDocuments] = useState({})
  const [showPopup, setShowPopup] = useState(false)
  const [mainId, setMainId] = useState([])

  const [activeTab, setActiveTab] = useState(cartItems[0]?.id || cartItems[0]?._id)

  // Define the field groups - only include requested fields
  const personalInfoFields = [
    { name: "firstName", label: "First Name", type: "text" },
    { name: "lastName", label: "Last Name", type: "text" },
    { name: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"] },
    { name: "ageGroup", label: "Age Group", type: "select", options: ["Under 18", "18 and Over"] },
    { name: "fatherName", label: "Father's Name", type: "text" },
    { name: "motherName", label: "Mother's Name", type: "text" },
    { name: "dob", label: "Date of Birth", type: "date" },
    { name: "email", label: "Email", type: "email" },
    { name: "phoneNumber", label: "Phone Number", type: "tel" },
  ]

  const passportFields = [
    { name: "passportNumber", label: "Passport Number", type: "text" },
    { name: "passportIssueDate", label: "Passport Issue Date", type: "date" },
    { name: "passportValidTill", label: "Passport Valid Till", type: "date" },
  ]

  const travelDateFields = [
    { name: "departureDate", label: "From", type: "date" },
    { name: "returnDate", label: "To", type: "date" },
  ]

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4))
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const [shouldNavigate, setShouldNavigate] = useState(false)
  const [navigateId, setNavigateId] = useState(null)

  useEffect(() => {
    if (shouldNavigate && navigateId) {
      navigate(`/edit-visa-request-v2/${navigateId}`)
    }
  }, [shouldNavigate, navigateId])

  const validateForm = (formData) => {
    // Validate personal info
    if (!formData.firstName?.trim()) return "First Name is required"
    if (!formData.lastName?.trim()) return "Last Name is required"
    if (!formData.gender?.trim()) return "Gender is required"
    if (!formData.ageGroup?.trim()) return "Age Group is required"
    if (!formData.fatherName?.trim()) return "Father's Name is required"
    if (!formData.motherName?.trim()) return "Mother's Name is required"
    if (!formData.dob) return "Date of Birth is required"
    if (!formData.email?.trim()) return "Email is required"
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) return "Please enter a valid email address"
    if (!formData.phoneNumber?.trim()) return "Phone Number is required"
    if (!/^\d{10,15}$/.test(formData.phoneNumber)) return "Please enter a valid phone number"

    // Validate passport info
    if (!formData.passportNumber?.trim()) return "Passport Number is required"
    if (!formData.passportIssueDate) return "Passport Issue Date is required"
    if (!formData.passportValidTill) return "Passport Expiry Date is required"

    // Validate travel dates
    if (!formData.departureDate) return "Departure Date is required"
    if (!formData.returnDate) return "Return Date is required"

    // Check if return date is after departure date
    if (formData.departureDate && formData.returnDate) {
      const departure = new Date(formData.departureDate)
      const returnDate = new Date(formData.returnDate)
      if (returnDate < departure) {
        return "Return date must be after departure date"
      }
    }

    return null
  }

  const validateDocs = (documents, requiredDocs) => {
    const requiredDocuments = requiredDocs.filter((doc) => doc.show === "true")

    for (const doc of requiredDocuments) {
      if (!documents[doc.name]?.file) {
        return `${doc.name} document is required`
      }
    }

    return null
  }

  const getTodayDateString = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      // Initialize form data for each country
      const initialFormData = {}
      const initialDocuments = {}

      cartItems.forEach((item) => {
        const countryName = item.name

        // Initialize form data with defaults
        initialFormData[countryName] = {}
        initialDocuments[countryName] = {}

        const filteredDocs = (item.document || []).filter((doc) => doc.show === "true")

        filteredDocs.forEach((doc) => {
          initialDocuments[countryName][doc.name] = {}
        })
      })

      setCountryData(initialFormData)
      setCountryDocuments(initialDocuments)
    }
  }, [cartItems])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setLoading(false)
    alert("Order placed successfully!")
    onClose()
  }

  const addAllDetails = async (item, id) => {
    try {
      const token = localStorage.getItem("token")
      const formData = new FormData()

      // Prepare the data object to be sent as JSON string
      const dataPayload = {
        ...countryData[item],
        detailsFulfilled: true,
        documents: [], // names for the uploaded files
      }

      // Handle file attachments
      const documents = countryDocuments[item] // e.g., { 'Passport': { file: File }, ... }
      for (const docKey in documents) {
        const fileObj = documents[docKey]
        if (fileObj?.file) {
          formData.append("files", fileObj.file) // multiple files
          dataPayload.documents.push({ name: docKey }) // push the doc name
        }
      }

      // Append the stringified data
      formData.append("data", JSON.stringify(dataPayload))

      // 🔥 Send request to backend
      const response = await fetch(`${BASE_URL}edit-order-details-v2/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // DO NOT set 'Content-Type' when sending FormData
        },
        body: formData,
      })

      const result = await response.json()
      // console.log(result.data)

      if (result.success) {
        setShowPopup(true)
        setNavigateId(result.data.visaOrder)
      } else {
        toast.error(result.message || "Update failed")
      }
    } catch (error) {
      console.error("❌ Frontend error:", error)
      toast.error("Network error! Try again later.")
    }
  }

  const createVisaOrder = async (item, id) => {
    try {
      const formData = countryData[item]
      const documents = countryDocuments[item]
      const requiredDocs = cartItems.find((i) => i.name === item)?.document || []

      // Validate form fields
      const formError = validateForm(formData)
      if (formError) {
        toast.error(formError)
        return
      }

      // Validate document uploads
      const docError = validateDocs(documents, requiredDocs)
      if (docError) {
        toast.error(docError)
        return
      }

      const response = await fetchDataFromAPI(
        "POST",
        `${BASE_URL}create-visa-order`,
        {
          user: localStorage.getItem("userId"),
          visaCategory: id,
          travellersCount: 1,
          from: countryData[item]?.departureDate,
          to: countryData[item]?.returnDate,
          applicationType: "normal",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        },
      )

      addAllDetails(item, response?.data?.orderDetails?._id)
      if (response.status === 503) {
        console.log("Request Successful")
        navigate("/503") // Redirect to Service Unavailable page
      }
    } catch (error) {
      toast.error("An error occurred while processing your request")
      navigate("/503")
      console.log(error)
    }
  }

  const handleCountryChange = (countryName, e) => {
    const { name, value, type, checked } = e.target
    const fieldValue = type === "checkbox" ? checked : value

    setCountryData((prev) => ({
      ...prev,
      [countryName]: {
        ...prev[countryName],
        [name]: fieldValue,
      },
    }))
  }

  const handleFileChange = (countryName, doc, e) => {
    const file = e.target.files[0]

    setCountryDocuments((prev) => ({
      ...prev,
      [countryName]: {
        ...prev[countryName],
        [doc.name]: {
          ...prev[countryName]?.[doc.type],
          file: file,
        },
      },
    }))
  }

  const saveCountryForm = (countryName) => {
    const formData = countryData[countryName]
    const documents = countryDocuments[countryName]
    const requiredDocs = cartItems.find((i) => i.name === countryName)?.document || []

    // Validate form fields
    const formError = validateForm(formData)
    if (formError) {
      toast.error(formError)
      return false
    }

    // Validate document uploads
    const docError = validateDocs(documents, requiredDocs)
    if (docError) {
      toast.error(docError)
      return false
    }

    console.log(`Saving data for ${countryName}:`, formData)
    console.log(`Documents for ${countryName}:`, documents)
    toast.success(`${countryName} visa requirements saved successfully!`)
    return true
  }

  // Function to load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }

  // Function to create Razorpay order
  const validateAmount = (amount) => {
    // Check if amount is valid
    if (!amount || isNaN(amount) || amount <= 0) {
      return {
        valid: false,
        message: "Invalid payment amount. Please contact support."
      }
    }
    
    // Check if amount is too small
    if (amount < 1) {
      return {
        valid: false,
        message: "Payment amount must be at least ₹1."
      }
    }
    
    // Check if amount is reasonable (e.g., not accidentally too large)
    if (amount > 100000) {
      return {
        valid: false,
        message: "Payment amount exceeds maximum limit. Please contact support."
      }
    }
    
    return { valid: true }
  }

  const createRazorpayOrder = async (amount) => {
    try {
      // Validate amount before making API call
      const amountValidation = validateAmount(amount)
      if (!amountValidation.valid) {
        throw new Error(amountValidation.message)
      }
      
      setPaymentInitializing(true)
      const token = localStorage.getItem("token")
      const response = await fetch(`${BASE_URL}create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: amount,
          purpose: "Visa Processing Fee",
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Server error (${response.status}): ${errorText || "Unknown error"}`)
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.message || "Failed to create order")
      }
      
      return result.data
    } catch (error) {
      console.error("Create order error:", error)
      throw error
    } finally {
      setPaymentInitializing(false)
    }
  }

  // Function to verify payment
  const verifyPayment = async (paymentData, attempt = 1) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${BASE_URL}verify-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      })

      if (!response.ok) {
        // If server is temporarily unavailable, we can retry
        if (response.status >= 500 && attempt <= 3) {
          // Wait before retrying (exponential backoff)
          const waitTime = Math.min(2000 * Math.pow(2, attempt - 1), 10000)
          await new Promise(resolve => setTimeout(resolve, waitTime))
          
          // Retry verification
          return verifyPayment(paymentData, attempt + 1)
        }
        
        throw new Error(`Server responded with status: ${response.status}`)
      }

      const result = await response.json()
      
      if (!result.success) {
        // Some verification errors might be temporary
        if (attempt <= 3 && result.message?.includes("pending")) {
          // Wait before retrying
          const waitTime = Math.min(2000 * Math.pow(2, attempt - 1), 10000)
          await new Promise(resolve => setTimeout(resolve, waitTime))
          
          // Retry verification
          return verifyPayment(paymentData, attempt + 1)
        }
        
        throw new Error(result.message || "Payment verification failed")
      }
      
      return result
    } catch (error) {
      console.error(`Payment verification error (attempt ${attempt}):`, error)
      
      // If we haven't exceeded max attempts and it's a potentially recoverable error
      if (attempt <= 3 && (error.message?.includes("timeout") || error.message?.includes("network"))) {
        // Wait before retrying (exponential backoff)
        const waitTime = Math.min(2000 * Math.pow(2, attempt - 1), 10000)
        await new Promise(resolve => setTimeout(resolve, waitTime))
        
        // Retry verification
        return verifyPayment(paymentData, attempt + 1)
      }
      
      throw error
    }
  }

  // Function to retry payment verification
  const retryVerification = async () => {
    if (!paymentData) {
      setPaymentError("No payment data available for verification")
      return
    }
    
    try {
      setPaymentLoading(true)
      setPaymentError(null)
      setVerificationAttempts(prev => prev + 1)
      
      const verificationResult = await verifyPayment(paymentData)
      
      if (verificationResult.success) {
        toast.success("Payment verification successful!")
        navigate("/payment-success")
      } else {
        setPaymentError("Payment verification failed. Please contact support.")
      }
    } catch (error) {
      setPaymentError(`Verification failed: ${error.message}. Please contact support.`)
    } finally {
      setPaymentLoading(false)
    }
  }

  // Function to display Razorpay payment form
  const displayRazorpay = async (orderData) => {
    try {
      setPaymentInitializing(true)
      const res = await loadRazorpayScript()

      if (!res) {
        toast.error("Razorpay SDK failed to load. Please check your internet connection.")
        setPaymentLoading(false)
        setPaymentInitializing(false)
        setPaymentError("Payment gateway failed to load. Please try again later.")
        return false
      }

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Chalo Ghoomne",
        description: "Visa Processing Fee",
        order_id: orderData.order_id,
        handler: async function (response) {
          try {
            // Verify payment on success
            const paymentResponseData = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }
            
            // Store payment data for potential retries
            setPaymentData(paymentResponseData)

            const verificationResult = await verifyPayment(paymentResponseData)
            
            if (verificationResult.success) {
              toast.success("Payment successful! Your visa processing has begun.")
              // Redirect or update UI as needed
              navigate("/payment-success")
            } else {
              toast.error("Payment verification failed. Please contact support.")
              setPaymentError("Payment could not be verified. Please try again or contact support.")
            }
          } catch (error) {
            toast.error("Payment verification failed: " + (error.message || "Unknown error"))
            setPaymentError("Payment could not be verified. Please contact support.")
          } finally {
            setPaymentLoading(false)
            setPaymentInitializing(false)
          }
        },
        prefill: {
          name: countryData[Object.keys(countryData)[0]]?.firstName + " " + countryData[Object.keys(countryData)[0]]?.lastName || "",
          email: countryData[Object.keys(countryData)[0]]?.email || "",
          contact: countryData[Object.keys(countryData)[0]]?.phoneNumber || "",
        },
        notes: {
          address: "Chalo Ghoomne Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function () {
            setPaymentLoading(false)
            setPaymentInitializing(false)
            toast.info("Payment cancelled. You can try again later.")
          },
        },
      }

      setPaymentInitializing(false)
      const paymentObject = new window.Razorpay(options)
      paymentObject.on("payment.failed", function (response) {
        toast.error(`Payment failed: ${response.error.description}`)
        setPaymentError(`Payment failed: ${response.error.description}. Please try again.`)
        setPaymentLoading(false)
      })
      
      paymentObject.open()
      return true
    } catch (error) {
      console.error("Razorpay display error:", error)
      setPaymentInitializing(false)
      setPaymentLoading(false)
      setPaymentError(`Failed to initialize payment: ${error.message}`)
      return false
    }
  }

  // Function to handle payment initiation
  const handlePayment = async () => {
    try {
      // Clear previous errors and set loading state
      setPaymentLoading(true)
      setPaymentError(null)
      setPaymentData(null)

      // Check if all forms are filled correctly
      const allFormsValid = Object.keys(countryData).every(country => {
        return saveCountryForm(country)
      })

      if (!allFormsValid) {
        setPaymentLoading(false)
        return
      }

      // Validate payment amount
      if (!totalPrice || isNaN(totalPrice) || totalPrice <= 0) {
        toast.error("Invalid payment amount. Please contact support.")
        setPaymentError("Invalid payment amount. Please refresh or contact support.")
        setPaymentLoading(false)
        return
      }

      // Calculate total price for payment
      const amount = totalPrice // Use the total price passed as prop

      // Create Razorpay order
      const orderData = await createRazorpayOrder(amount)
      
      if (!orderData) {
        throw new Error("Failed to create payment order")
      }
      
      // Display Razorpay payment form
      const paymentInitiated = await displayRazorpay(orderData)
      
      if (!paymentInitiated) {
        setPaymentLoading(false)
      }
    } catch (error) {
      console.error("Payment error:", error)
      toast.error("Payment failed: " + (error.message || "Unknown error occurred"))
      setPaymentError("Payment processing failed. Please try again later.")
      setPaymentLoading(false)
      setPaymentInitializing(false)
    }
  }

  const handleShowPayment = () => {
    setShowPayment(true)
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      {onClose && (
        <div className="fixed inset-0 bg-gray-100 z-50 flex flex-col overflow-auto">
          <div className="max-w-6xl w-full mx-auto bg-white shadow-lg rounded-lg my-8">
            {/* Header with close button */}
            <div className="flex items-center justify-between p-6 border-b">
              <h1 className="text-2xl font-bold text-gray-800">Complete Your Application</h1>
              <button
                onClick={() => onClose(false)}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors font-medium"
              >
                Close
              </button>
            </div>

            {showPayment ? (
              /* Payment Section */
              <EditVisaDetailsv3 visaIds={mainId} />
            ) : (
              /* Form Content */
              <div>
                {/* Tab Navigation */}
                <div className="border-b">
                  <div className="flex overflow-x-auto px-6 py-2 gap-2">
                    {cartItems.map((tab) => (
                      <button
                        key={tab.id || tab._id}
                        onClick={() => setActiveTab(tab.id || tab._id)}
                        className={`px-6 py-3 font-medium whitespace-nowrap transition-all rounded-t-lg ${
                          activeTab === (tab.id || tab._id)
                            ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {tab.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {cartItems
                    .filter((item) => (item.id || item._id) === activeTab)
                    .map((item) => (
                      <div key={item.id || item._id}>
                        <h2 className="text-xl font-semibold mb-2 text-gray-800">{item.name} Visa Application</h2>
                        <p className="text-gray-600 mb-6">
                          {item.description || "Please complete all required information below."}
                        </p>

                        <div className="grid gap-8">
                          {/* Travel Dates Section */}
                          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-medium mb-4 text-gray-800 border-b pb-2">Travel Dates</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                              {travelDateFields.map((field) => (
                                <div key={field.name}>
                                  <label className="block text-gray-700 font-medium mb-1">{field.label}</label>
                                  <input
                                    type={field.type}
                                    name={field.name}
                                    required
                                    min={getTodayDateString()}
                                    value={countryData[item.name]?.[field.name] || ""}
                                    onChange={(e) => handleCountryChange(item.name, e)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Personal Information Section */}
                          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-medium mb-4 text-gray-800 border-b pb-2">
                              Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                              {personalInfoFields.map((field) => (
                                <div key={field.name}>
                                  <label className="block text-gray-700 font-medium mb-1">{field.label}</label>
                                  {field.type === "select" ? (
                                    <select
                                      name={field.name}
                                      required
                                      value={countryData[item.name]?.[field.name] || ""}
                                      onChange={(e) => handleCountryChange(item.name, e)}
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                      <option value="">Select {field.label}</option>
                                      {field.options.map((option) => (
                                        <option key={option} value={option}>
                                          {option}
                                        </option>
                                      ))}
                                    </select>
                                  ) : (
                                    <input
                                      type={field.type}
                                      name={field.name}
                                      required
                                      value={countryData[item.name]?.[field.name] || ""}
                                      onChange={(e) => handleCountryChange(item.name, e)}
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      placeholder={`Enter ${field.label}`}
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Passport Information Section */}
                          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-medium mb-4 text-gray-800 border-b pb-2">
                              Passport Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                              {passportFields.map((field, index) => (
                                <div key={index}>
                                  <label className="block text-gray-700 font-medium mb-1">{field.label}</label>
                                  <input
                                    type={field.type}
                                    name={field.name}
                                    required
                                    value={countryData[item.name]?.[field.name] || ""}
                                    onChange={(e) => handleCountryChange(item.name, e)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder={`Enter ${field.label}`}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Document Upload Section */}
                          {item.document && item.document.length > 0 && (
                            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                              <h3 className="text-lg font-medium mb-4 text-gray-800 border-b pb-2">
                                Required Documents
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {item.document
                                  .filter((doc) => doc.show === "true")
                                  .map((doc) => (
                                    <div key={doc.type} className="flex flex-col">
                                      <label className="block text-gray-700 font-medium mb-2">{doc.name}</label>
                                      <div className="relative">
                                        <input
                                          type="file"
                                          required
                                          onChange={(e) => handleFileChange(item.name, doc, e)}
                                          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                                        />
                                        <div className="flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white hover:border-blue-400 transition-colors">
                                          <span className="text-gray-500 truncate">
                                            {countryDocuments[item.name]?.[doc.name]?.file?.name
                                              ? countryDocuments[item.name][doc.name].file.name
                                              : "No file chosen"}
                                          </span>
                                          <FaFileUpload className="text-blue-500" />
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                        {showPopup && (
                          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
                              <p className="mb-4 text-lg font-semibold text-center">
                                Do you want to make the payment now?
                              </p>
                              <div className="flex justify-center gap-4">
                                <Button onClick={() => setShouldNavigate(true)}>YES</Button>
                                <Button
                                  onClick={() => {
                                    setShowPopup(false)
                                    setMainId([...mainId, navigateId])
                                    toast.success("Your application has been saved and you can make payments anytime")
                                  }}
                                >
                                  NO
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end mt-6">
                          <button
                            type="button"
                            onClick={() => {
                              const isValid = saveCountryForm(item.name)
                              if (isValid) {
                                createVisaOrder(item.name, item.id)
                              }
                            }}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                          >
                            Save {item.name} Requirements
                          </button>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Form Navigation */}
                <div className="flex justify-between p-6 border-t bg-gray-50">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                    disabled={currentStep === 1 || paymentLoading}
                  >
                    <FaArrowLeft className="mr-2" /> Previous
                  </button>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handlePayment}
                      disabled={paymentLoading}
                      className={`flex items-center px-6 py-2 ${
                        paymentLoading 
                          ? "bg-gray-400 cursor-not-allowed" 
                          : "bg-blue-600 hover:bg-blue-700"
                      } text-white rounded-lg transition-colors shadow-sm`}
                    >
                      {paymentLoading ? (
                        <>
                          <FaSpinner className="mr-2 animate-spin" /> Processing...
                        </>
                      ) : (
                        <>
                          <FaCreditCard className="mr-2" /> Submit All & Pay
                        </>
                      )}
                    </button>
                  </div>
                </div>
                {/* Payment Error Message */}
                {paymentError && (
                  <div className="p-4 mt-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600">{paymentError}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      If you continue experiencing issues, please contact our support team.
                    </p>
                    {verificationAttempts > 0 && (
                      <button
                        onClick={retryVerification}
                        disabled={paymentLoading}
                        className="mt-3 flex items-center px-4 py-2 text-blue-600 border border-blue-300 rounded hover:bg-blue-50"
                      >
                        {paymentLoading ? (
                          <FaSpinner className="animate-spin mr-2" />
                        ) : (
                          <FaSync className="mr-2" />
                        )}
                        Retry Verification
                      </button>
                    )}
                  </div>
                )}
                {/* Payment Initializing State */}
                {paymentInitializing && !paymentLoading && (
                  <div className="p-4 mt-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center">
                    <FaSpinner className="animate-spin text-blue-500 mr-3" />
                    <p>Initializing payment gateway. Please wait...</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CheckoutForm
