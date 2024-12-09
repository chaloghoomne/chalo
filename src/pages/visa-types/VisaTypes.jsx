import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchDataFromAPI } from "../../api-integration/fetchApi";
import { BASE_URL, NetworkConfig } from "../../api-integration/urlsVariable";
import VisaDetails from "../visa-details/VisaDetails";
import Packages from "../packages/Packages";
import { useDispatch, useSelector } from "react-redux";
import { getVisaType } from "../../redux/actions/package-id-actions";
import { BsEmojiSmile } from "react-icons/bs";
import { FaCircleDot } from "react-icons/fa6";
import {
  calenderDate,
  returnCalenderDate,
} from "../../redux/actions/calender-date-action";
import { Helmet } from "react-helmet";

const VisaTypes = () => {
  const [selectedVisa, setSelectedVisa] = useState("Tourist");
  const selectedCountry = useSelector(
    (state) => state.SelectedCountryReducer.selectedCountry
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [plans, setPlans] = useState();
  const [data, setData] = useState();
  const [visatypes, setVisaTypes] = useState();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchDataFromAPI(
          "GET",
          `${BASE_URL}place/${id}`
        );
        if (response) {
          setVisaTypes(response?.data?.tourTypes);
          setSelectedVisa(response?.data?.tourTypes[0]?._id);
          handleplans(
            response?.data?.tourTypes[0]?._id,
            response?.data?.tourTypes[0]?.name
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    dispatch(returnCalenderDate(null));
    dispatch(calenderDate(null));
  }, []);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await fetchDataFromAPI(
          "GET",
          `${BASE_URL}${NetworkConfig.GET_HEADING_BY_ID}/VisaTypes`
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

  const handleplans = async (visaTypeId, name) => {
    setSelectedVisa(visaTypeId);
    dispatch(getVisaType(name));
    try {
      const response = await fetchDataFromAPI(
        "POST",
        `${BASE_URL}visa-category-by-package`,
        { package: id, tourType: visaTypeId }
      );
      if (response) {
        setPlans(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col  items-center justify-center py-20 px-4 bg-white">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Chalo Ghoomne</title>
        <link rel="canonical" href="https://chaloghoomne.com/" />   
      </Helmet>
      <h2 className="text-3xl poppins-six text-center  font-bold my-4">
        {selectedCountry} Visa Application 
      </h2>
      <p className="text-orange-500 poppins-four  text-xl mb-6">{data?.description }</p>
      <div className="flex flex-wrap md:justify-evenly justify-center gap-8 mb-6">
        {visatypes?.map((visa) => (
          <div
            key={visa?._id}
            className={`p-4 relative min-w-48 w-48 h-48 flex flex-col justify-center items-center border rounded-[30px]  shadow-md shadow-gray-300 text-center cursor-pointer ${
              selectedVisa === visa?._id
                ? "border-orange-500"
                : "border-gray-300"
            }`}
            onClick={() => handleplans(visa?._id, visa?.name)}
          >
            <img
              src={visa?.image}
              alt={visa?.name}
              className="max-w-32 max-h-32 min-w-32 min-h-32 rounded-2xl object-cover mt-3"
            />
            <p className="font-semibold my-2">{visa?.name}</p>
          </div>
        ))}
      </div>
      <p className="text-[#F26337] text-xl  mt-5 p-5 px-16 gap-7 flex justify-center items-center bg-[#FDF0EC] rounded-md mb-6">
        <span className=" poppins-five  ">
          <BsEmojiSmile size={25} color="#F26337" />
        </span>{" "}
        Chalo Ghoomne has brought joy to over 100,000 happy travellers!
      </p>
      {plans?.length < 1 ? (
        <div className=" mt-8 ">
          <p className="text-md text-[#F26337] poppins-seven text-center  font-bold mb-2">
            RECOMMENDATIONS
          </p>
          <h2 className="text-orange-500 text-4xl">
            We will update you soon...
          </h2>
        </div>
      ) : (
        <Packages plans={plans} />
      )}
    </div>
  );
};

export default VisaTypes;
