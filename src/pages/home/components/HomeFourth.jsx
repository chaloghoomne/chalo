import React from 'react';
import ratings from "../../../assets/rating.png"
const HomeFourth = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center py-2 px-4 bg-white">
      {/* Left Content */}
      <div className="w-full md:w-1/2 md:text-left text-center md:p-4 p-1">
        <h3 className="text-orange-500 mb-2">Our Experience</h3>
        <h1 className="text-4xl font-bold mb-4">Crafting Unforgettable Adventures</h1>
        <p className="text-gray-600 mb-6">
          We excel in curating remarkable journeys, specializing in outdoor destinations around the globe.
          With a wealth of experience, we bring adventures to life and invite you to embark on your own.
          The call of nature awaits—begin your adventure today!
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-100 rounded-lg shadow-md text-center">
            <h2 className="text-3xl font-bold text-orange-500 mb-2">99.2%</h2>
            <p className="text-gray-600">Visa Approval Rate</p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow-md text-center">
            <h2 className="text-3xl font-bold text-orange-500 mb-2">99%</h2>
            <p className="text-gray-600">Approval</p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow-md text-center">
            <h2 className="text-3xl font-bold text-orange-500 mb-2">4.5</h2>
            <p className="text-gray-600">Google Ratings</p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow-md text-center">
            <h2 className="text-3xl font-bold text-orange-500 mb-2">99%</h2>
            <p className="text-gray-600">Visa Process</p>
          </div>
        </div>
      </div>
      
      {/* Right Image */}
      <div className="w-full relative md:w-1/2 flex items-center justify-center mt-5 md:mt-0">
        <img
          src={ratings}
          alt="Happy Customer"
          className="w-[96%] relative left-14 h-auto"
        />
      </div>
    </div>
  );
};

export default HomeFourth;
