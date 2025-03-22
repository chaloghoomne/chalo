import React, { useEffect, useState } from "react";
import logo from "../../assets/loginlogo.png";
import facebook from "../../assets/facebook.png";
import instagram from "../../assets/instagram.png";
import linkedin from "../../assets/linkedin.jpg";
import pinterest from "../../assets/pinterest.png";
import twitter from "../../assets/twitter.png";
import whatsapp from "../../assets/whatsapp.png";
import whitelogo from "../../assets/whitelogo.png";
import subscribe from "../../assets/subscribe.png";
import { TbLocationShare } from "react-icons/tb";

import { fetchDataFromAPI } from "../../api-integration/fetchApi";
import { BASE_URL } from "../../api-integration/urlsVariable";
import { toast } from "react-toastify";
import { Link, useLocation } from "react-router-dom";
import { 
  FaFacebookF, 
  FaInstagram, 
  FaLinkedinIn, 
  FaTwitter, 
  FaWhatsapp, 
  FaPinterest,
  FaCcMastercard,
  FaBriefcase,
  FaUserTie,
  FaInfoCircle,
  FaBlog,
  FaPhone,
  FaMapMarkerAlt,
  FaGlobe,
  FaShieldAlt,
  FaFileContract,
  FaMoneyBillWave
} from 'react-icons/fa';
import { SiVisa, SiAmazonpay } from 'react-icons/si';
import { BsPaypal } from "react-icons/bs";
import axios from "axios";


