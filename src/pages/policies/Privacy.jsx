import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../api-integration/urlsVariable';

const PrivacyPolicyPage = () => {
  const [privacyData, setPrivacyData] = useState(null);

  useEffect(() => {
    // Fetch privacy policy data from API
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}page-by-type/privacy`); // replace with actual API
        setPrivacyData(response.data.data);
      } catch (error) {
        console.error('Error fetching privacy policy data:', error);
      }
    };
    fetchData();
  }, []);

  if (!privacyData) {
    return <div className="text-white text-center">Loading...</div>;
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header Image */}
      <div className="w-full h-96 bg-orange-500 flex mt-20 bg-cover  justify-center items-center">
        <img src={privacyData.imageUrl }alt="Privacy Policy" className="h-full w-full object-cover" />
      </div>

      {/* Privacy Policy Content */}
      <div className="text-white px-10 py-8">
        <h1 className="text-4xl text-center poppins-seven font-bold text-orange-400 mb-6">{privacyData.title || 'Privacy Policy'}</h1>
        
        <p className="text-lg poppins-four text-black mb-4">{privacyData.description || 'Description about privacy policy goes here...'}</p>

        {/* Sections */}
        <div className="space-y-8">
          {privacyData?.sections?.map((section, index) => (
            <div key={index}>
              <h2 className="text-2xl poppins-five font-semibold text-orange-400">{section.heading}</h2>
              <ul className="list-disc poppins-three list-inside mt-2 text-black">
                {section.point.map((point, idx) => (
                  <li  key={idx}>{point}</li>
                ))}
              </ul>
              <ul className="list-disc poppins-three list-inside mt-2 text-black">
                {section.summary.map((point, idx) => (
                  <li  key={idx}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
