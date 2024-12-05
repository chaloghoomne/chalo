import React, { useState } from 'react';
import { BASE_URL } from '../../api-integration/urlsVariable';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';

const TravelAgentForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    description: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
   
    try {
      const resp = await axios.post(`${BASE_URL}add-travel-agent`, formData);
      if (resp) {
        toast.success(`Congratulations! Your application is submitted.`);
        setFormData({
            name: '',
            email: '',
            phoneNumber: '',
            description: ''
          })
      }
    } catch (error) {
      console.log(error);
      toast.error(`Failed to submit the application.`);
    }
  };

  return (
    <div className="bg-orange-100 mx-auto flex flex-col  justify-center items-center min-w-3xl  max-w-3xl container   mt-24 rounded-xl p-8">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Chalo Ghoomne</title>
        <link rel="canonical" href="https://chaloghoomne.com/" />   
      </Helmet>
      <h1 className="text-4xl font-bold poppins-six text-center text-[#F26337] mb-6">Travel Agent Form</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-black poppins-four mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-black rounded"
            placeholder="Enter your name "
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
          <label className="block poppins-four text-black mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border border-black rounded"
            placeholder="Enter description"
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

export default TravelAgentForm;
