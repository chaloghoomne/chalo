import React, { useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { MdOutlinePersonAdd } from "react-icons/md";
import { IoDocumentsSharp } from "react-icons/io5";
import { fetchDataFromAPI } from "../../api-integration/fetchApi";
import { BASE_URL } from "../../api-integration/urlsVariable";
import { toast } from "react-toastify";

const ModalVisaRequest = ({ user, isEdit, onClose }) => {
  const [formData, setFormData] = useState(user);
  const [images, setImages] = useState({
    selfie: user.selfie,
    passportFront: user.passportFront,
    passportBack: user.passportBack,
    additional: user.additional,
  });
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleFields = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    setImages((prevImages) => ({
      ...prevImages,
      [name]: files[0],
    }));
  };

  useEffect(() => {
    console.log("try enter");

    if (formData.dob && formData.passportIssueDate) {
      console.log("enter");
      calculatePassportValidity(formData.dob, formData.passportIssueDate);
    }
  }, [formData.dob, formData.passportIssueDate]);

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
    e.preventDefault();

    if (!validatePassportDetails()) {
      return;
    }

    const newformData = new FormData();
    newformData.append(`firstName`, formData.firstName);
    newformData.append(`lastName`, formData.lastName);
    newformData.append(`fatherName`, formData.fatherName);
    newformData.append(`motherName`, formData.motherName);
    newformData.append(`gender`, formData.gender);
    newformData.append(`passportNumber`, formData.passportNumber);
    newformData.append(`dob`, formData.dob);
    newformData.append(`passportIssueDate`, formData.passportIssueDate);
    newformData.append(`passportValidTill`, formData.passportValidTill);
    newformData.append(`selfie`, images.selfie);
    newformData.append(`passportFront`, images.passportFront);
    newformData.append(`passportBack`, images.passportBack);
    newformData.append(`additional`, images.additional);

    try {
      const response = await fetchDataFromAPI(
        "PUT",
        `${BASE_URL}edit-order-details/${user?._id}`,
        newformData
      );
      console.log(response);
      if (response) {
        console.log(response);
        onClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    if (isEdit) {
      setShowConfirmationModal(true);
    } else {
      onClose();
    }
  };

  const handleConfirmation = (confirm) => {
    if (confirm) {
      handleSubmit(new Event("submit"));
    } else {
      onClose();
    }
    setShowConfirmationModal(false);
  };

  return (
    <div className="fixed inset-0 h-full z-30 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-orange-100 p-6 rounded-lg shadow-lg w-full max-w-3xl overflow-y-auto max-h-[75%]">
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={handleClose}
        >
          <IoCloseSharp size={24} />
        </button>

        <h2 className="text-2xl text-orange-500 poppins-five font-bold mb-4">
          {isEdit ? "Edit User" : "View User"}
        </h2>
        <button className="text-xl self-center py-2 w-[95%] mx-3 mb-5 rounded-2xl px-5 flex justify-start gap-2 items-center bg-orange-500 text-white font-semibold">
          <MdOutlinePersonAdd size={25} color="white" />
          Personal Information
        </button>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-10 mb-4">
            <div>
              <label className="block text-sm font-semibold">First Name</label>
              <input
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleFields}
                className="w-full p-2 border rounded-lg"
                readOnly={!isEdit}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Last Name</label>
              <input
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleFields}
                className="w-full p-2 border rounded-lg"
                readOnly={!isEdit}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">
                Father's Name
              </label>
              <input
                name="fatherName"
                required
                value={formData.fatherName}
                onChange={handleFields}
                className="w-full p-2 border rounded-lg"
                readOnly={!isEdit}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">
                Mother's Name
              </label>
              <input
                name="motherName"
                required
                value={formData.motherName}
                onChange={handleFields}
                className="w-full p-2 border rounded-lg"
                readOnly={!isEdit}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Gender</label>
              <select
                name="gender"
                required
                value={formData.gender}
                onChange={handleFields}
                className="w-full p-2 border rounded-lg"
                disabled={!isEdit}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold">
                Passport Number
              </label>
              <input
                name="passportNumber"
                required
                value={formData.passportNumber}
                onChange={handleFields}
                className="w-full p-2 border rounded-lg"
                readOnly={!isEdit}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                required
                value={formData.dob}
                onChange={handleFields}
                className="w-full p-2 border rounded-lg"
                readOnly={!isEdit}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">
                Passport Issued On
              </label>
              <input
                type="date"
                name="passportIssueDate"
                required
                value={formData.passportIssueDate?.slice(0, 10)}
                onChange={handleFields}
                className="w-full p-2 border rounded-lg"
                readOnly={!isEdit}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">
                Passport Valid Till
              </label>
              <input
                type="date"
                name="passportValidTill"
                required
                value={formData.passportValidTill}
                onChange={handleFields}
                className="w-full p-2 border rounded-lg"
                readOnly={!isEdit}
              />
            </div>
          </div>
          <button className="text-xl py-3 w-[95%] mx-3 mb-5 rounded-2xl px-5 flex justify-start gap-2 items-center poppins-five bg-orange-500 text-white font-semibold">
            <IoDocumentsSharp size={25} color="white" />
            Documents Submitted
          </button>
          {images.selfie &&
            images.passportFront &&
            images.passportBack &&
            images.additional && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {["selfie", "passportFront", "passportBack", "additional"].map(
                  (key) => (
                    <div
                      key={key}
                      className="border-2 border-dashed border-orange-500 rounded-lg p-4"
                    >
                      <img
                        src={
                          typeof images[key] === "string"
                            ? images[key]
                            : URL.createObjectURL(images[key])
                        }
                        alt={key}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      {isEdit && (
                        <input
                          type="file"
                          name={key}
                          onChange={handleImageChange}
                          className="w-full mt-2"
                        />
                      )}
                    </div>
                  )
                )}
              </div>
            )}
          {isEdit && (
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-lg"
              >
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
      {showConfirmationModal && isEdit && (
        <div className="fixed inset-0 h-full z-40 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-orange-100 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl text-orange-500 poppins-five font-semibold mb-4">
              Save Changes?
            </h3>
            <p className="mb-4 poppins-four text-black">
              Do you want to save the changes you made?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => handleConfirmation(false)}
                className="bg-red-500 text-white py-2 px-4 rounded-lg"
              >
                No
              </button>
              <button
                onClick={() => handleConfirmation(true)}
                className="bg-orange-500 text-white py-2 px-4 rounded-lg"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalVisaRequest;
