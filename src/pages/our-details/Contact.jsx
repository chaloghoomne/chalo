import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../api-integration/urlsVariable';

const ContactUs = () => {
  const [contactData, setContactData] = useState({
    "offices": [
      { "city": "Mumbai", "address": "264, Vaswani Chambers Dr Annie Besant Rd, Mumbai, Maharashtra, 400030" },
      { "city": "Delhi", "address": "32, Sector 32, Gurgaon - 122003" }
    ],
    "supportEmail": "support@example.com"
  });

  useEffect(() => {
    // Fetch Contact Data from API
    const fetchData = async()=>{
        const resp = await axios.get(`${BASE_URL}/contact`)
        console.log(resp,"djjd")
        setContactData(resp.data.data)
        }
        fetchData()
  }, []);

  return (
    <div className="bg-white text-black mt-20 p-8 min-h-screen container mx-auto ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div>
          <h1 className="text-4xl poppins-six text-[#F26337] font-bold mb-4">Get in touch</h1>
          <p className="text-lg poppins-four text-black mb-6">
            Thank you for your interest in reaching out to us! We value your feedback, inquiries, and suggestions.
            To ensure we can assist you effectively, please find the appropriate contact information and guidelines below:
          </p>
          {contactData.offices.map((office, index) => (
            <div key={index} className="mb-4">
              <h2 className="text-xl poppins-five font-bold">{office.city}</h2>
              <p className="text-lg poppins-three">{office.address}</p>
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div className="text-center mt-24 md:text-center">
          <h2 className="text-3xl poppins-five font-bold mb-4">Have a question?</h2>
          <p className="text-lg poppins-four">You can message us on: <a href={`mailto:${contactData.supportEmail}`} className="text-blue-600">{contactData.supportEmail}</a></p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
