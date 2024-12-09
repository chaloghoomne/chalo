import React, { useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { MdOutlinePersonAdd } from "react-icons/md";
import { IoDocumentsSharp } from "react-icons/io5";
import { fetchDataFromAPI } from "../../api-integration/fetchApi";
import { BASE_URL } from "../../api-integration/urlsVariable";
import { toast } from "react-toastify";

const ModalVisaRequest = ({ user, isEdit, onClose }) => {
  const [formData, setFormData] = useState(user);
  // const [documents, setDocuments] = useState(user.documents);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleTourTypeImageChange = async (index, e) => {
    const data = new FormData();
    data.append("documents", e.target.files[0]);
    data.append("index", index);

    try {
      const response = await fetchDataFromAPI(
        "PUT",
        `${BASE_URL}edit-document/${user?._id}`,
        data
      );
      if (response) {
        const updatedTourTypes = [...formData?.documents];
        updatedTourTypes[index] = {
          ...updatedTourTypes[index],
          image: response.data,
        };
        setFormData({ ...formData, documents: updatedTourTypes });
      }
    } catch (error) {
      console.log(error);
      toast.error("Error In Updating ");
    }
  };

  const handleFields = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // const handleImageChange = (e) => {
  //   const { name, files } = e.target;
  //   setImages((prevImages) => ({
  //     ...prevImages,
  //     [name]: files[0],
  //   }));
  // };

  useEffect(() => {

    if (formData.dob && formData.passportIssueDate) {
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
    newformData.append(`ageGroup`, formData.ageGroup);
    newformData.append(`passportIssueDate`, formData.passportIssueDate);
    newformData.append(`passportValidTill`, formData.passportValidTill);
    formData?.documents?.forEach((item, index) => {
      newformData.append(`documents[${index}][name]`, item.name);
      newformData.append(`documents[${index}][image]`, item.image);
    });
    // formData?.documents?.forEach((item) => {
    //   if (typeof item.image === "string") {
    //     console.log("");
    //   } else {
    //     newformData.append("documents", item.image);
    //   }
    // });

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
      <div className="bg-orange-100 p-6 mt-10 rounded-lg shadow-lg w-full max-w-3xl overflow-y-auto max-h-[75%]">
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
  <label className="block text-sm font-semibold">Age Group</label>
  <select
    name="ageGroup"
    required
    value={formData.ageGroup}
    onChange={handleFields}
    className="w-full p-2 border rounded-lg"
  >
    <option value="">Select Age Group</option>
    <option value="Child">Under 18</option>
    <option value="Adult">18 and Over</option>
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {formData.documents?.map((doc, index) => (
              <div
                key={doc?.name}
                className="border-2 border-dashed border-orange-500 rounded-lg p-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {doc?.name}
                  </label>

                  {doc?.image && (
                    <img
                      src={
                        typeof doc?.image === "string"
                          ? doc?.image
                          : URL.createObjectURL(doc?.image)
                      }
                      alt={doc?.name}
                      className="mt-2 w-20 h-20 object-cover"
                    />
                  )}
                  {isEdit && (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleTourTypeImageChange(index, e)}
                      className="mt-1 block w-full"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {isEdit && (
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-[#F26438] text-white py-2 px-4 rounded-full"
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
                className="bg-red-500 text-white py-2 px-4 rounded-full"
              >
                No
              </button>
              <button
                onClick={() => handleConfirmation(true)}
                className="bg-[#F26438] text-white py-2 px-4 rounded-full"
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
