// src/Homepage.js
import React from 'react';
import logo from "../../assets/logo.jpg"
import back from "../../assets/chaloghoomne banner.png"
import HomeSecond from './components/HomeSecond';
import HomeFirst from './components/HomeFirst';
import HomeThird from './components/HomeThird';
import HomeFourth from './components/HomeFourth';
import HomeFive from './components/HomeFive';


const Home = () => {
  return (
   <>
   {/* <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${back})` }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 text-center p-2">
        <header className="flex justify-between items-center p-4 text-white">
          <div className="flex items-center">
            <img src={logo} alt="Chalo Ghoomne" className="h-20 rounded-full" />
            <h1 className="text-2xl font-bold ml-2">Chalo Ghoomne</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span>Need quick assistance</span>
            <a href='https://wa.me/919555535252' className="bg-blue-500 py-2 px-4  rounded-full">WhatsApp</a>
          </div>
        </header>
        <div className="mt-20">
          <h2 className="text-4xl md:text-6xl text-white font-bold">Professional solutions for Visa services</h2>
         
          <div className="mt-6">
            <a href="tel:+919555535252" className="inline-block bg-white text-black py-3 px-6 rounded-full font-bold">Call us @ +91 9555535252</a>
          </div>
           <p style={{ textShadow: '5px 5px 5px rgba(173, 216, 230, 0.8)' }} className='text-2xl text-white mt-4 '>We apologize for the inconvenience. Our website is currently under construction.</p>
           <p style={{ textShadow: '2px 2px 5px rgba(173, 216, 230, 0.8)' }} className='text-4xl text-white mt-4 '>Coming Soon...</p>
        </div>
        <div className="mt-10 flex justify-center space-x-6">
          <div className="bg-blue-600 text-white p-6 rounded-lg w-64">
            <h3 className="font-bold">Visa Services</h3>
            <p >Visa Services Available: Hassle-free, efficient, and reliable visa processing.</p>
          </div>
          <div className="bg-blue-600 text-white p-6 rounded-lg w-64">
            <h3 className="font-bold">Air Ticketing</h3>
            <p>Affordable and convenient air ticket booking services.</p>
          </div>
          <div className="bg-blue-600 text-white p-6 rounded-lg w-64">
            <h3 className="font-bold">Travel Packages</h3>
            <p>Explore exotic destinations with our all-inclusive travel packages.</p>
          </div>
        </div>
         <p className="text-white mt-4">Exclusive offers on Visa Services , Air tickets and Travel Packages</p>
      </div>
    </div> */}
   <HomeFirst />
    <HomeSecond />
      <HomeThird />
       <HomeFourth />
     
   </>
  );
}

export default Home;


 