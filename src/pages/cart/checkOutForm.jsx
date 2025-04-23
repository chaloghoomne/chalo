"use client"

import { useState, useEffect } from "react"
import { FaFileUpload, FaArrowLeft, FaCreditCard } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { fetchDataFromAPI } from "../../api-integration/fetchApi"
import { BASE_URL } from "../../api-integration/urlsVariable"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Button } from "react-aria-components"
import EditVisaDetailsv3 from "../edit-visa-requests/EditVisaDetailsv3"

const CheckoutForm = ({ onClose, totalPrice, cartItems }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
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
                    disabled={currentStep === 1}
                  >
                    <FaArrowLeft className="mr-2" /> Previous
                  </button>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleShowPayment}
                      className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      <FaCreditCard className="mr-2" /> Submit All & Pay
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CheckoutForm
