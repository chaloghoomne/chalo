import React, { useState } from 'react';
import logo from "../../assets/CHLOGHOOMNE logo.png"
import Login from './../../pages/Authentication/Login';
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [islogin,setIsLogin] = useState(false)

  return (
    <nav className="bg-white  w-full fixed z-50 top-0 shadow-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center lg:hidden">
            {/* Mobile menu button */}
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
          <div className="flex-1 flex items-center justify-end sm:items-stretch sm:justify-start">
            <div className="sm:flex-shrink-0 self-end ">
              <img className="w-36" src={logo} alt="Logo" />
            </div>
            {/* <div className="hidden lg:flex justify-center items-center sm:ml-6">
              <div className="flex space-x-4">
                <a href="#" className="text-[#747373] hover:text-[#439BD5] px-3 py-2 rounded-md text-sm font-medium">HOME</a>
                <a href="#" className="text-[#747373] hover:text-[#439BD5] px-3 py-2 rounded-md text-sm font-medium">About us</a>
                <a href="#" className="text-[#747373] hover:text-[#439BD5] px-3 py-2 rounded-md text-sm font-medium">VISA</a>
                <a href="#" className="text-[#747373] hover:text-[#439BD5]  px-3 py-2 rounded-md text-sm font-medium">Service</a>
                <a href="#" className="text-[#747373] hover:text-[#439BD5] px-3 py-2 rounded-md text-sm font-medium">Page</a>
                <a href="#" className="text-[#747373] hover:text-[#439BD5]  px-3 py-2 rounded-md text-sm font-medium">Contact us</a>
              </div>
            </div> */}
          </div>
          <div className="absolute hidden  inset-y-0 right-0 sm:flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <a href="tel:+918527418635" className="text-gray-900 px-3 py-2 cursor-pointer rounded-md text-sm font-medium">Agent Login</a>
            { !islogin ? <button onClick={()=>setIsLogin(!islogin)} className="ml-3 bg-blue-500 text-white px-3 py-2 rounded-md text-sm font-medium">Login</button>:
            <img onClick={()=>setIsLogin(!islogin)} src="" className='w-10 h-10 bg-white  rounded-full'/>}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="#" className="text-[#747373] hover:text-[#439BD5] block px-3 py-2 rounded-md text-base font-medium">HOME</a>
            <a href="#" className="text-[#747373] hover:text-[#439BD5] block px-3 py-2 rounded-md text-base font-medium">About us</a>
            <a href="#" className="text-[#747373] hover:text-[#439BD5] block px-3 py-2 rounded-md text-base font-medium">VISA</a>
            <a href="#" className="text-[#747373] hover:text-[#439BD5] block px-3 py-2 rounded-md text-base font-medium">Service</a>
            <a href="#" className="text-[#747373] hover:text-[#439BD5] block px-3 py-2 rounded-md text-base font-medium">Page</a>
            <a href="#" className="text-[#747373] hover:text-[#439BD5] block px-3 py-2 rounded-md text-base font-medium">Contact us</a>
            <a href="tel:+918527418635" className="hover:text-[#439BD5] hover:text-[#439BD5] block px-3 py-2 rounded-md text-base font-medium">Agent Login</a>
            <button className="block w-full bg-blue-500 text-white px-3 py-2 rounded-md text-base font-medium">Login</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
