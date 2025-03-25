// src/VisaSelection.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDataFromAPI } from "../../api-integration/fetchApi";
import { BASE_URL, NetworkConfig } from "../../api-integration/urlsVariable";
import { toast } from "react-toastify";
import { FaCircleDot } from "react-icons/fa6";
import { Helmet } from "react-helmet";

import {Button} from 'react-aria-components'

const Packages = ({ plans }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");
  const [data, setData] = useState();
  const [heading,setHeading] = useState()
  const [state,setState] = useState();
  const [filteredData,setFilteredData] = useState();

  // useEffect(() => {
  //   if (plans?.length > 0) {
  //     handleselect(plans[0]?._id);
  //   }
  // }, [plans]);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await fetchDataFromAPI(
          "GET",
          `${BASE_URL}${NetworkConfig.GET_HEADING_BY_ID}/Recommendations`
        );
        if (response) {
          setData(response.data);
        }
        // console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfileImage();
  }, []);
  // console.log(Array.isArray(plans))


  useEffect(()=>{

    if (!Array.isArray(plans)) return; // Prevent errors if plans is undefined

  let sortedPlans = [...plans];


// console.log(sortedPlans)
      if(state === "Recent"){
        sortedPlans.sort((a,b)=> a.createdAt > b.createdAt)
        
      }
      else if(state === "Priced"){
        sortedPlans.sort((a,b)=>a.price-b.price)
      }
      else{
        setFilteredData(sortedPlans)
      }
      setFilteredData(sortedPlans)
    
  },[plans,state])

  // console.log(data);
  const handleselect = (id,heading) => {
    setSelected(id);
    setHeading(heading)
  };
  // console.log(selected,heading)

  const generateSlug = (title)=>{
    return title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
  }
  // console.log(heading)

  const handleRedirect = () => {
    if (!selected || !heading) {
        toast.error("First select the Package");
        return;
    }

    const slug = generateSlug(heading); // Generate slug safely
    navigate(`/visa-details/${slug}-${selected}`);
  };

  return (
    <div className=" flex flex-col items-center  mt-[-40px] justify-center md:px-0 px-5 pt-20">
      <Helmet>
        <meta charSet="utf-8" />

        <link rel="canonical" href="https://chaloghoomne.com/" />   
      </Helmet>
      <p className="text-md text-[#F26337] poppins-seven  font-bold mb-2">
        RECOMMENDATIONS
      </p>



      <h2 className="text-3xl font-semibold poppins-five  mb-6">
        {data?.heading}
      </h2>
      <div className="flex flex-row  gap-4 m-3">
  <Button onClick = {()=>{
    setState("Recent")
  }} className = "p-2 bg-orange-400 shadow-md hover:bg-orange-600 hover:shadow-lg hover:border-blue-500 hover:border-2 rounded-xl">Most Recent</Button>
  <Button onClick = {()=>{
    setState("Priced")
  }} className = "p-2 bg-orange-400 shadow-md hover:bg-orange-600 hover:shadow-lg hover:border-blue-500 hover:border-2 rounded-xl">Least Priced</Button>
</div>
      <div className="space-y-4 w-full flex flex-col gap-5 justify-center ">
        {filteredData?.map((option, index) => (
          <div
            onClick={() => handleselect(option?._id,option?.visaTypeHeading)}
            key={index}
            className="border md:min-w-[900px] relative gap-3 rounded-[25px] border-blue-500 shadow-sm shadow-blue-200 p-8 py-10 flex  cursor-pointer flex-col justify-between items-center"
          >
            <div
              className={`w-4 h-4 absolute left-3 top-4 mb-4 mx-auto rounded-full border-3 `}
            >
              {" "}
              <FaCircleDot
                size={15}
                color={`${selected === option?._id ? "#3180CA" : "gray"}`}
              />
            </div>
            {option.type && (
              <span className=" bg-gradient-to-r from-[#3180CA] to-[#7AC7F9]  absolute right-16 top-[-12px] text-white shadow-lg shadow-[#7AC7F9] px-9 py-1 rounded-full text-sm">
                {option?.type}
              </span>
            )}
            <div className="flex  justify-between w-full px-4">
              <h2 className="text-lg md:text-[27px] poppins-five font-semibold">
                {option?.visaTypeHeading}
              </h2>
              <p className="text-lg md:text-[27px] poppins-five font-bold">
                ₹{option?.price}
              </p>
            </div>
            <div className="w-full flex md:flex-row flex-col gap-2 justify-between px-4">
              <p className="text-gray-500 poppins-five text-md">
                Stay Period:{" "}
                <span className="text-md text-gray-400 poppins-three">
                  {option?.period} Days
                </span>
              </p>
              <p className="text-gray-500 poppins-five text-md">
                Validity:{" "}
                <span className="text-md text-gray-400 poppins-three">
                  {" "}
                  {option?.validity} Days
                </span>
              </p>
              <p className="text-gray-500 poppins-five text-md">
                Processing Time:{" "}
                <span className="text-md text-gray-400 poppins-three">
                  {option?.processingTime} Bussiness Days
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleRedirect}
        className=" bg-[#F26438] text-white py-2 px-8 mt-12 text-lg poppins-three rounded-full"
      >
        Continue
      </button>
    </div>
  );
};

export default Packages;
