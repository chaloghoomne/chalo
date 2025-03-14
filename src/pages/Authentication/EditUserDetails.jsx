import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchDataFromAPI } from "../../api-integration/fetchApi";
import { BASE_URL } from "../../api-integration/urlsVariable";

const EditProfileModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    passportNumber: "",
    passportExpiry: "",
    addressLineOne: "",
    addressLineTwo: "",
    city: "",
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    occupation: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetchDataFromAPI(
        "PUT",
        `${BASE_URL}user-edit-profile/${localStorage.getItem("userId")}`,
        formData
      );
      if (response) {
        toast.success("Profile updated successfully.");
        navigate("/login");
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    } catch (err) {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleSkip = () => {
    navigate("/login");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-h-[500px] overflow-auto max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              name="passportNumber"
              placeholder="Passport Number"
              value={formData.passportNumber}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300"
            />
            <input
              type="date"
              name="passportExpiry"
              placeholder="Passport Expiry"
              value={formData.passportExpiry}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300"
            />
          </div>
          <input
            type="text"
            name="addressLineOne"
            placeholder="Address Line 1"
            value={formData.addressLineOne}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-gray-300"
          />
          <input
            type="text"
            name="addressLineTwo"
            placeholder="Address Line 2"
            value={formData.addressLineTwo}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-gray-300"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-gray-300"
          />
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300"
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300"
            >
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="date"
              name="dob"
              placeholder="DOB"
              value={formData.dob}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300"
            />
          </div>
          <input
            type="text"
            name="occupation"
            placeholder="Occupation"
            value={formData.occupation}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-gray-300"
          />
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleSkip}
              className="px-4 py-2 bg-gray-300 rounded-xl hover:bg-gray-400"
            >
              Skip
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
