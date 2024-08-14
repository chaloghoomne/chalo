import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchDataFromAPI } from "../../../api-integration/fetchApi";
import { BASE_URL } from "../../../api-integration/urlsVariable";

const EditProfile = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    addressLineOne: "",
    addressLineTwo: "",
    city: "",
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    occupation: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchDataFromAPI(
          "GET",
          `${BASE_URL}user-profile`
        );
        if (response) {
          const data = response?.data;
          setFormData({
            ...data,
            passportExpiry: formatDateForInput(data.passportExpiry),
            dob: formatDateForInput(data.dob),
          });
          if (data.image) {
            setImagePreview(data.image);
          }
        } else {
          console.log("");
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (key === "unreadNotifications") {
          console.log("abhsihek k liye yahi sahi");
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }

      const response = await fetchDataFromAPI(
        "PUT",
        `${BASE_URL}user-edit-profile/${localStorage.getItem("userId")}`,
        formDataToSend,
        true // Set this to true if your API expects multipart/form-data
      );
      if (response) {
        toast.success("Profile updated successfully.");
        onClose();
          window.location.href = "/profile"
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    } catch (err) {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-h-[500px] overflow-auto max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-4"></div>
          <div className="w-full">
            <label htmlFor="profileImage" className="block mb-2">
              Profile Image
            </label>
            <input
              type="file"
              id="profileImage"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300"
            />
          </div>
          {imagePreview && (
            <div className="w-full">
              <label className="block mb-2">Image Preview</label>
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="w-32 h-32 object-cover rounded-full"
              />
            </div>
          )}
          <div>
            <label htmlFor="addressLineOne" className="block mb-2">
              Address Line 1
            </label>
            <input
              type="text"
              id="addressLineOne"
              name="addressLineOne"
              placeholder="Address Line 1"
              value={formData.addressLineOne}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300"
            />
          </div>
          <div>
            <label htmlFor="addressLineTwo" className="block mb-2">
              Address Line 2
            </label>
            <input
              type="text"
              id="addressLineTwo"
              name="addressLineTwo"
              placeholder="Address Line 2"
              value={formData.addressLineTwo}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300"
            />
          </div>
          <div>
            <label htmlFor="city" className="block mb-2">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300"
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full">
              <label htmlFor="firstName" className="block mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-gray-300"
              />
            </div>
            <div className="w-full">
              <label htmlFor="lastName" className="block mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-gray-300"
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full">
              <label htmlFor="gender" className="block mb-2">
                Gender
              </label>
              <select
                id="gender"
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
            </div>
            <div className="w-full">
              <label htmlFor="dob" className="block mb-2">
                DOB
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                placeholder="DOB"
                value={formData.dob}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-gray-300"
              />
            </div>
          </div>
          <div>
            <label htmlFor="occupation" className="block mb-2">
              Occupation
            </label>
            <input
              type="text"
              id="occupation"
              name="occupation"
              placeholder="Occupation"
              value={formData.occupation}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300"
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleSkip}
              className="px-4 py-2 bg-gray-300 rounded-xl hover:bg-gray-400"
            >
              Close
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

export default EditProfile;
