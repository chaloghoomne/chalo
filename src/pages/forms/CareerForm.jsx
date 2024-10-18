import axios from 'axios';
import React, { useState } from 'react';
import { BASE_URL } from '../../api-integration/urlsVariable';
import { toast } from 'react-toastify';

const CareerForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    currentDesignation: '',
    position: '',
    description: '',
    resume: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData object to handle file uploads
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('phoneNumber', formData.phoneNumber);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('currentDesignation', formData.currentDesignation);
    formDataToSend.append('position', formData.position);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('documents', formData.resume); // Append file to formData

    try {
      const resp = await axios.post(`${BASE_URL}add-career`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (resp) {
        toast.success(`Congratulations! Your application is submitted.`);
        setFormData({
            name: '',
            phoneNumber: '',
            email: '',
            currentDesignation: '',
            position: '',
            description: '',
            resume: null
          })
      }
      window.location.href = "/career-form"
    } catch (error) {
      console.log(error);
      toast.error(`Failed to submit the application.`);
    }

    console.log(formDataToSend);
  };

  return (
    <div className="bg-orange-100 mx-auto flex flex-col  justify-center items-center min-w-3xl  max-w-3xl container  mt-24 rounded-xl p-8">
      <h1 className="text-4xl poppins-six font-bold text-[#F26337] mb-6">Career Form</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block poppins-four text-black mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-black rounded"
            placeholder="Enter your name"
            required
          />
        </div>

        <div>
          <label className="block poppins-four text-black mb-2">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full p-2 border border-black rounded"
            placeholder="Enter your phone number"
            required
          />
        </div>

        <div>
          <label className="block poppins-four text-black mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-black rounded"
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label className="block poppins-four text-black mb-2">Current Designation</label>
          <input
            type="text"
            name="currentDesignation"
            value={formData.currentDesignation}
            onChange={handleChange}
            className="w-full p-2 border border-black rounded"
            placeholder="Enter your current designation"
            required
          />
        </div>

        <div>
          <label className="block poppins-four text-black mb-2">Position Applied For</label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="w-full p-2 border border-black rounded"
            placeholder="Enter the position you're applying for"
            required
          />
        </div>

        <div>
          <label className="block poppins-four text-black mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border border-black rounded"
            placeholder="Enter additional details"
            required
          />
        </div>

        <div>
          <label className="block poppins-four text-black mb-2">Resume</label>
          <input
            type="file"
            name="resume"
            onChange={handleChange}
            className="w-full p-2 border border-black rounded"
            required
          />
        </div>

        <button type="submit" className="bg-[#F26438] text-white py-2 px-8 mt-12 text-lg poppins-three rounded-full">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CareerForm;
