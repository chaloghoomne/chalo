import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VisaTypes = () => {
  const [selectedVisa, setSelectedVisa] = useState('Tourist');
const navigate = useNavigate()
const handleRedirect = ()=>{
navigate("/packages")

}

  const visaTypes = [
    { id: 'Tourist', label: 'Tourist', img: 'https://e7.pngegg.com/pngimages/174/153/png-clipart-travel-agent-bank-service-industry-visa-passport-blue-company-thumbnail.png' },
    { id: 'Business', label: 'Business', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT39wSCkTvlPH5yoxr7661_l_wxl8WYTxE9AQ&s' },
    { id: 'Transit', label: 'Transit', img: 'https://static1.bigstockphoto.com/2/3/3/large2/332458573.jpg' },
    { id: 'SureShot', label: 'Sure Shot', img: 'https://e7.pngegg.com/pngimages/174/153/png-clipart-travel-agent-bank-service-industry-visa-passport-blue-company-thumbnail.png' },
    { id: 'JobSeeker', label: 'Job Seeker', img: 'https://e7.pngegg.com/pngimages/174/153/png-clipart-travel-agent-bank-service-industry-visa-passport-blue-company-thumbnail.png' },
  ];

  return (
    <div className="flex flex-col  items-center justify-center py-20 px-4 bg-white">
      <h2 className="text-2xl font-bold mb-4">Brazil Visa Application</h2>
      <p className="text-orange-500 mb-6">Select the Purpose of your visit</p>
      <div className="flex flex-wrap  gap-4 mb-6">
        {visaTypes.map((visa) => (
          <div
            key={visa.id}
            className={`p-4 relative min-w-56 w-56 h-56 flex flex-col justify-center items-center border rounded-[30px] shadow-md shadow-gray-300 text-center cursor-pointer ${
              selectedVisa === visa.id ? 'border-orange-500' : 'border-gray-300'
            }`}
            onClick={() => setSelectedVisa(visa.id)}
          >
            <div
              className={`w-4 h-4 absolute left-3 top-2 mb-4 mx-auto rounded-full border-3 ${
                selectedVisa === visa.id ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
              }`}
            ></div>
            <img src={visa.img} alt={visa.label} className="w-[80%] h-auto mb-4" />
            <p className="font-semibold">{visa.label}</p>
          </div>
        ))}
      </div>
      <p className="text-orange-500 p-2 flex justify-center items-center bg-orange-200 rounded-md mb-6">
        <span className="text-2xl">😊</span> Chalo Ghoomne has brought joy to over 100,000 happy travellers!
      </p>
      <button onClick = {handleRedirect} className="bg-orange-500 text-white py-2 px-6 rounded-full">Continue</button>
    </div>
  );
};

export default VisaTypes;
