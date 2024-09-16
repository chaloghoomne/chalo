import React, { useEffect, useState } from "react";
import homefirst from "../../../assets/homefirst.png";
import { fetchDataFromAPI } from "../../../api-integration/fetchApi";
import { BASE_URL, NetworkConfig } from "../../../api-integration/urlsVariable";
import { useDispatch } from "react-redux";
import { CiSearch } from "react-icons/ci";

import { searchPackageByValue } from "../../../redux/actions/package-id-actions";

const HomeFirst = ({ homeSecondRef }) => {
  const [data, setData] = useState();
  const [inputValue, setInputValue] = useState();
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await fetchDataFromAPI(
          "GET",
          `${BASE_URL}${NetworkConfig.GET_HEADING_BY_ID}/Main`
        );
        console.log(response);
        if (response) {
          setData(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfileImage();
  }, []);

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     try {
  //       const response = await fetchDataFromAPI(
  //         "GET",
  //         `${BASE_URL}user-profile`
  //       );

  //       if (response) {
  //         console.log(response, "response profile");
  //         localStorage.setItem("userId", response?.data?._id);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchProfile();
  // }, []);

  const handleInputValue = (e) => {
    setInputValue(e.target.value);
    dispatch(searchPackageByValue(e.target.value));

    if (homeSecondRef && homeSecondRef.current) {
      const targetPosition = homeSecondRef.current.offsetTop;

      const scrollPosition = targetPosition - window.innerHeight / 3;
      window.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex flex-col shadow-md shadow-[#00000036] mt-14 md:flex-row items-center gap-4 md:justify-between h-auto md:h-auto px-4  bg-gradient-to-r from-[#3180CA] to-[#7AC7F9]">
      <div className="md:flex hidden text-white flex-col items-start justify-center w-full md:w-[55%] text-left p-2 md:pt-20 md:pb-4 md:pl-20">
        <h1
          style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
          className="text-2xl  md:w-[80%] poppins-six  md:text-4xl font-bold mb-4"
        >
          {data?.title || "Get the VISA simple, fast & Reliable"}
        </h1>
        <p
          style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
          className="text-md poppins-six md:w-[80%] font-bold md:text-md mb-10"
        >
          {data?.description}
        </p>
        <div className="flex items-center px-8 flex-wrap justify-between p-4 gap-4 bg-white/70 rounded-lg  w-full">
          <div className="flex justify-start px-5 bg-white border border-gray-300  rounded-lg  items-center">
            <CiSearch size={23} color="black" />
            <input
              type="text"
              placeholder="Where to....."
              value={inputValue}
              onChange={(e) => handleInputValue(e)}
              className="flex-grow focus:outline-none w-40 md:w-56 lg:w-72 text-black p-[6px]    "
            />
          </div>
          <button className="bg-orange-500 min-w-32 text-white text-sm p-[8px] rounded-md">
            Get Started
          </button>
        </div>
        <p className="mt-2 poppins-two text-[10px]">
          {data?.shortDescription ||
            `*Exclusive offers on VISA service, Air Tickets, and Travel Packages.`}
        </p>
      </div>
      <div className="flex items-center justify-center w-full md:w-[45%] p-2 md:px-4">
        <img src={homefirst} alt="Travel Image" className="max-w-[80%] " />
      </div>
      <div className="flex md:hidden shadow-md shadow-[#00000036] flex-col items-start justify-center w-full md:w-1/2 text-left p-2 md:p-4">
        <h1 className="text-2xl poppins-six md:text-5xl font-bold mb-4">
          Get the VISA simple, fast & Reliable
        </h1>
        <p className="text-md poppins-three md:text-xl mb-6">
          Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem
          Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum
        </p>
        <div className="flex items-center flex-wrap p-4 justify-between gap-2 bg-white/70 rounded-lg w-full">
          <div className="flex justify-start px-5 bg-white border border-gray-300  rounded-lg  items-center">
            <CiSearch size={23} color="black" />
            <input
              type="text"
              placeholder="Where to....."
              value={inputValue}
              onChange={(e) => handleInputValue(e)}
              className="flex-grow focus:outline-none w-40 md:w-56 lg:w-72 text-black p-1     "
            />
          </div>
          <button className="bg-orange-500 text-white p-2  rounded-md">
            Get Started
          </button>
        </div>
        <p className="mt-2 poppins-two text-sm">
          *Exclusive offers on VISA service, Air Tickets, and Travel Packages.
        </p>
      </div>
    </div>
  );
};

export default HomeFirst;
