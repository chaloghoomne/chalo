import React, { useState } from 'react';
import logo from "../../assets/CHLOGHOOMNE logo.png"
import { TbLocationShare } from "react-icons/tb";
const Footer = () => {
const [value,setValue] = useState("")

const handleChnage = (e)=>{
  setValue(e.target.value)
}

  return (
    <footer className="bg-gray-100 ">

       <div className='flex justify-center py-3 items-center w-full bg-white'>
      <div className="bg-gradient-to-r rounded-xl flex flex-col w-[80%] justify-center items-center from-[#f29408] to-[#ebad51] text-white text-center py-8">
        <h2 className="text-3xl  text-black font-semibold">Sign up to our newsletter</h2>
        <p style={{overflowWrap:"anywhere"}} className="mt-4  text-black w-full text-md text-center max-w-[60%]">We value the connections we make with our clients and partners. Your feedback and insights are crucial to our growth and improvement.</p>
        <div className="mt-6">
          <input
            type="email"
            placeholder="Enter Your email"
            value={value}
            onChange={(e)=>handleChnage(e)}
            className="px-4 py-2 rounded-l-md min-h-10 text-black border border-r-0 border-gray-300 focus:outline-none"
          />
          <button className="px-4 py-2 min-h-10 relative top-[6px] bg-blue-600 text-white rounded-r-md">
          <TbLocationShare size={22} color='white' />
            </button>
        </div>
      </div>
     </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-wrap lg:flex-nowrap lg:justify-between  gap-8">
        <div className='lg:min-w-96 lg:max-w-96'>
          <img src={logo} alt="Chalo Ghoomne" className="w-64" />
          <p className=" text-gray-700 flex flex-col">
            <span>125, 2nd FLoor New UCO Bank Shahhpur Jat,Siri Fort </span>
            <span>New Delhi - 110049</span>
            <span>b2b@chaloghoomne.com</span>
            <span>www.chaloghoomne.com</span>
            {/* Our visa booking company is dedicated to simplifying the complex and often daunting process of obtaining travel visas. With extensive experience and a team of experts, we provide personalized services to ensure a smooth and hassle-free visa application experience.   */}
          </p>
          {/* <button className="mt-4 bg-[#F26337] text-white px-4 py-2 rounded">Read More</button> */}
        </div>
        <div >
          <h3 className="text-lg font-semibold text-gray-800">About</h3>
          <ul className="mt-4 space-y-2 text-gray-600">
            <li>About us</li>
            <li>Features</li>
            <li>News</li>
            <li>Plans</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Company</h3>
          <ul className="mt-4 space-y-2 text-gray-600">
            <li>Why Chalo Ghoomne</li>
            <li>Partner with us</li>
            <li>FAQs</li>
            <li>Blog</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Support</h3>
          <ul className="mt-4 space-y-2 text-gray-600">
            <li>Account</li>
            <li>Support Center</li>
            <li>Feedback</li>
            <li>Contact us</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
