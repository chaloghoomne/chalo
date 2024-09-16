import React, { useState } from "react";
import logo from "../../assets/CHLOGHOOMNE logo.png";
import subscribe from "../../assets/subscribe.png";
import { TbLocationShare } from "react-icons/tb";
import { fetchDataFromAPI } from "../../api-integration/fetchApi";
import { BASE_URL } from "../../api-integration/urlsVariable";
import { toast } from "react-toastify";
const Footer = () => {
  const [value, setValue] = useState("");

  const handleChnage = (e) => {
    setValue(e.target.value);
  };

  const className = ` bg-cover bg-center rounded-2xl min-h-72 flex flex-col w-[80%] justify-center items-center text-white text-center py-8 bg-gradient-to-r from-[#F2A137] to-[#F2A137] ${
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
    <footer className="bg-white  ">
      <div className="flex justify-center py-3 pb-5 items-center w-full bg-white">
        <div className={className}>
          <h2 className="text-4xl  text-black poppins-six  font-semibold">
            Sign up to our newsletter
          </h2>
          <p
            style={{ overflowWrap: "anywhere" }}
            className="mt-4  text-black poppins-four  w-full text-sm text-center max-w-[90%] md:max-w-[40%]"
          >
            We value the connections we make with our clients and partners. Your
            feedback and insights are crucial to our growth and improvement.
          </p>
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
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-gray-200 border-b px-4 sm:px-6 lg:px-8 py-14 flex flex-wrap lg:flex-nowrap lg:justify-between  gap-8">
        <div className="lg:min-w-96 flex flex-col justify-start items-start lg:max-w-96">
          <img src={logo} alt="Chalo Ghoomne" className="w-52" />
          <p className=" text-gray-700 text-xs poppins-five ">
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
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Product</h3>
          <ul className="mt-4 space-y-2 text-gray-600">
            <li style={{ lineHeight: "2rem" }}>Features</li>
            <li style={{ lineHeight: "2rem" }}>Pricing</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Company</h3>
          <ul className="mt-4 space-y-2 text-gray-600">
            <li style={{ lineHeight: "2rem" }}>Why Chalo Ghoomne</li>
            <li style={{ lineHeight: "2rem" }}>Partner with us</li>
            <li style={{ lineHeight: "2rem" }}>FAQs</li>
            <li style={{ lineHeight: "2rem" }}>Blog</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Support</h3>
          <ul className="mt-4 space-y-2 text-gray-600">
            <li style={{ lineHeight: "2rem" }}>Account</li>
            <li style={{ lineHeight: "2rem" }}>Support Center</li>
            <li style={{ lineHeight: "2rem" }}>Feedback</li>
            <li style={{ lineHeight: "2rem" }}>Contact us</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Contact Us</h3>
          <ul className="mt-4 space-y-2 text-gray-600">
            <p style={{ lineHeight: "2rem" }}>
              125, 2nd FLoor New UCO Bank Shahhpur Jat{" "}
            </p>
            <p style={{ lineHeight: "2rem" }}> Siri Fort,New Delhi - 110049</p>
            <p style={{ lineHeight: "2rem" }}>b2b@chaloghoomne.com</p>
            <p style={{ lineHeight: "2rem" }}>www.chaloghoomne.com</p>
          </ul>
        </div>
      </div>
      <div className="my-2 flex justify-between px-14 items-center ">
        <p className="text-gray-600 text-md poppins-four">Copyright c 2023</p>
        <p className="text-gray-600 text-md poppins-four">
          All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
