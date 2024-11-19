import { FaUser, FaPhone, FaEnvelope, FaBriefcase, FaTools, FaFileAlt } from 'react-icons/fa';
import { BsCardText } from 'react-icons/bs';
import axios from 'axios';
import React, { useState } from 'react';
import { BASE_URL } from '../../api-integration/urlsVariable';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CareerForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    currentDesignation: '',
    position: '',
    skills: "",
    description: '',
    documents: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => formDataToSend.append(key, formData[key]));

    try {
      const resp = await axios.post(`${BASE_URL}add-career`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (resp) {
        toast.success(`Congratulations! Your application is submitted.`);
        setFormData({
          name: '',
          phoneNumber: '',
          email: '',
          currentDesignation: '',
          position: '',
          skills: '',
          description: '',
          resume: null
        });
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(`Failed to submit the application.`);
    }
  };

  return (
    <div className="bg-orange-100 mx-auto flex flex-col justify-center items-center max-w-3xl container mt-24 rounded-xl p-8 shadow-lg">
      <h1 className="text-4xl font-bold text-[#F26337] mb-6">Career Form</h1>
      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
          {[
            { label: 'Name', name: 'name', icon: <FaUser /> },
            { label: 'Phone Number', name: 'phoneNumber', icon: <FaPhone /> },
            { label: 'Email', name: 'email', icon: <FaEnvelope />, type: 'email' },
            { label: 'Current Designation', name: 'currentDesignation', icon: <FaBriefcase /> },
            { label: 'Position Applied For', name: 'position', icon: <FaTools /> },
            { label: 'Skills', name: 'skills', icon: <FaTools /> }
          ].map(({ label, name, icon, type = 'text' }) => (
            <div key={name} className="flex items-center">
              
              <div className="flex-1">
                <label className=" text-black flex gap-1 mb-2"> <span className="text-xl text-[#F26337] mr-2">{icon}</span>{label}</label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#F26337]"
                  placeholder={`Enter your ${label.toLowerCase()}`}
                  required
                />
              </div>
            </div>
          ))}

          <div className="flex items-center">
        
            <div className="flex-1">
            <label className=" text-black flex gap-1 mb-2">     <span className="text-xl text-[#F26337] mr-2"><BsCardText /></span>Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#F26337]"
                placeholder="Enter additional details"
                required
              />
            </div>
          </div>

          <div className="flex items-center">
           
            <div className="flex-1">
              <label className=" text-black  flex gap-1 mb-2"> <span className="text-xl text-[#F26337] mr-2"><FaFileAlt /></span>Resume</label>
              <input
                type="file"
                name="documents"
                onChange={handleChange}
                className="w-full bg-white p-2 border border-gray-300 rounded focus:outline-none focus:border-[#F26337]"
                required
              />
            </div>
          </div>
        </div>

        <button type="submit" className="bg-[#F26438] text-white py-2 px-8 mt-4 text-lg font-semibold rounded-full transition-all hover:bg-[#e65327]">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CareerForm;
