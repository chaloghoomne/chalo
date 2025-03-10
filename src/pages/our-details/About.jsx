import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../api-integration/urlsVariable';
import { Helmet } from 'react-helmet';

const AboutUs = () => {
  const [aboutUsData, setAboutUsData] = useState({
    title: 'About us',
    description: 'We\'re a fully distributed team...',
    image: '',
  });

  useEffect(() => {
    // Fetch About Us data from API
    const fetchData = async()=>{
        const resp = await  axios.get(`${BASE_URL}/about`)
        setAboutUsData(resp.data.data)
      }
      fetchData()
  }, []);

  return (
    <div className="bg-white mx-auto container text-black mt-20 p-8">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Chalo Ghoomne</title>
        <link rel="canonical" href="https://chaloghoomne.com/" />   
      </Helmet>
      <h1 className="text-4xl font-bold poppins-six text-[#F26337] text-center">{aboutUsData.title}</h1>
      <div className="mt-8 flex justify-center">
        <img src={aboutUsData.image || "https://t4.ftcdn.net/jpg/05/06/80/79/360_F_506807900_w3mbiKhspSodoRQZEC53lWD3mqfoFeum.jpg"} alt="Team" className="rounded-lg shadow-lg" />
      </div>
      <div className="mt-8" >
      <div
				dangerouslySetInnerHTML={{
					__html: aboutUsData.description,
				}}
				className="prose prose-lg max-w-none"
			></div>
      </div>
    </div>
  );
};

export default AboutUs;
