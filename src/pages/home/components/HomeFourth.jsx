import React, { useEffect, useState } from "react";
import ratings from "../../../assets/rating.png";
import { fetchDataFromAPI } from "../../../api-integration/fetchApi";
import { BASE_URL, NetworkConfig } from "../../../api-integration/urlsVariable";
import { FaStar } from "react-icons/fa";
const HomeFourth = () => {
  const [data, setData] = useState();

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await fetchDataFromAPI(
          "GET",
          `${BASE_URL}${NetworkConfig.GET_HEADING_BY_ID}/About`
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

  return (
    <div className="flex flex-col md:flex-row items-center justify-center py-2 px-4 md:px-10 bg-white">
      {/* Left Content */}
      <div className="w-full md:w-[43%] md:text-left text-center md:p-4 p-1">
        <h3 className="text-[#F2A137]  poppins-six mb-4">{data?.title}</h3>
        <h1
          style={{ lineHeight: "3rem" }}
          className="text-3xl md:max-w-64 poppins-seven font-bold mb-4"
        >
          {data?.heading}
        </h1>
        <p className="text-gray-600 poppins-three mb-6">{data?.description}</p>
        <div className="grid lg:grid-cols-4 grid-cols-2 gap-4">
          {data?.subItems?.map((box) => {
            return (
              <>
                <div className="p-4 bg-white min-h-24 border border-gray-100  rounded-lg shadow-md text-center">
                  <h2 className="text-2xl poppins-six  font-bold text-[#F2A137] mb-2">
                    {box?.heading === "4.5" ? box?.heading : box?.heading}
                  </h2>
                  <p className="text-gray-600 text-[9px] poppins-eight ">
                    {box?.description}
                  </p>
                </div>
              </>
            );
          })}
        </div>
      </div>

      {/* Right Image */}
      <div className="w-full relative md:w-[57%] flex items-center bg-cover justify-center mt-5 md:mt-0">
        <img
          src={ratings}
          alt="Happy Customer"
          className="w-[99%] relative left-14 h-auto md:h-[550px]"
        />
      </div>
    </div>
  );
};

export default HomeFourth;