const Footer = () => {
  const [value, setValue] = useState("");
  const location = useLocation();

  const [show,setShow] = useState(true)
  const [formData, setFormData] = useState({
    offices: [{ city: '', addressLine1: '', addressLine2: '', phone: '' }],
    supportEmail: ''
  });

  useEffect(() => {
    // Fetch existing contact info (if available)
    const fetchData = async () => {
      try {
        const resp = await axios.get(`${BASE_URL}/contact`);
        setFormData(resp.data.data);
      } catch (error) {
        console.error('Error fetching contact data:', error);
      }
    };
    fetchData();
  }, []);


  useEffect(() => {
    const pathName = location.pathname;
    if (pathName === "/edit-visa-request" || pathName === "/upload-image" || pathName === "/view-application" || pathName === "/visa-details/:id" ) {
      setShow(false);
    } else {
      setShow(true);
    }
  }, [location.pathname]);

  const handleChnage = (e) => {
    setValue(e.target.value);
  };

  const className = ` container  md:mx-5 w-full bg-cover bg-center rounded-2xl min-h-72 flex flex-col min-[1000px]   justify-center items-center text-white text-center py-8 bg-gradient-to-r from-[#F2A137] to-[#F2A137] mt-4 ${
    subscribe ? 'lg:bg-[url("' + subscribe + '")]' : " "
  }`;

  const becomeSubscriber = async () => {
    try {
      const response = await fetchDataFromAPI(
        "POST",
        `${BASE_URL}add-subscription`,
        { email: value }
      );
      
      if (response) {
        setValue("");
        toast.success(`Congratulations! You are a Subscriber Now`);
      }
    } catch (error) {
      navigate("/503")
      toast.success(` You are already a Subscriber `);
    }
  };

  return (
    <footer className="bg-white w-full">
      <div className="flex justify-center items-center py-3 px-5  pb-5 w-full bg-white">
        {show && <div className={className}>
          <div className="w-full justify-center flex flex-col items-center text-center">
          <h2 className="text-4xl  text-black poppins-six font-semibold">
            Sign up to our newsletter
          </h2>
          <p
            style={{ overflowWrap: "anywhere" }}
            className="mt-4 text-black poppins-four w-[40%] se text-sm"
          >
            We value the connections we make with our clients and partners. Your
            feedback and insights are crucial to our growth and improvement.
          </p>
          </div>
          <div className="mt-6 p-2 md:min-w-96 flex justify-between rounded-xl items-center bg-white">
            <input
              type="email"
              placeholder="Enter Your email Address"
              value={value}
              onChange={(e) => handleChnage(e)}
              className="px-4 py-2 rounded-l-md sm:w-72 w-56 min-h-10 text-black focus:outline-none"
            />
            <button
              onClick={() => becomeSubscriber()}
              className="px-2 py-2    bg-blue-600 text-white rounded-md"
            >
              <TbLocationShare size={22} color="white" />
            </button>
          </div>
        </div>}
      </div>
      <div className="bg-[#1E231F] text-white mx-auto border-t border-gray-200 border-b px-6 sm:px-10 lg:px-14 py-14 flex flex-wrap lg:flex-nowrap lg:justify-between mt-4 gap-8">
      <div className="lg:min-w-72 flex flex-col justify-start items-start lg:max-w-72">
        <div className="w-full self-start">
          <img src={whitelogo} alt="Chalo Ghoomne" className="self-start items-start w-[150px] mt-[-5px]" />
        </div>
        <p className="text-white text-[13px] mt-[25px]">
          Our visa booking company is dedicated to simplifying the complex and
          often daunting process of obtaining travel visas. With extensive
          experience and a team of experts, we provide personalized services
          to ensure a smooth and hassle-free visa application experience.
        </p>
        <div className="mt-4 flex flex-wrap justify-center items-center gap-4">
          <a href="https://www.facebook.com/chaloghoomneofficial/" target="_blank" rel="noopener noreferrer">
            <FaFacebookF className="w-8 h-8 hover:-scale-x-100 transition-all hover:bg-yellow-500 border border-white p-1 rounded-lg" />
          </a>
          <a href="https://www.instagram.com/chaloghoomneofficial/" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="w-8 h-8 hover:-scale-x-100 transition-all hover:bg-yellow-500 border border-white p-1 rounded-lg" />
          </a>
          {/* <a href="https://linkedin.com/company/chaloghoomneofficial" target="_blank" rel="noopener noreferrer">
            <FaLinkedinIn className="w-8 h-8 hover:-scale-x-100 transition-all hover:bg-yellow-500 border border-white p-1 rounded-lg" />
          </a> */}
          <a href="https://x.com/chaloghoomne1" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="w-8 h-8 hover:-scale-x-100 transition-all hover:bg-yellow-500 border border-white p-1 rounded-lg" />
          </a>
          <a href="https://wa.me/919555535252" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp className="w-8 h-8 hover:-scale-x-100 transition-all hover:bg-yellow-500 border border-white p-1 rounded-lg" />
          </a>
          {/* <a href="https://in.pinterest.com/chaloghoomneofficial" target="_blank" rel="noopener noreferrer">
            <FaPinterest className="w-8 h-8 hover:-scale-x-100 transition-all hover:bg-yellow-500 border border-white p-1 rounded-lg" />
          </a> */}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-white">Company</h3>
        <ul className="mt-4 space-y-2 text-white">
          <Link to="/career-form" className="">
            <li className="flex items-center gap-2" style={{ lineHeight: "2rem" }}>
              <FaBriefcase className="w-4 h-4" />
              Careers
            </li>
          </Link>
          <Link to="/travel-form" className="">
            <li className="flex items-center gap-2" style={{ lineHeight: "2rem" }}>
              <FaUserTie className="w-4 h-4" />
              For Travel Agents
            </li>
          </Link>
          <Link to="/about" className="">
            <li className="flex items-center gap-2" style={{ lineHeight: "2rem" }}>
              <FaInfoCircle className="w-4 h-4" />
              About us
            </li>
          </Link>
          <Link to="/blogs" className="">
            <li className="flex items-center gap-2" style={{ lineHeight: "2rem" }}>
              <FaBlog className="w-4 h-4" />
              Blog
            </li>
          </Link>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-bold text-white">Important Links</h3>
        <ul className="mt-4 space-y-2 text-white">
          <Link to="/privacy-policy">
            <li className="flex items-center gap-2" style={{ lineHeight: "2rem" }}>
              <FaShieldAlt className="w-4 h-4" />
              Privacy Policy
            </li>
          </Link>
          <Link to="/terms-condition">
          <li className="flex items-center gap-2" style={{ lineHeight: "2rem" }}>
            <FaFileContract className="w-4 h-4" />
            Terms and Conditions
          </li>
          </Link>
          <Link to="/refund-policy">
            <li className="flex items-center gap-2" style={{ lineHeight: "2rem" }}>
              <FaMoneyBillWave className="w-4 h-4" />
              Refund Policy
            </li>
          </Link>
          <Link to="/contact">
            <li className="flex items-center gap-2" style={{ lineHeight: "2rem" }}>
              <FaPhone className="w-4 h-4" />
            Contact Us
            </li>
          </Link>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-bold text-white">Contact Us</h3>
        <ul className="mt-4 space-y-2 text-white">
          <p className="flex items-center gap-2 w-[100px] md:w-[400px]" style={{ lineHeight: "2rem" }}>
            <FaMapMarkerAlt className="w-4 h-4" />
            { formData?.addressLine1 + " " + formData?.addressLine2  ||"Siri Fort, New Delhi - 110049"}
          </p>
          {/* <p className="flex items-center gap-2" style={{ lineHeight: "2rem" }}>
            <FaMapMarkerAlt className="w-4 h-4" />
            { formData?.addressLine2 ||"Siri Fort, New Delhi - 110049"}
          </p> */}
          <p className="flex items-center gap-2" style={{ lineHeight: "2rem" }}>
            <FaGlobe className="inline-block w-4 h-4 mr-2" />
          { formData?.supportEmail ||"  www.chaloghoomne.com"}
          </p>
          <p className="flex items-center gap-2" style={{ lineHeight: "2rem" }}>
            <FaPhone className="inline-block w-4 h-4 mr-2" />
            { "+"+91+" "  + formData?.phoneNumber || 9555535252}
          </p>
        </ul>

        
       
      </div>
    </div>
      <div className="py-2 bg-[#1E231F] flex px-14 justify-center">
        {/* <p className="text-white text-md poppins-four">Copyright c 2025</p> */}
        <p className="text-white "> Copyright c 2025.
          All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
