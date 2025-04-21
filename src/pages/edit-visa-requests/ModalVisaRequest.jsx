"use client"

import { useEffect, useState } from "react"
import { IoCloseSharp } from "react-icons/io5"
import { MdOutlinePersonAdd } from "react-icons/md"
import { IoDocumentsSharp } from "react-icons/io5"
import { fetchDataFromAPI } from "../../api-integration/fetchApi"
import { BASE_URL } from "../../api-integration/urlsVariable"
import { toast } from "react-toastify"
import { FaPassport, FaRegCalendarAlt, FaUserAlt } from "react-icons/fa"

const ModalVisaRequest = ({ user, isEdit, onClose }) => {
  const [formData, setFormData] = useState(user)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)

  const handleTourTypeImageChange = async (index, e) => {
    const data = new FormData()
    data.append("documents", e.target.files[0])
    data.append("index", index)

    try {
      const response = await fetchDataFromAPI("PUT", `${BASE_URL}edit-document/${user?._id}`, data)
      if (response) {
        const updatedTourTypes = [...formData?.documents]
        updatedTourTypes[index] = {
          ...updatedTourTypes[index],
          image: response.data,
        }
        setFormData({ ...formData, documents: updatedTourTypes })
      }
    } catch (error) {
      console.log(error)
      toast.error("Error In Updating ")
    }
  }

  const handleFields = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  useEffect(() => {
    if (formData.dob && formData.passportIssueDate) {
      calculatePassportValidity(formData.dob, formData.passportIssueDate)
    }
  }, [formData.dob, formData.passportIssueDate])

  const calculatePassportValidity = (dob, issueDate) => {
    const dobDate = new Date(dob)
    const issueDateObj = new Date(issueDate)
    const currentDate = new Date()

    // Assuming passport is valid for 10 years from issue date
    const validityPeriod = 10 * 365 * 24 * 60 * 60 * 1000 // 10 years in milliseconds
    const validityDate = new Date(issueDateObj.getTime() + validityPeriod)

    if (validityDate < dobDate) {
      toast.error("Passport expiry date is earlier than date of birth.")
      return ""
    }

    if (validityDate < currentDate) {
      toast.error("Passport has expired.")
      return ""
    }

    setFormData((prevData) => ({
      ...prevData,
      passportValidTill: validityDate.toISOString().slice(0, 10),
    }))

    return validityDate.toISOString().slice(0, 10) // Format: YYYY-MM-DD
  }

  const validatePassportDetails = () => {
    const { passportNumber, passportIssueDate, dob } = formData

    // Regex pattern for passport number validation
    // This example assumes passport numbers are alphanumeric and between 6 and 9 characters
    const passportNumberRegex = /^[A-Z0-9]{6,9}$/

    // Passport number validation
    if (!passportNumberRegex.test(passportNumber)) {
      toast.error("Invalid passport number.")
      return false
    }

    // Calculate and set passportValidTill date
    const passportValidTillDate = calculatePassportValidity(dob, passportIssueDate)
    if (!passportValidTillDate) {
      return false
    }

    setFormData((prevData) => ({
      ...prevData,
      passportValidTill: passportValidTillDate,
    }))

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validatePassportDetails()) {
      return
    }

    const newformData = new FormData()
    newformData.append(`firstName`, formData.firstName)
    newformData.append(`lastName`, formData.lastName)
    newformData.append(`fatherName`, formData.fatherName)
    newformData.append(`motherName`, formData.motherName)
    newformData.append(`gender`, formData.gender)
    newformData.append(`passportNumber`, formData.passportNumber)
    newformData.append(`dob`, formData.dob)
    newformData.append(`ageGroup`, formData.ageGroup)
    newformData.append(`passportIssueDate`, formData.passportIssueDate)
    newformData.append(`passportValidTill`, formData.passportValidTill)
    formData?.documents?.forEach((item, index) => {
      newformData.append(`documents[${index}][name]`, item.name)
      newformData.append(`documents[${index}][image]`, item.image)
    })

    try {
      const response = await fetchDataFromAPI("PUT", `${BASE_URL}edit-order-details/${user?._id}`, newformData)
      if (response) {
        toast.success("Information updated successfully")
        onClose()
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to update information")
    }
  }

  const handleClose = () => {
    if (isEdit) {
      setShowConfirmationModal(true)
    } else {
      onClose()
    }
  }

  const handleConfirmation = (confirm) => {
    if (confirm) {
      handleSubmit(new Event("submit"))
    } else {
      onClose()
    }
    setShowConfirmationModal(false)
  }

  return (
    <div className="fixed inset-0 h-full z-30 bg-black bg-opacity-60 flex justify-center items-center backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-y-auto max-h-[80vh] border border-blue-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl text-white font-bold">{isEdit ? "Edit Traveler Details" : "Traveler Information"}</h2>
          <button
            className="text-white hover:bg-blue-700 p-2 rounded-full transition-colors"
            onClick={handleClose}
            aria-label="Close"
          >
            <IoCloseSharp size={24} />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Personal Information Section */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                <div className="bg-blue-500 text-white p-2 rounded-full">
                  <MdOutlinePersonAdd size={22} />
                </div>
                <h3 className="text-lg font-semibold text-blue-800">Personal Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUserAlt className="text-gray-400" />
                    </div>
                    <input
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleFields}
                      className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      readOnly={!isEdit}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUserAlt className="text-gray-400" />
                    </div>
                    <input
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleFields}
                      className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      readOnly={!isEdit}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Father's Name</label>
                  <input
                    name="fatherName"
                    required
                    value={formData.fatherName}
                    onChange={handleFields}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    readOnly={!isEdit}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Mother's Name</label>
                  <input
                    name="motherName"
                    required
                    value={formData.motherName}
                    onChange={handleFields}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    readOnly={!isEdit}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    name="gender"
                    required
                    value={formData.gender}
                    onChange={handleFields}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!isEdit}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Age Group</label>
                  <select
                    name="ageGroup"
                    required
                    value={formData.ageGroup}
                    onChange={handleFields}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!isEdit}
                  >
                    <option value="">Select Age Group</option>
                    <option value="Child">Under 18</option>
                    <option value="Adult">18 and Over</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Passport Information Section */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                <div className="bg-blue-500 text-white p-2 rounded-full">
                  <FaPassport size={22} />
                </div>
                <h3 className="text-lg font-semibold text-blue-800">Passport Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Passport Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPassport className="text-gray-400" />
                    </div>
                    <input
                      name="passportNumber"
                      required
                      value={formData.passportNumber}
                      onChange={handleFields}
                      className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      readOnly={!isEdit}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaRegCalendarAlt className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="dob"
                      required
                      value={formData.dob}
                      onChange={handleFields}
                      className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      readOnly={!isEdit}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Passport Issued On</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaRegCalendarAlt className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="passportIssueDate"
                      required
                      value={formData.passportIssueDate?.slice(0, 10)}
                      onChange={handleFields}
                      className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      readOnly={!isEdit}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Passport Valid Till</label>
                  <input
                    name="passportValidTill"
                    required
                    value={formData.passportValidTill}
                    onChange={handleFields}
                    className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50"
                    readOnly={true}
                  />
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                <div className="bg-blue-500 text-white p-2 rounded-full">
                  <IoDocumentsSharp size={22} />
                </div>
                <h3 className="text-lg font-semibold text-blue-800">Documents</h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {formData.documents?.map((doc, index) => (
                  <div key={doc?.name} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b">
                      <h4 className="font-medium text-gray-700 truncate">{doc?.name}</h4>
                    </div>

                    <div className="p-4">
                      {doc?.image && (
                        <div className="mb-3 flex justify-center">
                          <img
                            src={typeof doc?.image === "string" ? doc?.image : URL.createObjectURL(doc?.image)}
                            alt={doc?.name}
                            className="h-24 w-auto object-cover rounded-md"
                          />
                        </div>
                      )}

                      {isEdit && (
                        <div className="mt-2">
                          <label className="block text-xs font-medium text-gray-700 mb-1">Update document</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleTourTypeImageChange(index, e)}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            {isEdit && (
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  className="mr-3 px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-colors shadow-md"
                >
                  Save Changes
                </button>
              </div>
            )}

            {!isEdit && (
              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                >
                  Close
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && isEdit && (
        <div className="fixed inset-0 h-full z-40 bg-black bg-opacity-70 flex justify-center items-center backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                <svg
                  className="h-10 w-10 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">Save Changes?</h3>
              <p className="text-gray-600">Do you want to save the changes you made to this traveler's information?</p>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleConfirmation(false)}
                className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Discard
              </button>
              <button
                onClick={() => handleConfirmation(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-colors shadow-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ModalVisaRequest
