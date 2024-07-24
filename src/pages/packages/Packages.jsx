// src/VisaSelection.js
import React, { useState } from 'react';

const Packages = () => {

const [selected,setSelected] = useState("")

const handleselect = (id)=>{
    setSelected(id)
}

  const visaOptions = [
    {id:1, duration: '180 Days', type: 'Multiple Entry', price: '₹18,000', processingTime: '15 to 20 Business Days', popular: true },
    { id:2,duration: '180 Days', type: 'Multiple Entry', price: '₹18,000', processingTime: '15 to 20 Business Days', popular: false },
    { id:3,duration: '180 Days', type: 'Multiple Entry', price: '₹18,000', processingTime: '15 to 20 Business Days', popular: false },
    { id:4,duration: '180 Days', type: 'Multiple Entry', price: '₹18,000', processingTime: '15 to 20 Business Days', popular: false },
  ];

  return (
    <div className="  flex flex-col items-center  justify-center md:px-0 px-5 py-20">
         <p className="text-md text-orange-500 font-bold mb-2">Recommendations</p>
      <h2 className="text-xl font-bold mb-6">Which Visa do you wish to apply?</h2>
      <div className="space-y-4 w-full max-w-2xl ">
        {visaOptions.map((option, index) => (
          <div onClick={()=>handleselect(option.id)} key={index} className="border  relative gap-3 rounded-2xl border-blue-500 shadow-sm shadow-blue-200 p-6 flex  cursor-pointer flex-col justify-between items-center">
             <div
              className={`w-4 h-4 absolute left-3 top-2 mb-4 mx-auto rounded-full border-3 ${
                selected === option?.id ? 'border-blue-500 bg-blue-500' : ' bg-gray-300 border-gray-300'
              }`}
            ></div>
            {option.popular && <span className="bg-blue-500 absolute right-10 top-[-12px] text-white px-6 py-1 rounded-full text-sm">Popular</span>}
            <div className='flex  justify-between w-full px-4'>
              <h2 className="text-lg font-semibold">{option.duration} {option.type}</h2>
               <p className="text-lg font-bold">{option.price}</p>
            </div>
            <div className="w-full flex justify-between px-4">
             <p>Stay Period: {option.duration}</p>
              <p>Validity: {option.duration}</p>
              <p>Processing Time: {option.processingTime}</p>
              
            </div>
          </div>
        ))}
      </div>
      <button className="mt-6 bg-orange-500 text-white py-2 px-4 rounded">Continue</button>
    </div>
  );
};

export default Packages;
