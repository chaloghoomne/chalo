import React from 'react';
import homefirst from "../../../assets/homefirst.png"

const HomeFirst = () => {
  return (
    <div className="flex flex-col mt-14 md:flex-row items-center gap-4 md:justify-between h-auto md:h-full px-4 bg-blue-100">
      <div className="md:flex hidden flex-col items-start justify-center w-full md:w-1/2 text-left p-2 md:p-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Get the VISA simple, fast & Reliable</h1>
        <p className="text-lg md:text-xl mb-6">
          Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum
        </p>
        <div className="flex items-center w-full">
          <input
            type="text"
           
            placeholder="Where to....."
            className="flex-grow focus:outline-none p-2 border border-gray-300 rounded-l-md   "
          />
          <button className="bg-orange-500 text-white p-2 rounded-r-md">Get Started</button>
        </div>
        <p className="mt-2 text-sm">*Exclusive offers on VISA service, Air Tickets, and Travel Packages.</p>
      </div>
      <div className="flex items-center justify-center w-full md:w-1/2 p-2 md:p-4">
        <img  src={homefirst} alt="Travel Image" className="max-w-full " />
      </div>
      <div className="flex md:hidden flex-col items-start justify-center w-full md:w-1/2 text-left p-2 md:p-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Get the VISA simple, fast & Reliable</h1>
        <p className="text-lg md:text-xl mb-6">
          Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum
        </p>
        <div className="flex items-center w-full">
          <input
            type="text"
           
            placeholder="Where to....."
            className="flex-grow focus:outline-none p-2 border border-gray-300 rounded-l-md   "
          />
          <button className="bg-orange-500 text-white p-2 rounded-r-md">Get Started</button>
        </div>
        <p className="mt-2 text-sm">*Exclusive offers on VISA service, Air Tickets, and Travel Packages.</p>
      </div>
    </div>
  );
};

export default HomeFirst;
