import React from 'react';
import { IoPersonCircleOutline } from 'react-icons/io5';

const OfferPackages = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex pt-20 flex-col  items-center">
      {/* Header Image */}
      <div className="w-full relative">
        <img src="https://e0.pxfuel.com/wallpapers/898/938/desktop-wallpaper-travel-tours-and-travels-background-travel-and-tourism.jpg" alt="Eiffel Tower" className="w-full h-96 object-cover" />
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 flex flex-col justify-center items-center">
          <h1 className="text-white text-5xl font-bold">FRANCE</h1>
          <p className="text-white text-2xl mt-2">Paris, FRANCE</p>
        </div>
      </div>

      {/* Main Content */}
      <div className='w-full h-full flex lg:flex-row flex-col bg-gray-200 '>
      <div className="w-full lg:w-[70%]  bg-white shadow-md max-w-5xl p-4">
        <div className="flex justify-between items-center mt-8 mb-6">
          <button className="bg-orange-500 text-white py-2 px-4 rounded-lg">View on 25 Jul,06:36 PM</button>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Add new places to your itinerary</h2>
        <p className="text-gray-600 mb-6">(with no added effort)</p>

        {/* Itinerary Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { location: "Istanbul, Turkey", imgSrc: "https://wallpapercave.com/wp/wp4424332.jpg" },
            { location: "Sydney, Australia", imgSrc: "https://wallpapercave.com/wp/wp4424332.jpg" },
            { location: "Malé, Maldives", imgSrc: "https://wallpapercave.com/wp/wp4424332.jpg" },
            { location: "Paris, France", imgSrc: "https://wallpapercave.com/wp/wp4424332.jpg" },
            { location: "London, UK", imgSrc: "https://wallpapercave.com/wp/wp4424332.jpg" },
            { location: "Tokyo, Japan", imgSrc: "https://wallpapercave.com/wp/wp4424332.jpg" },
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={item.imgSrc} alt={item.location} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold">{item.location}</h3>
                <p className="text-gray-600">Flights • Hotels • Resorts</p>
              </div>
            </div>
          ))}
        </div>

        {/* Proceed to Checkout */}
        <div className="text-center mt-8">
          <button className="bg-blue-500 text-white py-2 px-4 rounded-lg">Proceed to Checkout</button>
        </div>
      </div>

      {/* Side Information */}
      <div className="flex w-full mt-10 flex-col md:w-[30%] bg-gray-200 h-full justify-start  md:flex-col">
          <div className="self-start p-4 rounded-lg mb-4 md:mb-0">
            <div className='bg-white h-auto p-4 rounded-xl'>
            <h2 className="text-xl flex gap-3 font-semibold mb-4">
                <IoPersonCircleOutline size={25} color='black' />
                Personal Deatils</h2>
            <p className="text-gray-600 mb-4">
              Your photo is important. Make sure your photo showcases your lovely smile, has a clear bright background and your face is clearly visible.
            </p>
            {/* <ul className="text-left space-y-2">
              <li>✔️ Position your head in the oval</li>
              <li>✔️ Make sure you're in a well-lit area</li>
              <li>✔️ Remove glasses</li>
              <li>✔️ Avoid glares and blurs</li>
            </ul> */}
          </div>
</div>
</div>
      </div>
    </div>
  );
};

export default OfferPackages;
