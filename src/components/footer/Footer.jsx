import React, { useEffect, useState } from "react";
import logo from "../../assets/loginlogo.png";
import facebook from "../../assets/facebook.png";
import instagram from "../../assets/instagram.png";
import linkedin from "../../assets/linkedin.jpg";
import pinterest from "../../assets/pinterest.png";
import twitter from "../../assets/twitter.png";
import whatsapp from "../../assets/whatsapp.png";

import subscribe from "../../assets/subscribe.png";
import { TbLocationShare } from "react-icons/tb";
import { fetchDataFromAPI } from "../../api-integration/fetchApi";
import { BASE_URL } from "../../api-integration/urlsVariable";
import { toast } from "react-toastify";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const [value, setValue] = useState("");
  const location = useLocation();

  const [show,setShow] = useState(true)

  useEffect(() => {
    const pathName = location.pathname;
    console.log(pathName, "pathName");
    if (pathName === "/edit-visa-request" || pathName === "/upload-image" || pathName === "/view-application" || pathName === "/visa-details/:id" ) {
      setShow(false);
    } else {
      setShow(true);
    }
  }, [location.pathname]);

  const handleChnage = (e) => {
    setValue(e.target.value);
  };

  const className = ` mx-[5%] w-[90%] bg-cover bg-center rounded-2xl min-h-72 flex flex-col min-[1000px]  px-10 justify-center items-center text-white text-center py-8 bg-gradient-to-r from-[#F2A137] to-[#F2A137] mt-4 ${
    subscribe ? 'lg:bg-[url("' + subscribe + '")]' : " "
  }`;

  const becomeSubscriber = async () => {
    try {
      const response = await fetchDataFromAPI(
        "POST",
        `${BASE_URL}add-subscription`,
        { email: value }
      );
      console.log(response);
      if (response) {
        console.log(response.data, "data");
        setValue("");
        toast.success(`Congratulations! You are a Subscriber Now`);
      }
    } catch (error) {
      console.log(error);
      toast.success(` You are already a Subscriber `);
    }
  };

  return (
    <footer className="bg-white">
      <div className="flex  py-3 pb-5 w-full bg-white">
        {show && <div className={className}>
          <div className="w-full justify-center flex flex-col items-center text-center">
          <h2 className="text-4xl  text-black poppins-six font-semibold">
            Sign up to our newsletter
          </h2>
          <p
            style={{ overflowWrap: "anywhere" }}
            className="mt-4 text-black poppins-four w-[40%] se text-sm "
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
              className="px-4 py-2 rounded-l-md w-72 min-h-10 text-black    focus:outline-none"
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
      <div className="bg-slate-300 container  mx-auto border-t border-gray-200 border-b px-6 sm:px-10 lg:px-14 py-14 flex flex-wrap lg:flex-nowrap lg:justify-between mt-4  gap-8">
        <div className="lg:min-w-72 flex flex-col justify-start items-start lg:max-w-72">
          <div className="w-full self-start">
          <img src={logo} alt="Chalo Ghoomne"  className="self-start items-start w-[150px] mt-[-35px]"  />
          </div>
          <p className="text-gray-600 text-[13px]  mt-[25px] ">
            {/* <span>125, 2nd FLoor New UCO Bank Shahhpur Jat,Siri Fort </span>
            <span>New Delhi - 110049</span>
            <span>b2b@chaloghoomne.com</span>
            <span>www.chaloghoomne.com</span> */}
            Our visa booking company is dedicated to simplifying the complex and
            often daunting process of obtaining travel visas. With extensive
            experience and a team of experts, we provide personalized services
            to ensure a smooth and hassle-free visa application experience.
          </p>
          {/* <button className="mt-4 bg-[#F26337] text-white px-4 py-2 rounded">Read More</button> */}
        </div>
        {/* <div>
          <h3 className="text-lg font-semibold text-gray-800">Product</h3>
          <ul className="mt-4 space-y-2 text-gray-600">
            <li style={{ lineHeight: "2rem" }}>Features</li>
            <li style={{ lineHeight: "2rem" }}>Pricing</li>
          </ul>
        </div> */}
        <div>
          <h3 className="text-lg font-bold text-gray-800">Company</h3>
          <ul className="mt-4 space-y-2 text-gray-600">
            <li style={{ lineHeight: "2rem" }}>Carrers</li>
            <li style={{ lineHeight: "2rem" }}>Partners</li>
            <li style={{ lineHeight: "2rem" }}>For Travel Agents</li>
            <li style={{ lineHeight: "2rem" }}>About us</li>
            <li style={{ lineHeight: "2rem" }}>Blog</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">Important Links</h3>
          <ul className="mt-4 space-y-2 text-gray-600">
            <li style={{ lineHeight: "2rem" }}>Privacy Policy</li>
            <li style={{ lineHeight: "2rem" }}>Terms and Conditions</li>
            <li style={{ lineHeight: "2rem" }}>Refund Policy</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">Contact Us</h3>
          <ul className="mt-4 space-y-2 text-gray-600">
            <p style={{ lineHeight: "2rem" }}>
              125, 2nd FLoor New UCO Bank Shahhpur Jat{" "}
            </p>
            <p style={{ lineHeight: "2rem" }}> Siri Fort,New Delhi - 110049</p>
            <p style={{ lineHeight: "2rem" }}>b2b@chaloghoomne.com</p>
            <p style={{ lineHeight: "2rem" }}>www.chaloghoomne.com</p>
            <p style={{ lineHeight: "2rem" }}>9999999999</p>
          </ul>

          <div>
            <div className="flex flex-row">
            <a href = 'https://www.facebook.com/chaloghoomneofficial/' target="_blank">
            <img src={facebook} className="w-6 h-6 hover:scale-110" />
            </a>
            <a href = 'https://www.instagram.com/chaloghoomneofficial/'  className="mx-2"  target="_blank">
            <img src={instagram} className="w-6 h-6 hover:scale-110"/>
            </a>
            <a href = 'linkedin.com/company/chaloghoomneofficial' target="_blank">
            <img src={linkedin} className="w-6 h-6 hover:scale-110"/>
            </a>
            </div>
            <div className="flex flex-row mt-2">
            <a href = 'https://x.com/chaloghoomne1' target="_blank">
            <img src={twitter} className="w-6 h-6 hover:scale-110"/>
            </a>
            <a href = 'https://wa.me/919555535252' className="mx-2" target="_blank">
            <img src={whatsapp} className="w-6 h-6 hover:scale-110"/>
            </a>
            <a href = 'https://in.pinterest.com/chaloghoomneofficial' target="_blank">
            <img src={pinterest} className="w-6 h-6 hover:scale-110"/>
            </a>
            </div>
          </div>
        </div>
      </div>
      <div className="py-2 bg-slate-300 flex justify-between px-14 items-center ">
        <p className="text-gray-600 text-md poppins-four">Copyright c 2023</p>
        <p className="text-gray-600 text-md poppins-four">
          All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
