import React, { useEffect, useState } from "react";
import ratings from "../../../assets/homefourth.png";
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
    <div className="flex  flex-col md:flex-row container  mx-auto items-center justify-between py-20 md:px-10 px-5 bg-white ">
      {/* Left Content */}
      <div className="w-full md:w-[43%] md:text-left text-center md:p-4 p-1">
        <h2 className="text-[#F2A137] text-xl poppins-six mb-4">{data?.title}</h2>
        <h1
          style={{ lineHeight: "3rem" }}
          className="text-4xl md:max-w-[600px] poppins-seven font-bold mb-4"
        >
          {data?.heading}
        </h1>
        <p className="text-gray-600 poppins-three mb-6">{data?.description}</p>
        <div className="grid min-[1213px]:grid-cols-4 grid-cols-2 gap-4">
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
      <div className="w-full relative md:w-[57%] justify-center  flex md:items-end bg-cover md:justify-end mt-5 md:mt-0">
        <img
          src={ratings}
          alt="Happy Customer"
          className="w-[80%] relative  h-auto max-w-[600px] "
        />
      </div>
    </div>
  );
};

export default HomeFourth;
