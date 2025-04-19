"use client"

import { useState, useEffect } from "react"
import { FaFileUpload, FaArrowLeft, FaArrowRight } from "react-icons/fa"
import {useNavigate } from "react-router-dom"
import { fetchDataFromAPI } from "../../api-integration/fetchApi"
import { BASE_URL } from "../../api-integration/urlsVariable"
import { PackageId } from "../../redux/actions/package-id-actions"

const CheckoutForm = ({ onClose, totalPrice, cartItems }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
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

  const [activeTab, setActiveTab] = useState(cartItems[0]?.id)

  // console.log(cartItems)

  // Define the field groups - only include requested fields
  const personalInfoFields = [
    { name: "firstName", label: "First Name", type: "text" },
    { name: "lastName", label: "Last Name", type: "text" },
    { name: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"] },
    { name: "ageGroup", label: "Age Group", type: "select", options:["Under 18","18 and Over"] },
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
    { name: "departureDate", label: "from", type: "date" },
    { name: "returnDate", label: "to", type: "date" },
  ]

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4))
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      // Initialize form data for each country
      const initialFormData = {}
      const initialDocuments = {}

      cartItems.forEach((item) => {
        console.log(item.document)
        const countryName = item.name

        // Initialize form data with defaults
        initialDocuments[countryName] = {}

        const filteredDocs = (item.document || []).filter((doc) => doc.show === "true")

        filteredDocs.forEach((doc) => {
          initialDocuments[countryName][doc.name] = {
          }
        })
      })

      setCountryData(initialFormData)
      setCountryDocuments(initialDocuments)
    }
  }, [cartItems])

  console.log(countryDocuments)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Here you would typically send the form data to your backend
    // const formDataToSend = new FormData();

    // For each country, add its form data and documents
    // Object.keys(countryData).forEach(country => {
    //   Object.entries(countryData[country]).forEach(([key, value]) => {
    //     formDataToSend.append(`${country}_${key}`, value);
    //   });
    //
    //   Object.entries(countryDocuments[country]).forEach(([key, file]) => {
    //     if (file) formDataToSend.append(`${country}_${key}`, file);
    //   });
    // });

    // await fetchDataFromAPI("POST", `${BASE_URL}checkout`, formDataToSend);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setLoading(false)
    alert("Order placed successfully!")
    onClose()
  }
  // console.log(countryData)

  const addAllDetails = async (item, id) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
  
      // Prepare the data object to be sent as JSON string
      const dataPayload = {
        ...countryData[item],
        detailsFulfilled: true,
        documents: [], // names for the uploaded files
      };
  
      // Handle file attachments
      const documents = countryDocuments[item]; // e.g., { 'Passport': { file: File }, ... }
      for (const docKey in documents) {
        const fileObj = documents[docKey];
        if (fileObj?.file) {
          formData.append("files", fileObj.file); // multiple files
          dataPayload.documents.push({ name: docKey }); // push the doc name
        }
      }
  
      // Append the stringified data
      formData.append("data", JSON.stringify(dataPayload));
  
      // 🔥 Send request to backend
      const response = await fetch(`${BASE_URL}edit-order-details-v2/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // DO NOT set 'Content-Type' when sending FormData
        },
        body: formData,
      });
  
      const result = await response.json();
      console.log(result.data);
  
      if (result.success) {
        navigate(`/edit-visa-request-v2/${result.data.visaOrder}`);
      } else {
        toast.error(result.message || "Update failed");
      }
    } catch (error) {
      console.error("❌ Frontend error:", error);
      toast.error("Network error! Try again later.");
    }
  };
  
  

  const createVisaOrder = async(item,id)=>{
    try {
          console.log(countryData[item])
          const response = await fetchDataFromAPI(
            "POST",
            `${BASE_URL}create-visa-order`,
            {
              visaCategory:id,
              travellersCount: 1,
              from: countryData[item]?.departureDate,
              to: countryData[item]?.returnDate,
              applicationType: "normal",
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem(
                  "token"
                )}`,
                "Content-Type": "application/json",
              },
            }
          );
          console.log(response)
          addAllDetails(item,response?.data?.orderDetails?._id);
          if (response.status === 503) {
            console.log("Request  Successfull")
            navigate("/503"); // Redirect to Service Unavailable page
          }
        } catch (error) {
          navigate("/503");
          console.log(error);
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
  
  console.log(countryDocuments)

  const saveCountryForm = (countryName) => {
    // Save the form data for the specific country
    console.log(`Saving data for ${countryName}:`, countryData[countryName])
    console.log(`Documents for ${countryName}:`, countryDocuments[countryName])
    // Here you would typically validate and process the data
    alert(`${countryName} visa requirements saved successfully!`)
  }

  return (
    <div className="flex justify-center mb-8">
      {onClose && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col p-6 overflow-auto">
          {/* Close Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => onClose(false)}
              className="text-red-500 font-semibold text-sm px-4 py-2 border border-red-500 rounded hover:bg-red-50"
            >
              Close
            </button>
          </div>

          {/* Tab Buttons */}
          <div className="flex justify-center border-b mb-8 gap-4">
            {cartItems.map((tab) => (
              <button
                key={tab.id || tab._id}
                onClick={() => setActiveTab(tab.id || tab._id)}
                className={`px-4 py-2 font-medium transition ${
                  activeTab === (tab.id || tab._id) ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1">
            {cartItems
              .filter((item) => (item.id || item._id) === activeTab)
              .map((item) => (
                <div key={item.id || item._id}>
                  <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                  <p>{item.description}</p>
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Personal Info */}
                        {personalInfoFields.map((field) => (
                          <div key={field.name}>
                            <label className="block text-gray-700 font-medium mb-2">{field.label}</label>
                            {field.type === "select" ? (
                              <select
                                name={field.name}
                                value={countryData[item.name]?.[field.name] || ""}
                                onChange={(e) => handleCountryChange(item.name, e)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                                value={countryData[item.name]?.[field.name] || ""}
                                onChange={(e) => handleCountryChange(item.name, e)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              />
                            )}
                          </div>
                        ))}

                        {/* Passport Info */}
                        {passportFields.map((field,index) => (
                          <div key={index}>
                            <label className="block text-gray-700 font-medium mb-2">{field.label}</label>
                            <input
                              type={field.type}
                              name={field.name}
                              value={countryData[item.name]?.[field.name] || ""}
                              onChange={(e) => handleCountryChange(item.name, e)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                          </div>
                        ))}

                        {/* Travel Dates */}
                        {travelDateFields.map((field) => (
                          <div key={field.name}>
                            <label className="block text-gray-700 font-medium mb-2">{field.label}</label>
                            <input
                              type={field.type}
                              name={field.name}
                              value={countryData[item.name]?.[field.name] || ""}
                              onChange={(e) => handleCountryChange(item.name, e)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Document Upload Section - Only show documents with show:true */}
                      {item.document && item.document.length > 0 && (
                        <div className="md:col-span-2 mt-8">
                          <h3 className="text-lg font-semibold mb-4">Required Documents</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {item.document
                              .filter((doc) => doc.show === "true")
                              .map((doc) => (
                                <div key={doc.type} className="flex flex-col">
                                  <label className="block text-gray-700 font-medium mb-2">{doc.name}</label>
                                  <div className="relative">
                                    <input
                                      type="file"
                                      onChange={(e) => handleFileChange(item.name, doc, e)}
                                      className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                                    />
                                    <div className="flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg">
                                      <span className="text-gray-500 truncate">
                                        {countryDocuments[item.name]?.[doc.name]?.file?.name
                                          ? countryDocuments[item.name][doc.name].file.name
                                          : "No file chosen"}
                                      </span>
                                      <FaFileUpload className="text-gray-400" />
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <button
                      type="button"
                      onClick={() => {saveCountryForm(item.name); createVisaOrder(item.name,item.id)}}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Save {item.name} Requirements
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* Form Navigation */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              disabled={currentStep === 1}
            >
              <FaArrowLeft className="mr-2" /> Previous
            </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="flex items-center px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                disabled={loading}
              >
                {loading ? "Processing..." : "Submit Application"}
              </button>
            
          </div>
        </div>
      )}
    </div>
  )
}

export default CheckoutForm
