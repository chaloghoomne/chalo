import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../api-integration/urlsVariable';
import { Helmet } from 'react-helmet';

const TermsConditions = () => {
  const [privacyData, setPrivacyData] = useState(null);

  useEffect(() => {
    // Fetch privacy policy data from API
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}page-by-type/terms`); // replace with actual API
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
      <Helmet>
        <meta charSet="utf-8" />
        <title>Chalo Ghoomne</title>
        <link rel="canonical" href="https://chaloghoomne.com/" />   
      </Helmet>
      {/* Header Image */}
      <div className="w-full h-96 bg-orange-500 flex mt-20 bg-cover  justify-center items-center">
        <img src={privacyData.imageUrl }alt="Privacy Policy" className="h-full w-full object-cover" />
      </div>

      {/* Privacy Policy Content */}
      <div className="text-white px-10 py-8">
        <h1 className="text-4xl text-center poppins-seven font-bold text-orange-400 mb-6">{privacyData.title || 'Privacy Policy'}</h1>
        
        <div dangerouslySetInnerHTML={{__html:privacyData.description}} className='prose prose-lg max-w-none'></div>
      </div>
    </div>
  );
};

export default TermsConditions;
